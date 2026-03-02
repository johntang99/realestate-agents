import { writeAuditLog } from '@/lib/admin/audit';

type LeadSinkPayload = {
  type: string;
  siteId: string;
  locale: string;
  category?: string;
  source?: string | null;
  pagePath?: string | null;
  eventName?: string;
  payload: Record<string, unknown>;
  capturedAt?: string;
};

function isEnabled() {
  return (
    process.env.CRM_SINK_ENABLED === 'true' ||
    process.env.LEAD_ADAPTER_WEBHOOK_ENABLED === 'true'
  );
}

function sinkUrl() {
  return process.env.CRM_SINK_URL || process.env.LEAD_WEBHOOK_URL || '';
}

function getMaxRetries() {
  const raw = Number(process.env.CRM_SINK_MAX_RETRIES || 2);
  if (!Number.isFinite(raw) || raw < 0) return 2;
  return Math.min(Math.round(raw), 5);
}

function getRetryBaseMs() {
  const raw = Number(process.env.CRM_SINK_RETRY_BASE_MS || 250);
  if (!Number.isFinite(raw) || raw < 50) return 250;
  return Math.min(Math.round(raw), 2000);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function emitLeadToCrm(event: LeadSinkPayload) {
  if (!isEnabled()) return { delivered: false, reason: 'disabled' as const };
  const url = sinkUrl();
  if (!url) return { delivered: false, reason: 'missing_url' as const };

  const payload = {
    ...event,
    capturedAt: event.capturedAt || new Date().toISOString(),
  };
  const maxRetries = getMaxRetries();
  const retryBaseMs = getRetryBaseMs();
  const errors: string[] = [];

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        return { delivered: true as const, attempts: attempt + 1 };
      }
      const text = await response.text().catch(() => '');
      errors.push(`attempt ${attempt + 1}: ${response.status} ${text.slice(0, 300)}`);
    } catch (error: any) {
      errors.push(`attempt ${attempt + 1}: ${error?.message || 'unknown error'}`);
    }

    if (attempt < maxRetries) {
      await sleep(retryBaseMs * Math.pow(2, attempt));
    }
  }

  await writeAuditLog({
    action: 'crm_sink_dead_letter',
    siteId: event.siteId,
    metadata: {
      type: event.type,
      locale: event.locale,
      category: event.category || null,
      source: event.source || null,
      pagePath: event.pagePath || null,
      eventName: event.eventName || null,
      sinkUrl: url,
      attempts: maxRetries + 1,
      errors,
      payload,
    },
  });

  return { delivered: false as const, reason: 'dead_letter' as const, attempts: maxRetries + 1 };
}

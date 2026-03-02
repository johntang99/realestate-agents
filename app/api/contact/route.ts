import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { writeAuditLog } from '@/lib/admin/audit';
import { emitLeadToCrm } from '@/lib/leads/server';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const FALLBACK_EMAIL = process.env.CONTACT_FALLBACK_TO || 'info@jinpanghomes.com';
const EMAIL_ADAPTER_ENABLED = process.env.LEAD_ADAPTER_EMAIL_ENABLED !== 'false';

interface ConsultationPayload {
  name?: string;
  email?: string;
  phone?: string;
  projectType?: string;
  scope?: string;
  budget?: string;
  location?: string;
  referral?: string;
  preferredLanguage?: string;
  message?: string;
  siteId?: string;
  locale?: string;
  type?: string;
  category?: string;
  source?: string;
  pagePath?: string;
  consentAccepted?: boolean;
  consentText?: string;
  metadata?: Record<string, unknown>;
  currentSituation?: string;
  yearsExperience?: string;
  lastYearVolume?: string;
  bestTime?: string;
  investmentType?: string;
  timeline?: string;
  // legacy fields
  reason?: string;
}

function normalizedSiteId(payload: ConsultationPayload) {
  return payload.siteId || process.env.NEXT_PUBLIC_DEFAULT_SITE_ID || 'jinpanghomes';
}

function normalizedLocale(payload: ConsultationPayload) {
  return payload.locale || 'en';
}

async function saveToSupabase(payload: ConsultationPayload): Promise<{ table: string; id: string | null }> {
  if (!SUPABASE_URL || !SERVICE_KEY) return { table: 'none', id: null };
  const category = String(payload.category || payload.type || '').toLowerCase();
  const siteId = normalizedSiteId(payload);
  const locale = normalizedLocale(payload);
  const baseMeta = {
    source: payload.source || null,
    pagePath: payload.pagePath || null,
    consentAccepted: Boolean(payload.consentAccepted),
    consentText: payload.consentText || null,
    metadata: payload.metadata || {},
  };
  let table = 'consultation_requests';
  let row: Record<string, unknown> = {};

  if (category === 'join') {
    table = 'join_requests';
    row = {
      site_id: siteId,
      name: payload.name || '',
      email: payload.email || '',
      phone: payload.phone || '',
      current_situation: payload.currentSituation || '',
      years_experience: payload.yearsExperience || '',
      current_volume: payload.lastYearVolume || '',
      best_time_to_chat: payload.bestTime || '',
      message: payload.message || '',
      status: 'new',
    };
  } else if (category === 'investor') {
    table = 'investor_inquiries';
    row = {
      site_id: siteId,
      name: payload.name || '',
      email: payload.email || '',
      phone: payload.phone || '',
      investment_type: payload.investmentType || '',
      budget_range: payload.budget || '',
      timeline: payload.timeline || '',
      message: payload.message || '',
      status: 'new',
    };
  } else {
    row = {
      site_id: siteId,
      name: payload.name || '',
      email: payload.email || '',
      phone: payload.phone || '',
      project_type: payload.projectType || payload.reason || payload.category || '',
      scope: payload.scope || '',
      budget: payload.budget || '',
      location: payload.location || '',
      referral: payload.referral || payload.source || '',
      preferred_language: payload.preferredLanguage || locale,
      message: payload.message || '',
      status: 'new',
    };
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(row),
  });
  if (!response.ok) {
    throw new Error(`Failed to save lead (${table})`);
  }
  let leadId: string | null = null;
  try {
    const rows = await response.json();
    if (Array.isArray(rows) && rows[0] && typeof rows[0].id === 'string') {
      leadId = rows[0].id;
    }
  } catch {}

  await writeAuditLog({
    action: 'lead_capture',
    siteId,
    metadata: {
      table,
      leadId,
      category: category || 'general',
      locale,
      email: payload.email || null,
      ...baseMeta,
    },
  });
  return { table, id: leadId };
}

function buildEmailHtml(payload: ConsultationPayload): string {
  const rows = [
    ['Name', payload.name],
    ['Email', payload.email],
    ['Phone', payload.phone],
    ['Project Type', payload.projectType],
    ['Scope', payload.scope],
    ['Budget', payload.budget],
    ['Location', payload.location],
    ['Preferred Language', payload.preferredLanguage],
    ['How they found us', payload.referral],
    ['Source Tag', payload.source],
    ['Page Path', payload.pagePath],
    ['Lead Category', payload.category || payload.type],
    ['Message', payload.message],
  ].filter(([, v]) => v).map(([k, v]) => `<tr><td style="padding:6px 12px;background:#f9f6f2;color:#6B6B6B;font-size:12px;width:140px">${k}</td><td style="padding:6px 12px;color:#2C2C2C;font-size:14px">${v}</td></tr>`).join('');

  return `<!DOCTYPE html><html><body style="font-family:'Georgia',serif;background:#FAF8F5;margin:0;padding:20px">
  <div style="max-width:580px;margin:0 auto;background:#fff;border:1px solid #E5E2DD">
    <div style="background:#2C2C2C;padding:24px 32px">
      <p style="color:#C4A265;font-size:11px;letter-spacing:3px;margin:0">JIN PANG HOMES</p>
      <p style="color:#fff;font-size:22px;margin:8px 0 0;font-family:'Georgia',serif">New Consultation Request</p>
    </div>
    <table style="width:100%;border-collapse:collapse;margin:0">${rows}</table>
    <div style="padding:16px 32px;border-top:1px solid #E5E2DD">
      <p style="color:#6B6B6B;font-size:12px;margin:0">Jin Pang Homes Admin — Reply directly to ${payload.email}</p>
    </div>
  </div></body></html>`;
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json() as ConsultationPayload;

    if (!payload.name || !payload.email) {
      return NextResponse.json({ message: 'Name and email are required' }, { status: 400 });
    }

    await saveToSupabase(payload).catch(console.error);

    if (EMAIL_ADAPTER_ENABLED && resend) {
      const from = process.env.RESEND_FROM || 'no-reply@baamplatform.com';
      await resend.emails.send({
        from,
        to: [FALLBACK_EMAIL],
        reply_to: payload.email,
        subject: `New Consultation Request — ${payload.name}`,
        html: buildEmailHtml(payload),
      });
    }

    await emitLeadToCrm({
      type: 'lead_capture',
      siteId: normalizedSiteId(payload),
      locale: normalizedLocale(payload),
      category: String(payload.category || payload.type || 'general'),
      source: payload.source || null,
      pagePath: payload.pagePath || null,
      payload: payload as unknown as Record<string, unknown>,
    }).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Contact route error:', error);
    return NextResponse.json({ message: 'Internal error' }, { status: 500 });
  }
}

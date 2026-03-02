import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { writeAuditLog } from '@/lib/admin/audit';
import { emitLeadToCrm } from '@/lib/leads/server';

const resend = new Resend(process.env.RESEND_API_KEY);

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const FALLBACK_EMAIL = process.env.CONTACT_FALLBACK_TO || 'info@jinpanghomes.com';
const EMAIL_ADAPTER_ENABLED = process.env.LEAD_ADAPTER_EMAIL_ENABLED !== 'false';

type ValuationPayload = {
  siteId?: string;
  locale?: string;
  source?: string;
  pagePath?: string;
  consentAccepted?: boolean;
  consentText?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  beds?: string;
  baths?: string;
  sqft?: string;
  yearBuilt?: string;
  condition?: string;
  timeline?: string;
  message?: string;
};

function normalizedSiteId(payload: ValuationPayload) {
  return payload.siteId || process.env.NEXT_PUBLIC_DEFAULT_SITE_ID || 'jinpanghomes';
}

function normalizedLocale(payload: ValuationPayload) {
  return payload.locale || 'en';
}

async function saveToSupabase(payload: ValuationPayload): Promise<string | null> {
  if (!SUPABASE_URL || !SERVICE_KEY) return null;
  const response = await fetch(`${SUPABASE_URL}/rest/v1/valuation_requests`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      site_id: normalizedSiteId(payload),
      name: payload.name || '',
      email: payload.email || '',
      phone: payload.phone || '',
      address: payload.address || '',
      city: payload.city || '',
      beds: payload.beds || '',
      baths: payload.baths || '',
      sqft: payload.sqft || '',
      year_built: payload.yearBuilt || '',
      condition: payload.condition || '',
      timeline: payload.timeline || '',
      message: payload.message || '',
      status: 'new',
    }),
  });

  if (!response.ok) throw new Error('Failed to save valuation request');
  try {
    const rows = await response.json();
    if (Array.isArray(rows) && rows[0] && typeof rows[0].id === 'string') return rows[0].id;
  } catch {}
  return null;
}

function buildEmailHtml(payload: ValuationPayload) {
  const rows = [
    ['Name', payload.name],
    ['Email', payload.email],
    ['Phone', payload.phone],
    ['Address', payload.address],
    ['City', payload.city],
    ['Beds', payload.beds],
    ['Baths', payload.baths],
    ['Sq Ft', payload.sqft],
    ['Year Built', payload.yearBuilt],
    ['Condition', payload.condition],
    ['Timeline', payload.timeline],
    ['Source Tag', payload.source],
    ['Page Path', payload.pagePath],
    ['Message', payload.message],
  ]
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;background:#f9f6f2;color:#6B6B6B;font-size:12px;width:140px">${k}</td><td style="padding:6px 12px;color:#2C2C2C;font-size:14px">${v}</td></tr>`
    )
    .join('');

  return `<!DOCTYPE html><html><body style="font-family:'Georgia',serif;background:#FAF8F5;margin:0;padding:20px">
  <div style="max-width:580px;margin:0 auto;background:#fff;border:1px solid #E5E2DD">
    <div style="background:#2C2C2C;padding:24px 32px">
      <p style="color:#C4A265;font-size:11px;letter-spacing:3px;margin:0">JIN PANG HOMES</p>
      <p style="color:#fff;font-size:22px;margin:8px 0 0;font-family:'Georgia',serif">New Home Valuation Request</p>
    </div>
    <table style="width:100%;border-collapse:collapse;margin:0">${rows}</table>
  </div></body></html>`;
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as ValuationPayload;
    if (!payload.name || !payload.email || !payload.address) {
      return NextResponse.json({ message: 'Name, email, and address are required' }, { status: 400 });
    }

    const leadId = await saveToSupabase(payload);

    await writeAuditLog({
      action: 'lead_capture',
      siteId: normalizedSiteId(payload),
      metadata: {
        table: 'valuation_requests',
        leadId,
        category: 'valuation',
        locale: normalizedLocale(payload),
        email: payload.email,
        source: payload.source || null,
        pagePath: payload.pagePath || null,
        consentAccepted: Boolean(payload.consentAccepted),
        consentText: payload.consentText || null,
      },
    });

    if (EMAIL_ADAPTER_ENABLED && process.env.RESEND_API_KEY) {
      const from = process.env.RESEND_FROM || 'no-reply@baamplatform.com';
      await resend.emails.send({
        from,
        to: [FALLBACK_EMAIL],
        reply_to: payload.email,
        subject: `New Home Valuation Request — ${payload.name}`,
        html: buildEmailHtml(payload),
      });
    }

    await emitLeadToCrm({
      type: 'valuation_request',
      siteId: normalizedSiteId(payload),
      locale: normalizedLocale(payload),
      category: 'valuation',
      source: payload.source || null,
      pagePath: payload.pagePath || null,
      payload: payload as unknown as Record<string, unknown>,
    }).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Valuation route error:', error);
    return NextResponse.json({ message: 'Internal error' }, { status: 500 });
  }
}

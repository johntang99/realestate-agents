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
const BUYER_CONFIRMATION_ENABLED =
  process.env.SHOWING_BUYER_CONFIRMATION_ENABLED !== 'false';

type ShowingRequestPayload = {
  siteId?: string;
  locale?: string;
  source?: string;
  pagePath?: string;
  consentAccepted?: boolean;
  consentText?: string;
  name?: string;
  email?: string;
  phone?: string;
  propertySlug?: string;
  propertyAddress?: string;
  agentSlug?: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
};

function normalizedSiteId(payload: ShowingRequestPayload) {
  return payload.siteId || process.env.NEXT_PUBLIC_DEFAULT_SITE_ID || 'jinpanghomes';
}

function normalizedLocale(payload: ShowingRequestPayload) {
  return payload.locale || 'en';
}

async function saveToSupabase(payload: ShowingRequestPayload): Promise<string | null> {
  if (!SUPABASE_URL || !SERVICE_KEY) return null;
  const baseRow = {
    site_id: normalizedSiteId(payload),
    name: payload.name || '',
    email: payload.email || '',
    phone: payload.phone || '',
    property_slug: payload.propertySlug || '',
    property_address: payload.propertyAddress || '',
    agent_slug: payload.agentSlug || '',
    preferred_date: payload.preferredDate || '',
    preferred_time: payload.preferredTime || '',
    message: payload.message || '',
    status: 'new',
  };

  let response = await fetch(`${SUPABASE_URL}/rest/v1/showing_requests`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(baseRow),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    const columnMissing =
      errorText.includes('property_slug') ||
      errorText.includes('property_address') ||
      errorText.includes('preferred_date') ||
      errorText.includes('preferred_time') ||
      errorText.includes('status');
    if (!columnMissing) {
      throw new Error('Failed to save showing request');
    }
    // Schema variant compatibility:
    // 1) flattened without property_slug
    // 2) legacy data-jsonb
    response = await fetch(`${SUPABASE_URL}/rest/v1/showing_requests`, {
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
        property_address: payload.propertyAddress || '',
        agent_slug: payload.agentSlug || '',
        preferred_date: payload.preferredDate || '',
        preferred_time: payload.preferredTime || '',
        message: payload.message || '',
        status: 'new',
      }),
    });

    if (!response.ok) {
      response = await fetch(`${SUPABASE_URL}/rest/v1/showing_requests`, {
        method: 'POST',
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          site_id: normalizedSiteId(payload),
          data: {
            name: payload.name || '',
            email: payload.email || '',
            phone: payload.phone || '',
            propertySlug: payload.propertySlug || '',
            propertyAddress: payload.propertyAddress || '',
            agentSlug: payload.agentSlug || '',
            preferredDate: payload.preferredDate || '',
            preferredTime: payload.preferredTime || '',
            message: payload.message || '',
            status: 'new',
          },
        }),
      });
      if (!response.ok) throw new Error('Failed to save showing request');
    }
  }
  try {
    const rows = await response.json();
    if (Array.isArray(rows) && rows[0] && typeof rows[0].id === 'string') return rows[0].id;
  } catch {}
  return null;
}

function buildEmailHtml(payload: ShowingRequestPayload) {
  const rows = [
    ['Name', payload.name],
    ['Email', payload.email],
    ['Phone', payload.phone],
    ['Property', payload.propertyAddress],
    ['Property Slug', payload.propertySlug],
    ['Preferred Date', payload.preferredDate],
    ['Preferred Time', payload.preferredTime],
    ['Message', payload.message],
    ['Source', payload.source],
    ['Page Path', payload.pagePath],
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
      <p style="color:#fff;font-size:22px;margin:8px 0 0;font-family:'Georgia',serif">New Showing Request</p>
    </div>
    <table style="width:100%;border-collapse:collapse;margin:0">${rows}</table>
  </div></body></html>`;
}

function buildBuyerConfirmationHtml(payload: ShowingRequestPayload) {
  const locale = normalizedLocale(payload);
  const isZh = locale === 'zh';
  const property = payload.propertyAddress || payload.propertySlug || 'the selected property';
  const preferredWindow = [payload.preferredDate, payload.preferredTime]
    .filter(Boolean)
    .join(' · ');

  const copy = isZh
    ? {
        title: '我们已收到您的看房预约请求',
        greeting: `您好 ${payload.name || ''}`.trim(),
        intro: `感谢您的联系。我们已收到您关于 ${property} 的看房预约请求。`,
        preferredLabel: '期望时间',
        followup:
          '我们的买方顾问将尽快审核您的请求，并与您确认可预约时间及后续安排。',
        help: `如需即时帮助，请直接回复此邮件或联系 ${FALLBACK_EMAIL}。`,
      }
    : {
        title: 'We received your showing request',
        greeting: `Hi ${payload.name || 'there'},`,
        intro: `Thanks for reaching out. Your request to schedule a showing for ${property} has been received.`,
        preferredLabel: 'Preferred time',
        followup:
          'A buyer specialist will review your request and follow up shortly to confirm availability and next steps.',
        help: `If you need immediate help, reply to this email or contact us at ${FALLBACK_EMAIL}.`,
      };

  return `<!DOCTYPE html><html><body style="font-family:Inter,Arial,sans-serif;background:#f7f8fb;margin:0;padding:20px;color:#0f172a">
  <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
    <div style="background:#0f2a55;padding:20px 24px">
      <p style="color:#d4af37;font-size:11px;letter-spacing:2px;margin:0 0 6px;font-weight:600">JIN PANG HOMES</p>
      <h1 style="color:#ffffff;font-size:22px;line-height:1.3;margin:0">${copy.title}</h1>
    </div>
    <div style="padding:24px">
      <p style="margin:0 0 12px;font-size:15px;line-height:1.7">${copy.greeting}</p>
      <p style="margin:0 0 14px;font-size:15px;line-height:1.7">
        ${copy.intro}
      </p>
      ${
        preferredWindow
          ? `<p style="margin:0 0 14px;font-size:15px;line-height:1.7">${copy.preferredLabel}: <strong>${preferredWindow}</strong></p>`
          : ''
      }
      <p style="margin:0 0 14px;font-size:15px;line-height:1.7">
        ${copy.followup}
      </p>
      <div style="margin-top:18px;padding:14px;border:1px solid #e5e7eb;border-radius:8px;background:#f8fafc">
        <p style="margin:0;font-size:13px;color:#475569">
          ${copy.help}
        </p>
      </div>
    </div>
  </div></body></html>`;
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as ShowingRequestPayload;
    if (!payload.name || !payload.email || !payload.propertySlug) {
      return NextResponse.json(
        { message: 'name, email, and propertySlug are required' },
        { status: 400 }
      );
    }

    const leadId = await saveToSupabase(payload);
    const siteId = normalizedSiteId(payload);
    const locale = normalizedLocale(payload);

    await writeAuditLog({
      action: 'lead_capture',
      siteId,
      metadata: {
        table: 'showing_requests',
        leadId,
        category: 'showing',
        locale,
        email: payload.email,
        source: payload.source || null,
        pagePath: payload.pagePath || null,
        consentAccepted: Boolean(payload.consentAccepted),
        consentText: payload.consentText || null,
        propertySlug: payload.propertySlug || null,
      },
    });

    if (EMAIL_ADAPTER_ENABLED && resend) {
      const from = process.env.RESEND_FROM || 'no-reply@baamplatform.com';
      await resend.emails.send({
        from,
        to: [FALLBACK_EMAIL],
        reply_to: payload.email,
        subject: `New Showing Request — ${payload.name}`,
        html: buildEmailHtml(payload),
      }).catch(console.error);

      if (BUYER_CONFIRMATION_ENABLED && payload.email) {
        await resend.emails
          .send({
            from,
            to: [payload.email],
            subject:
              normalizedLocale(payload) === 'zh'
                ? '我们已收到您的看房预约请求'
                : 'We received your showing request',
            html: buildBuyerConfirmationHtml(payload),
          })
          .then(async () => {
            await writeAuditLog({
              action: 'showing_request_confirmation_sent',
              siteId,
              metadata: {
                leadId,
                email: payload.email,
                propertySlug: payload.propertySlug || null,
              },
            });
          })
          .catch(console.error);
      }
    }

    await emitLeadToCrm({
      type: 'showing_request',
      siteId,
      locale,
      category: 'showing',
      source: payload.source || null,
      pagePath: payload.pagePath || null,
      payload: payload as unknown as Record<string, unknown>,
    }).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('showing-request route error:', error);
    return NextResponse.json({ message: 'Internal error' }, { status: 500 });
  }
}

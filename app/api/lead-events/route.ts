import { NextRequest, NextResponse } from 'next/server';
import { writeAuditLog } from '@/lib/admin/audit';
import { emitLeadToCrm } from '@/lib/leads/server';

type LeadEventPayload = {
  siteId?: string;
  locale?: string;
  eventName?: string;
  source?: string;
  pagePath?: string;
  metadata?: Record<string, unknown>;
};

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as LeadEventPayload;
    const eventName = String(payload.eventName || '').trim();
    if (!eventName) {
      return NextResponse.json({ message: 'eventName is required' }, { status: 400 });
    }

    const siteId = payload.siteId || process.env.NEXT_PUBLIC_DEFAULT_SITE_ID || 'jinpanghomes';
    const locale = payload.locale || 'en';
    await writeAuditLog({
      action: 'lead_event',
      siteId,
      metadata: {
        eventName,
        locale,
        source: payload.source || null,
        pagePath: payload.pagePath || null,
        metadata: payload.metadata || {},
      },
    });
    await emitLeadToCrm({
      type: 'lead_event',
      siteId,
      locale,
      eventName,
      source: payload.source || null,
      pagePath: payload.pagePath || null,
      payload: payload.metadata || {},
    }).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('lead-events route error:', error);
    return NextResponse.json({ message: 'Internal error' }, { status: 500 });
  }
}

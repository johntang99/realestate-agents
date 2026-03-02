import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { getSupabaseServerClient as getSupabaseAdmin } from '@/lib/supabase/server';

const EDITABLE_FIELDS = ['photo', 'bio', 'phone', 'email', 'social', 'specialties', 'languages', 'testimonials'];

async function getAgentForUser(userId: string, siteId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  // Look up agent_users link
  const { data: link } = await supabase
    .from('agent_users')
    .select('agent_id')
    .eq('user_id', userId)
    .single();

  if (!link?.agent_id) return null;

  const { data: agent } = await supabase
    .from('agents')
    .select('*')
    .eq('id', link.agent_id)
    .eq('site_id', siteId)
    .single();

  return agent || null;
}

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const siteId = process.env.NEXT_PUBLIC_DEFAULT_SITE_ID || 'jinpanghomes';

  // broker_admin can access all agents; agent role can only see their own
  if (session.user.role === 'agent') {
    const agent = await getAgentForUser(session.user.id, siteId);
    if (!agent) return NextResponse.json({ error: 'No agent profile found for this user' }, { status: 404 });
    return NextResponse.json({ agent: agent.data });
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

export async function PUT(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (session.user.role !== 'agent') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json();
  const newData: Record<string, unknown> = body.agent || {};
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 500 });
  const siteId = process.env.NEXT_PUBLIC_DEFAULT_SITE_ID || 'jinpanghomes';

  const agent = await getAgentForUser(session.user.id, siteId);
  if (!agent) return NextResponse.json({ error: 'No agent profile found' }, { status: 404 });

  // Merge only editable fields — never allow slug, role, licenseNumber, displayOrder
  const merged = { ...(agent.data || {}) };
  for (const field of EDITABLE_FIELDS) {
    if (field in newData) merged[field] = newData[field];
  }

  const { error } = await supabase
    .from('agents')
    .update({ data: merged, updated_at: new Date().toISOString() })
    .eq('id', agent.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

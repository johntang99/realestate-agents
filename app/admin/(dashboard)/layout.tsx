import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { getSession } from '@/lib/admin/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect('/admin/login');
  }

  const role = session.user?.role || 'viewer';
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '';

  // Agent role: may only access /admin/agent-profile
  if (role === 'agent' && !pathname.includes('agent-profile')) {
    redirect('/admin/agent-profile');
  }

  // Staff role: block settings, users, sites, agents, new-construction pages
  const staffBlocked = ['/admin/settings', '/admin/users', '/admin/sites', '/admin/agents', '/admin/new-construction'];
  if (role === 'staff' && staffBlocked.some((p) => pathname.startsWith(p))) {
    redirect('/admin/content');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminTopbar />
        <main className="px-6 py-6">{children}</main>
      </div>
    </div>
  );
}

import { getSession } from '@/lib/admin/auth';
import { canManageUsers, isSuperAdmin } from '@/lib/admin/permissions';
import { AdminSidebarNav } from './AdminSidebarNav';
import type { IconKey } from './AdminSidebarNav';

type SidebarItem = {
  name: string;
  href: string;
  iconKey: IconKey;
  group: 'site' | 'system';
  preserveContext?: boolean;
};

const brokerAdminNav: SidebarItem[] = [
  { name: 'Site Settings', href: '/admin/site-settings', iconKey: 'slidersHorizontal', group: 'site' },
  { name: 'Content', href: '/admin/content', iconKey: 'fileText', group: 'site' },
  { name: 'Properties', href: '/admin/properties', iconKey: 'home', group: 'site' },
  { name: 'Neighborhoods', href: '/admin/neighborhoods', iconKey: 'map', group: 'site' },
  { name: 'Case Studies', href: '/admin/case-studies', iconKey: 'fileText', group: 'site' },
  { name: 'Knowledge Center', href: '/admin/knowledge-center', iconKey: 'bookOpen', group: 'site' },
  { name: 'Market Reports', href: '/admin/market-reports', iconKey: 'barChart2', group: 'site' },
  { name: 'Testimonials', href: '/admin/testimonials', iconKey: 'messageSquare', group: 'site' },
  { name: 'Resources', href: '/admin/resources', iconKey: 'download', group: 'site' },
  { name: 'Investor Inquiries', href: '/admin/investor-inquiries', iconKey: 'calendarCheck2', group: 'site' },
  { name: 'Showing Requests', href: '/admin/showing-requests', iconKey: 'calendarCheck2', group: 'site' },
  { name: 'Media', href: '/admin/media', iconKey: 'image', group: 'site' },

  { name: 'Sites', href: '/admin/sites', iconKey: 'building2', group: 'system', preserveContext: false },
  { name: 'Domains', href: '/admin/sites', iconKey: 'globe', group: 'system', preserveContext: false },
  { name: 'Onboarding', href: '/admin/onboarding', iconKey: 'rocket', group: 'system', preserveContext: false },
  { name: 'Variants', href: '/admin/variants', iconKey: 'layers', group: 'system', preserveContext: false },
  { name: 'Users', href: '/admin/users', iconKey: 'users', group: 'system', preserveContext: false },
  { name: 'Settings', href: '/admin/settings', iconKey: 'settings', group: 'system', preserveContext: false },
];

const staffNav = brokerAdminNav.filter((item) =>
  ['Content', 'Case Studies', 'Knowledge Center', 'Market Reports', 'Testimonials', 'Resources', 'Media'].includes(item.name)
);

const agentNav: SidebarItem[] = [
  { name: 'My Profile', href: '/admin/agent-profile', iconKey: 'userCircle', group: 'system', preserveContext: false },
];

export async function AdminSidebar() {
  const session = await getSession();
  const role = session?.user?.role || 'viewer';

  let items = brokerAdminNav;
  if (role === 'agent') {
    items = agentNav;
  } else if (role === 'staff') {
    items = staffNav;
  } else if (session?.user && !canManageUsers(session.user)) {
    items = brokerAdminNav.filter((item) => item.name !== 'Users');
  }

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <span className="text-lg font-semibold" style={{ color: '#1A2744' }}>
          {role === 'agent' ? 'Agent Portal' : 'Admin Dashboard'}
        </span>
      </div>
      <AdminSidebarNav items={items} />
      {role === 'agent' && (
        <div className="px-4 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            Jin Pang Homes<br />Agent Portal
          </p>
        </div>
      )}
    </aside>
  );
}

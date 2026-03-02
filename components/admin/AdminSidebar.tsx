import Link from 'next/link';
import {
  Home,
  Building2,
  Map,
  FileText,
  BarChart2,
  MessageSquare,
  Image,
  Layers,
  Settings,
  SlidersHorizontal,
  Users,
  BookOpen,
  CalendarCheck2,
  Download,
  UserCircle,
  Globe,
} from 'lucide-react';
import { getSession } from '@/lib/admin/auth';
import { canManageUsers, isSuperAdmin } from '@/lib/admin/permissions';

const brokerAdminNav = [
  { name: 'Sites', href: '/admin/sites', icon: Building2 },
  { name: 'Domains', href: '/admin/sites', icon: Globe },
  { name: 'Site Settings', href: '/admin/site-settings', icon: SlidersHorizontal },
  { name: 'Content', href: '/admin/content', icon: FileText },
  { name: 'Properties', href: '/admin/properties', icon: Home },
  { name: 'Neighborhoods', href: '/admin/neighborhoods', icon: Map },
  { name: 'Case Studies', href: '/admin/case-studies', icon: FileText },
  { name: 'Knowledge Center', href: '/admin/knowledge-center', icon: BookOpen },
  { name: 'Market Reports', href: '/admin/market-reports', icon: BarChart2 },
  { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
  { name: 'Resources', href: '/admin/resources', icon: Download },
  { name: 'Investor Inquiries', href: '/admin/investor-inquiries', icon: CalendarCheck2 },
  { name: 'Showing Requests', href: '/admin/showing-requests', icon: CalendarCheck2 },
  { name: 'Media', href: '/admin/media', icon: Image },
  { name: 'Variants', href: '/admin/variants', icon: Layers },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

const staffNav = brokerAdminNav.filter((item) =>
  ['Content', 'Case Studies', 'Knowledge Center', 'Market Reports', 'Testimonials', 'Resources', 'Media'].includes(item.name)
);

const agentNav = [
  { name: 'My Profile', href: '/admin/agent-profile', icon: UserCircle },
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
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
          >
            <item.icon className="w-4 h-4 text-gray-500" />
            {item.name}
          </Link>
        ))}
      </nav>
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

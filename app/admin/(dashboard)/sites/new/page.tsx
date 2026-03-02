import Link from 'next/link';
import { SiteForm } from '@/components/admin/SiteForm';
import type { SiteConfig } from '@/lib/types';
import { getSites } from '@/lib/sites';

export default async function AdminSiteCreatePage() {
  const sites = await getSites();
  const site: SiteConfig = {
    id: '',
    name: '',
    domain: '',
    enabled: true,
    defaultLocale: 'en',
    supportedLocales: ['en', 'zh'],
    createdAt: '',
    updatedAt: '',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/admin/sites" className="hover:text-gray-800">
              Sites
            </Link>
            <span>/</span>
            <span>New Site</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mt-2">New Site</h1>
          <p className="text-sm text-gray-600">Create a new site.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SiteForm site={site} mode="create" sites={sites} />
      </div>
    </div>
  );
}

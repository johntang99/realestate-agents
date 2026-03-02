import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSiteById } from '@/lib/sites';
import { SiteForm } from '@/components/admin/SiteForm';
import { getSession } from '@/lib/admin/auth';
import { canAccessSite } from '@/lib/admin/permissions';

export default async function AdminSiteDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session || !canAccessSite(session.user, params.id)) {
    notFound();
  }
  const site = await getSiteById(params.id);
  if (!site) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/admin/sites" className="hover:text-gray-800">
              Sites
            </Link>
            <span>/</span>
            <span>{site.name}</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mt-2">{site.name}</h1>
          <p className="text-sm text-gray-600">Manage site settings and locales.</p>
        </div>
        <Link
          href={`/${site.defaultLocale}`}
          className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
          target="_blank"
          rel="noreferrer"
        >
          Open Site
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SiteForm site={site} />
      </div>
    </div>
  );
}

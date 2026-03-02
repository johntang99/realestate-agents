import Link from 'next/link';
import { getSites } from '@/lib/sites';
import { ImportSitesButton } from '@/components/admin/ImportSitesButton';
import { getSession } from '@/lib/admin/auth';
import { canCreateSites, canImportSites, filterSitesForUser } from '@/lib/admin/permissions';

export default async function AdminSitesPage() {
  const session = await getSession();
  const sites = await getSites();
  const visibleSites = session ? filterSitesForUser(sites, session.user) : sites;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Sites</h1>
          <p className="text-sm text-gray-600">
            Manage all sites and their locales
          </p>
        </div>
        <div className="flex items-center gap-3">
          {session?.user && canImportSites(session.user) && <ImportSitesButton />}
          {session?.user && canCreateSites(session.user) && (
            <Link
              href="/admin/sites/new"
              className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:opacity-90"
            >
              Add Site
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {visibleSites.map((site) => (
          <div
            key={site.id}
            className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900">{site.name}</h2>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    site.enabled
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {site.enabled ? 'Active' : 'Disabled'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">ID: {site.id}</p>
              <div className="text-sm text-gray-600 mt-2">
                <span className="font-medium text-gray-700">Default locale:</span>{' '}
                {site.defaultLocale}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                <span className="font-medium text-gray-700">Supported locales:</span>{' '}
                {site.supportedLocales.join(', ')}
              </div>
              {site.domain && (
                <div className="text-sm text-gray-600 mt-1">
                  <span className="font-medium text-gray-700">Domain:</span>{' '}
                  {site.domain}
                </div>
              )}
              {Array.isArray(site.domainAliases) && site.domainAliases.length > 0 && (
                <div className="text-sm text-gray-600 mt-1">
                  <span className="font-medium text-gray-700">Domain aliases:</span>{' '}
                  {site.domainAliases.length}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/admin/sites/${site.id}`}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
              >
                View
              </Link>
              <Link
                href={`/admin/sites/${site.id}`}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
        {visibleSites.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-600">
            No sites found. Create your first site to get started.
          </div>
        )}
      </div>
    </div>
  );
}

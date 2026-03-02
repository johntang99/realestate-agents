import { getSites } from '@/lib/sites';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { getSession } from '@/lib/admin/auth';
import { filterSitesForUser } from '@/lib/admin/permissions';

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: { siteId?: string; locale?: string };
}) {
  const session = await getSession();
  const sites = await getSites();
  const visibleSites = session ? filterSitesForUser(sites, session.user) : sites;
  const defaultSite = visibleSites[0];
  const selectedSite =
    visibleSites.find((site) => site.id === (searchParams?.siteId || '')) || defaultSite;
  const selectedSiteId = selectedSite?.id || '';
  const selectedLocale = searchParams?.locale || selectedSite?.defaultLocale || 'en';

  return (
    <ContentEditor
      sites={visibleSites}
      selectedSiteId={selectedSiteId}
      selectedLocale={selectedLocale}
      fileFilter="events"
      titleOverride="Events"
      basePath="/admin/events"
    />
  );
}

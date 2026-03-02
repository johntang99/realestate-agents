import { getSites } from '@/lib/sites';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { getSession } from '@/lib/admin/auth';
import { filterSitesForUser } from '@/lib/admin/permissions';

export default async function AdminCollectionsPage({ searchParams }: { searchParams?: { siteId?: string; locale?: string } }) {
  const session = await getSession();
  const sites = await getSites();
  const visibleSites = session ? filterSitesForUser(sites, session.user) : sites;
  const defaultSite = visibleSites[0];
  const selectedSite = visibleSites.find(s => s.id === (searchParams?.siteId || '')) || defaultSite;
  return (
    <ContentEditor sites={visibleSites} selectedSiteId={selectedSite?.id || ''} selectedLocale={searchParams?.locale || selectedSite?.defaultLocale || 'en'}
      fileFilter="collections" titleOverride="Design Collections" basePath="/admin/collections" />
  );
}

import { MediaManager } from '@/components/admin/MediaManager';
import { getSites } from '@/lib/sites';
import { getSession } from '@/lib/admin/auth';
import { filterSitesForUser } from '@/lib/admin/permissions';

export default async function AdminMediaPage() {
  const session = await getSession();
  const sites = await getSites();
  const visibleSites = session ? filterSitesForUser(sites, session.user) : sites;
  const selectedSiteId = visibleSites[0]?.id || '';
  return (
    <MediaManager sites={visibleSites} selectedSiteId={selectedSiteId} />
  );
}

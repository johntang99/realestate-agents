import { ShowingRequestsManager } from '@/components/admin/ShowingRequestsManager';
import { getSites } from '@/lib/sites';
import { getSession } from '@/lib/admin/auth';
import { filterSitesForUser } from '@/lib/admin/permissions';

export default async function AdminShowingRequestsPage() {
  const session = await getSession();
  const sites = await getSites();
  const visibleSites = session ? filterSitesForUser(sites, session.user) : sites;
  const selectedSiteId = visibleSites[0]?.id || '';
  return (
    <ShowingRequestsManager sites={visibleSites} selectedSiteId={selectedSiteId} />
  );
}

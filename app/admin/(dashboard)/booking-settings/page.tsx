import { BookingSettingsManager } from '@/components/admin/BookingSettingsManager';
import { getSites } from '@/lib/sites';
import { getSession } from '@/lib/admin/auth';
import { filterSitesForUser } from '@/lib/admin/permissions';

export default async function AdminBookingSettingsPage() {
  const session = await getSession();
  const sites = await getSites();
  const visibleSites = session ? filterSitesForUser(sites, session.user) : sites;
  const selectedSiteId = visibleSites[0]?.id || '';
  return <BookingSettingsManager sites={visibleSites} selectedSiteId={selectedSiteId} />;
}

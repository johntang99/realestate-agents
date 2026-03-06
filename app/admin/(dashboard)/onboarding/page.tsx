import { getSession } from '@/lib/admin/auth';
import { isSuperAdmin } from '@/lib/admin/permissions';
import { getSites } from '@/lib/sites';
import { OnboardingWizard } from '@/components/admin/OnboardingWizard';

export default async function AdminOnboardingPage() {
  const session = await getSession();
  if (!session || !isSuperAdmin(session.user)) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-gray-600">
          You do not have access to client onboarding.
        </p>
      </div>
    );
  }

  const sites = await getSites();
  const templateSites = sites.filter((s) => s.enabled);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Brokerage Onboarding
        </h1>
        <p className="text-sm text-gray-600">
          Create a new brokerage site from a master template. Fill in business
          details, select verticals, choose a brand, and generate a fully
          customized real estate brokerage site.
        </p>
      </div>
      <OnboardingWizard
        templateSites={templateSites.map((s) => ({ id: s.id, name: s.name }))}
      />
    </div>
  );
}

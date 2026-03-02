import { UsersManager } from '@/components/admin/UsersManager';
import { getSites } from '@/lib/sites';
import { getSession } from '@/lib/admin/auth';
import { canManageUsers } from '@/lib/admin/permissions';

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session || !canManageUsers(session.user)) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600">
        You do not have access to manage users.
      </div>
    );
  }
  const sites = await getSites();
  return (
    <UsersManager sites={sites} />
  );
}

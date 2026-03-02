import type { SiteConfig, User } from '@/lib/types';

function normalizeSiteId(siteId: string) {
  return siteId.trim().toLowerCase();
}

function normalizeRole(user: User) {
  return String(user.role || '')
    .trim()
    .toLowerCase()
    .replace(/-/g, '_');
}

export function isSuperAdmin(user: User) {
  return normalizeRole(user) === 'super_admin';
}

function hasGlobalSiteAccess(user: User) {
  const role = normalizeRole(user);
  return role === 'super_admin' || role === 'broker_admin';
}

export function canImportSites(user: User) {
  return hasGlobalSiteAccess(user);
}

export function canCreateSites(user: User) {
  return hasGlobalSiteAccess(user);
}

export function canManageUsers(user: User) {
  const role = normalizeRole(user);
  return role === 'super_admin' || role === 'broker_admin' || role === 'site_admin';
}

export function canAccessSite(user: User, siteId: string) {
  const normalizedSiteId = normalizeSiteId(siteId);
  if (!normalizedSiteId) return false;
  if (hasGlobalSiteAccess(user)) return true;
  const uniqueSites = new Set(user.sites.map((entry) => normalizeSiteId(entry)));
  return uniqueSites.has(normalizedSiteId);
}

export function filterSitesForUser(sites: SiteConfig[], user: User) {
  if (hasGlobalSiteAccess(user)) return sites;
  const allowed = new Set(user.sites.map((entry) => normalizeSiteId(entry)));
  return sites.filter((site) => allowed.has(normalizeSiteId(site.id)));
}

export function requireRole(user: User, roles: User['role'][]) {
  const role = normalizeRole(user);
  const allowed = roles.map((entry) =>
    String(entry)
      .trim()
      .toLowerCase()
      .replace(/-/g, '_')
  );
  if (!allowed.includes(role)) {
    throw new Error('Forbidden');
  }
}

export function requireSiteAccess(user: User, siteId: string) {
  if (!canAccessSite(user, siteId)) {
    throw new Error('Forbidden');
  }
}

export function canWriteContent(user: User) {
  const role = normalizeRole(user);
  return ['super_admin', 'site_admin', 'editor', 'broker_admin'].includes(role);
}

export function canManageBookings(user: User) {
  const role = normalizeRole(user);
  return ['super_admin', 'site_admin', 'broker_admin'].includes(role);
}

export function canManageMedia(user: User) {
  const role = normalizeRole(user);
  return ['super_admin', 'site_admin', 'editor', 'broker_admin'].includes(role);
}

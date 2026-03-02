import type { SiteInfo } from './types';

/**
 * Returns a neutral display name while preserving legacy `clinicName` support.
 */
export function getSiteDisplayName(
  siteInfo?: Partial<SiteInfo> | null,
  fallback = 'Business'
): string {
  const fromBusinessName = siteInfo?.businessName?.trim();
  if (fromBusinessName) return fromBusinessName;

  const fromLegacyName = siteInfo?.clinicName?.trim();
  if (fromLegacyName) return fromLegacyName;

  return fallback;
}

import type { Metadata } from 'next';
import { headers } from 'next/headers';
import {
  addLocaleToPathname,
  defaultLocale,
  locales,
  type Locale,
  removeLocaleFromPathname,
} from '@/lib/i18n';
import { loadSeo, loadSiteInfo } from '@/lib/content';
import type { SeoConfig, SiteInfo } from '@/lib/types';
import { getSiteDisplayName } from '@/lib/siteInfo';

export function getBaseUrlFromHost(host?: string | null): URL {
  const trimmed = (host || '').trim();
  if (!trimmed) {
    return new URL('http://localhost:3003');
  }

  const isLocal =
    trimmed.includes('localhost') ||
    trimmed.endsWith('.local') ||
    trimmed.startsWith('127.0.0.1') ||
    trimmed.endsWith(':3000') ||
    trimmed.endsWith(':3003');
  const protocol = isLocal ? 'http' : 'https';
  return new URL(`${protocol}://${trimmed}`);
}

export function getBaseUrlFromRequest(): URL {
  const host = headers().get('host');
  return getBaseUrlFromHost(host);
}

function getPageSeo(seo: SeoConfig | null, slug?: string) {
  if (!seo) return null;
  if (!slug || slug === 'home') {
    return seo.home || seo.pages?.home || null;
  }
  return seo.pages?.[slug] || null;
}

export async function buildPageMetadata({
  siteId,
  locale,
  slug,
  title,
  description,
  canonicalPath,
  pathWithoutLocale,
}: {
  siteId: string;
  locale: Locale;
  slug?: string;
  title?: string;
  description?: string;
  canonicalPath?: string;
  pathWithoutLocale?: string;
}): Promise<Metadata> {
  const baseUrl = getBaseUrlFromRequest();
  const [seo, siteInfo] = await Promise.all([
    loadSeo(siteId, locale) as Promise<SeoConfig | null>,
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
  ]);

  const pageSeo = getPageSeo(seo, slug);
  const fallbackTitle = getSiteDisplayName(siteInfo, 'Business');
  const resolvedTitle = title || pageSeo?.title || seo?.title || fallbackTitle;
  const resolvedDescription =
    description ||
    pageSeo?.description ||
    seo?.description ||
    siteInfo?.description ||
    '';

  const resolvedPathWithoutLocale =
    pathWithoutLocale ??
    (canonicalPath ? removeLocaleFromPathname(canonicalPath) : null) ??
    (slug && slug !== 'home' ? `/${slug}` : '/');
  const canonicalPathname = addLocaleToPathname(resolvedPathWithoutLocale, locale);
  const canonical = new URL(canonicalPathname, baseUrl).toString();
  const languageAlternates = locales.reduce<Record<string, string>>((acc, entry) => {
    acc[entry] = new URL(addLocaleToPathname(resolvedPathWithoutLocale, entry), baseUrl).toString();
    return acc;
  }, {});
  const xDefault = new URL(
    addLocaleToPathname(resolvedPathWithoutLocale, defaultLocale),
    baseUrl
  ).toString();

  return {
    title: resolvedTitle,
    description: resolvedDescription || undefined,
    alternates: {
      canonical,
      languages: {
        ...languageAlternates,
        'x-default': xDefault,
      },
    },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription || undefined,
      url: canonical,
      images: seo?.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
  };
}

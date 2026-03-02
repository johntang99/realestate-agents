// ============================================
// INTERNATIONALIZATION (i18n) UTILITIES
// ============================================

import { Locale } from './types';

// Re-export Locale type
export type { Locale };

export const locales: Locale[] = ['en', 'zh'];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  zh: '🇨🇳',
};

/**
 * Get locale from pathname
 */
export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (firstSegment && locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale;
  }
  
  return defaultLocale;
}

/**
 * Remove locale prefix from pathname
 */
export function removeLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  // Check if first segment is a valid locale
  if (firstSegment && locales.includes(firstSegment as Locale)) {
    // Remove the locale segment
    segments.shift();
    return '/' + segments.join('/');
  }
  
  return pathname || '/';
}

/**
 * Add locale prefix to pathname
 */
export function addLocaleToPathname(pathname: string, locale: Locale): string {
  const cleanPath = removeLocaleFromPathname(pathname);
  
  // Always add locale prefix
  if (cleanPath === '/' || cleanPath === '') {
    return `/${locale}`;
  }
  
  return `/${locale}${cleanPath}`;
}

/**
 * Switch locale while maintaining current path
 */
export function switchLocale(currentPath: string, newLocale: Locale): string {
  const pathWithoutLocale = removeLocaleFromPathname(currentPath);
  return addLocaleToPathname(pathWithoutLocale, newLocale);
}

/**
 * Validate locale
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

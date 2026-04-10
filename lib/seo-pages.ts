import fs from 'fs/promises';
import path from 'path';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export type SeoPageType =
  | 'rea-location-landing'
  | 'rea-agent-location'
  | 'rea-buy-location'
  | 'rea-sell-location'
  | 'rea-resource';

export interface SeoPageRegistryEntry {
  slug: string;
  pageType: SeoPageType;
  active: boolean;
  locales: string[];
  priority?: number;
  keywords?: string[];
}

interface RegistryFileShape {
  pages?: SeoPageRegistryEntry[];
}

const CONTENT_DIR = path.join(process.cwd(), 'content');

async function loadRegistryFile(siteId: string): Promise<SeoPageRegistryEntry[]> {
  try {
    const filePath = path.join(CONTENT_DIR, siteId, 'seo-pages.json');
    const raw = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(raw) as RegistryFileShape;
    return (parsed.pages || []).filter((entry) => entry.active !== false);
  } catch {
    return [];
  }
}

export async function getSEOPagesForSite(siteId: string): Promise<SeoPageRegistryEntry[]> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('site_seo_pages')
        .select('*')
        .eq('site_id', siteId)
        .eq('active', true);

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((row: any) => ({
          slug: row.slug,
          pageType: row.page_type as SeoPageType,
          active: row.active !== false,
          locales: Array.isArray(row.locales) && row.locales.length > 0 ? row.locales : ['en'],
          priority: typeof row.priority === 'number' ? row.priority : undefined,
          keywords: Array.isArray(row.keywords) ? row.keywords : undefined,
        }));
      }
    } catch {
      // Fall back to filesystem registry when DB table is unavailable.
    }
  }

  return loadRegistryFile(siteId);
}

export async function getSEOPagesBySlug(
  siteId: string,
  slug: string,
): Promise<SeoPageRegistryEntry | null> {
  const pages = await getSEOPagesForSite(siteId);
  return pages.find((page) => page.slug === slug && page.active !== false) || null;
}

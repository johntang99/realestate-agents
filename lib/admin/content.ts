import fs from 'fs/promises';
import path from 'path';
import { getDefaultFooter } from '../footer';
import { listContentEntries } from '@/lib/contentDb';
import { defaultLocale } from '@/lib/i18n';

export interface ContentFileItem {
  id: string;
  label: string;
  path: string;
  scope: 'locale' | 'site';
  publishDate?: string;
}

const CONTENT_DIR = path.join(process.cwd(), 'content');
const COLLECTION_PREFIXES = [
  'portfolio/',
  'shop-products/',
  'journal/',
  'collections/',
  'testimonials/',
  'properties/',
  'neighborhoods/',
  'market-reports/',
  'agents/',
  'knowledge-center/',
  'new-construction/',
  'events/',
  'guides/',
  'case-studies/',
  'resources/',
];
const COLLECTION_DIRS = [
  'portfolio', 'shop-products', 'journal', 'collections', 'testimonials',
  'properties', 'neighborhoods', 'market-reports',
  'agents', 'knowledge-center', 'new-construction', 'events', 'guides',
  'case-studies', 'resources',
];

function getTitleFromData(data: unknown): string {
  if (!data || typeof data !== 'object') return '';
  const record = data as Record<string, unknown>;
  const candidates = ['title', 'headline', 'name', 'label', 'slug'];
  for (const key of candidates) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function getCollectionLabel(filePath: string, data?: unknown): string {
  const slug = filePath.split('/').pop()?.replace('.json', '') || filePath;
  const title = getTitleFromData(data);
  if (filePath.startsWith('portfolio/')) {
    return `Portfolio: ${title || titleCase(slug)}`;
  }
  if (filePath.startsWith('shop-products/')) {
    return `Product: ${title || titleCase(slug)}`;
  }
  if (filePath.startsWith('journal/')) {
    return `Journal: ${title || titleCase(slug)}`;
  }
  if (filePath.startsWith('collections/')) {
    return `Collection: ${title || titleCase(slug)}`;
  }
  if (filePath.startsWith('testimonials/')) {
    return `Testimonial: ${title || titleCase(slug)}`;
  }
  return title || titleCase(slug);
}

function titleCase(value: string) {
  return value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

async function ensureSeoFile(siteId: string, locale: string) {
  const seoPath = path.join(CONTENT_DIR, siteId, locale, 'seo.json');
  try {
    await fs.access(seoPath);
  } catch (error) {
    try {
      await fs.mkdir(path.dirname(seoPath), { recursive: true });
      await fs.writeFile(
        seoPath,
        JSON.stringify(
          {
            title: '',
            description: '',
            ogImage: '',
            home: {
              title: '',
              description: '',
            },
            pages: {},
          },
          null,
          2
        )
      );
    } catch (writeError) {
      // ignore write failures (read-only environments)
    }
  }
}

async function ensureFooterFile(siteId: string, locale: string) {
  const footerPath = path.join(CONTENT_DIR, siteId, locale, 'footer.json');
  try {
    await fs.access(footerPath);
  } catch (error) {
    try {
      await fs.mkdir(path.dirname(footerPath), { recursive: true });
      const footer = getDefaultFooter(locale as any);
      await fs.writeFile(footerPath, JSON.stringify(footer, null, 2));
    } catch (writeError) {
      // ignore write failures (read-only environments)
    }
  }
}

async function ensureHeaderFile(siteId: string, locale: string) {
  const headerPath = path.join(CONTENT_DIR, siteId, locale, 'header.json');
  try {
    await fs.access(headerPath);
  } catch (error) {
    try {
      await fs.mkdir(path.dirname(headerPath), { recursive: true });
      const payload = {
        topbar: {
          phone: '',
          phoneHref: '',
          address: '',
          addressHref: '',
          hours: '',
          badge: '',
        },
        menu: {
          logo: {
            emoji: '',
            text: '',
            subtext: '',
            image: {
              src: '',
              alt: '',
            },
          },
          items: [],
        },
        languages: [],
        cta: {
          text: '',
          link: '',
        },
      };
      await fs.writeFile(headerPath, JSON.stringify(payload, null, 2));
    } catch (writeError) {
      // ignore write failures (read-only environments)
    }
  }
}

export async function listContentFiles(
  siteId: string,
  locale: string
): Promise<ContentFileItem[]> {
  const items: ContentFileItem[] = [];
  const localeCandidates =
    locale === defaultLocale ? [locale] : [locale, defaultLocale];
  await ensureSeoFile(siteId, locale);
  await ensureFooterFile(siteId, locale);
  await ensureHeaderFile(siteId, locale);

  const addItem = (item: ContentFileItem) => {
    if (!items.some((entry) => entry.path === item.path)) {
      items.push(item);
    }
  };

  let dbEntries = await listContentEntries(siteId, locale);
  if (dbEntries.length === 0 && locale !== defaultLocale) {
    dbEntries = await listContentEntries(siteId, defaultLocale);
  }
  if (dbEntries.length > 0) {
    dbEntries.forEach((entry) => {
      if (entry.path.startsWith('pages/') && entry.path.endsWith('.json')) {
        const slug = entry.path.replace('pages/', '').replace('.json', '');
        addItem({
          id: `page-${slug}`,
          label: `Page: ${titleCase(slug)}`,
          path: entry.path,
          scope: 'locale',
        });
        return;
      }

      if (entry.path.startsWith('blog/') && entry.path.endsWith('.json')) {
        const slug = entry.path.replace('blog/', '').replace('.json', '');
        const data = (entry.content ?? entry.data) as Record<string, any>;
        const title = typeof data?.title === 'string' ? data.title : '';
        const publishDate =
          typeof data?.publishDate === 'string' ? data.publishDate : '';
        addItem({
          id: `blog-${slug}`,
          label: `Blog Post: ${title || titleCase(slug)}`,
          path: entry.path,
          scope: 'locale',
          publishDate: publishDate || undefined,
        });
        return;
      }

      if (
        COLLECTION_PREFIXES.some((prefix) => entry.path.startsWith(prefix)) &&
        entry.path.endsWith('.json')
      ) {
        addItem({
          id: `collection-${entry.path.replace(/\//g, '-').replace('.json', '')}`,
          label: getCollectionLabel(entry.path, entry.content ?? entry.data),
          path: entry.path,
          scope: 'locale',
        });
        return;
      }

      if (entry.path === 'testimonials.json') {
        addItem({
          id: 'testimonials',
          label: 'Client Testimonials',
          path: entry.path,
          scope: 'locale',
        });
        return;
      }

      if (entry.path === 'navigation.json') {
        addItem({ id: 'navigation', label: 'Navigation', path: entry.path, scope: 'locale' });
      }
      if (entry.path === 'header.json') {
        addItem({ id: 'header', label: 'Header', path: entry.path, scope: 'locale' });
      }
      if (entry.path === 'seo.json') {
        addItem({ id: 'seo', label: 'SEO', path: entry.path, scope: 'locale' });
      }
      if (entry.path === 'footer.json') {
        addItem({ id: 'footer', label: 'Footer', path: entry.path, scope: 'locale' });
      }
      if (entry.path === 'site.json') {
        addItem({ id: 'site', label: 'Site Info', path: entry.path, scope: 'locale' });
      }
      if (entry.path === 'theme.json') {
        addItem({ id: 'theme', label: 'Theme', path: entry.path, scope: 'site' });
      }
    });
  }

  for (const candidateLocale of localeCandidates) {
    const pagesDir = path.join(CONTENT_DIR, siteId, candidateLocale, 'pages');
    try {
      const files = await fs.readdir(pagesDir);
      files
        .filter((file) => file.endsWith('.json'))
        .forEach((file) => {
          const slug = file.replace('.json', '');
          addItem({
            id: `page-${slug}`,
            label: `Page: ${titleCase(slug)}`,
            path: `pages/${file}`,
            scope: 'locale',
          });
        });
    } catch (error) {
      // ignore missing pages directory
    }
  }

  for (const candidateLocale of localeCandidates) {
    const blogDir = path.join(CONTENT_DIR, siteId, candidateLocale, 'blog');
    try {
      const files = await fs.readdir(blogDir);
      await Promise.all(
        files
          .filter((file) => file.endsWith('.json'))
          .map(async (file) => {
            const slug = file.replace('.json', '');
            let title = '';
            let publishDate = '';
            try {
              const raw = await fs.readFile(path.join(blogDir, file), 'utf-8');
              const parsed = JSON.parse(raw);
              title = typeof parsed.title === 'string' ? parsed.title : '';
              publishDate =
                typeof parsed.publishDate === 'string' ? parsed.publishDate : '';
            } catch (error) {
              // ignore parse errors
            }
            addItem({
              id: `blog-${slug}`,
              label: `Blog Post: ${title || titleCase(slug)}`,
              path: `blog/${file}`,
              scope: 'locale',
              publishDate: publishDate || undefined,
            });
          })
      );
    } catch (error) {
      // ignore missing blog directory
    }
  }

  for (const candidateLocale of localeCandidates) {
    await Promise.all(
      COLLECTION_DIRS.map(async (dirName) => {
        const dirPath = path.join(CONTENT_DIR, siteId, candidateLocale, dirName);
        try {
          const files = await fs.readdir(dirPath);
          await Promise.all(
            files
              .filter((file) => file.endsWith('.json'))
              .map(async (file) => {
                const filePath = `${dirName}/${file}`;
                let parsed: unknown = null;
                try {
                  const raw = await fs.readFile(path.join(dirPath, file), 'utf-8');
                  parsed = JSON.parse(raw);
                } catch {
                  // ignore parse errors and fallback to slug label
                }
                addItem({
                  id: `collection-${dirName}-${file.replace('.json', '')}`,
                  label: getCollectionLabel(filePath, parsed),
                  path: filePath,
                  scope: 'locale',
                });
              })
          );
        } catch {
          // ignore missing collection directories
        }
      })
    );
  }

  for (const candidateLocale of localeCandidates) {
    const testimonialsPath = path.join(CONTENT_DIR, siteId, candidateLocale, 'testimonials.json');
    try {
      await fs.access(testimonialsPath);
      addItem({
        id: 'testimonials',
        label: 'Client Testimonials',
        path: 'testimonials.json',
        scope: 'locale',
      });
      break;
    } catch {
      // ignore missing testimonials.json
    }
  }

  addItem({
    id: 'navigation',
    label: 'Navigation',
    path: 'navigation.json',
    scope: 'locale',
  });
  addItem({
    id: 'header',
    label: 'Header',
    path: 'header.json',
    scope: 'locale',
  });
  addItem({
    id: 'seo',
    label: 'SEO',
    path: 'seo.json',
    scope: 'locale',
  });
  addItem({
    id: 'footer',
    label: 'Footer',
    path: 'footer.json',
    scope: 'locale',
  });
  addItem({
    id: 'site',
    label: 'Site Info',
    path: 'site.json',
    scope: 'locale',
  });
  addItem({
    id: 'theme',
    label: 'Theme',
    path: 'theme.json',
    scope: 'site',
  });

  return items;
}

export function resolveContentPath(siteId: string, locale: string, filePath: string) {
  if (filePath === 'theme.json') {
    return path.join(CONTENT_DIR, siteId, 'theme.json');
  }

  if (filePath === 'navigation.json') {
    return path.join(CONTENT_DIR, siteId, locale, 'navigation.json');
  }

  if (filePath === 'header.json') {
    return path.join(CONTENT_DIR, siteId, locale, 'header.json');
  }

  if (filePath === 'site.json') {
    return path.join(CONTENT_DIR, siteId, locale, 'site.json');
  }

  if (filePath === 'seo.json') {
    return path.join(CONTENT_DIR, siteId, locale, 'seo.json');
  }

  if (filePath === 'footer.json') {
    return path.join(CONTENT_DIR, siteId, locale, 'footer.json');
  }

  if (filePath.startsWith('pages/')) {
    return path.join(CONTENT_DIR, siteId, locale, filePath);
  }

  if (filePath.startsWith('blog/')) {
    return path.join(CONTENT_DIR, siteId, locale, filePath);
  }

  if (
    filePath === 'testimonials.json' ||
    COLLECTION_PREFIXES.some((prefix) => filePath.startsWith(prefix))
  ) {
    return path.join(CONTENT_DIR, siteId, locale, filePath);
  }

  return null;
}

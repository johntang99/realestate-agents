import { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { isSuperAdmin } from '@/lib/admin/permissions';
import fs from 'fs';
import path from 'path';

// ── Types ────────────────────────────────────────────────────────────

interface StepProgress {
  step: string;
  label: string;
  status: 'running' | 'done' | 'error';
  message: string;
  duration?: number;
}

interface OnboardResult {
  siteId: string;
  entries: number;
  agents: number;
  domains: number;
  errors: string[];
  warnings: string[];
}

// ── Real estate vertical mapping ─────────────────────────────────────

const RE_VERTICALS: Record<string, Array<{ slug: string; label: string }>> = {
  'Core Services': [
    { slug: 'buying', label: 'Buy a Home' },
    { slug: 'selling', label: 'Sell Your Home' },
    { slug: 'home-valuation', label: 'Home Valuation' },
  ],
  'Specialty Services': [
    { slug: 'investing', label: 'Investment Properties' },
    { slug: 'relocating', label: 'Relocation Services' },
    { slug: 'new-construction', label: 'New Construction' },
  ],
};
const ALL_VERTICAL_SLUGS = Object.values(RE_VERTICALS).flat().map((s) => s.slug);

// ── Color utilities ──────────────────────────────────────────────────

function hexToHsl(hex: string): [number, number, number] {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  h /= 360; s /= 100; l /= 100;
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return '#' + [r, g, b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
}

function darken(hex: string, percent: number): string {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h, s, Math.max(0, l - percent));
}

function lighten(hex: string, percent: number): string {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h, s, Math.min(100, l + percent));
}

// ── Deep string replace ──────────────────────────────────────────────

function deepReplace(obj: any, replacements: [string, string][]): any {
  if (typeof obj === 'string') {
    let result = obj;
    for (const [search, replace] of replacements) {
      result = result.replaceAll(search, replace);
    }
    return result;
  }
  if (Array.isArray(obj)) return obj.map((item) => deepReplace(item, replacements));
  if (obj && typeof obj === 'object') {
    const out: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      out[key] = deepReplace(val, replacements);
    }
    return out;
  }
  return obj;
}

// ── Slugify ──────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text.toLowerCase()
    .replace(/,.*$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// ── Phone to tel link ────────────────────────────────────────────────

function phoneToTel(phone: string): string {
  return 'tel:+1' + phone.replace(/[^0-9]/g, '');
}

// ── Template interpolation ───────────────────────────────────────────

function interpolateTemplate(template: string, vars: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{{${key}}}`, value);
  }
  return result;
}

// ── Supabase REST helpers ────────────────────────────────────────────

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase configuration');
  return { url, key };
}

function supaHeaders(key: string): Record<string, string> {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    Prefer: 'resolution=merge-duplicates,return=representation',
  };
}

async function supaFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const { url, key } = getSupabaseConfig();
  const headers = { ...supaHeaders(key), ...(options.headers as Record<string, string> || {}) };
  return fetch(`${url}/rest/v1/${path}`, { ...options, headers });
}

async function upsert(table: string, rows: any[], onConflict?: string): Promise<any[]> {
  const queryPath = onConflict ? `${table}?on_conflict=${onConflict}` : table;
  const res = await supaFetch(queryPath, { method: 'POST', body: JSON.stringify(rows) });
  if (!res.ok) throw new Error(`Upsert ${table} failed (${res.status}): ${await res.text()}`);
  return res.json();
}

async function fetchRows(table: string, filters: Record<string, string>): Promise<any[]> {
  const { url, key } = getSupabaseConfig();
  const params = Object.entries(filters).map(([k, v]) => `${k}=eq.${encodeURIComponent(v)}`).join('&');
  const res = await fetch(`${url}/rest/v1/${table}?${params}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`Fetch ${table} failed (${res.status})`);
  return res.json();
}

async function deleteRows(table: string, filters: Record<string, string>): Promise<void> {
  const { key } = getSupabaseConfig();
  const res = await supaFetch(
    `${table}?${Object.entries(filters).map(([k, v]) => `${k}=eq.${encodeURIComponent(v)}`).join('&')}`,
    { method: 'DELETE', headers: supaHeaders(key) }
  );
  if (!res.ok) throw new Error(`Delete ${table} failed (${res.status}): ${await res.text()}`);
}

// ── Claude API helpers ───────────────────────────────────────────────

async function callClaude(prompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Claude API failed (${res.status}): ${body}`);
  }
  const result = await res.json();
  return result.content[0].text;
}

function parseJsonFromResponse(text: string): any {
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
  const jsonStr = codeBlockMatch ? codeBlockMatch[1].trim() : text.trim();
  try {
    return JSON.parse(jsonStr);
  } catch (e: any) {
    const braceMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (braceMatch) return JSON.parse(braceMatch[0]);
    throw new Error(`Failed to parse AI response as JSON: ${e.message}`);
  }
}

// ── POST handler ─────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // Auth check
  const session = await getSessionFromRequest(request);
  if (!session) {
    return new Response(JSON.stringify({ message: 'Not authenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (!isSuperAdmin(session.user)) {
    return new Response(JSON.stringify({ message: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Parse intake from request body
  let intake: any;
  try {
    intake = await request.json();
  } catch {
    return new Response(JSON.stringify({ message: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!intake.clientId || !intake.business?.name) {
    return new Response(JSON.stringify({ message: 'clientId and business.name are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Validate Supabase config early
  try {
    getSupabaseConfig();
  } catch (e: any) {
    return new Response(JSON.stringify({ message: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const TEMPLATE_ID = intake.templateSiteId || 'jinpanghomes';
  const SITE_ID: string = intake.clientId;
  const LOCALES: string[] = intake.locales?.supported || ['en'];
  const DEFAULT_LOCALE: string = intake.locales?.default || 'en';
  const SKIP_AI: boolean = intake.skipAi === true;
  const CONTENT_DIR = path.join(process.cwd(), 'content');

  // SSE stream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const emit = (event: string, data: any) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      const emitProgress = (step: string, label: string, status: StepProgress['status'], message: string, duration?: number) => {
        const payload: StepProgress = { step, label, status, message };
        if (duration !== undefined) payload.duration = duration;
        emit('progress', payload);
      };

      const result: OnboardResult = {
        siteId: SITE_ID,
        entries: 0,
        agents: 0,
        domains: 0,
        errors: [],
        warnings: [],
      };

      try {
        // ════════════════════════════════════════════════════════════════
        //  O1: CLONE
        // ════════════════════════════════════════════════════════════════
        const o1Start = Date.now();
        emitProgress('O1', 'Clone', 'running', 'Cloning template...');

        try {
          // Check if site already exists
          const existing = await fetchRows('sites', { id: SITE_ID });
          if (existing.length === 0) {
            await upsert('sites', [{
              id: SITE_ID,
              name: intake.business.name,
              domain: intake.domains?.production || '',
              enabled: true,
              default_locale: DEFAULT_LOCALE,
              supported_locales: LOCALES,
            }], 'id');
          }

          // Clone content entries from template
          const templateEntries = await fetchRows('content_entries', { site_id: TEMPLATE_ID });
          const cloned = templateEntries.map((e: any) => ({
            site_id: SITE_ID,
            locale: e.locale,
            path: e.path,
            content: e.content,
            updated_by: 'onboard-api',
          }));

          const BATCH = 50;
          for (let i = 0; i < cloned.length; i += BATCH) {
            await upsert('content_entries', cloned.slice(i, i + BATCH), 'site_id,locale,path');
          }

          // Register domain aliases
          const domainRows: any[] = [];
          if (intake.domains?.production) {
            domainRows.push({ site_id: SITE_ID, domain: intake.domains.production, environment: 'prod', enabled: true });
          }
          if (intake.domains?.dev) {
            domainRows.push({ site_id: SITE_ID, domain: intake.domains.dev, environment: 'dev', enabled: true });
          }
          if (domainRows.length > 0) {
            await upsert('site_domains', domainRows, 'site_id,domain,environment');
          }
          result.domains = domainRows.length;

          // Update local _sites.json
          const sitesFile = path.join(CONTENT_DIR, '_sites.json');
          try {
            const sitesData = JSON.parse(fs.readFileSync(sitesFile, 'utf-8'));
            if (!sitesData.sites.find((s: any) => s.id === SITE_ID)) {
              sitesData.sites.push({
                id: SITE_ID,
                name: intake.business.name,
                domain: intake.domains?.production || '',
                enabled: true,
                defaultLocale: DEFAULT_LOCALE,
                supportedLocales: LOCALES,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });
              fs.writeFileSync(sitesFile, JSON.stringify(sitesData, null, 2) + '\n');
            }
          } catch { /* _sites.json may not exist in all environments */ }

          // Update local _site-domains.json
          const domainsFile = path.join(CONTENT_DIR, '_site-domains.json');
          try {
            const domainsData = JSON.parse(fs.readFileSync(domainsFile, 'utf-8'));
            for (const dr of domainRows) {
              if (!domainsData.domains.find((d: any) => d.siteId === dr.site_id && d.domain === dr.domain)) {
                domainsData.domains.push({ siteId: dr.site_id, domain: dr.domain, environment: dr.environment, enabled: true });
              }
            }
            fs.writeFileSync(domainsFile, JSON.stringify(domainsData, null, 2) + '\n');
          } catch { /* _site-domains.json may not exist in all environments */ }

          emitProgress('O1', 'Clone', 'done', `Cloned ${cloned.length} entries`, Date.now() - o1Start);
        } catch (err: any) {
          emitProgress('O1', 'Clone', 'error', err.message, Date.now() - o1Start);
          throw err;
        }

        // ════════════════════════════════════════════════════════════════
        //  O2: BRAND
        // ════════════════════════════════════════════════════════════════
        const o2Start = Date.now();
        emitProgress('O2', 'Brand', 'running', 'Applying brand theme...');

        try {
          const variantsPath = path.join(process.cwd(), 'scripts', 'onboard', 'brand-variants.json');
          const variants = JSON.parse(fs.readFileSync(variantsPath, 'utf-8'));
          const variantName = intake.brand?.variant || 'navy-gold';
          const variant = JSON.parse(JSON.stringify(variants[variantName] || variants['navy-gold']));

          // Read existing theme from DB to preserve full structure (status colors, spacing, effects, etc.)
          const themeRows = await fetchRows('content_entries', { site_id: SITE_ID, locale: 'en', path: 'theme.json' });
          const existingTheme = themeRows[0]?.content || {};

          // Start from existing theme and merge variant colors/typography
          const base = JSON.parse(JSON.stringify(existingTheme));

          // Merge variant colors into existing theme colors
          if (variant.colors) {
            base.colors = {
              ...base.colors,
              primary: variant.colors.primary?.DEFAULT || base.colors?.primary,
              primaryScale: variant.colors.primary || base.colors?.primaryScale,
              secondary: variant.colors.secondary?.DEFAULT || base.colors?.secondary,
              secondaryScale: variant.colors.secondary || base.colors?.secondaryScale,
            };
            if (variant.colors.accent) base.colors.accent = variant.colors.accent;
            if (variant.colors.accentAlt) base.colors.accentAlt = variant.colors.accentAlt;
            if (variant.colors.backdrop) base.colors.backdrop = { ...base.colors.backdrop, ...variant.colors.backdrop };
          }

          // Apply color overrides from intake
          if (intake.brand?.primaryColor) {
            const pc = intake.brand.primaryColor;
            const primaryScale = {
              '50': lighten(pc, 42),
              '100': lighten(pc, 32),
              DEFAULT: pc,
              light: lighten(pc, 18),
              dark: darken(pc, 12),
            };
            base.colors.primary = pc;
            base.colors.primaryScale = primaryScale;
          }
          if (intake.brand?.secondaryColor) {
            const sc = intake.brand.secondaryColor;
            const secondaryScale = {
              '50': lighten(sc, 42),
              DEFAULT: sc,
              light: lighten(sc, 18),
              dark: darken(sc, 12),
            };
            base.colors.secondary = sc;
            base.colors.secondaryScale = secondaryScale;
          }

          // Merge variant fonts into typography.fonts
          if (variant.typography?.fonts) {
            base.typography = {
              ...base.typography,
              fonts: { ...base.typography?.fonts, ...variant.typography.fonts },
            };
          }

          // Apply font overrides from intake — update BOTH top-level fonts and typography.fonts
          if (intake.brand?.fonts?.heading) {
            const f = intake.brand.fonts.heading;
            const headingStack = `'${f}', Georgia, serif`;
            base.fonts = { ...base.fonts, heading: f };
            if (base.typography?.fonts) {
              base.typography.fonts.display = headingStack;
              base.typography.fonts.heading = headingStack;
              base.typography.fonts.subheading = headingStack;
            }
          }
          if (intake.brand?.fonts?.body) {
            const f = intake.brand.fonts.body;
            const bodyStack = `'${f}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
            base.fonts = { ...base.fonts, body: f };
            if (base.typography?.fonts) {
              base.typography.fonts.body = bodyStack;
              base.typography.fonts.small = bodyStack;
            }
          }
          if (intake.brand?.fonts?.ui) {
            base.fonts = { ...base.fonts, ui: intake.brand.fonts.ui };
          }
          if (intake.brand?.fonts?.chineseBody) {
            base.fonts = { ...base.fonts, chineseBody: intake.brand.fonts.chineseBody };
          }
          if (intake.brand?.fonts?.chineseHeading) {
            base.fonts = { ...base.fonts, chineseHeading: intake.brand.fonts.chineseHeading };
          }

          // Also derive top-level fonts from variant if not overridden by intake
          if (variant.typography?.fonts && !intake.brand?.fonts?.heading) {
            const dispFont = variant.typography.fonts.display?.match(/'([^']+)'/)?.[1];
            if (dispFont) base.fonts = { ...base.fonts, heading: dispFont };
          }
          if (variant.typography?.fonts && !intake.brand?.fonts?.body) {
            const bodyFont = variant.typography.fonts.body?.match(/'([^']+)'/)?.[1];
            if (bodyFont) base.fonts = { ...base.fonts, body: bodyFont };
          }

          // Upsert theme.json
          await upsert('content_entries', [{
            site_id: SITE_ID,
            locale: 'en',
            path: 'theme.json',
            content: base,
            updated_by: 'onboard-api',
          }], 'site_id,locale,path');

          emitProgress('O2', 'Brand', 'done', `Applied variant "${variantName}"`, Date.now() - o2Start);
        } catch (err: any) {
          emitProgress('O2', 'Brand', 'error', err.message, Date.now() - o2Start);
          throw err;
        }

        // ════════════════════════════════════════════════════════════════
        //  O3: PRUNE VERTICALS
        // ════════════════════════════════════════════════════════════════
        const o3Start = Date.now();
        emitProgress('O3', 'Prune Verticals', 'running', 'Pruning disabled verticals...');

        try {
          const enabledSlugs: string[] = intake.services?.enabled || ALL_VERTICAL_SLUGS;
          const disabledSlugs = ALL_VERTICAL_SLUGS.filter((s) => !enabledSlugs.includes(s));

          if (disabledSlugs.length > 0) {
            for (const locale of LOCALES) {
              // 1. Delete page content entries for disabled verticals
              for (const slug of disabledSlugs) {
                await deleteRows('content_entries', { site_id: SITE_ID, locale, path: `pages/${slug}.json` });
              }

              // 2. Delete related content directories (e.g., new-construction/*.json)
              const allEntries = await fetchRows('content_entries', { site_id: SITE_ID });
              for (const slug of disabledSlugs) {
                const relatedEntries = allEntries.filter(
                  (e: any) => e.locale === locale && e.path.startsWith(`${slug}/`)
                );
                for (const entry of relatedEntries) {
                  await deleteRows('content_entries', { site_id: SITE_ID, locale, path: entry.path });
                }
              }

              // 3. Update header.json: filter navigation[] array
              const headerRows = await fetchRows('content_entries', { site_id: SITE_ID, locale, path: 'header.json' });
              if (headerRows[0]?.content) {
                const header = headerRows[0].content;
                if (header.navigation) {
                  header.navigation = header.navigation.filter((item: any) => {
                    const href = item.href?.replace(/^\//, '');
                    return !disabledSlugs.includes(href);
                  });
                }
                await upsert('content_entries', [{ site_id: SITE_ID, locale, path: 'header.json', content: header, updated_by: 'onboard-api' }], 'site_id,locale,path');
              }

              // 4. Update footer.json: filter columns[1].links[] (Services column)
              const footerRows = await fetchRows('content_entries', { site_id: SITE_ID, locale, path: 'footer.json' });
              if (footerRows[0]?.content) {
                const footer = footerRows[0].content;
                if (footer.columns?.[1]?.links) {
                  footer.columns[1].links = footer.columns[1].links.filter((link: any) => {
                    const href = link.href?.replace(/^\//, '');
                    return !disabledSlugs.includes(href);
                  });
                }
                await upsert('content_entries', [{ site_id: SITE_ID, locale, path: 'footer.json', content: footer, updated_by: 'onboard-api' }], 'site_id,locale,path');
              }

              // 5. Update pages/home.json: filter goalPaths.items[]
              const homeRows = await fetchRows('content_entries', { site_id: SITE_ID, locale, path: 'pages/home.json' });
              if (homeRows[0]?.content) {
                const home = homeRows[0].content;
                if (home.goalPaths?.items) {
                  home.goalPaths.items = home.goalPaths.items.filter((item: any) => {
                    const href = item.href?.replace(/^\//, '');
                    return !disabledSlugs.includes(href);
                  });
                }
                await upsert('content_entries', [{ site_id: SITE_ID, locale, path: 'pages/home.json', content: home, updated_by: 'onboard-api' }], 'site_id,locale,path');
              }
            }
          }

          emitProgress('O3', 'Prune Verticals', 'done', `${enabledSlugs.length} enabled, ${disabledSlugs.length} removed`, Date.now() - o3Start);
        } catch (err: any) {
          emitProgress('O3', 'Prune Verticals', 'error', err.message, Date.now() - o3Start);
          throw err;
        }

        // ════════════════════════════════════════════════════════════════
        //  O4: CONTENT REPLACEMENT
        // ════════════════════════════════════════════════════════════════
        const o4Start = Date.now();
        emitProgress('O4', 'Content Replacement', 'running', 'Replacing template content...');

        try {
          const biz = intake.business;
          const loc = intake.location;

          // Build replacement pairs — ordered longest-first, only when values provided
          const replacements: [string, string][] = [];

          // 1. Principal broker name
          if (intake.license?.principalBrokerName) {
            replacements.push(['Jin Pang Leadership Team', intake.license.principalBrokerName]);
          }
          // 2. Business name uppercase
          replacements.push(['JIN PANG HOMES', biz.name.toUpperCase()]);
          // 3. Business name + Homes (if not already included)
          const bizNameWithHomes = biz.name.toLowerCase().includes('homes') ? biz.name : `${biz.name} Homes`;
          replacements.push(['Jin Pang Homes', bizNameWithHomes]);
          // 4. Business name
          replacements.push(['Jin Pang', biz.name]);
          // 5. Domain
          if (intake.domains?.production) {
            replacements.push(['jinpanghomes.com', intake.domains.production]);
          }
          // 6. Email
          if (loc.email) {
            replacements.push(
              ['hello@jinpanghomes.com', loc.email],
              [`mailto:hello@jinpanghomes.com`, `mailto:${loc.email}`],
            );
          }
          // 7. Phone
          if (loc.phone) {
            const phoneDigits = loc.phone.replace(/[^0-9]/g, '');
            replacements.push(
              ['(845) 555-0190', loc.phone],
              ['+18455550190', phoneDigits],
              ['tel:+18455550190', phoneToTel(loc.phone)],
            );
          }
          // 8. Address components (longest-first)
          if (loc.address && loc.city && loc.state && loc.zip) {
            replacements.push(
              ['21 Painted Apron Ter, Port Jervis, NY 12771', `${loc.address}, ${loc.city}, ${loc.state} ${loc.zip}`],
              ['21 Painted Apron Ter', loc.address],
              ['Port Jervis, NY 12771', `${loc.city}, ${loc.state} ${loc.zip}`],
              ['Port Jervis, NY', `${loc.city}, ${loc.state}`],
              ['Port Jervis', loc.city],
              ['NY 12771', `${loc.state} ${loc.zip}`],
              ['12771', loc.zip],
            );
          }
          // 9. County
          if (intake.location?.county) {
            replacements.push(['Orange County', intake.location.county]);
          }
          // 10. Bare template site ID (storage paths, video paths, handles)
          replacements.push(['jinpanghomes', SITE_ID]);

          // Fetch all content entries for new site and deep-replace
          const allEntries = await fetchRows('content_entries', { site_id: SITE_ID });
          const updated: any[] = [];
          for (const entry of allEntries) {
            if (entry.path === 'theme.json') continue;
            const newData = deepReplace(entry.content, replacements);
            if (JSON.stringify(newData) !== JSON.stringify(entry.content)) {
              updated.push({ site_id: SITE_ID, locale: entry.locale, path: entry.path, content: newData, updated_by: 'onboard-api' });
            }
          }

          const BATCH = 50;
          for (let i = 0; i < updated.length; i += BATCH) {
            await upsert('content_entries', updated.slice(i, i + BATCH), 'site_id,locale,path');
          }

          // ── Structural updates for specific files ──────────────────

          for (const locale of LOCALES) {
            // site.json — update structured fields
            const siteRows = await fetchRows('content_entries', { site_id: SITE_ID, locale, path: 'site.json' });
            if (siteRows[0]?.content) {
              const site = siteRows[0].content;
              site.id = SITE_ID;
              site.name = biz.name;
              if (loc.email) site.email = loc.email;
              if (loc.phone) {
                site.phone = loc.phone;
                site.smsPhone = loc.phone;
              }
              if (biz.tagline) site.tagline = biz.tagline;
              if (biz.subtagline) site.subtagline = biz.subtagline;
              // Address is a nested object
              if (loc.address && loc.city && loc.state && loc.zip) {
                site.address = {
                  ...site.address,
                  street: loc.address,
                  city: loc.city,
                  state: loc.state,
                  zip: loc.zip,
                  full: `${loc.address}, ${loc.city}, ${loc.state} ${loc.zip}`,
                  ...(loc.lat ? { lat: parseFloat(loc.lat) } : {}),
                  ...(loc.lng ? { lng: parseFloat(loc.lng) } : {}),
                  ...(loc.mapsUrl ? { mapsUrl: loc.mapsUrl } : {}),
                };
              }
              // License
              if (intake.license) {
                site.license = { ...site.license, ...intake.license };
              }
              // Stats
              if (intake.stats && Object.values(intake.stats).some(Boolean)) {
                site.stats = { ...site.stats, ...intake.stats };
              }
              // Social
              if (intake.social && Object.values(intake.social).some(Boolean)) {
                site.social = { ...site.social, ...intake.social };
              }
              // Compliance
              if (intake.compliance) {
                site.compliance = { ...site.compliance, ...intake.compliance };
              }
              // Office hours
              if (intake.hours) {
                site.officeHours = intake.hours;
              }
              // Languages
              const langLabels: Record<string, string> = { en: 'English', zh: '中文', es: 'Espanol', ko: '한국어' };
              const langFlags: Record<string, string> = { en: 'US', zh: 'CN', es: 'MX', ko: 'KR' };
              site.languages = LOCALES.map((code) => ({
                code, label: langLabels[code] || code, flag: langFlags[code] || '', enabled: true,
              }));
              await upsert('content_entries', [{ site_id: SITE_ID, locale, path: 'site.json', content: site, updated_by: 'onboard-api' }], 'site_id,locale,path');
            }

            // header.json — update logoText, phone, logo alt
            const headerRows = await fetchRows('content_entries', { site_id: SITE_ID, locale, path: 'header.json' });
            if (headerRows[0]?.content) {
              const header = headerRows[0].content;
              header.logoText = biz.name.toUpperCase();
              if (loc.phone) header.phone = loc.phone;
              if (header.logo) header.logo.alt = biz.name;
              await upsert('content_entries', [{ site_id: SITE_ID, locale, path: 'header.json', content: header, updated_by: 'onboard-api' }], 'site_id,locale,path');
            }

            // footer.json — update brand column, compliance
            const footerRows = await fetchRows('content_entries', { site_id: SITE_ID, locale, path: 'footer.json' });
            if (footerRows[0]?.content) {
              const footer = footerRows[0].content;
              // First column is brand/about
              if (footer.columns?.[0]) {
                footer.columns[0].heading = biz.name;
                if (biz.description) footer.columns[0].content = biz.description;
              }
              // Compliance
              if (footer.compliance) {
                footer.compliance.brokerageName = biz.name;
                if (intake.license?.principalBrokerName) footer.compliance.principalBroker = intake.license.principalBrokerName;
                if (intake.license?.licenseNumber) footer.compliance.licenseNumber = intake.license.licenseNumber;
                if (intake.license?.principalBrokerLicense) footer.compliance.principalBrokerLicense = intake.license.principalBrokerLicense;
                if (intake.license?.licenseState) footer.compliance.state = intake.license.licenseState;
                footer.compliance.copyrightYear = String(new Date().getFullYear());
                if (intake.compliance?.equalHousingText) footer.compliance.equalHousingText = intake.compliance.equalHousingText;
                if (intake.compliance?.mlsDisclaimer) footer.compliance.mlsDisclaimer = intake.compliance.mlsDisclaimer;
                if (intake.compliance?.fairHousingStatement) footer.compliance.fairHousingStatement = intake.compliance.fairHousingStatement;
              }
              await upsert('content_entries', [{ site_id: SITE_ID, locale, path: 'footer.json', content: footer, updated_by: 'onboard-api' }], 'site_id,locale,path');
            }

            // agents/ — replace template agents with new agents
            const templateAgentSlugs = ['jin-pang', 'jane-smith', 'marcus-johnson', 'sarah-rodriguez'];

            if (intake.business.principalBrokerName) {
              // Delete all 4 template agent files
              for (const slug of templateAgentSlugs) {
                await deleteRows('content_entries', { site_id: SITE_ID, locale, path: `agents/${slug}.json` });
              }

              // Create principal broker agent file
              const principalName = intake.business.principalBrokerName;
              const principalSlug = slugify(principalName);
              const principalAgent = {
                name: principalName,
                slug: principalSlug,
                role: 'principal_broker',
                email: loc.email || '',
                phone: loc.phone || '',
                photo: '',
                title: intake.license?.principalBrokerTitle || 'Principal Broker',
                status: 'active',
                featured: true,
                languages: intake.business.languages || ['English'],
                specialties: intake.business.specialties || [],
                displayOrder: 1,
                licenseState: intake.license?.licenseState || '',
                licenseNumber: intake.license?.principalBrokerLicense || '',
                yearsExperience: intake.stats?.yearsInBusiness ? parseInt(intake.stats.yearsInBusiness) : 0,
                transactionCount: intake.stats?.totalTransactions ? parseInt(String(intake.stats.totalTransactions).replace(/[^0-9]/g, '')) : 0,
                bio: '',
              };
              await upsert('content_entries', [{ site_id: SITE_ID, locale, path: `agents/${principalSlug}.json`, content: principalAgent, updated_by: 'onboard-api' }], 'site_id,locale,path');

              // Create team agent files from intake.agents[]
              if (intake.agents && intake.agents.length > 0) {
                for (let i = 0; i < intake.agents.length; i++) {
                  const agent = intake.agents[i];
                  if (!agent.name) continue;
                  const agentSlug = slugify(agent.name);
                  const agentData = {
                    name: agent.name,
                    slug: agentSlug,
                    role: agent.role || 'agent',
                    email: agent.email || '',
                    phone: agent.phone || '',
                    photo: '',
                    title: agent.title || 'Licensed Real Estate Agent',
                    status: 'active',
                    featured: agent.featured !== false,
                    languages: agent.languages || ['English'],
                    specialties: agent.specialties || [],
                    displayOrder: i + 2,
                    licenseState: agent.licenseState || '',
                    licenseNumber: agent.licenseNumber || '',
                    yearsExperience: agent.yearsExperience || 0,
                    transactionCount: agent.transactionCount || 0,
                    bio: agent.bio || '',
                  };
                  await upsert('content_entries', [{ site_id: SITE_ID, locale, path: `agents/${agentSlug}.json`, content: agentData, updated_by: 'onboard-api' }], 'site_id,locale,path');
                }
              }

              // Update pages/home.json teamPreview
              const homeRows = await fetchRows('content_entries', { site_id: SITE_ID, locale, path: 'pages/home.json' });
              if (homeRows[0]?.content) {
                const home = homeRows[0].content;
                if (home.teamPreview) {
                  home.teamPreview.agentSlugs = [principalSlug];
                  const shortName = principalName.split(',')[0].trim();
                  home.teamPreview.headline = `Meet ${shortName}`;
                }
                await upsert('content_entries', [{ site_id: SITE_ID, locale, path: 'pages/home.json', content: home, updated_by: 'onboard-api' }], 'site_id,locale,path');
              }
            }
            // If no principalBrokerName provided, template agents are kept as-is
            // (their names were already swapped by the deep-replace step above)
          }

          emitProgress('O4', 'Content Replacement', 'done', `Deep-replaced ${updated.length} entries`, Date.now() - o4Start);
        } catch (err: any) {
          emitProgress('O4', 'Content Replacement', 'error', err.message, Date.now() - o4Start);
          throw err;
        }

        // ════════════════════════════════════════════════════════════════
        //  O5: AI CONTENT + SEO
        // ════════════════════════════════════════════════════════════════
        const o5Start = Date.now();
        emitProgress('O5', 'AI Content', 'running', SKIP_AI ? 'Skipping AI (skipAi=true)...' : 'Generating AI content + SEO...');

        try {
          if (!SKIP_AI) {
            const biz = intake.business;
            const loc = intake.location;
            const tone = intake.contentTone || {};

            // Generate content via Claude
            const contentPromptPath = path.join(process.cwd(), 'scripts', 'onboard', 'prompts', 'realestate', 'content.md');
            const contentPrompt = fs.readFileSync(contentPromptPath, 'utf-8');
            const teamDesc = intake.agents?.map((a: any) =>
              `- ${a.name}, ${a.title || 'Licensed Real Estate Agent'}, ${a.role || 'Agent'}. Languages: ${(a.languages || []).join(', ')}. Specialties: ${(a.specialties || []).join(', ')}.`
            ).join('\n') || 'No additional team members.';

            const enabledVerticals = intake.services?.enabled || ALL_VERTICAL_SLUGS;
            const verticalLabels = Object.values(RE_VERTICALS).flat()
              .filter((v) => enabledVerticals.includes(v.slug))
              .map((v) => v.label);

            const contentInput = interpolateTemplate(contentPrompt, {
              businessName: biz.name,
              principalBrokerName: biz.principalBrokerName || '',
              principalBrokerTitle: intake.license?.principalBrokerTitle || 'Principal Broker',
              city: loc.city,
              state: loc.state,
              county: loc.county || '',
              yearsInBusiness: intake.stats?.yearsInBusiness || '',
              totalVolume: intake.stats?.totalVolume || '',
              languages: (biz.languages || []).join(', '),
              specialties: (biz.specialties || []).join(', '),
              uniqueSellingPoints: (tone.uniqueSellingPoints || []).map((u: string) => `- ${u}`).join('\n'),
              targetDemographic: tone.targetDemographic || '',
              voice: tone.voice || 'warm-professional',
              verticalsList: verticalLabels.join(', '),
              teamMembers: teamDesc,
            });

            const contentResult = await callClaude(contentInput);
            const aiContent = parseJsonFromResponse(contentResult);

            // Generate SEO via Claude
            const seoPromptPath = path.join(process.cwd(), 'scripts', 'onboard', 'prompts', 'realestate', 'seo.md');
            const seoPrompt = fs.readFileSync(seoPromptPath, 'utf-8');
            const seoInput = interpolateTemplate(seoPrompt, {
              businessName: biz.name,
              city: loc.city,
              state: loc.state,
              county: loc.county || '',
              phone: loc.phone || '',
              verticalsList: verticalLabels.join(', '),
              languages: (biz.languages || []).join(', '),
            });

            const seoResult = await callClaude(seoInput);
            const aiSeo = parseJsonFromResponse(seoResult);

            // Merge AI content into DB entries
            for (const locale of LOCALES) {
              // Update home page
              const homeRows = await fetchRows('content_entries', { site_id: SITE_ID, locale, path: 'pages/home.json' });
              if (homeRows[0]?.content) {
                const home = homeRows[0].content;
                if (aiContent.hero) {
                  if (aiContent.hero.headline) home.hero.headline = aiContent.hero.headline;
                  if (aiContent.hero.subline) home.hero.subline = aiContent.hero.subline;
                }
                if (aiContent.introHeadline && home.intro) home.intro.headline = aiContent.introHeadline;
                if (aiContent.introBody && home.intro) home.intro.body = aiContent.introBody;
                if (aiContent.whyChooseUs && home.whyChooseUs) {
                  home.whyChooseUs.items = aiContent.whyChooseUs;
                }
                if (aiContent.consultationCta) {
                  if (home.consultationCta) {
                    if (aiContent.consultationCta.headline) home.consultationCta.headline = aiContent.consultationCta.headline;
                    if (aiContent.consultationCta.subline) home.consultationCta.subline = aiContent.consultationCta.subline;
                  }
                }
                await upsert('content_entries', [{ site_id: SITE_ID, locale, path: 'pages/home.json', content: home, updated_by: 'onboard-api' }], 'site_id,locale,path');
              }

              // Update about page
              const aboutRows = await fetchRows('content_entries', { site_id: SITE_ID, locale, path: 'pages/about.json' });
              if (aboutRows[0]?.content) {
                const about = aboutRows[0].content;
                if (aiContent.aboutStory && about.story?.blocks) {
                  for (let i = 0; i < Math.min(aiContent.aboutStory.length, about.story.blocks.length); i++) {
                    about.story.blocks[i].body = aiContent.aboutStory[i];
                  }
                  // If AI returned more paragraphs than blocks, add extra blocks
                  if (aiContent.aboutStory.length > about.story.blocks.length) {
                    for (let i = about.story.blocks.length; i < aiContent.aboutStory.length; i++) {
                      about.story.blocks.push({ body: aiContent.aboutStory[i], image: '', imageAlt: '' });
                    }
                  }
                }
                await upsert('content_entries', [{ site_id: SITE_ID, locale, path: 'pages/about.json', content: about, updated_by: 'onboard-api' }], 'site_id,locale,path');
              }

              // Update principal broker agent bio
              if (aiContent.principalBrokerBio && biz.principalBrokerName) {
                const principalSlug = slugify(biz.principalBrokerName);
                const agentRows = await fetchRows('content_entries', { site_id: SITE_ID, locale, path: `agents/${principalSlug}.json` });
                if (agentRows[0]?.content) {
                  const agent = agentRows[0].content;
                  agent.bio = aiContent.principalBrokerBio;
                  await upsert('content_entries', [{ site_id: SITE_ID, locale, path: `agents/${principalSlug}.json`, content: agent, updated_by: 'onboard-api' }], 'site_id,locale,path');
                }
              }

              // Update team agent bios
              if (aiContent.teamBios) {
                for (const tb of aiContent.teamBios) {
                  const slug = tb.slug || slugify(tb.name || '');
                  if (!slug) continue;
                  const agentRows = await fetchRows('content_entries', { site_id: SITE_ID, locale, path: `agents/${slug}.json` });
                  if (agentRows[0]?.content) {
                    const agent = agentRows[0].content;
                    agent.bio = tb.bio;
                    await upsert('content_entries', [{ site_id: SITE_ID, locale, path: `agents/${slug}.json`, content: agent, updated_by: 'onboard-api' }], 'site_id,locale,path');
                  }
                }
              }

              // Update testimonials
              if (aiContent.testimonials) {
                const testimonials = aiContent.testimonials.map((t: any, i: number) => ({
                  id: `t-${String(i + 1).padStart(3, '0')}`,
                  text: t.text,
                  rating: t.rating || 5,
                  featured: i < 3,
                  location: t.location || `${loc.city}, ${loc.state}`,
                  reviewer: t.reviewer,
                  verified: true,
                  reviewDate: new Date(Date.now() - (i * 30 + Math.random() * 60) * 86400000).toISOString().split('T')[0].slice(0, 7),
                  transactionType: t.transactionType || 'buyer',
                }));
                await upsert('content_entries', [{
                  site_id: SITE_ID, locale, path: 'testimonials.json',
                  content: { items: testimonials },
                  updated_by: 'onboard-api',
                }], 'site_id,locale,path');
              }

              // Update seo.json
              if (aiSeo) {
                await upsert('content_entries', [{
                  site_id: SITE_ID, locale, path: 'seo.json', content: aiSeo, updated_by: 'onboard-api',
                }], 'site_id,locale,path');
              }
            }
          }

          emitProgress('O5', 'AI Content', 'done', SKIP_AI ? 'Skipped' : 'Content + SEO generated', Date.now() - o5Start);
        } catch (err: any) {
          emitProgress('O5', 'AI Content', 'error', err.message, Date.now() - o5Start);
          throw err;
        }

        // ════════════════════════════════════════════════════════════════
        //  O6: CLEANUP
        // ════════════════════════════════════════════════════════════════
        const o6Start = Date.now();
        emitProgress('O6', 'Cleanup', 'running', 'Removing unsupported locales...');

        try {
          const allEntries = await fetchRows('content_entries', { site_id: SITE_ID });
          const supportedSet = new Set(LOCALES);
          const unsupportedEntries = allEntries.filter((e: any) => !supportedSet.has(e.locale) && e.locale !== 'en');

          if (unsupportedEntries.length > 0) {
            const unsupportedLocales = [...new Set(unsupportedEntries.map((e: any) => e.locale))] as string[];
            for (const locale of unsupportedLocales) {
              const entries = unsupportedEntries.filter((e: any) => e.locale === locale);
              for (const entry of entries) {
                await deleteRows('content_entries', { site_id: SITE_ID, locale, path: entry.path });
              }
            }
          }

          // Final entry count
          const finalEntries = await fetchRows('content_entries', { site_id: SITE_ID });
          result.entries = finalEntries.length;

          emitProgress('O6', 'Cleanup', 'done', `${result.entries} entries remaining`, Date.now() - o6Start);
        } catch (err: any) {
          emitProgress('O6', 'Cleanup', 'error', err.message, Date.now() - o6Start);
          throw err;
        }

        // ════════════════════════════════════════════════════════════════
        //  O7: VERIFY
        // ════════════════════════════════════════════════════════════════
        const o7Start = Date.now();
        emitProgress('O7', 'Verify', 'running', 'Running verification checks...');

        try {
          const allEntries = await fetchRows('content_entries', { site_id: SITE_ID });

          // 1. Required paths
          const requiredPaths = [
            'site.json', 'header.json', 'footer.json', 'seo.json',
            'pages/home.json', 'pages/about.json', 'pages/contact.json',
          ];
          for (const locale of LOCALES) {
            for (const p of requiredPaths) {
              const found = allEntries.find((e: any) => e.locale === locale && e.path === p);
              if (!found) result.errors.push(`Missing: ${locale}/${p}`);
            }
          }

          // 2. Template contamination check
          const templateTerms = ['Jin Pang', 'jinpanghomes.com', 'jinpanghomes', '(845) 555-0190', '21 Painted Apron'];
          const contaminated: string[] = [];
          for (const entry of allEntries) {
            if (entry.path === 'theme.json') continue;
            const str = JSON.stringify(entry.content);
            for (const term of templateTerms) {
              if (str.includes(term)) {
                contaminated.push(`${entry.locale}/${entry.path} contains "${term}"`);
                break;
              }
            }
          }
          if (contaminated.length > 0) {
            result.warnings.push(`Template contamination in ${contaminated.length} entries`);
            contaminated.forEach((c) => result.warnings.push(c));
          }

          // 3. Agent count check
          const agentEntries = allEntries.filter((e: any) => e.locale === DEFAULT_LOCALE && e.path.startsWith('agents/'));
          result.agents = agentEntries.length;
          if (agentEntries.length === 0) {
            result.warnings.push('No agent entries found');
          }

          // 4. Domain check
          const domains = await fetchRows('site_domains', { site_id: SITE_ID });
          if (domains.length === 0) result.errors.push('No domain aliases registered');
          result.domains = domains.length;

          const status = result.errors.length === 0 && result.warnings.length === 0
            ? 'All checks passed'
            : `${result.errors.length} errors, ${result.warnings.length} warnings`;

          emitProgress('O7', 'Verify', 'done', status, Date.now() - o7Start);
        } catch (err: any) {
          emitProgress('O7', 'Verify', 'error', err.message, Date.now() - o7Start);
          throw err;
        }

        // ── Complete ─────────────────────────────────────────────────
        emit('complete', result);

      } catch (err: any) {
        emit('error', {
          message: `Pipeline failed: ${err.message}`,
          detail: err.stack || '',
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

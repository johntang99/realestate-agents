// ============================================
// SITE MANAGEMENT UTILITIES
// ============================================

import { SiteConfig } from './types';
import fs from 'fs';
import path from 'path';
import {
  canUseSitesDb,
  createSiteDb,
  getSiteByIdDb,
  listSitesDb,
  updateSiteDb,
} from './sitesDb';
import { getSiteDomainMatchDb, normalizeDomain } from './siteDomainsDb';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const SITES_CONFIG_PATH = path.join(CONTENT_DIR, '_sites.json');
const SITE_DOMAINS_CONFIG_PATH = path.join(CONTENT_DIR, '_site-domains.json');

interface SiteDomainFileRecord {
  siteId: string;
  domain: string;
  environment?: 'dev' | 'staging' | 'prod';
  enabled?: boolean;
}

async function getSitesFromFile(): Promise<SiteConfig[]> {
  try {
    const data = await fs.promises.readFile(SITES_CONFIG_PATH, 'utf-8');
    const parsed = JSON.parse(data) as { sites?: SiteConfig[] };
    return parsed.sites || [];
  } catch {
    return [];
  }
}

/**
 * Get all registered sites
 */
export async function getSites(): Promise<SiteConfig[]> {
  if (canUseSitesDb()) {
    const sites = await listSitesDb();
    if (sites.length) return sites;
  }
  try {
    const data = await fs.promises.readFile(SITES_CONFIG_PATH, 'utf-8');
    const sites = JSON.parse(data);
    return sites.sites || [];
  } catch (error) {
    console.error('Error reading sites config:', error);
    return [];
  }
}

async function saveSites(sites: SiteConfig[]): Promise<void> {
  await fs.promises.mkdir(CONTENT_DIR, { recursive: true });
  const payload = { sites };
  await fs.promises.writeFile(SITES_CONFIG_PATH, JSON.stringify(payload, null, 2));
}

/**
 * Get a single site by ID
 */
export async function getSiteById(siteId: string): Promise<SiteConfig | null> {
  if (canUseSitesDb()) {
    const site = await getSiteByIdDb(siteId);
    if (site) return site;
  }
  const fileSites = await getSitesFromFile();
  const fileMatch = fileSites.find((site) => site.id === siteId);
  if (fileMatch) return fileMatch;
  const sites = await getSites();
  return sites.find(site => site.id === siteId) || null;
}

/**
 * Get the default/first site
 */
export async function getDefaultSite(): Promise<SiteConfig | null> {
  const sites = await getSites();
  return sites.find(site => site.enabled) || sites[0] || null;
}

/**
 * Get site by domain (for multi-domain setup)
 */
export async function getSiteByDomain(domain: string): Promise<SiteConfig | null> {
  const normalized = normalizeHost(domain);
  if (!normalized) return null;

  if (canUseSitesDb()) {
    const aliasMatch = await getSiteDomainMatchDb(normalized);
    if (aliasMatch?.siteId) {
      const site = await getSiteById(aliasMatch.siteId);
      if (site?.enabled) return site;
    }
  } else {
    try {
      const raw = await fs.promises.readFile(SITE_DOMAINS_CONFIG_PATH, 'utf-8');
      const parsed = JSON.parse(raw) as { domains?: SiteDomainFileRecord[] };
      const aliases = Array.isArray(parsed.domains) ? parsed.domains : [];
      const alias = aliases.find((entry) => {
        if (entry.enabled === false) return false;
        return normalizeDomain(entry.domain || '') === normalized;
      });
      if (alias?.siteId) {
        const site = await getSiteById(alias.siteId);
        if (site?.enabled) return site;
      }
    } catch {
      // ignore if alias file is missing
    }
  }

  const sites = await getSites();
  return sites.find((site) => normalizeHost(site.domain || '') === normalized) || null;
}

/**
 * Check if a site exists
 */
export async function siteExists(siteId: string): Promise<boolean> {
  const site = await getSiteById(siteId);
  return site !== null;
}

/**
 * Update a site by ID
 */
export async function updateSite(
  siteId: string,
  updates: Partial<SiteConfig>
): Promise<SiteConfig | null> {
  if (canUseSitesDb()) {
    const updated = await updateSiteDb(siteId, updates);
    if (updated) return updated;
  }
  const sites = await getSites();
  const index = sites.findIndex((site) => site.id === siteId);
  if (index === -1) return null;

  const updated: SiteConfig = {
    ...sites[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  sites[index] = updated;
  await saveSites(sites);
  return updated;
}

export async function createSite(
  input: Omit<SiteConfig, 'createdAt' | 'updatedAt'>
): Promise<SiteConfig> {
  if (canUseSitesDb()) {
    const created = await createSiteDb(input);
    if (created) return created;
  }
  const sites = await getSites();
  if (sites.some((site) => site.id === input.id)) {
    throw new Error('Site ID already exists');
  }

  const now = new Date().toISOString();
  const newSite: SiteConfig = {
    ...input,
    createdAt: now,
    updatedAt: now,
  };

  sites.push(newSite);
  await saveSites(sites);
  return newSite;
}

/**
 * Get site content directory path
 */
export function getSiteContentPath(siteId: string): string {
  return path.join(CONTENT_DIR, siteId);
}

/**
 * Get site upload directory path
 */
export function getSiteUploadPath(siteId: string): string {
  return path.join(process.cwd(), 'public', 'uploads', siteId);
}

export function normalizeHost(host: string): string {
  return host.replace(/:\d+$/, '').replace(/^www\./, '').toLowerCase();
}

export async function getSiteByHost(host?: string | null): Promise<SiteConfig | null> {
  if (!host) return null;
  return getSiteByDomain(host);
}

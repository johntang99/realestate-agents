#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const siteId = process.argv[2] || process.env.NEXT_PUBLIC_DEFAULT_SITE_ID || 'jinpanghomes';
const contentRoot = join(ROOT, 'content', siteId);

const requiredRoot = ['site.json', 'header.json', 'footer.json', 'seo.json'];
const requiredPages = ['home.json', 'about.json', 'contact.json', 'home-valuation.json'];
const requiredDirs = ['properties', 'neighborhoods', 'market-reports', 'knowledge-center', 'case-studies', 'resources'];
const locales = ['en', 'zh'];

const issues = [];

for (const locale of locales) {
  const localeRoot = join(contentRoot, locale);
  if (!existsSync(localeRoot)) {
    issues.push(`Missing locale directory: ${locale}`);
    continue;
  }

  for (const file of requiredRoot) {
    if (!existsSync(join(localeRoot, file))) {
      issues.push(`Missing ${locale}/${file}`);
    }
  }

  const pagesRoot = join(localeRoot, 'pages');
  for (const page of requiredPages) {
    if (!existsSync(join(pagesRoot, page))) {
      issues.push(`Missing ${locale}/pages/${page}`);
    }
  }

  for (const dir of requiredDirs) {
    const fullDir = join(localeRoot, dir);
    if (!existsSync(fullDir)) {
      issues.push(`Missing ${locale}/${dir}/`);
      continue;
    }
    const jsonCount = readdirSync(fullDir).filter((f) => f.endsWith('.json')).length;
    if (jsonCount === 0) {
      issues.push(`Empty ${locale}/${dir}/`);
    }
  }
}

const themePath = join(contentRoot, 'theme.json');
if (!existsSync(themePath)) {
  issues.push('Missing theme.json');
} else {
  try {
    JSON.parse(readFileSync(themePath, 'utf-8'));
  } catch {
    issues.push('Invalid JSON in theme.json');
  }
}

if (issues.length > 0) {
  console.error(`Contract validation failed for ${siteId}:`);
  issues.forEach((issue) => console.error(`- ${issue}`));
  process.exit(1);
}

console.log(`Contract validation passed for ${siteId}.`);

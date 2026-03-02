'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ContentTemplate } from '@/lib/admin/templates';
import type { Locale, SiteConfig } from '@/lib/types';
import { Button } from '@/components/ui';

interface TemplatesLibraryProps {
  sites: SiteConfig[];
  templates: ContentTemplate[];
}

export function TemplatesLibrary({ sites, templates }: TemplatesLibraryProps) {
  const [siteId, setSiteId] = useState(sites[0]?.id || '');
  const [locale, setLocale] = useState<Locale>(
    (sites[0]?.defaultLocale as Locale) || 'en'
  );
  const [slug, setSlug] = useState('');
  const [templateId, setTemplateId] = useState(templates[0]?.id || 'basic');
  const [status, setStatus] = useState<string | null>(null);

  const site = useMemo(
    () => sites.find((item) => item.id === siteId),
    [sites, siteId]
  );

  useEffect(() => {
    if (!site) return;
    if (!site.supportedLocales.includes(locale)) {
      setLocale(site.defaultLocale);
    }
  }, [site, locale]);

  const handleCreate = async () => {
    setStatus(null);
    if (!slug) {
      setStatus('Enter a slug first.');
      return;
    }
    const response = await fetch('/api/admin/content/file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        siteId,
        locale,
        action: 'create',
        slug,
        templateId,
        targetDir: 'pages',
      }),
    });
    if (!response.ok) {
      const payload = await response.json();
      setStatus(payload.message || 'Create failed');
      return;
    }
    setSlug('');
    setStatus('Page created');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Components</h1>
        <p className="text-sm text-gray-600">
          Use templates to create consistent page layouts.
        </p>
      </div>

      {status && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
          {status}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
        <div className="text-sm font-semibold text-gray-900">Create page</div>
        <div className="grid gap-3 md:grid-cols-4">
          <div>
            <label className="block text-xs font-medium text-gray-500">Site</label>
            <select
              className="mt-1 rounded-md border border-gray-200 px-3 py-2 text-sm w-full"
              value={siteId}
              onChange={(event) => setSiteId(event.target.value)}
            >
              {sites.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">Locale</label>
            <select
              className="mt-1 rounded-md border border-gray-200 px-3 py-2 text-sm w-full"
              value={locale}
              onChange={(event) => setLocale(event.target.value as Locale)}
            >
              {(site?.supportedLocales || ['en']).map((item) => (
                <option key={item} value={item}>
                  {item === 'en' ? 'English' : item === 'zh' ? 'Chinese' : item}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">Slug</label>
            <input
              className="mt-1 rounded-md border border-gray-200 px-3 py-2 text-sm w-full"
              placeholder="faq"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">Template</label>
            <select
              className="mt-1 rounded-md border border-gray-200 px-3 py-2 text-sm w-full"
              value={templateId}
              onChange={(event) => setTemplateId(event.target.value)}
            >
              {templates.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Button onClick={handleCreate}>Create page</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((template) => (
          <div key={template.id} className="border border-gray-200 rounded-xl p-4">
            <div className="text-sm font-semibold text-gray-900 mb-2">
              {template.label}
            </div>
            <pre className="text-xs bg-gray-50 border border-gray-200 rounded-lg p-3 overflow-auto max-h-64">
              {JSON.stringify(template.content, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}

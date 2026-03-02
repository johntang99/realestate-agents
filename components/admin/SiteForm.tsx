'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { RuntimeEnvironment, SiteConfig } from '@/lib/types';
import { Button, Input } from '@/components/ui';
 
const siteSchemaBase = z.object({
  name: z.string().min(2, 'Name is required'),
  domain: z.string().optional(),
  enabled: z.boolean(),
  defaultLocale: z.enum(['en', 'zh']),
  supportedLocales: z.array(z.enum(['en', 'zh'])).min(1, 'Select at least one locale'),
});

const createSchema = siteSchemaBase.extend({
  id: z
    .string()
    .min(2, 'ID is required')
    .regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers, and hyphens'),
  cloneFrom: z.string().optional(),
});

type SiteFormData = z.infer<typeof siteSchemaBase>;
type SiteCreateFormData = z.infer<typeof createSchema>;
 
interface SiteFormProps {
  site: SiteConfig;
  mode?: 'edit' | 'create';
  sites?: SiteConfig[];
}

interface EditableDomainAlias {
  id?: string;
  domain: string;
  environment: RuntimeEnvironment;
  isPrimary: boolean;
  enabled: boolean;
}

export function SiteForm({ site, mode = 'edit', sites = [] }: SiteFormProps) {
   const router = useRouter();
   const [status, setStatus] = useState<string | null>(null);
  const isCreate = mode === 'create';
  const [domainAliases, setDomainAliases] = useState<EditableDomainAlias[]>(
    Array.isArray(site.domainAliases) && site.domainAliases.length > 0
      ? site.domainAliases.map((alias) => ({
          id: alias.id,
          domain: alias.domain,
          environment: alias.environment,
          isPrimary: alias.isPrimary,
          enabled: alias.enabled,
        }))
      : []
  );
 
  const form = useForm<SiteFormData | SiteCreateFormData>({
    resolver: zodResolver(isCreate ? createSchema : siteSchemaBase),
     defaultValues: {
      id: site.id,
       name: site.name,
       domain: site.domain || '',
       enabled: site.enabled,
       defaultLocale: site.defaultLocale,
       supportedLocales: site.supportedLocales,
      cloneFrom: '',
     },
   });
 
  const onSubmit = async (data: SiteFormData | SiteCreateFormData) => {
     setStatus(null);
    const request = isCreate
      ? fetch('/api/admin/sites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...(data as SiteCreateFormData),
            domain: data.domain ? data.domain : undefined,
          }),
        })
      : fetch(`/api/admin/sites/${site.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            domain: data.domain ? data.domain : undefined,
            domainAliases,
          }),
        });

    const response = await request;
 
     if (!response.ok) {
       const payload = await response.json();
       setStatus(payload.message || 'Update failed');
       return;
     }
 
    if (isCreate) {
      const payload = await response.json();
      router.push(`/admin/sites/${payload.id}`);
      router.refresh();
      return;
    }

    setStatus('Saved');
    router.refresh();
   };
 
   const supported = form.watch('supportedLocales');
 
   return (
     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
       {status && (
         <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700">
           {status}
         </div>
       )}
 
      {isCreate && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Site ID</label>
          <Input className="mt-1" {...form.register('id' as const)} placeholder="your-site-id" />
          <p className="text-xs text-gray-500 mt-1">
            Used for folder name and URLs. Lowercase letters, numbers, and hyphens only.
          </p>
          {(form.formState.errors as any)?.id && (
            <p className="text-sm text-red-600 mt-1">
              {(form.formState.errors as any).id?.message}
            </p>
          )}
        </div>
      )}

      {isCreate && sites.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Clone from</label>
          <select
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            {...form.register('cloneFrom' as const)}
          >
            <option value="">No clone (empty site)</option>
            {sites.map((existing) => (
              <option key={existing.id} value={existing.id}>
                {existing.name} ({existing.id})
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Copies the content folder from the selected site.
          </p>
        </div>
      )}

      <div>
         <label className="block text-sm font-medium text-gray-700">Site Name</label>
         <Input className="mt-1" {...form.register('name')} />
         {form.formState.errors.name && (
           <p className="text-sm text-red-600 mt-1">
             {form.formState.errors.name.message}
           </p>
         )}
       </div>
 
       <div>
         <label className="block text-sm font-medium text-gray-700">Domain</label>
         <Input className="mt-1" placeholder="example.com" {...form.register('domain')} />
         <p className="text-xs text-gray-500 mt-1">
           Optional. Used for multi-domain routing.
         </p>
       </div>

      {!isCreate && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">Domain Aliases</label>
            <button
              type="button"
              className="px-3 py-1.5 text-xs rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() =>
                setDomainAliases((current) => [
                  ...current,
                  {
                    domain: '',
                    environment: 'prod',
                    isPrimary: true,
                    enabled: true,
                  },
                ])
              }
            >
              Add Alias
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Manage production and local/dev hostnames for this site without SQL.
          </p>
          {domainAliases.length === 0 ? (
            <div className="rounded-md border border-dashed border-gray-300 p-3 text-xs text-gray-500">
              No aliases configured yet.
            </div>
          ) : (
            <div className="space-y-2">
              {domainAliases.map((alias, index) => (
                <div
                  key={`${alias.id || 'new'}-${index}`}
                  className="grid gap-2 md:grid-cols-[1fr_180px_100px_80px]"
                >
                  <Input
                    placeholder="example.com"
                    value={alias.domain}
                    onChange={(event) =>
                      setDomainAliases((current) =>
                        current.map((entry, entryIndex) =>
                          entryIndex === index
                            ? { ...entry, domain: event.target.value }
                            : entry
                        )
                      )
                    }
                  />
                  <select
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                    value={alias.environment}
                    onChange={(event) =>
                      setDomainAliases((current) =>
                        current.map((entry, entryIndex) =>
                          entryIndex === index
                            ? {
                                ...entry,
                                environment: event.target.value as RuntimeEnvironment,
                              }
                            : entry
                        )
                      )
                    }
                  >
                    <option value="prod">Production</option>
                    <option value="dev">Local/Dev</option>
                    <option value="staging">Staging</option>
                  </select>
                  <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={alias.enabled}
                      onChange={(event) =>
                        setDomainAliases((current) =>
                          current.map((entry, entryIndex) =>
                            entryIndex === index
                              ? { ...entry, enabled: event.target.checked }
                              : entry
                          )
                        )
                      }
                    />
                    Enabled
                  </label>
                  <button
                    type="button"
                    className="px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() =>
                      setDomainAliases((current) =>
                        current.filter((_, entryIndex) => entryIndex !== index)
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
 
       <div className="flex items-center gap-3">
         <input
           id="enabled"
           type="checkbox"
           className="h-4 w-4 rounded border-gray-300"
           {...form.register('enabled')}
         />
         <label htmlFor="enabled" className="text-sm text-gray-700">
           Site is active
         </label>
       </div>
 
       <div>
         <label className="block text-sm font-medium text-gray-700">Default Locale</label>
         <select
           className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
           {...form.register('defaultLocale')}
         >
           <option value="en">English</option>
          <option value="zh">Chinese</option>
         </select>
       </div>
 
       <div>
         <label className="block text-sm font-medium text-gray-700">Supported Locales</label>
         <div className="mt-2 flex gap-6">
          {(['en', 'zh'] as const).map((locale) => (
             <label key={locale} className="flex items-center gap-2 text-sm text-gray-700">
               <input
                 type="checkbox"
                 className="h-4 w-4 rounded border-gray-300"
                 value={locale}
                 checked={supported.includes(locale)}
                 onChange={(event) => {
                   const next = event.target.checked
                     ? [...supported, locale]
                     : supported.filter((value) => value !== locale);
                   form.setValue('supportedLocales', next, { shouldValidate: true });
                 }}
               />
              {locale === 'en' ? 'English' : 'Chinese'}
             </label>
           ))}
         </div>
         {form.formState.errors.supportedLocales && (
           <p className="text-sm text-red-600 mt-1">
             {form.formState.errors.supportedLocales.message}
           </p>
         )}
       </div>
 
       <div className="flex items-center gap-3">
         <Button type="submit">Save Changes</Button>
         <button
           type="button"
           className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
           onClick={() => form.reset()}
         >
           Reset
         </button>
       </div>
     </form>
   );
 }

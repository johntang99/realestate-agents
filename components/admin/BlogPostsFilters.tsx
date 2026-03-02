 'use client';
 
 import { useRouter } from 'next/navigation';
import type { SiteConfig } from '@/lib/types';
 
 interface BlogPostsFiltersProps {
   sites: SiteConfig[];
   selectedSiteId: string;
   selectedLocale: string;
 }
 
 export function BlogPostsFilters({
   sites,
   selectedSiteId,
   selectedLocale,
 }: BlogPostsFiltersProps) {
   const router = useRouter();
   const selectedSite = sites.find((site) => site.id === selectedSiteId) || sites[0];
 
   const pushParams = (siteId: string, locale: string) => {
     const params = new URLSearchParams({
       siteId,
       locale,
     });
     router.push(`/admin/blog-posts?${params.toString()}`);
   };
 
   return (
     <div className="flex gap-3 items-center">
       <div>
         <label className="block text-xs font-medium text-gray-500">Site</label>
         <select
           className="mt-1 rounded-md border border-gray-200 px-3 py-2 text-sm"
           value={selectedSiteId}
           onChange={(event) => {
             pushParams(event.target.value, selectedLocale);
           }}
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
           className="mt-1 rounded-md border border-gray-200 px-3 py-2 text-sm"
           value={selectedLocale}
           onChange={(event) => {
             pushParams(selectedSiteId, event.target.value);
           }}
         >
           {(selectedSite?.supportedLocales || ['en']).map((item) => (
             <option key={item} value={item}>
             {item === 'en' ? 'English' : item === 'zh' ? 'Chinese' : item}
             </option>
           ))}
         </select>
       </div>
     </div>
   );
 }

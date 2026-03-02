import { TemplatesLibrary } from '@/components/admin/TemplatesLibrary';
import { CONTENT_TEMPLATES } from '@/lib/admin/templates';
import { getSites } from '@/lib/sites';

export default async function AdminComponentsPage() {
  const sites = await getSites();
  return (
    <TemplatesLibrary sites={sites} templates={CONTENT_TEMPLATES} />
  );
}

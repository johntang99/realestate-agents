interface SeoPanelProps {
  formData: Record<string, any>;
  seoPopulating: boolean;
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
  populateSeoFromHeroes: () => void;
}

export function SeoPanel({
  formData,
  seoPopulating,
  updateFormValue,
  openImagePicker,
  populateSeoFromHeroes,
}: SeoPanelProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-semibold text-gray-500 uppercase">SEO</div>
        <button
          type="button"
          onClick={populateSeoFromHeroes}
          disabled={seoPopulating}
          className="px-3 py-1.5 rounded-md border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {seoPopulating ? 'Populating…' : 'Auto-populate'}
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="block text-xs text-gray-500">Default Title</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.defaultTitle || ''}
            onChange={(event) => updateFormValue(['defaultTitle'], event.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500">Title Template</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.titleTemplate || ''}
            onChange={(event) => updateFormValue(['titleTemplate'], event.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500">Default Description</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.defaultDescription || ''}
            onChange={(event) => updateFormValue(['defaultDescription'], event.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500">Twitter Card</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.twitterCard || ''}
            onChange={(event) => updateFormValue(['twitterCard'], event.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500">Twitter Handle</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.twitterHandle || ''}
            onChange={(event) => updateFormValue(['twitterHandle'], event.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500">Canonical Base</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.canonicalBase || ''}
            onChange={(event) => updateFormValue(['canonicalBase'], event.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-500">Open Graph Image</label>
          <div className="mt-1 flex gap-2">
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={formData.ogImage || ''}
              onChange={(event) => updateFormValue(['ogImage'], event.target.value)}
            />
            <button
              type="button"
              onClick={() => openImagePicker(['ogImage'])}
              className="px-3 rounded-md border border-gray-200 text-xs"
            >
              Choose
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

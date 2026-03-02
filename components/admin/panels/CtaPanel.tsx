interface CtaPanelProps {
  formData: Record<string, any>;
  updateFormValue: (path: string[], value: any) => void;
}

export function CtaPanel({ formData, updateFormValue }: CtaPanelProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
        CTA
      </div>
      {'title' in formData.cta && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Title</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.cta.title || ''}
            onChange={(event) => updateFormValue(['cta', 'title'], event.target.value)}
          />
        </div>
      )}
      {'description' in formData.cta && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">
            Description
          </label>
          <textarea
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.cta.description || ''}
            onChange={(event) => updateFormValue(['cta', 'description'], event.target.value)}
          />
        </div>
      )}
      {formData.cta?.primaryCta && (
        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-1">Primary CTA</div>
          <input
            className="mb-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            placeholder="Text"
            value={formData.cta.primaryCta.text || ''}
            onChange={(event) => updateFormValue(['cta', 'primaryCta', 'text'], event.target.value)}
          />
          <input
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            placeholder="Link"
            value={formData.cta.primaryCta.link || ''}
            onChange={(event) => updateFormValue(['cta', 'primaryCta', 'link'], event.target.value)}
          />
        </div>
      )}
      {formData.cta?.secondaryCta && (
        <div>
          <div className="text-xs text-gray-500 mb-1">Secondary CTA</div>
          <input
            className="mb-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            placeholder="Text"
            value={formData.cta.secondaryCta.text || ''}
            onChange={(event) =>
              updateFormValue(['cta', 'secondaryCta', 'text'], event.target.value)
            }
          />
          <input
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            placeholder="Link"
            value={formData.cta.secondaryCta.link || ''}
            onChange={(event) =>
              updateFormValue(['cta', 'secondaryCta', 'link'], event.target.value)
            }
          />
        </div>
      )}
    </div>
  );
}

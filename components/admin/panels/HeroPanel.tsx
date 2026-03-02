interface HeroPanelProps {
  formData: Record<string, any>;
  isHomePageFile: boolean;
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}

export function HeroPanel({
  formData,
  isHomePageFile,
  updateFormValue,
  openImagePicker,
}: HeroPanelProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
        Hero
      </div>
      {'title' in formData.hero && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Title</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.hero.title || ''}
            onChange={(event) => updateFormValue(['hero', 'title'], event.target.value)}
          />
        </div>
      )}
      {'subtitle' in formData.hero && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Subtitle</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.hero.subtitle || ''}
            onChange={(event) => updateFormValue(['hero', 'subtitle'], event.target.value)}
          />
        </div>
      )}
      {('businessName' in formData.hero || 'clinicName' in formData.hero) && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Business Name</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.hero.businessName || formData.hero.clinicName || ''}
            onChange={(event) =>
              updateFormValue(
                ['hero', 'businessName' in formData.hero ? 'businessName' : 'clinicName'],
                event.target.value
              )
            }
          />
        </div>
      )}
      {'tagline' in formData.hero && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Tagline</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.hero.tagline || ''}
            onChange={(event) => updateFormValue(['hero', 'tagline'], event.target.value)}
          />
        </div>
      )}
      {isHomePageFile && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Overlay Mode</label>
          <select
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-white"
            value={String(formData.hero.overlayMode || 'focus-text')}
            onChange={(event) => updateFormValue(['hero', 'overlayMode'], event.target.value)}
          >
            <option value="focus-text">Focus Text (images stay bright)</option>
            <option value="soft-full">Soft Full Overlay (slightly dark)</option>
          </select>
        </div>
      )}
      {'description' in formData.hero && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">
            Description
          </label>
          <textarea
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.hero.description || ''}
            onChange={(event) =>
              updateFormValue(['hero', 'description'], event.target.value)
            }
          />
        </div>
      )}
      {'backgroundImage' in formData.hero && (
        <div>
          <label className="block text-xs text-gray-500">
            Background Image
          </label>
          <div className="mt-1 flex gap-2">
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={formData.hero.backgroundImage || ''}
              onChange={(event) =>
                updateFormValue(['hero', 'backgroundImage'], event.target.value)
              }
            />
            <button
              type="button"
              onClick={() => openImagePicker(['hero', 'backgroundImage'])}
              className="px-3 rounded-md border border-gray-200 text-xs"
            >
              Choose
            </button>
          </div>
        </div>
      )}
      {'image' in formData.hero && (
        <div className="mt-3">
          <label className="block text-xs text-gray-500">Image</label>
          <div className="mt-1 flex gap-2">
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={formData.hero.image || ''}
              onChange={(event) => updateFormValue(['hero', 'image'], event.target.value)}
            />
            <button
              type="button"
              onClick={() => openImagePicker(['hero', 'image'])}
              className="px-3 rounded-md border border-gray-200 text-xs"
            >
              Choose
            </button>
          </div>
        </div>
      )}
      {formData.hero && typeof formData.hero === 'object' && (
        <div className="mt-3">
          <label className="block text-xs text-gray-500">Hero Height (vh)</label>
          <input
            type="number"
            min={52}
            max={95}
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={typeof formData.hero.heightVh === 'number' ? formData.hero.heightVh : 82}
            onChange={(event) =>
              updateFormValue(['hero', 'heightVh'], Number(event.target.value || 82))
            }
          />
          <p className="mt-1 text-xs text-gray-400">Used by photo-background variant (recommended 68-90).</p>
        </div>
      )}
    </div>
  );
}

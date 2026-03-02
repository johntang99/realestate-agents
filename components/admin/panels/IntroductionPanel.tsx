interface IntroductionPanelProps {
  formData: Record<string, any>;
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}

export function IntroductionPanel({
  formData,
  updateFormValue,
  openImagePicker,
}: IntroductionPanelProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
        Introduction
      </div>
      {'headline' in formData.introduction && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Headline</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.introduction.headline || ''}
            onChange={(event) =>
              updateFormValue(['introduction', 'headline'], event.target.value)
            }
          />
        </div>
      )}
      {'headlineCn' in formData.introduction && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Headline (Chinese)</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.introduction.headlineCn || ''}
            onChange={(event) =>
              updateFormValue(['introduction', 'headlineCn'], event.target.value)
            }
          />
        </div>
      )}
      {'body' in formData.introduction && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Body</label>
          <textarea
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.introduction.body || ''}
            onChange={(event) =>
              updateFormValue(['introduction', 'body'], event.target.value)
            }
          />
        </div>
      )}
      {'bodyCn' in formData.introduction && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Body (Chinese)</label>
          <textarea
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.introduction.bodyCn || ''}
            onChange={(event) =>
              updateFormValue(['introduction', 'bodyCn'], event.target.value)
            }
          />
        </div>
      )}
      {'ctaLabel' in formData.introduction && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">CTA Label</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.introduction.ctaLabel || ''}
            onChange={(event) =>
              updateFormValue(['introduction', 'ctaLabel'], event.target.value)
            }
          />
        </div>
      )}
      {'ctaLabelCn' in formData.introduction && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">CTA Label (Chinese)</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.introduction.ctaLabelCn || ''}
            onChange={(event) =>
              updateFormValue(['introduction', 'ctaLabelCn'], event.target.value)
            }
          />
        </div>
      )}
      {'ctaHref' in formData.introduction && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">CTA Link</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.introduction.ctaHref || ''}
            onChange={(event) =>
              updateFormValue(['introduction', 'ctaHref'], event.target.value)
            }
          />
        </div>
      )}
      {'image' in formData.introduction && (
        <div className="mb-3">
          <label className="block text-xs text-gray-500">Image</label>
          <div className="mt-1 grid gap-2 md:grid-cols-[72px_1fr_auto_auto] items-center">
            {String(formData.introduction.image || '').trim() ? (
              <img
                src={String(formData.introduction.image || '')}
                alt="Introduction image preview"
                className="h-12 w-12 rounded border border-gray-200 object-cover bg-gray-50"
                loading="lazy"
              />
            ) : (
              <div className="h-12 w-12 rounded border border-dashed border-gray-200 bg-gray-50" />
            )}
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={formData.introduction.image || ''}
              onChange={(event) =>
                updateFormValue(['introduction', 'image'], event.target.value)
              }
              placeholder="/uploads/..."
            />
            <button
              type="button"
              onClick={() => openImagePicker(['introduction', 'image'])}
              className="px-3 py-2 rounded-md border border-gray-200 text-xs"
            >
              Choose
            </button>
            <button
              type="button"
              onClick={() => updateFormValue(['introduction', 'image'], '')}
              className="px-3 py-2 rounded-md border border-gray-200 text-xs"
            >
              Clear
            </button>
          </div>
        </div>
      )}
      {'text' in formData.introduction && (
        <div>
          <label className="block text-xs text-gray-500">Text</label>
          <textarea
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.introduction.text || ''}
            onChange={(event) =>
              updateFormValue(['introduction', 'text'], event.target.value)
            }
          />
        </div>
      )}
    </div>
  );
}

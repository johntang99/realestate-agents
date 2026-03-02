interface HomeFieldRef {
  path: string[];
  label: string;
}

interface HomeSectionPhotosPanelProps {
  homePhotoFields: HomeFieldRef[];
  getPathValue: (path: string[]) => any;
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}

export function HomeSectionPhotosPanel({
  homePhotoFields,
  getPathValue,
  updateFormValue,
  openImagePicker,
}: HomeSectionPhotosPanelProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
        Home Section Photos
      </div>
      <div className="space-y-3">
        {homePhotoFields.map((field) => (
          <div
            key={field.path.join('.')}
            className="grid gap-2 md:grid-cols-[220px_72px_1fr_auto_auto] items-center"
          >
            <label className="text-xs text-gray-600">{field.label}</label>
            {String(getPathValue(field.path) || '').trim() ? (
              <img
                src={String(getPathValue(field.path) || '')}
                alt={`${field.label} preview`}
                className="h-12 w-12 rounded border border-gray-200 object-cover bg-gray-50"
                loading="lazy"
              />
            ) : (
              <div className="h-12 w-12 rounded border border-dashed border-gray-200 bg-gray-50" />
            )}
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={String(getPathValue(field.path) || '')}
              onChange={(event) => updateFormValue(field.path, event.target.value)}
              placeholder="/uploads/..."
            />
            <button
              type="button"
              onClick={() => openImagePicker(field.path)}
              className="px-3 py-2 rounded-md border border-gray-200 text-xs"
            >
              Choose
            </button>
            <button
              type="button"
              onClick={() => updateFormValue(field.path, '')}
              className="px-3 py-2 rounded-md border border-gray-200 text-xs"
            >
              Clear
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

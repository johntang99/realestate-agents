interface HomeFieldRef {
  path: string[];
  label: string;
}

interface HomeSectionVisualsPanelProps {
  homeSectionImageFields: HomeFieldRef[];
  getPathValue: (path: string[]) => any;
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}

export function HomeSectionVisualsPanel({
  homeSectionImageFields,
  getPathValue,
  updateFormValue,
  openImagePicker,
}: HomeSectionVisualsPanelProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
        Home Section Visuals
      </div>
      <div className="space-y-3">
        {homeSectionImageFields.map((field) => {
          const lastKey = field.path[field.path.length - 1] || '';
          const isShopPreviewSlot =
            field.path[0] === 'shopPreview' && /^image\d+$/.test(lastKey);
          const slotMatch = lastKey.match(/^image(\d+)$/);
          const slot = slotMatch ? Number(slotMatch[1]) : 0;
          const itemNamePath = ['shopPreview', `itemName${slot}`];
          const itemPricePath = ['shopPreview', `itemPrice${slot}`];

          return (
            <div
              key={field.path.join('.')}
              className={
                isShopPreviewSlot
                  ? 'grid gap-2 md:grid-cols-[260px_72px_1fr_180px_120px_auto_auto] items-center'
                  : 'grid gap-2 md:grid-cols-[260px_72px_1fr_auto_auto] items-center'
              }
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
              {isShopPreviewSlot && (
                <input
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={String(getPathValue(itemNamePath) || '')}
                  onChange={(event) => updateFormValue(itemNamePath, event.target.value)}
                  placeholder="Item name"
                />
              )}
              {isShopPreviewSlot && (
                <input
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={String(getPathValue(itemPricePath) || '')}
                  onChange={(event) => updateFormValue(itemPricePath, event.target.value)}
                  placeholder="Price"
                />
              )}
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
          );
        })}
      </div>
    </div>
  );
}

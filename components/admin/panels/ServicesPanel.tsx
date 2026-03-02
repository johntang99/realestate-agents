interface ServicesPanelProps {
  services: any[];
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}

export function ServicesPanel({
  services,
  updateFormValue,
  openImagePicker,
}: ServicesPanelProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
        Services
      </div>
      <div className="space-y-4">
        {services.map((service: any, index: number) => (
          <div key={service.id || index} className="border rounded-md p-3">
            <div className="text-xs text-gray-500 mb-2">
              {service.title || `Service ${index + 1}`}
            </div>
            <input
              className="mb-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="Title"
              value={service.title || ''}
              onChange={(event) =>
                updateFormValue(['services', String(index), 'title'], event.target.value)
              }
            />
            <textarea
              className="mb-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="Short description"
              value={service.shortDescription || ''}
              onChange={(event) =>
                updateFormValue(
                  ['services', String(index), 'shortDescription'],
                  event.target.value
                )
              }
            />
            <div className="flex gap-2">
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                placeholder="Image"
                value={service.image || ''}
                onChange={(event) =>
                  updateFormValue(['services', String(index), 'image'], event.target.value)
                }
              />
              <button
                type="button"
                onClick={() => openImagePicker(['services', String(index), 'image'])}
                className="px-3 rounded-md border border-gray-200 text-xs"
              >
                Choose
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

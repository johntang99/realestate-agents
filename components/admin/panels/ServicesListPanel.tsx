interface ServicesListPanelProps {
  servicesList: { items?: any[] };
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}

export function ServicesListPanel({
  servicesList,
  updateFormValue,
  openImagePicker,
}: ServicesListPanelProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
        Services List
      </div>
      {Array.isArray(servicesList.items) && (
        <div className="space-y-4 mt-4">
          {servicesList.items.map((service: any, index: number) => (
            <div key={service.id || index} className="border rounded-md p-3 bg-white">
              <div className="text-xs text-gray-500 mb-2">
                {service.title || `Service ${index + 1}`}
              </div>
              <input
                className="mb-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                placeholder="Title"
                value={service.title || ''}
                onChange={(event) =>
                  updateFormValue(
                    ['servicesList', 'items', String(index), 'title'],
                    event.target.value
                  )
                }
              />
              <textarea
                className="mb-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                placeholder="Short description"
                value={service.shortDescription || ''}
                onChange={(event) =>
                  updateFormValue(
                    ['servicesList', 'items', String(index), 'shortDescription'],
                    event.target.value
                  )
                }
              />
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Price"
                  value={service.price || ''}
                  onChange={(event) =>
                    updateFormValue(
                      ['servicesList', 'items', String(index), 'price'],
                      event.target.value
                    )
                  }
                />
                <input
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Duration (min)"
                  type="number"
                  value={service.durationMinutes || ''}
                  onChange={(event) =>
                    updateFormValue(
                      ['servicesList', 'items', String(index), 'durationMinutes'],
                      parseInt(event.target.value) || 0
                    )
                  }
                />
              </div>
              <div className="flex gap-2 mb-2">
                <input
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Image"
                  value={service.image || ''}
                  onChange={(event) =>
                    updateFormValue(
                      ['servicesList', 'items', String(index), 'image'],
                      event.target.value
                    )
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    openImagePicker(['servicesList', 'items', String(index), 'image'])
                  }
                  className="px-3 rounded-md border border-gray-200 text-xs"
                >
                  Choose
                </button>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(service.featured)}
                  onChange={(event) =>
                    updateFormValue(
                      ['servicesList', 'items', String(index), 'featured'],
                      event.target.checked
                    )
                  }
                  className="rounded border-gray-300"
                />
                <span className="text-gray-700">Featured (for featured-large variant)</span>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

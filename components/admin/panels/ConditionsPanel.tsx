interface ConditionsPanelProps {
  conditions: any[];
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}

export function ConditionsPanel({
  conditions,
  updateFormValue,
  openImagePicker,
}: ConditionsPanelProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
        Conditions
      </div>
      <div className="space-y-4">
        {conditions.map((condition: any, index: number) => (
          <div key={condition.id || index} className="border rounded-md p-3">
            <div className="text-xs text-gray-500 mb-2">
              {condition.title || `Condition ${index + 1}`}
            </div>
            <input
              className="mb-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="Title"
              value={condition.title || ''}
              onChange={(event) =>
                updateFormValue(['conditions', String(index), 'title'], event.target.value)
              }
            />
            <textarea
              className="mb-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="Description"
              value={condition.description || ''}
              onChange={(event) =>
                updateFormValue(
                  ['conditions', String(index), 'description'],
                  event.target.value
                )
              }
            />
            <div className="flex gap-2">
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                placeholder="Image"
                value={condition.image || ''}
                onChange={(event) =>
                  updateFormValue(['conditions', String(index), 'image'], event.target.value)
                }
              />
              <button
                type="button"
                onClick={() => openImagePicker(['conditions', String(index), 'image'])}
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

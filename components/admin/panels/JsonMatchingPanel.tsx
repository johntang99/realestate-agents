import { useState } from 'react';

interface JsonMatchingPanelProps {
  formData: any;
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}

const inputClassName =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-[var(--primary)] focus:outline-none';

const isImageLikeField = (key: string) =>
  /(image|photo|logo|icon|avatar|cover|thumbnail|banner|portrait)/i.test(key);

const isLongTextField = (key: string, value: string) =>
  /(body|description|excerpt|content|summary|notes|highlights)/i.test(key) ||
  value.includes('\n') ||
  value.length > 140;

export function JsonMatchingPanel({
  formData,
  updateFormValue,
  openImagePicker,
}: JsonMatchingPanelProps) {
  const [pendingFieldKeys, setPendingFieldKeys] = useState<Record<string, string>>({});
  const [pendingFieldTypes, setPendingFieldTypes] = useState<Record<string, 'string' | 'number' | 'boolean' | 'object' | 'array'>>({});

  const getPathId = (path: string[]) => (path.length ? path.join('.') : 'root');

  const getDefaultValueForType = (type: 'string' | 'number' | 'boolean' | 'object' | 'array') => {
    if (type === 'number') return 0;
    if (type === 'boolean') return false;
    if (type === 'object') return {};
    if (type === 'array') return [];
    return '';
  };

  const addObjectField = (path: string[], objectValue: Record<string, any>) => {
    const pathId = getPathId(path);
    const rawKey = (pendingFieldKeys[pathId] || '').trim();
    if (!rawKey || rawKey in objectValue) return;
    const valueType = pendingFieldTypes[pathId] || 'string';
    const next = {
      ...objectValue,
      [rawKey]: getDefaultValueForType(valueType),
    };
    updateFormValue(path, next);
    setPendingFieldKeys((current) => ({ ...current, [pathId]: '' }));
    setPendingFieldTypes((current) => ({ ...current, [pathId]: 'string' }));
  };

  const addArrayItem = (path: string[], arrayValue: any[]) => {
    const first = arrayValue[0];
    const nextItem =
      typeof first === 'number'
        ? 0
        : typeof first === 'boolean'
          ? false
          : Array.isArray(first)
            ? []
            : first && typeof first === 'object'
              ? {}
              : '';
    updateFormValue(path, [...arrayValue, nextItem]);
  };

  const removeArrayItem = (path: string[], arrayValue: any[], index: number) => {
    const next = [...arrayValue];
    next.splice(index, 1);
    updateFormValue(path, next);
  };

  const renderNode = (value: any, path: string[], keyName: string): React.ReactNode => {
    if (Array.isArray(value)) {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {keyName}
            </div>
            <button
              type="button"
              className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
              onClick={() => addArrayItem(path, value)}
            >
              Add Item
            </button>
          </div>
          <div className="space-y-2">
            {value.map((item, index) => (
              <div key={index} className="rounded-lg border border-gray-200 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-xs font-medium text-gray-500">Item {index + 1}</div>
                  <button
                    type="button"
                    className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                    onClick={() => removeArrayItem(path, value, index)}
                  >
                    Remove
                  </button>
                </div>
                {renderNode(item, [...path, String(index)], `${keyName}[${index}]`)}
              </div>
            ))}
            {value.length === 0 && <div className="text-xs text-gray-500">No items.</div>}
          </div>
        </div>
      );
    }

    if (value && typeof value === 'object') {
      const entries = Object.entries(value);
      const pathId = getPathId(path);
      return (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {keyName}
            </div>
            <input
              className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700"
              placeholder="new_field_name"
              value={pendingFieldKeys[pathId] || ''}
              onChange={(event) =>
                setPendingFieldKeys((current) => ({
                  ...current,
                  [pathId]: event.target.value,
                }))
              }
            />
            <select
              className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700"
              value={pendingFieldTypes[pathId] || 'string'}
              onChange={(event) =>
                setPendingFieldTypes((current) => ({
                  ...current,
                  [pathId]: event.target.value as 'string' | 'number' | 'boolean' | 'object' | 'array',
                }))
              }
            >
              <option value="string">string</option>
              <option value="number">number</option>
              <option value="boolean">boolean</option>
              <option value="object">object</option>
              <option value="array">array</option>
            </select>
            <button
              type="button"
              className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
              onClick={() => addObjectField(path, value as Record<string, any>)}
            >
              Add Field
            </button>
          </div>
          {entries.map(([childKey, childValue]) => (
            <div key={[...path, childKey].join('.')} className="rounded-lg border border-gray-100 p-3">
              {renderNode(childValue, [...path, childKey], childKey)}
            </div>
          ))}
          {entries.length === 0 && (
            <div className="text-xs text-gray-500">Empty object.</div>
          )}
        </div>
      );
    }

    if (typeof value === 'boolean') {
      return (
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={value}
            onChange={(event) => updateFormValue(path, event.target.checked)}
          />
          {keyName}
        </label>
      );
    }

    if (typeof value === 'number') {
      return (
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            {keyName}
          </label>
          <input
            type="number"
            className={inputClassName}
            value={Number.isFinite(value) ? value : 0}
            onChange={(event) => updateFormValue(path, Number(event.target.value) || 0)}
          />
        </div>
      );
    }

    const textValue = typeof value === 'string' ? value : value == null ? '' : String(value);
    const useTextArea = isLongTextField(keyName, textValue);
    const isImageField = isImageLikeField(keyName);

    return (
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          {keyName}
        </label>
        {useTextArea ? (
          <textarea
            rows={5}
            className={inputClassName}
            value={textValue}
            onChange={(event) => updateFormValue(path, event.target.value)}
          />
        ) : (
          <div className="flex gap-2">
            <input
              className={inputClassName}
              value={textValue}
              onChange={(event) => updateFormValue(path, event.target.value)}
            />
            {isImageField && (
              <button
                type="button"
                className="rounded-md border border-gray-200 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
                onClick={() => openImagePicker(path)}
              >
                Pick
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  if (!formData || typeof formData !== 'object' || Array.isArray(formData)) {
    return (
      <div className="text-sm text-gray-500">
        This file is not an object JSON structure. Use the JSON tab.
      </div>
    );
  }

  return <div className="space-y-3">{renderNode(formData, [], 'Root')}</div>;
}

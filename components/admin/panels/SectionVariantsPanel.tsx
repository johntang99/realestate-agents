interface SectionVariantsPanelProps {
  variantSections: Array<[string, string[]]>;
  getPathValue: (path: string[]) => any;
  updateFormValue: (path: string[], value: any) => void;
  toTitleCase: (value: string) => string;
}

export function SectionVariantsPanel({
  variantSections,
  getPathValue,
  updateFormValue,
  toTitleCase,
}: SectionVariantsPanelProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
        Section Variants
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {variantSections.map(([sectionKey, options]) => (
          <div key={`variant-${sectionKey}`}>
            <label className="block text-xs text-gray-500">
              {toTitleCase(sectionKey)} Variant
            </label>
            <select
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-white"
              value={String(getPathValue([sectionKey, 'variant']) || '')}
              onChange={(event) => updateFormValue([sectionKey, 'variant'], event.target.value)}
            >
              <option value="">Default</option>
              {options.map((option) => (
                <option key={`${sectionKey}-${option}`} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

import ReactMarkdown from 'react-markdown';

interface CaseStudiesPanelProps {
  caseStudies: any[];
  caseStudyCategories: Array<{ id: string; name: string }>;
  markdownPreview: Record<string, boolean>;
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
  toggleMarkdownPreview: (key: string) => void;
  normalizeMarkdown: (value: string) => string;
}

export function CaseStudiesPanel({
  caseStudies,
  caseStudyCategories,
  markdownPreview,
  updateFormValue,
  openImagePicker,
  toggleMarkdownPreview,
  normalizeMarkdown,
}: CaseStudiesPanelProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
        Case Studies
      </div>
      <div className="space-y-4">
        {caseStudies.map((item: any, index: number) => (
          <div key={item.id || index} className="border rounded-md p-3">
            <div className="text-xs text-gray-500 mb-2">
              {item.condition || `Case ${index + 1}`}
            </div>
            <input
              className="mb-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="Condition"
              value={item.condition || ''}
              onChange={(event) =>
                updateFormValue(['caseStudies', String(index), 'condition'], event.target.value)
              }
            />
            <div className="mb-2">
              <label className="block text-xs text-gray-500 mb-1">Category</label>
              <select
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={item.category || ''}
                onChange={(event) =>
                  updateFormValue(['caseStudies', String(index), 'category'], event.target.value)
                }
              >
                <option value="">Select category</option>
                {caseStudyCategories.map((category: any) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Summary (Markdown)</span>
              <button
                type="button"
                onClick={() => toggleMarkdownPreview(`caseStudies-${index}-summary`)}
                className="text-xs text-gray-600 hover:text-gray-900"
              >
                {markdownPreview[`caseStudies-${index}-summary`] ? 'Edit' : 'Preview'}
              </button>
            </div>
            {markdownPreview[`caseStudies-${index}-summary`] ? (
              <div className="prose prose-sm max-w-none rounded-md border border-gray-200 px-3 py-2">
                <ReactMarkdown
                  components={{
                    ul: (props) => <ul className="list-disc pl-5" {...props} />,
                    ol: (props) => <ol className="list-decimal pl-5" {...props} />,
                    li: (props) => <li className="mb-1" {...props} />,
                  }}
                >
                  {normalizeMarkdown(item.summary || '')}
                </ReactMarkdown>
              </div>
            ) : (
              <textarea
                className="mb-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                placeholder="Summary (Markdown supported)"
                value={item.summary || ''}
                onChange={(event) =>
                  updateFormValue(['caseStudies', String(index), 'summary'], event.target.value)
                }
              />
            )}
            <div className="grid gap-2 md:grid-cols-3">
              <div className="flex gap-2">
                <input
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Image"
                  value={item.image || ''}
                  onChange={(event) =>
                    updateFormValue(['caseStudies', String(index), 'image'], event.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => openImagePicker(['caseStudies', String(index), 'image'])}
                  className="px-3 rounded-md border border-gray-200 text-xs"
                >
                  Choose
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Before image"
                  value={item.beforeImage || ''}
                  onChange={(event) =>
                    updateFormValue(['caseStudies', String(index), 'beforeImage'], event.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    openImagePicker(['caseStudies', String(index), 'beforeImage'])
                  }
                  className="px-3 rounded-md border border-gray-200 text-xs"
                >
                  Choose
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  placeholder="After image"
                  value={item.afterImage || ''}
                  onChange={(event) =>
                    updateFormValue(['caseStudies', String(index), 'afterImage'], event.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    openImagePicker(['caseStudies', String(index), 'afterImage'])
                  }
                  className="px-3 rounded-md border border-gray-200 text-xs"
                >
                  Choose
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

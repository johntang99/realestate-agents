interface FooterPanelProps {
  formData: Record<string, any>;
  updateFormValue: (path: string[], value: any) => void;
}

export function FooterPanel({ formData, updateFormValue }: FooterPanelProps) {
  const columns = Array.isArray(formData.columns) ? formData.columns : [];

  const addColumn = () => {
    const next = [...columns, { heading: '', content: '', links: [] }];
    updateFormValue(['columns'], next);
  };

  const removeColumn = (index: number) => {
    const next = [...columns];
    next.splice(index, 1);
    updateFormValue(['columns'], next);
  };

  const addLink = (columnIndex: number) => {
    const next = [...columns];
    const column = next[columnIndex] || {};
    const links = Array.isArray(column.links) ? [...column.links] : [];
    links.push({ label: '', href: '' });
    next[columnIndex] = { ...column, links };
    updateFormValue(['columns'], next);
  };

  const removeLink = (columnIndex: number, linkIndex: number) => {
    const next = [...columns];
    const column = next[columnIndex] || {};
    const links = Array.isArray(column.links) ? [...column.links] : [];
    links.splice(linkIndex, 1);
    next[columnIndex] = { ...column, links };
    updateFormValue(['columns'], next);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-gray-500 uppercase">Footer Columns</div>
        <button
          type="button"
          onClick={addColumn}
          className="px-3 py-1.5 rounded-md border border-gray-200 text-xs text-gray-700 hover:bg-gray-50"
        >
          Add Column
        </button>
      </div>

      {columns.map((column: any, index: number) => (
        <div key={`footer-col-${index}`} className="border border-gray-200 rounded-md p-3 space-y-3">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] items-end">
            <div>
              <label className="block text-xs text-gray-500">Heading</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={column?.heading || ''}
                onChange={(event) =>
                  updateFormValue(['columns', `${index}`, 'heading'], event.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Content</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={column?.content || ''}
                onChange={(event) =>
                  updateFormValue(['columns', `${index}`, 'content'], event.target.value)
                }
              />
            </div>
            <button
              type="button"
              onClick={() => removeColumn(index)}
              className="text-xs text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                checked={Boolean(column?.showSocials)}
                onChange={(event) =>
                  updateFormValue(['columns', `${index}`, 'showSocials'], event.target.checked)
                }
              />
              Show socials
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                checked={Boolean(column?.showLogo)}
                onChange={(event) =>
                  updateFormValue(['columns', `${index}`, 'showLogo'], event.target.checked)
                }
              />
              Show logo
            </label>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-gray-500 uppercase">Links</div>
              <button
                type="button"
                onClick={() => addLink(index)}
                className="px-2 py-1 rounded-md border border-gray-200 text-xs text-gray-700 hover:bg-gray-50"
              >
                Add Link
              </button>
            </div>
            {(Array.isArray(column?.links) ? column.links : []).map((link: any, linkIndex: number) => (
              <div
                key={`footer-col-${index}-link-${linkIndex}`}
                className="grid gap-2 md:grid-cols-[1fr_1fr_auto] items-end"
              >
                <input
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Label"
                  value={link?.label || ''}
                  onChange={(event) =>
                    updateFormValue(
                      ['columns', `${index}`, 'links', `${linkIndex}`, 'label'],
                      event.target.value
                    )
                  }
                />
                <input
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Href"
                  value={link?.href || ''}
                  onChange={(event) =>
                    updateFormValue(
                      ['columns', `${index}`, 'links', `${linkIndex}`, 'href'],
                      event.target.value
                    )
                  }
                />
                <button
                  type="button"
                  onClick={() => removeLink(index, linkIndex)}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {columns.length === 0 && (
        <div className="text-xs text-gray-500">No footer columns yet.</div>
      )}

      <div className="border-t border-gray-100 pt-4 space-y-3">
        <div className="text-xs font-semibold text-gray-500 uppercase">Compliance</div>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            'brokerageName',
            'licenseNumber',
            'principalBroker',
            'principalBrokerLicense',
            'state',
            'privacyHref',
            'termsHref',
            'copyrightYear',
            'copyrightSuffix',
          ].map((key) => (
            <div key={`compliance-${key}`}>
              <label className="block text-xs text-gray-500">{key}</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={formData.compliance?.[key] || ''}
                onChange={(event) =>
                  updateFormValue(['compliance', key], event.target.value)
                }
              />
            </div>
          ))}
        </div>
        <div>
          <label className="block text-xs text-gray-500">Equal Housing Text</label>
          <textarea
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            rows={3}
            value={formData.compliance?.equalHousingText || ''}
            onChange={(event) =>
              updateFormValue(['compliance', 'equalHousingText'], event.target.value)
            }
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500">MLS Disclaimer</label>
          <textarea
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            rows={3}
            value={formData.compliance?.mlsDisclaimer || ''}
            onChange={(event) =>
              updateFormValue(['compliance', 'mlsDisclaimer'], event.target.value)
            }
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500">Fair Housing Statement</label>
          <textarea
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            rows={3}
            value={formData.compliance?.fairHousingStatement || ''}
            onChange={(event) =>
              updateFormValue(['compliance', 'fairHousingStatement'], event.target.value)
            }
          />
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300"
            checked={Boolean(formData.compliance?.showEqualHousingLogo)}
            onChange={(event) =>
              updateFormValue(['compliance', 'showEqualHousingLogo'], event.target.checked)
            }
          />
          Show Equal Housing Logo
        </label>
      </div>
    </div>
  );
}

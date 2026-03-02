interface HeaderPanelProps {
  formData: Record<string, any>;
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
  addHeaderMenuItem: () => void;
  removeHeaderMenuItem: (index: number) => void;
  addHeaderLanguage: () => void;
  removeHeaderLanguage: (index: number) => void;
}

export function HeaderPanel({
  formData,
  updateFormValue,
  openImagePicker,
}: HeaderPanelProps) {
  const navigationItems = Array.isArray(formData.navigation) ? formData.navigation : [];

  const addNavigationItem = () => {
    const next = [...navigationItems, { label: '', href: '', children: [] }];
    updateFormValue(['navigation'], next);
  };

  const removeNavigationItem = (index: number) => {
    const next = [...navigationItems];
    next.splice(index, 1);
    updateFormValue(['navigation'], next);
  };

  const addNavigationChild = (parentIndex: number) => {
    const next = [...navigationItems];
    const parent = next[parentIndex] || {};
    const currentChildren = Array.isArray(parent.children) ? parent.children : [];
    next[parentIndex] = {
      ...parent,
      children: [...currentChildren, { label: '', href: '' }],
    };
    updateFormValue(['navigation'], next);
  };

  const removeNavigationChild = (parentIndex: number, childIndex: number) => {
    const next = [...navigationItems];
    const parent = next[parentIndex] || {};
    const currentChildren = Array.isArray(parent.children) ? [...parent.children] : [];
    currentChildren.splice(childIndex, 1);
    next[parentIndex] = { ...parent, children: currentChildren };
    updateFormValue(['navigation'], next);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
        Header
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
            Branding
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="block text-xs text-gray-500">Logo Text</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={formData.logoText || ''}
                onChange={(event) => updateFormValue(['logoText'], event.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Phone</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={formData.phone || ''}
                onChange={(event) => updateFormValue(['phone'], event.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">CTA Label</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={formData.ctaLabel || ''}
                onChange={(event) => updateFormValue(['ctaLabel'], event.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">CTA Href</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={formData.ctaHref || ''}
                onChange={(event) => updateFormValue(['ctaHref'], event.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Scroll Threshold</label>
              <input
                type="number"
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={typeof formData.scrollThreshold === 'number' ? formData.scrollThreshold : 80}
                onChange={(event) =>
                  updateFormValue(['scrollThreshold'], Number(event.target.value || 0))
                }
              />
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
            Behavior
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700 mt-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={Boolean(formData.stickyCtaPhone)}
                  onChange={(event) =>
                    updateFormValue(['stickyCtaPhone'], event.target.checked)
                  }
                />
                Sticky CTA Phone
              </label>
            </div>
            <div>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700 mt-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={Boolean(formData.stickyCtaButton)}
                  onChange={(event) =>
                    updateFormValue(['stickyCtaButton'], event.target.checked)
                  }
                />
                Sticky CTA Button
              </label>
            </div>
            <div>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700 mt-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={Boolean(formData.transparentOnHero)}
                  onChange={(event) =>
                    updateFormValue(['transparentOnHero'], event.target.checked)
                  }
                />
                Transparent On Hero
              </label>
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
            Logo
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-xs text-gray-500">Logo Image Src</label>
              <div className="mt-1 flex gap-2">
                <input
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={formData.logo?.src || ''}
                  onChange={(event) => updateFormValue(['logo', 'src'], event.target.value)}
                />
                <button
                  type="button"
                  onClick={() => openImagePicker(['logo', 'src'])}
                  className="px-3 rounded-md border border-gray-200 text-xs"
                >
                  Choose
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500">Logo Alt</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={formData.logo?.alt || ''}
                onChange={(event) => updateFormValue(['logo', 'alt'], event.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Logo Width</label>
              <input
                type="number"
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={typeof formData.logo?.width === 'number' ? formData.logo.width : 160}
                onChange={(event) =>
                  updateFormValue(['logo', 'width'], Number(event.target.value || 0))
                }
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Logo Height</label>
              <input
                type="number"
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={typeof formData.logo?.height === 'number' ? formData.logo.height : 48}
                onChange={(event) =>
                  updateFormValue(['logo', 'height'], Number(event.target.value || 0))
                }
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-gray-500 uppercase">
              Navigation
            </div>
            <button
              type="button"
              onClick={addNavigationItem}
              className="px-3 py-1.5 rounded-md border border-gray-200 text-xs text-gray-700 hover:bg-gray-50"
            >
              Add Item
            </button>
          </div>
          <div className="space-y-3">
            {navigationItems.map(
              (item: any, index: number) => (
                <div
                  key={`header-item-${index}`}
                  className="border border-gray-200 rounded-md p-3 space-y-3"
                >
                  <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] items-end">
                    <div>
                      <label className="block text-xs text-gray-500">Label</label>
                      <input
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                        value={item?.label || ''}
                        onChange={(event) =>
                          updateFormValue(['navigation', `${index}`, 'label'], event.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">Href</label>
                      <input
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                        value={item?.href || ''}
                        onChange={(event) =>
                          updateFormValue(['navigation', `${index}`, 'href'], event.target.value)
                        }
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNavigationItem(index)}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-semibold text-gray-500 uppercase">Children</div>
                      <button
                        type="button"
                        onClick={() => addNavigationChild(index)}
                        className="px-2 py-1 rounded-md border border-gray-200 text-xs text-gray-700 hover:bg-gray-50"
                      >
                        Add Child
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(Array.isArray(item?.children) ? item.children : []).map(
                        (child: any, childIndex: number) => (
                          <div
                            key={`header-item-${index}-child-${childIndex}`}
                            className="grid gap-2 md:grid-cols-[1fr_1fr_auto] items-end"
                          >
                            <input
                              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                              placeholder="Child label"
                              value={child?.label || ''}
                              onChange={(event) =>
                                updateFormValue(
                                  ['navigation', `${index}`, 'children', `${childIndex}`, 'label'],
                                  event.target.value
                                )
                              }
                            />
                            <input
                              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                              placeholder="Child href"
                              value={child?.href || ''}
                              onChange={(event) =>
                                updateFormValue(
                                  ['navigation', `${index}`, 'children', `${childIndex}`, 'href'],
                                  event.target.value
                                )
                              }
                            />
                            <button
                              type="button"
                              onClick={() => removeNavigationChild(index, childIndex)}
                              className="text-xs text-red-600 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        )
                      )}
                      {!Array.isArray(item?.children) || item.children.length === 0 ? (
                        <div className="text-xs text-gray-500">No children.</div>
                      ) : null}
                    </div>
                  </div>
                </div>
              )
            )}
            {navigationItems.length === 0 ? (
              <div className="text-xs text-gray-500">
                No navigation items yet.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

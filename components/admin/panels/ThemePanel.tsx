interface ThemePanelProps {
  getPathValue: (path: string[]) => any;
  updateFormValue: (path: string[], value: any) => void;
}

export function ThemePanel({ getPathValue, updateFormValue }: ThemePanelProps) {
  const fontFamilyFields: Array<{
    key: 'heading' | 'subheading' | 'body' | 'ui' | 'chineseHeading' | 'chineseBody';
    label: string;
    placeholder: string;
  }> = [
    {
      key: 'heading',
      label: 'Heading Font Family',
      placeholder: "'Playfair Display', Georgia, serif",
    },
    {
      key: 'subheading',
      label: 'Subheading Font Family',
      placeholder: "'Playfair Display', Georgia, serif",
    },
    {
      key: 'body',
      label: 'Body/Description Font Family',
      placeholder:
        "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    {
      key: 'ui',
      label: 'UI Font Family',
      placeholder:
        "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    {
      key: 'chineseHeading',
      label: 'Chinese Heading Font Family',
      placeholder: "'Noto Serif SC', serif",
    },
    {
      key: 'chineseBody',
      label: 'Chinese Body Font Family',
      placeholder:
        "'Noto Sans SC', sans-serif",
    },
  ];

  const applyScreenshotFontPreset = () => {
    updateFormValue(['fonts', 'heading'], "'Cormorant Garamond', Georgia, serif");
    updateFormValue(['fonts', 'subheading'], "'Playfair Display', Georgia, serif");
    updateFormValue(
      ['fonts', 'body'],
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    );
    updateFormValue(
      ['fonts', 'ui'],
      "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    );
    updateFormValue(['fonts', 'chineseHeading'], "'Noto Serif SC', serif");
    updateFormValue(['fonts', 'chineseBody'], "'Noto Sans SC', sans-serif");
  };

  const getColorValue = (
    primaryPath: string[],
    fallbackPaths: string[][] = [],
    fallback = '#000000'
  ) => {
    const primary = getPathValue(primaryPath);
    if (typeof primary === 'string' && primary.trim()) return primary;
    for (const path of fallbackPaths) {
      const value = getPathValue(path);
      if (typeof value === 'string' && value.trim()) return value;
    }
    return fallback;
  };

  const setColorValue = (
    value: string,
    primaryPath: string[],
    mirrorPaths: string[][] = []
  ) => {
    updateFormValue(primaryPath, value);
    mirrorPaths.forEach((path) => updateFormValue(path, value));
  };

  const renderColorField = (
    label: string,
    primaryPath: string[],
    fallbackPaths: string[][] = [],
    mirrorPaths: string[][] = [],
    fallback = '#000000'
  ) => {
    const value = getColorValue(primaryPath, fallbackPaths, fallback);
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="block text-xs text-gray-500">{label}</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={value || ''}
            onChange={(event) =>
              setColorValue(event.target.value, primaryPath, mirrorPaths)
            }
            placeholder="#000000"
          />
        </div>
        <input
          type="color"
          className="mt-6 h-10 w-10 rounded-md border border-gray-200"
          value={value || '#000000'}
          onChange={(event) =>
            setColorValue(event.target.value, primaryPath, mirrorPaths)
          }
          aria-label={`${label} color`}
        />
      </div>
    );
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-6">
      <div className="text-xs font-semibold text-gray-500 uppercase">
        Theme
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <div className="text-xs font-semibold text-gray-500 uppercase">
            Font Families
          </div>
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={applyScreenshotFontPreset}
              className="rounded-md border border-gray-200 px-2.5 py-1 text-[11px] font-medium text-gray-700 hover:bg-gray-50"
            >
              Apply Screenshot Preset
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Controls `theme.fonts.*` used by the site.
          </p>
          {fontFamilyFields.map(({ key, label, placeholder }) => (
            <div key={`font-${key}`}>
              <label className="block text-xs text-gray-500">
                {label}
              </label>
              <input
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={String(getPathValue(['fonts', key]) || '')}
                onChange={(event) =>
                  updateFormValue(['fonts', key], event.target.value)
                }
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-3">
          <div className="text-xs font-semibold text-gray-500 uppercase">
            Primary Colors
          </div>
          {renderColorField(
            'Primary',
            ['colors', 'primaryScale', 'DEFAULT'],
            [['colors', 'primary']],
            [['colors', 'primary']]
          )}
          {renderColorField('Primary Dark', ['colors', 'primaryScale', 'dark'])}
          {renderColorField('Primary Light', ['colors', 'primaryScale', 'light'])}
          {renderColorField('Primary 50', ['colors', 'primaryScale', '50'])}
          {renderColorField('Primary 100', ['colors', 'primaryScale', '100'])}
        </div>
        <div className="space-y-3">
          <div className="text-xs font-semibold text-gray-500 uppercase">
            Secondary Colors
          </div>
          {renderColorField(
            'Secondary',
            ['colors', 'secondaryScale', 'DEFAULT'],
            [['colors', 'secondary']],
            [['colors', 'secondary']]
          )}
          {renderColorField('Secondary Dark', ['colors', 'secondaryScale', 'dark'])}
          {renderColorField('Secondary Light', ['colors', 'secondaryScale', 'light'])}
          {renderColorField('Secondary 50', ['colors', 'secondaryScale', '50'])}
        </div>
        <div className="space-y-3">
          <div className="text-xs font-semibold text-gray-500 uppercase">
            Backdrop Colors
          </div>
          {renderColorField(
            'Backdrop Primary',
            ['colors', 'backdrop', 'primary'],
            [['colors', 'backdropLight']],
            [['colors', 'backdropLight']],
            '#F8F6F2'
          )}
          {renderColorField(
            'Backdrop Secondary',
            ['colors', 'backdrop', 'secondary'],
            [['colors', 'backdropDark']],
            [['colors', 'backdropDark']],
            '#141E30'
          )}
        </div>
      </div>
    </div>
  );
}

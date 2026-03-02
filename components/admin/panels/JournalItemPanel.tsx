interface SelectOption {
  value: string;
  label: string;
  labelCn?: string;
}

interface JournalItemPanelProps {
  formData: Record<string, any>;
  locale: string;
  journalCategoryOptions: SelectOption[];
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}

function normalizeVideoUrl(raw: string) {
  const input = raw.trim();
  if (!input) return '';
  try {
    const url = new URL(input.startsWith('http') ? input : `https://${input}`);
    const host = url.hostname.replace(/^www\./, '');

    const youtubeHosts = new Set(['youtube.com', 'm.youtube.com', 'youtu.be']);
    if (youtubeHosts.has(host)) {
      let id = '';
      if (host === 'youtu.be') {
        id = url.pathname.replace('/', '').split('/')[0];
      } else if (url.pathname.startsWith('/watch')) {
        id = url.searchParams.get('v') || '';
      } else if (url.pathname.startsWith('/shorts/')) {
        id = url.pathname.split('/')[2] || '';
      } else if (url.pathname.startsWith('/embed/')) {
        id = url.pathname.split('/')[2] || '';
      }
      if (id) return `https://www.youtube.com/embed/${id}`;
    }

    const vimeoHosts = new Set(['vimeo.com', 'player.vimeo.com']);
    if (vimeoHosts.has(host)) {
      const parts = url.pathname.split('/').filter(Boolean);
      const id = parts[parts.length - 1];
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    }

    return input;
  } catch {
    return input;
  }
}

export function JournalItemPanel({
  formData,
  locale,
  journalCategoryOptions,
  updateFormValue,
  openImagePicker,
}: JournalItemPanelProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="text-xs font-semibold text-gray-500 uppercase">
        Journal Post
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <input
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          placeholder="Title"
          value={formData.title || ''}
          onChange={(event) => updateFormValue(['title'], event.target.value)}
        />
        <input
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          placeholder="Title (Chinese)"
          value={formData.titleCn || ''}
          onChange={(event) => updateFormValue(['titleCn'], event.target.value)}
        />
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <textarea
          className="w-full min-h-[80px] rounded-md border border-gray-200 px-3 py-2 text-sm"
          placeholder="Excerpt (EN)"
          value={formData.excerpt || ''}
          onChange={(event) => updateFormValue(['excerpt'], event.target.value)}
        />
        <textarea
          className="w-full min-h-[80px] rounded-md border border-gray-200 px-3 py-2 text-sm"
          placeholder="Excerpt (ZH)"
          value={formData.excerptCn || ''}
          onChange={(event) => updateFormValue(['excerptCn'], event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-xs text-gray-500">Cover Image</label>
        <div className="flex gap-2">
          <input
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            placeholder="Cover image URL"
            value={formData.coverImage || ''}
            onChange={(event) => updateFormValue(['coverImage'], event.target.value)}
          />
          <button
            type="button"
            onClick={() => openImagePicker(['coverImage'])}
            className="px-3 rounded-md border border-gray-200 text-xs"
          >
            Choose
          </button>
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-5">
        <input
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          placeholder="Author"
          value={formData.author || ''}
          onChange={(event) => updateFormValue(['author'], event.target.value)}
        />
        <input
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          placeholder="Date (YYYY-MM-DD)"
          value={formData.date || ''}
          onChange={(event) => updateFormValue(['date'], event.target.value)}
        />
        <select
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          value={formData.category || ''}
          onChange={(event) => updateFormValue(['category'], event.target.value)}
        >
          <option value="">Select category</option>
          {formData.category &&
            !journalCategoryOptions.some((item) => item.value === formData.category) && (
              <option value={formData.category}>{formData.category}</option>
            )}
          {journalCategoryOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {locale === 'zh' ? item.labelCn || item.label : item.label}
            </option>
          ))}
        </select>
        <select
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          value={formData.type || 'article'}
          onChange={(event) => updateFormValue(['type'], event.target.value)}
        >
          <option value="article">article</option>
          <option value="video">video</option>
        </select>
        <div className="flex items-center gap-2 px-2">
          <input
            id="journal-featured"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300"
            checked={Boolean(formData.featured)}
            onChange={(event) => updateFormValue(['featured'], event.target.checked)}
          />
          <label htmlFor="journal-featured" className="text-sm text-gray-700">
            Featured
          </label>
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <input
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          placeholder="Video URL (YouTube/Vimeo, optional)"
          value={formData.videoUrl || ''}
          onChange={(event) => updateFormValue(['videoUrl'], event.target.value)}
          onBlur={(event) =>
            updateFormValue(['videoUrl'], normalizeVideoUrl(event.target.value))
          }
        />
        <input
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          placeholder="Video Duration (optional)"
          value={formData.videoDuration || ''}
          onChange={(event) => updateFormValue(['videoDuration'], event.target.value)}
        />
      </div>
      <p className="text-xs text-gray-500 -mt-1">
        Paste any YouTube link (watch/share/shorts) or Vimeo link. It auto-converts to an embed URL when you leave the field.
      </p>

      <div className="grid gap-2 md:grid-cols-2">
        <textarea
          className="w-full min-h-[90px] rounded-md border border-gray-200 px-3 py-2 text-sm"
          placeholder="Body (EN, Markdown supported)"
          value={formData.body || ''}
          onChange={(event) => updateFormValue(['body'], event.target.value)}
        />
        <textarea
          className="w-full min-h-[90px] rounded-md border border-gray-200 px-3 py-2 text-sm"
          placeholder="Body (ZH, Markdown supported)"
          value={formData.bodyCn || ''}
          onChange={(event) => updateFormValue(['bodyCn'], event.target.value)}
        />
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <textarea
          className="w-full min-h-[72px] rounded-md border border-gray-200 px-3 py-2 text-sm"
          placeholder="Related Post Slugs (one per line)"
          value={Array.isArray(formData.relatedPosts) ? formData.relatedPosts.join('\n') : ''}
          onChange={(event) =>
            updateFormValue(
              ['relatedPosts'],
              event.target.value
                .split('\n')
                .map((s) => s.trim())
                .filter(Boolean)
            )
          }
        />
        <textarea
          className="w-full min-h-[72px] rounded-md border border-gray-200 px-3 py-2 text-sm"
          placeholder="Related Product Slugs (one per line)"
          value={Array.isArray(formData.relatedProducts) ? formData.relatedProducts.join('\n') : ''}
          onChange={(event) =>
            updateFormValue(
              ['relatedProducts'],
              event.target.value
                .split('\n')
                .map((s) => s.trim())
                .filter(Boolean)
            )
          }
        />
      </div>
    </div>
  );
}

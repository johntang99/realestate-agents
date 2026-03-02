import React from 'react';

interface Props {
  formData: any;
  updateFormValue: (path: string, value: any) => void;
  openImagePicker?: (field: string) => void;
}

const inputCls = 'w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400';
const labelCls = 'block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide';

const CATEGORIES = [
  { value: 'market-updates', label: 'Market Updates' },
  { value: 'buyer-tips', label: 'Buyer Tips' },
  { value: 'seller-tips', label: 'Seller Tips' },
  { value: 'neighborhood-spotlight', label: 'Neighborhood Spotlight' },
  { value: 'investment', label: 'Investment' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'video', label: 'Video' },
];

export function BlogPostItemPanel({ formData, updateFormValue, openImagePicker }: Props) {
  const f = formData || {};

  return (
    <div className="space-y-6">
      {/* Basic */}
      <div className="bg-white border border-gray-100 rounded-lg p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-4">Post Details</h3>
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Title</label>
            <input className={inputCls} value={f.title || ''} onChange={e => updateFormValue('title', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Category</label>
              <select className={inputCls} value={f.category || ''} onChange={e => updateFormValue('category', e.target.value)}>
                <option value="">Select…</option>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Type</label>
              <select className={inputCls} value={f.type || 'article'} onChange={e => updateFormValue('type', e.target.value)}>
                <option value="article">Article</option>
                <option value="video">Video</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Publish Date</label>
              <input type="date" className={inputCls} value={f.date || ''} onChange={e => updateFormValue('date', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Author</label>
              <input className={inputCls} value={f.author || ''} onChange={e => updateFormValue('author', e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="blog-featured" checked={!!f.featured} onChange={e => updateFormValue('featured', e.target.checked)} className="w-4 h-4" />
            <label htmlFor="blog-featured" className="text-sm text-gray-700">Featured post (shown prominently on hub)</label>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="bg-white border border-gray-100 rounded-lg p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Cover Image</h3>
        <div className="flex gap-2">
          <input className={`${inputCls} flex-1`} value={f.coverImage || ''} onChange={e => updateFormValue('coverImage', e.target.value)} placeholder="https://..." />
          {openImagePicker && <button onClick={() => openImagePicker('coverImage')} className="px-3 py-2 text-xs bg-gray-100 rounded border border-gray-200">Pick</button>}
        </div>
        {f.coverImage && <img src={f.coverImage} alt="" className="mt-2 h-24 rounded object-cover" />}
      </div>

      {/* Excerpt */}
      <div className="bg-white border border-gray-100 rounded-lg p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Excerpt (1–2 sentences)</h3>
        <textarea rows={2} className={inputCls} value={f.excerpt || ''} onChange={e => updateFormValue('excerpt', e.target.value)} />
      </div>

      {/* Video (if type=video) */}
      {f.type === 'video' && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
          <h3 className="text-sm font-bold text-blue-700 mb-3">Video</h3>
          <div className="space-y-3">
            <div>
              <label className={labelCls}>Video URL</label>
              <input className={inputCls} value={f.videoUrl || ''} onChange={e => updateFormValue('videoUrl', e.target.value)} placeholder="YouTube or Vimeo URL" />
              <p className="text-xs text-gray-400 mt-1">Auto-converted to embed format on frontend.</p>
            </div>
            <div>
              <label className={labelCls}>Duration (e.g. 8:30)</label>
              <input className={inputCls} value={f.videoDuration || ''} onChange={e => updateFormValue('videoDuration', e.target.value)} placeholder="8:30" />
            </div>
          </div>
        </div>
      )}

      {/* Body */}
      <div className="bg-white border border-gray-100 rounded-lg p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Body (Markdown)</h3>
        <textarea rows={14} className={`${inputCls} font-mono text-xs`} value={f.body || ''} onChange={e => updateFormValue('body', e.target.value)} placeholder="## Heading&#10;&#10;Paragraph text..." />
        <p className="text-xs text-gray-400 mt-1">Supports: ## headings, **bold**, *italic*, bullet lists</p>
      </div>

      {/* Neighborhood link */}
      <div className="bg-white border border-gray-100 rounded-lg p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Cross-Links (optional)</h3>
        <div>
          <label className={labelCls}>Neighborhood Slug</label>
          <input className={inputCls} value={f.neighborhoodSlug || ''} onChange={e => updateFormValue('neighborhoodSlug', e.target.value)} placeholder="scarsdale" />
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white border border-gray-100 rounded-lg p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-4">SEO</h3>
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Page Title</label>
            <input className={inputCls} value={f.seo?.title || ''} onChange={e => updateFormValue('seo.title', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Meta Description</label>
            <textarea rows={2} className={inputCls} value={f.seo?.description || ''} onChange={e => updateFormValue('seo.description', e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
}

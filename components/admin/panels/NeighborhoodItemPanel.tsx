import React from 'react';
import { Plus, X } from 'lucide-react';

interface Props {
  formData: any;
  updateFormValue: (path: string, value: any) => void;
  openImagePicker?: (field: string) => void;
}

const inputCls = 'w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400';
const labelCls = 'block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide';

export function NeighborhoodItemPanel({ formData, updateFormValue, openImagePicker }: Props) {
  const f = formData || {};

  const addSchool = () => {
    const cur = Array.isArray(f.schools) ? [...f.schools] : [];
    cur.push({ name: '', type: 'elementary', rating: '', distance: '' });
    updateFormValue('schools', cur);
  };
  const removeSchool = (i: number) => {
    const cur = [...(f.schools || [])];
    cur.splice(i, 1);
    updateFormValue('schools', cur);
  };
  const addGalleryImage = () => {
    const cur = Array.isArray(f.gallery) ? [...f.gallery] : [];
    cur.push({ url: '', alt: '' });
    updateFormValue('gallery', cur);
  };
  const removeGalleryImage = (i: number) => {
    const cur = [...(f.gallery || [])];
    cur.splice(i, 1);
    updateFormValue('gallery', cur);
  };
  const addLifestyleItem = (cat: string) => {
    const cur = Array.isArray(f.lifestyle?.[cat]) ? [...f.lifestyle[cat]] : [];
    cur.push('');
    updateFormValue(`lifestyle.${cat}`, cur);
  };
  const removeLifestyleItem = (cat: string, i: number) => {
    const cur = [...(f.lifestyle?.[cat] || [])];
    cur.splice(i, 1);
    updateFormValue(`lifestyle.${cat}`, cur);
  };

  return (
    <div className="space-y-6">
      {/* Basic info */}
      <div className="bg-white border border-gray-100 rounded-lg p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-4">Neighborhood Info</h3>
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Name</label>
            <input className={inputCls} value={f.name || ''} onChange={e => updateFormValue('name', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Tagline (brief description)</label>
            <input className={inputCls} value={f.tagline || ''} onChange={e => updateFormValue('tagline', e.target.value)} placeholder="Walkable village, top schools…" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Region</label>
              <input className={inputCls} value={f.region || ''} onChange={e => updateFormValue('region', e.target.value)} placeholder="Southern Orange County" />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input type="checkbox" id="nb-featured" checked={!!f.featured} onChange={e => updateFormValue('featured', e.target.checked)} className="w-4 h-4" />
              <label htmlFor="nb-featured" className="text-sm text-gray-700">Featured neighborhood</label>
            </div>
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

      {/* Overview */}
      <div className="bg-white border border-gray-100 rounded-lg p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Overview (3–4 paragraphs)</h3>
        <textarea rows={8} className={inputCls} value={f.overview || ''} onChange={e => updateFormValue('overview', e.target.value)} placeholder="Neighborhood description with local knowledge. Separate paragraphs with blank lines." />
      </div>

      {/* Market Snapshot */}
      <div className="bg-white border border-gray-100 rounded-lg p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-4">Market Snapshot</h3>
        <div className="grid grid-cols-2 gap-3">
          {[['medianPrice','Median Price','$1,200,000'],['avgPricePerSqft','Avg $/Sqft','$450'],['inventory','Inventory','42 active listings'],['avgDaysOnMarket','Avg Days on Market','18 days'],['yoyChange','YoY Change','+5.2%']].map(([k,l,ph]) => (
            <div key={k}>
              <label className={labelCls}>{l}</label>
              <input className={inputCls} value={f.marketSnapshot?.[k] || ''} onChange={e => updateFormValue(`marketSnapshot.${k}`, e.target.value)} placeholder={ph} />
            </div>
          ))}
        </div>
      </div>

      {/* Schools */}
      <div className="bg-white border border-gray-100 rounded-lg p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-gray-700">Schools</h3>
          <button onClick={addSchool} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded border border-blue-200 hover:bg-blue-100">
            <Plus className="w-3 h-3" /> Add School
          </button>
        </div>
        <div className="space-y-3">
          {(f.schools || []).map((school: any, i: number) => (
            <div key={i} className="p-3 bg-gray-50 rounded border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs font-semibold text-gray-500">School {i + 1}</p>
                <button onClick={() => removeSchool(i)} className="text-red-400 hover:text-red-600"><X className="w-3.5 h-3.5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input className={inputCls} value={school.name || ''} placeholder="School name"
                  onChange={e => { const s = [...f.schools]; s[i] = {...s[i], name: e.target.value}; updateFormValue('schools', s); }} />
                <select className={inputCls} value={school.type || 'elementary'}
                  onChange={e => { const s = [...f.schools]; s[i] = {...s[i], type: e.target.value}; updateFormValue('schools', s); }}>
                  <option value="elementary">Elementary</option>
                  <option value="middle">Middle</option>
                  <option value="high">High</option>
                  <option value="private">Private</option>
                </select>
                <input className={inputCls} value={school.rating || ''} placeholder="Rating (e.g. 9/10)"
                  onChange={e => { const s = [...f.schools]; s[i] = {...s[i], rating: e.target.value}; updateFormValue('schools', s); }} />
                <input className={inputCls} value={school.distance || ''} placeholder="Distance (e.g. 0.5 mi)"
                  onChange={e => { const s = [...f.schools]; s[i] = {...s[i], distance: e.target.value}; updateFormValue('schools', s); }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lifestyle */}
      <div className="bg-white border border-gray-100 rounded-lg p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-4">Lifestyle & Amenities</h3>
        {['restaurants', 'parks', 'shopping', 'transit'].map(cat => (
          <div key={cat} className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className={labelCls + ' mb-0 capitalize'}>{cat}</label>
              <button onClick={() => addLifestyleItem(cat)} className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-0.5">
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            <div className="space-y-1.5">
              {(f.lifestyle?.[cat] || []).map((item: string, i: number) => (
                <div key={i} className="flex gap-2">
                  <input className={`${inputCls} flex-1`} value={item}
                    onChange={e => {
                      const cur = [...(f.lifestyle?.[cat] || [])];
                      cur[i] = e.target.value;
                      updateFormValue(`lifestyle.${cat}`, cur);
                    }} />
                  <button onClick={() => removeLifestyleItem(cat, i)} className="text-red-400 hover:text-red-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="mt-3">
          <label className={labelCls}>Commute Info</label>
          <input className={inputCls} value={f.lifestyle?.commute || ''} placeholder="25 min to Grand Central"
            onChange={e => updateFormValue('lifestyle.commute', e.target.value)} />
        </div>
      </div>

      {/* Gallery */}
      <div className="bg-white border border-gray-100 rounded-lg p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-gray-700">Gallery Photos</h3>
          <button onClick={addGalleryImage} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded border border-blue-200 hover:bg-blue-100">
            <Plus className="w-3 h-3" /> Add Photo
          </button>
        </div>
        <div className="space-y-2">
          {(f.gallery || []).map((img: any, i: number) => (
            <div key={i} className="flex gap-2 items-center">
              {img.url && <img src={img.url} alt="" className="w-12 h-9 object-cover rounded flex-shrink-0" />}
              <input className={`${inputCls} flex-1`} value={img.url || ''} placeholder="Image URL"
                onChange={e => { const g = [...(f.gallery||[])]; g[i]={...g[i], url: e.target.value}; updateFormValue('gallery', g); }} />
              {openImagePicker && <button onClick={() => openImagePicker(`gallery.${i}.url`)} className="px-2 py-1.5 text-xs bg-gray-100 rounded border border-gray-200">Pick</button>}
              <button onClick={() => removeGalleryImage(i)} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
            </div>
          ))}
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

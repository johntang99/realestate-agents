import React from 'react';
import { Plus, X } from 'lucide-react';

interface Props {
  formData: any;
  updateFormValue: (path: string, value: any) => void;
  openImagePicker?: (field: string) => void;
  neighborhoods?: Array<{ slug: string; name: string }>;
}

const inputCls = 'w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400';
const labelCls = 'block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide';
const rowCls = 'grid grid-cols-2 gap-3';

export function PropertyItemPanel({ formData, updateFormValue, openImagePicker, neighborhoods = [] }: Props) {
  const f = formData || {};

  const addFeature = (category: string) => {
    const cur = (f.features?.[category] || []) as string[];
    updateFormValue(`features.${category}`, [...cur, '']);
  };
  const updateFeature = (category: string, i: number, val: string) => {
    const cur = [...(f.features?.[category] || [])] as string[];
    cur[i] = val;
    updateFormValue(`features.${category}`, cur);
  };
  const removeFeature = (category: string, i: number) => {
    const cur = [...(f.features?.[category] || [])] as string[];
    cur.splice(i, 1);
    updateFormValue(`features.${category}`, cur);
  };
  const addImage = () => {
    const cur = Array.isArray(f.images) ? [...f.images] : [];
    cur.push({ url: '', alt: '', order: cur.length });
    updateFormValue('images', cur);
  };
  const removeImage = (i: number) => {
    const cur = [...(f.images || [])];
    cur.splice(i, 1);
    updateFormValue('images', cur);
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white border border-gray-100 rounded-lg p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-4">Property Details</h3>
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Address</label>
            <input className={inputCls} value={f.address || ''} onChange={e => updateFormValue('address', e.target.value)} placeholder="123 Oak Ridge Lane" />
          </div>
          <div className={rowCls}>
            <div>
              <label className={labelCls}>City</label>
              <input className={inputCls} value={f.city || ''} onChange={e => updateFormValue('city', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>State</label>
              <input className={inputCls} value={f.state || ''} onChange={e => updateFormValue('state', e.target.value)} placeholder="NY" />
            </div>
          </div>
          <div className={rowCls}>
            <div>
              <label className={labelCls}>ZIP</label>
              <input className={inputCls} value={f.zip || ''} onChange={e => updateFormValue('zip', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Neighborhood</label>
              <select className={inputCls} value={f.neighborhood || ''} onChange={e => updateFormValue('neighborhood', e.target.value)}>
                <option value="">Select…</option>
                {neighborhoods.map(n => <option key={n.slug} value={n.slug}>{n.name}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Price & Status */}
      <div className="bg-white border border-gray-100 rounded-lg p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-4">Status & Pricing</h3>
        <div className="space-y-3">
          <div className={rowCls}>
            <div>
              <label className={labelCls}>Status</label>
              <select className={inputCls} value={f.status || ''} onChange={e => updateFormValue('status', e.target.value)}>
                <option value="">Select…</option>
                <option value="for-sale">For Sale</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
                <option value="for-lease">For Lease</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Property Type</label>
              <select className={inputCls} value={f.type || ''} onChange={e => updateFormValue('type', e.target.value)}>
                <option value="">Select…</option>
                <option value="single-family">Single Family</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="commercial">Commercial</option>
                <option value="land">Land</option>
                <option value="multi-family">Multi-Family</option>
              </select>
            </div>
          </div>
          <div className={rowCls}>
            <div>
              <label className={labelCls}>Price ($)</label>
              <input type="number" className={inputCls} value={f.price || ''} onChange={e => updateFormValue('price', Number(e.target.value))} />
            </div>
            <div>
              <label className={labelCls}>Price Display</label>
              <input className={inputCls} value={f.priceDisplay || ''} onChange={e => updateFormValue('priceDisplay', e.target.value)} placeholder="$1,250,000" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="featured" checked={!!f.featured} onChange={e => updateFormValue('featured', e.target.checked)} className="w-4 h-4" />
            <label htmlFor="featured" className="text-sm text-gray-700">Featured on home page</label>
          </div>
        </div>
      </div>

      {/* Key specs */}
      <div className="bg-white border border-gray-100 rounded-lg p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-4">Key Specs</h3>
        <div className="grid grid-cols-3 gap-3">
          {[['beds','Beds'],['baths','Baths'],['sqft','Sqft']].map(([k,l]) => (
            <div key={k}>
              <label className={labelCls}>{l}</label>
              <input type="number" className={inputCls} value={f[k] || ''} onChange={e => updateFormValue(k, Number(e.target.value))} />
            </div>
          ))}
          {[['lotSize','Lot Size'],['yearBuilt','Year Built'],['garage','Garage']].map(([k,l]) => (
            <div key={k}>
              <label className={labelCls}>{l}</label>
              <input className={inputCls} value={f[k] || ''} onChange={e => updateFormValue(k, e.target.value)} />
            </div>
          ))}
          {[['hoa','HOA'],['taxAmount','Tax/yr'],['mlsNumber','MLS #']].map(([k,l]) => (
            <div key={k}>
              <label className={labelCls}>{l}</label>
              <input className={inputCls} value={f[k] || ''} onChange={e => updateFormValue(k, e.target.value)} />
            </div>
          ))}
          <div>
            <label className={labelCls}>School District</label>
            <input className={inputCls} value={f.schoolDistrict || ''} onChange={e => updateFormValue('schoolDistrict', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Latitude</label>
            <input
              type="number"
              step="0.000001"
              className={inputCls}
              value={f.coordinates?.lat ?? ''}
              onChange={e =>
                updateFormValue(
                  'coordinates.lat',
                  e.target.value === '' ? null : Number(e.target.value)
                )
              }
              placeholder="40.7128"
            />
          </div>
          <div>
            <label className={labelCls}>Longitude</label>
            <input
              type="number"
              step="0.000001"
              className={inputCls}
              value={f.coordinates?.lng ?? ''}
              onChange={e =>
                updateFormValue(
                  'coordinates.lng',
                  e.target.value === '' ? null : Number(e.target.value)
                )
              }
              placeholder="-73.9352"
            />
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="bg-white border border-gray-100 rounded-lg p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-4">Cover Image</h3>
        <div className="flex gap-2 items-start">
          <input className={`${inputCls} flex-1`} value={f.coverImage || ''} onChange={e => updateFormValue('coverImage', e.target.value)} placeholder="https://..." />
          {openImagePicker && (
            <button onClick={() => openImagePicker('coverImage')} className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded border border-gray-200 whitespace-nowrap">
              Pick
            </button>
          )}
        </div>
        {f.coverImage && <img src={f.coverImage} alt="" className="mt-2 h-24 rounded object-cover" />}
        <div className="mt-2">
          <label className={labelCls}>Cover Image Alt</label>
          <input className={inputCls} value={f.coverImageAlt || ''} onChange={e => updateFormValue('coverImageAlt', e.target.value)} />
        </div>
      </div>

      {/* Gallery */}
      <div className="bg-white border border-gray-100 rounded-lg p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-gray-700">Photo Gallery</h3>
          <button onClick={addImage} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded border border-blue-200 hover:bg-blue-100">
            <Plus className="w-3 h-3" /> Add Photo
          </button>
        </div>
        <div className="space-y-3">
          {(f.images || []).map((img: any, i: number) => (
            <div key={i} className="flex gap-2 items-start p-3 bg-gray-50 rounded border border-gray-100">
              {img.url && <img src={img.url} alt="" className="w-16 h-12 object-cover rounded flex-shrink-0" />}
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <input className={`${inputCls} flex-1`} value={img.url || ''} placeholder="Image URL"
                    onChange={e => {
                      const imgs = [...(f.images || [])];
                      imgs[i] = { ...imgs[i], url: e.target.value };
                      updateFormValue('images', imgs);
                    }} />
                  {openImagePicker && (
                    <button onClick={() => openImagePicker(`images.${i}.url`)} className="px-2 py-1 text-xs bg-gray-100 rounded border border-gray-200">Pick</button>
                  )}
                </div>
                <input className={inputCls} value={img.alt || ''} placeholder="Alt text"
                  onChange={e => {
                    const imgs = [...(f.images || [])];
                    imgs[i] = { ...imgs[i], alt: e.target.value };
                    updateFormValue('images', imgs);
                  }} />
              </div>
              <button onClick={() => removeImage(i)} className="text-red-400 hover:text-red-600 mt-0.5">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {(!f.images || f.images.length === 0) && (
            <p className="text-xs text-gray-400 text-center py-4">No gallery images yet. Add photos above.</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="bg-white border border-gray-100 rounded-lg p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-4">Description</h3>
        <textarea rows={6} className={inputCls} value={f.description || ''} onChange={e => updateFormValue('description', e.target.value)} placeholder="Property description (supports markdown)..." />
      </div>

      {/* Features */}
      <div className="bg-white border border-gray-100 rounded-lg p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-4">Features & Amenities</h3>
        {['interior', 'exterior', 'community', 'utilities'].map(cat => (
          <div key={cat} className="mb-5">
            <div className="flex justify-between items-center mb-2">
              <label className={labelCls + ' mb-0 capitalize'}>{cat}</label>
              <button onClick={() => addFeature(cat)} className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-0.5">
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {(f.features?.[cat] || []).map((item: string, i: number) => (
                <div key={i} className="flex gap-2">
                  <input className={`${inputCls} flex-1`} value={item} onChange={e => updateFeature(cat, i, e.target.value)} />
                  <button onClick={() => removeFeature(cat, i)} className="text-red-400 hover:text-red-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Virtual Tour */}
      <div className="bg-white border border-gray-100 rounded-lg p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Virtual Tour URL</h3>
        <input className={inputCls} value={f.virtualTourUrl || ''} onChange={e => updateFormValue('virtualTourUrl', e.target.value)} placeholder="YouTube, Vimeo, or Matterport URL" />
        <p className="text-xs text-gray-400 mt-1">Paste any YouTube/Vimeo URL — it will be auto-converted to embed format.</p>
      </div>

      {/* MLS metadata */}
      <div className="bg-white border border-gray-100 rounded-lg p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-3">MLS Source Metadata</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Provider</label>
            <input
              className={inputCls}
              value={f.mlsSource?.provider || ''}
              onChange={e => updateFormValue('mlsSource.provider', e.target.value)}
              placeholder="generic-json"
            />
          </div>
          <div>
            <label className={labelCls}>Listing ID</label>
            <input
              className={inputCls}
              value={f.mlsSource?.listingId || ''}
              onChange={e => updateFormValue('mlsSource.listingId', e.target.value)}
              placeholder="H6299912"
            />
          </div>
          <div>
            <label className={labelCls}>Sync Status</label>
            <select
              className={inputCls}
              value={f.mlsSource?.syncStatus || ''}
              onChange={e => updateFormValue('mlsSource.syncStatus', e.target.value)}
            >
              <option value="">Select...</option>
              <option value="active">active</option>
              <option value="archived">archived</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Synced At</label>
            <input
              className={inputCls}
              value={f.mlsSource?.syncedAt || ''}
              onChange={e => updateFormValue('mlsSource.syncedAt', e.target.value)}
              placeholder="2026-03-01T12:00:00.000Z"
            />
          </div>
        </div>
      </div>

      {/* Sold details — shown only if status=sold */}
      {f.status === 'sold' && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-5">
          <h3 className="text-sm font-bold text-red-700 mb-4">Sold Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Sold Price ($)</label>
              <input type="number" className={inputCls} value={f.soldDetails?.soldPrice || ''} onChange={e => updateFormValue('soldDetails.soldPrice', Number(e.target.value))} />
            </div>
            <div>
              <label className={labelCls}>Sold Date</label>
              <input type="date" className={inputCls} value={f.soldDetails?.soldDate || ''} onChange={e => updateFormValue('soldDetails.soldDate', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Days on Market</label>
              <input type="number" className={inputCls} value={f.soldDetails?.daysOnMarket || ''} onChange={e => updateFormValue('soldDetails.daysOnMarket', Number(e.target.value))} />
            </div>
            <div>
              <label className={labelCls}>Original List Price ($)</label>
              <input type="number" className={inputCls} value={f.soldDetails?.listPrice || ''} onChange={e => updateFormValue('soldDetails.listPrice', Number(e.target.value))} />
            </div>
          </div>
        </div>
      )}

      {/* Lease details — shown only if status=for-lease */}
      {f.status === 'for-lease' && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
          <h3 className="text-sm font-bold text-blue-700 mb-4">Lease Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Monthly Rent ($)</label>
              <input type="number" className={inputCls} value={f.leaseDetails?.monthlyRent || ''} onChange={e => updateFormValue('leaseDetails.monthlyRent', Number(e.target.value))} />
            </div>
            <div>
              <label className={labelCls}>Lease Term</label>
              <input className={inputCls} value={f.leaseDetails?.leaseTerm || ''} onChange={e => updateFormValue('leaseDetails.leaseTerm', e.target.value)} placeholder="12 months" />
            </div>
            <div>
              <label className={labelCls}>Available Date</label>
              <input type="date" className={inputCls} value={f.leaseDetails?.availableDate || ''} onChange={e => updateFormValue('leaseDetails.availableDate', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Pet Policy</label>
              <input className={inputCls} value={f.leaseDetails?.petPolicy || ''} onChange={e => updateFormValue('leaseDetails.petPolicy', e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Utilities Included</label>
              <input className={inputCls} value={f.leaseDetails?.utilitiesIncluded || ''} onChange={e => updateFormValue('leaseDetails.utilitiesIncluded', e.target.value)} />
            </div>
          </div>
        </div>
      )}

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

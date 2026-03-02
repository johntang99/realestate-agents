import React from 'react';
import { Plus, X, Star } from 'lucide-react';

interface Props {
  formData: any;
  updateFormValue: (path: string, value: any) => void;
}

const inputCls = 'w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400';
const labelCls = 'block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide';

const CATEGORIES = [
  { value: 'buyers', label: 'Buyers' },
  { value: 'sellers', label: 'Sellers' },
  { value: 'renters', label: 'Renters' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'investors', label: 'Investors' },
];

export function REATestimonialsPanel({ formData, updateFormValue }: Props) {
  const f = formData || {};
  const items: any[] = Array.isArray(f.items) ? f.items : [];

  const addItem = () => {
    const newId = `test-${Date.now()}`;
    updateFormValue('items', [...items, {
      id: newId, quote: '', author: '', title: '', category: 'buyers',
      rating: 5, featured: false, date: new Date().toISOString().slice(0, 10),
    }]);
  };

  const removeItem = (i: number) => {
    const cur = [...items];
    cur.splice(i, 1);
    updateFormValue('items', cur);
  };

  const updateItem = (i: number, field: string, value: any) => {
    const cur = [...items];
    cur[i] = { ...cur[i], [field]: value };
    updateFormValue('items', cur);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">{items.length} testimonial{items.length !== 1 ? 's' : ''}</p>
        <button onClick={addItem} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-4 py-2 rounded border border-blue-200 hover:bg-blue-100 font-semibold">
          <Plus className="w-3.5 h-3.5" /> Add Testimonial
        </button>
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-sm text-gray-400">No testimonials yet. Click "Add Testimonial" to get started.</p>
        </div>
      )}

      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={item.id || i} className={`border rounded-lg overflow-hidden ${item.featured ? 'border-amber-200' : 'border-gray-100'}`}>
            {/* Card header */}
            <div className={`flex items-center justify-between px-4 py-3 ${item.featured ? 'bg-amber-50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-500">#{i + 1}</span>
                <span className="font-semibold text-sm text-gray-700">{item.author || '(no author)'}</span>
                {item.category && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-500">
                    {CATEGORIES.find(c => c.value === item.category)?.label || item.category}
                  </span>
                )}
                {item.featured && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 border border-amber-200 text-amber-700 flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-current" /> Featured
                  </span>
                )}
              </div>
              <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Card body */}
            <div className="p-4 bg-white space-y-3">
              <div>
                <label className={labelCls}>Quote</label>
                <textarea rows={3} className={inputCls} value={item.quote || ''} placeholder="Client testimonial text…"
                  onChange={e => updateItem(i, 'quote', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Author</label>
                  <input className={inputCls} value={item.author || ''} placeholder="John & Sarah M."
                    onChange={e => updateItem(i, 'author', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Title / Location</label>
                  <input className={inputCls} value={item.title || ''} placeholder="Buyers, Port Jervis"
                    onChange={e => updateItem(i, 'title', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>Category</label>
                  <select className={inputCls} value={item.category || 'buyers'} onChange={e => updateItem(i, 'category', e.target.value)}>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Rating (1–5)</label>
                  <select className={inputCls} value={item.rating || 5} onChange={e => updateItem(i, 'rating', Number(e.target.value))}>
                    {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} stars</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Date</label>
                  <input type="date" className={inputCls} value={item.date || ''} onChange={e => updateItem(i, 'date', e.target.value)} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Transaction Type (optional)</label>
                <input className={inputCls} value={item.transactionType || ''} placeholder="Purchased 4BR colonial"
                  onChange={e => updateItem(i, 'transactionType', e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id={`feat-${i}`} checked={!!item.featured} onChange={e => updateItem(i, 'featured', e.target.checked)} className="w-4 h-4" />
                <label htmlFor={`feat-${i}`} className="text-sm text-gray-700">Featured (shown on home page)</label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

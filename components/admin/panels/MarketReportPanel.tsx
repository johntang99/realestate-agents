import React from 'react';
import { Plus, X, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Props {
  formData: any;
  updateFormValue: (path: string, value: any) => void;
}

const inputCls = 'w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400';
const labelCls = 'block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide';

export function MarketReportPanel({ formData, updateFormValue }: Props) {
  const f = formData || {};

  const addMetric = () => {
    const cur = Array.isArray(f.keyMetrics) ? [...f.keyMetrics] : [];
    cur.push({ label: '', value: '', change: '', direction: 'neutral' });
    updateFormValue('keyMetrics', cur);
  };
  const removeMetric = (i: number) => {
    const cur = [...(f.keyMetrics || [])];
    cur.splice(i, 1);
    updateFormValue('keyMetrics', cur);
  };
  const addNeighborhoodRow = () => {
    const cur = Array.isArray(f.neighborhoodBreakdown) ? [...f.neighborhoodBreakdown] : [];
    cur.push({ neighborhood: '', medianPrice: '', inventory: '', daysOnMarket: '' });
    updateFormValue('neighborhoodBreakdown', cur);
  };
  const removeNeighborhoodRow = (i: number) => {
    const cur = [...(f.neighborhoodBreakdown || [])];
    cur.splice(i, 1);
    updateFormValue('neighborhoodBreakdown', cur);
  };

  return (
    <div className="space-y-6">
      {/* Basic */}
      <div className="bg-white border border-gray-100 rounded-lg p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-4">Report Info</h3>
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Report Title</label>
            <input className={inputCls} value={f.title || ''} onChange={e => updateFormValue('title', e.target.value)} placeholder="January 2026 Market Report" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Date</label>
              <input type="date" className={inputCls} value={f.date || ''} onChange={e => updateFormValue('date', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Area</label>
              <input className={inputCls} value={f.area || ''} onChange={e => updateFormValue('area', e.target.value)} placeholder="Orange County, NY" />
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="bg-white border border-gray-100 rounded-lg p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-gray-700">Key Metrics</h3>
          <button onClick={addMetric} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded border border-blue-200 hover:bg-blue-100">
            <Plus className="w-3 h-3" /> Add Metric
          </button>
        </div>
        <div className="space-y-3">
          {(f.keyMetrics || []).map((metric: any, i: number) => (
            <div key={i} className="p-3 bg-gray-50 rounded border border-gray-100">
              <div className="flex justify-between mb-2">
                <p className="text-xs font-semibold text-gray-500">Metric {i + 1}</p>
                <button onClick={() => removeMetric(i)} className="text-red-400 hover:text-red-600"><X className="w-3.5 h-3.5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input className={inputCls} value={metric.label || ''} placeholder="Label (e.g. Median Home Price)"
                  onChange={e => { const m=[...f.keyMetrics]; m[i]={...m[i],label:e.target.value}; updateFormValue('keyMetrics',m); }} />
                <input className={inputCls} value={metric.value || ''} placeholder="Value (e.g. $875,000)"
                  onChange={e => { const m=[...f.keyMetrics]; m[i]={...m[i],value:e.target.value}; updateFormValue('keyMetrics',m); }} />
                <input className={inputCls} value={metric.change || ''} placeholder="Change (e.g. +5.8%)"
                  onChange={e => { const m=[...f.keyMetrics]; m[i]={...m[i],change:e.target.value}; updateFormValue('keyMetrics',m); }} />
                <select className={inputCls} value={metric.direction || 'neutral'}
                  onChange={e => { const m=[...f.keyMetrics]; m[i]={...m[i],direction:e.target.value}; updateFormValue('keyMetrics',m); }}>
                  <option value="up">↑ Up (green)</option>
                  <option value="down">↓ Down (red)</option>
                  <option value="neutral">→ Neutral (gray)</option>
                </select>
              </div>
              {/* Direction preview */}
              <div className="flex items-center gap-1 mt-2">
                {metric.direction === 'up' && <TrendingUp className="w-3 h-3 text-green-600" />}
                {metric.direction === 'down' && <TrendingDown className="w-3 h-3 text-red-600" />}
                {metric.direction === 'neutral' && <Minus className="w-3 h-3 text-gray-400" />}
                <span className={`text-xs font-semibold ${metric.direction==='up'?'text-green-600':metric.direction==='down'?'text-red-600':'text-gray-400'}`}>
                  {metric.value} {metric.change}
                </span>
              </div>
            </div>
          ))}
          {(!f.keyMetrics || f.keyMetrics.length === 0) && (
            <p className="text-xs text-gray-400 text-center py-4">No metrics yet. Add metrics above.</p>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="bg-white border border-gray-100 rounded-lg p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Analysis Body (Markdown)</h3>
        <textarea rows={12} className={`${inputCls} font-mono text-xs`} value={f.body || ''} onChange={e => updateFormValue('body', e.target.value)} placeholder="## Executive Summary&#10;&#10;Market commentary..." />
      </div>

      {/* Neighborhood Breakdown */}
      <div className="bg-white border border-gray-100 rounded-lg p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-gray-700">Neighborhood Breakdown</h3>
          <button onClick={addNeighborhoodRow} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded border border-blue-200 hover:bg-blue-100">
            <Plus className="w-3 h-3" /> Add Row
          </button>
        </div>
        {(f.neighborhoodBreakdown || []).length > 0 && (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                {['Neighborhood','Median Price','Inventory','Days on Market',''].map(h => (
                  <th key={h} className="text-left py-2 px-1 font-semibold text-gray-500 uppercase tracking-wide text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(f.neighborhoodBreakdown || []).map((row: any, i: number) => (
                <tr key={i} className="border-b border-gray-50">
                  {['neighborhood','medianPrice','inventory','daysOnMarket'].map(k => (
                    <td key={k} className="py-1.5 px-1">
                      <input className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                        value={row[k] || ''} placeholder={k}
                        onChange={e => { const nb=[...f.neighborhoodBreakdown]; nb[i]={...nb[i],[k]:e.target.value}; updateFormValue('neighborhoodBreakdown',nb); }} />
                    </td>
                  ))}
                  <td className="py-1.5 px-1">
                    <button onClick={() => removeNeighborhoodRow(i)} className="text-red-400 hover:text-red-600"><X className="w-3.5 h-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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

'use client';

import { useState, useEffect } from 'react';
import { trackLeadEvent } from '@/lib/leads/client';

type Step = 1 | 2 | 3;

export default function HomeValuationPage() {
  const [step, setStep] = useState<Step>(1);
  const [locale, setLocale] = useState('en');
  const [form, setForm] = useState({ address:'', city:'', beds:'', baths:'', sqft:'', yearBuilt:'', garage:'no', pool:'no', condition:'good', name:'', email:'', phone:'', timeline:'' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => { setLocale(window.location.pathname.startsWith('/zh') ? 'zh' : 'en'); }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    const siteId = process.env.NEXT_PUBLIC_DEFAULT_SITE_ID || 'jinpanghomes';
    await trackLeadEvent({ siteId, locale, eventName: 'form_submit', source: 'home-valuation-page', pagePath: `/${locale}/home-valuation` });
    await fetch('/api/valuation', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        ...form,
        locale,
        siteId,
        source: 'home-valuation-page',
        pagePath: `/${locale}/home-valuation`,
        consentAccepted: true,
        consentText: 'No spam. No obligation. Just an honest valuation from a local expert.',
      }),
    }).catch(()=>{});
    setDone(true); setSubmitting(false);
  };

  if (done) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--backdrop-light)' }}>
      <div className="max-w-lg w-full text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-6" style={{ background: 'var(--secondary)' }}>✓</div>
        <h1 className="font-serif text-3xl font-semibold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>Your valuation is being prepared!</h1>
        <p className="text-base mb-6" style={{ color: 'var(--text-secondary)' }}>A local Jin Pang Homes agent will contact you within 24 hours with:</p>
        <ul className="text-left space-y-2 mb-8 max-w-xs mx-auto">
          {['Comparable sold properties in your area','Current market trends for your neighborhood','Our pricing recommendation','A personalized marketing plan'].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--secondary)' }}>✓</span> {item}
            </li>
          ))}
        </ul>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>We've valued 200+ homes in Orange County.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--backdrop-light)' }}>
      {/* Header */}
      <div style={{ background: 'var(--primary)' }} className="pt-20 pb-10">
        <div className="container-custom">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-white" style={{ fontFamily: 'var(--font-heading)' }}>Free Home Valuation</h1>
          <p className="text-white/70 mt-2">Get your personalized report within 24 hours — no obligation.</p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="max-w-xl mx-auto">
          {/* Steps indicator */}
          <div className="flex items-center gap-2 mb-8">
            {([1,2,3] as Step[]).map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= s ? 'text-white' : 'text-gray-400'}`}
                  style={{ background: step >= s ? 'var(--secondary)' : 'var(--backdrop-mid)' }}>
                  {s}
                </div>
                {s < 3 && <div className="flex-1 h-0.5 w-12" style={{ background: step > s ? 'var(--secondary)' : 'var(--border)' }} />}
              </div>
            ))}
            <div className="ml-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
              {step === 1 ? 'Property Address' : step === 2 ? 'Property Details' : 'Your Information'}
            </div>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-[var(--border)]"
            style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}>

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-serif text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>Where is your property?</h2>
                <input value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))} placeholder="Street address" className="calc-input w-full" />
                <input value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))} placeholder="City / Town" className="calc-input w-full" />
                <button onClick={() => form.address && setStep(2)} disabled={!form.address}
                  className="btn-gold w-full py-3.5 disabled:opacity-50">Start My Valuation →</button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-serif text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>Tell us about your home</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div><label className="text-xs text-gray-500 block mb-1">Bedrooms</label>
                    <input type="number" value={form.beds} onChange={e=>setForm(f=>({...f,beds:e.target.value}))} placeholder="3" className="calc-input w-full" /></div>
                  <div><label className="text-xs text-gray-500 block mb-1">Bathrooms</label>
                    <input type="number" value={form.baths} onChange={e=>setForm(f=>({...f,baths:e.target.value}))} placeholder="2" className="calc-input w-full" /></div>
                  <div><label className="text-xs text-gray-500 block mb-1">Sq Ft (approx)</label>
                    <input type="number" value={form.sqft} onChange={e=>setForm(f=>({...f,sqft:e.target.value}))} placeholder="2000" className="calc-input w-full" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500 block mb-1">Year Built</label>
                    <input type="number" value={form.yearBuilt} onChange={e=>setForm(f=>({...f,yearBuilt:e.target.value}))} placeholder="1985" className="calc-input w-full" /></div>
                  <div><label className="text-xs text-gray-500 block mb-1">Condition</label>
                    <select value={form.condition} onChange={e=>setForm(f=>({...f,condition:e.target.value}))} className="calc-input w-full">
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="needs-work">Needs Work</option>
                    </select></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500 block mb-1">Garage</label>
                    <select value={form.garage} onChange={e=>setForm(f=>({...f,garage:e.target.value}))} className="calc-input w-full">
                      <option value="no">No garage</option>
                      <option value="1car">1-car</option>
                      <option value="2car">2-car</option>
                      <option value="3car">3-car</option>
                    </select></div>
                  <div><label className="text-xs text-gray-500 block mb-1">Pool</label>
                    <select value={form.pool} onChange={e=>setForm(f=>({...f,pool:e.target.value}))} className="calc-input w-full">
                      <option value="no">No pool</option>
                      <option value="yes">In-ground pool</option>
                    </select></div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">← Back</button>
                  <button onClick={() => setStep(3)} className="flex-1 btn-gold py-3">Continue →</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="font-serif text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>Almost done — who should we contact?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Full Name" className="calc-input" />
                  <input required type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="Email Address" className="calc-input" />
                </div>
                <input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="Phone (optional)" className="calc-input w-full" />
                <select value={form.timeline} onChange={e=>setForm(f=>({...f,timeline:e.target.value}))} className="calc-input w-full">
                  <option value="">Timeline to sell…</option>
                  <option value="asap">ASAP</option>
                  <option value="3months">Within 3 months</option>
                  <option value="6months">Within 6 months</option>
                  <option value="exploring">Just exploring</option>
                </select>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="flex-1 py-3 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">← Back</button>
                  <button onClick={handleSubmit} disabled={!form.name || !form.email || submitting} className="flex-1 btn-gold py-3 disabled:opacity-50">
                    {submitting ? 'Sending…' : 'Get My Valuation'}
                  </button>
                </div>
                <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>No spam. No obligation. Just an honest valuation from a local expert.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  const [site, setSite] = useState<any>({});
  const [locale, setLocale] = useState('en');
  const [form, setForm] = useState({ name:'', email:'', phone:'', category:'', message:'' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    fetch(`/api/content/file?locale=${loc}&path=site.json`).then(r=>r.json())
      .then(res => { try { setSite(JSON.parse(res.content||'{}')); } catch {} });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ...form, locale }) }).catch(()=>{});
    setSubmitted(true); setSubmitting(false);
  };

  return (
    <>
      <section className="relative pt-20 overflow-hidden" style={{ minHeight: '36vh', background: 'var(--primary)' }}>
        <div className="container-custom flex items-end pb-10 md:pb-12" style={{ minHeight: 'calc(36vh - 5rem)' }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Get in Touch</p>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white" style={{ fontFamily: 'var(--font-heading)' }}>Let's Talk</h1>
            <p className="text-white/70 mt-3 max-w-xl">We respond to every inquiry within 2 business hours.</p>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
            {/* Left: contact details */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-6" style={{ color: 'var(--secondary)' }}>Our Office</p>
              <div className="space-y-5">
                {site.address?.full && (
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--secondary)' }} />
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--primary)' }}>Address</p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{site.address.full}</p>
                    </div>
                  </div>
                )}
                {site.phone && (
                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--secondary)' }} />
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--primary)' }}>Phone</p>
                      <a href={`tel:${site.phone?.replace(/\D/g,'')}`} className="text-sm hover:underline" style={{ color: 'var(--text-secondary)' }}>{site.phone}</a>
                    </div>
                  </div>
                )}
                {site.email && (
                  <div className="flex items-start gap-4">
                    <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--secondary)' }} />
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--primary)' }}>Email</p>
                      <a href={`mailto:${site.email}`} className="text-sm hover:underline" style={{ color: 'var(--text-secondary)' }}>{site.email}</a>
                    </div>
                  </div>
                )}
                {site.officeHours && (
                  <div className="flex items-start gap-4">
                    <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--secondary)' }} />
                    <div>
                      <p className="font-semibold text-sm mb-1" style={{ color: 'var(--primary)' }}>Office Hours</p>
                      {Object.values(site.officeHours).map((v, i) => (
                        <p key={i} className="text-sm" style={{ color: 'var(--text-secondary)' }}>{v as string}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Map embed placeholder */}
              {site.address?.mapsEmbedUrl && (
                <div className="mt-8 rounded-xl overflow-hidden border border-[var(--border)]" style={{ borderRadius: 'var(--effect-card-radius)', height: '260px' }}>
                  <iframe src={site.address.mapsEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="Office location" />
                </div>
              )}
            </div>

            {/* Right: form */}
            <div className="bg-white p-7 rounded-2xl border border-[var(--border)]"
              style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}>
              {submitted ? (
                <div className="text-center py-12">
                  <p className="font-serif text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>Message received!</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>We'll be in touch within 2 business hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="font-serif text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>Send Us a Message</h2>
                  <input required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Full Name" className="calc-input w-full" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input required type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="Email" className="calc-input" />
                    <input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="Phone (optional)" className="calc-input" />
                  </div>
                  <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} className="calc-input w-full">
                    <option value="">How can we help?</option>
                    <option value="buy">I want to buy</option>
                    <option value="sell">I want to sell</option>
                    <option value="invest">Investment inquiry</option>
                    <option value="relocate">I'm relocating</option>
                    <option value="join">I'm interested in joining your team</option>
                    <option value="other">Other</option>
                  </select>
                  <textarea required value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} placeholder="Your message…" className="calc-input w-full min-h-[110px]" />
                  <button type="submit" disabled={submitting} className="btn-gold w-full py-3.5 font-semibold">
                    {submitting ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

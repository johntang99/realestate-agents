'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Bed, Bath, Maximize2, MapPin, Phone, Mail, Calendar, PlayCircle } from 'lucide-react';
import { AgentCard, type AgentData } from '@/components/ui/AgentCard';
import { trackLeadEvent } from '@/lib/leads/client';
import { MortgageCalculator } from '@/components/ui/MortgageCalculator';

function toEmbedUrl(rawUrl: string | undefined) {
  if (!rawUrl) return null;
  const url = rawUrl.trim();
  if (!url) return null;
  if (url.includes('youtube.com/watch')) {
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  }
  if (url.includes('youtu.be/')) {
    const match = url.match(/youtu\.be\/([^?&/]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  }
  if (url.includes('vimeo.com/')) {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? `https://player.vimeo.com/video/${match[1]}` : null;
  }
  if (url.includes('matterport.com/show/')) {
    return url;
  }
  if (url.startsWith('https://') || url.startsWith('http://')) {
    return url;
  }
  return null;
}

export default function PropertyDetailPage() {
  const [property, setProperty] = useState<any>(null);
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [locale, setLocale] = useState('en');
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [form, setForm] = useState({ name:'', email:'', phone:'', message:'' });
  const [submitted, setSubmitted] = useState(false);
  const [showingForm, setShowingForm] = useState({ name:'', email:'', phone:'', preferredDate:'', preferredTime:'', message:'' });
  const [showingSubmitted, setShowingSubmitted] = useState(false);
  const [showingSubmitting, setShowingSubmitting] = useState(false);

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    const slug = window.location.pathname.split('/').filter(Boolean).pop() || '';
    Promise.all([
      fetch(`/api/content/items?locale=${loc}&directory=properties`).then(r=>r.json()),
      fetch(`/api/content/items?locale=${loc}&directory=agents`).then(r=>r.json()),
    ]).then(([propsRes, agentsRes]) => {
      const allProps = Array.isArray(propsRes.items) ? propsRes.items : [];
      const p = allProps.find((x: any) => x.slug === slug);
      setProperty(p || null);
      if (p?.listingAgentSlug) {
        const allAgents = Array.isArray(agentsRes.items) ? agentsRes.items as AgentData[] : [];
        setAgent(allAgents.find((a: any) => a.slug === p.listingAgentSlug) || null);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ ...form, agentSlug: property?.listingAgentSlug, propertySlug: property?.slug, category:'property-inquiry', locale }) }).catch(()=>{});
    setSubmitted(true);
  };

  const handleShowingRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property?.slug) return;
    setShowingSubmitting(true);
    await fetch('/api/showing-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...showingForm,
        siteId: 'jinpanghomes',
        locale,
        source: 'property-detail',
        pagePath: window.location.pathname,
        propertySlug: property.slug,
        propertyAddress: property.address,
        agentSlug: property.listingAgentSlug || '',
      }),
    }).catch(() => {});
    trackLeadEvent({
      siteId: 'jinpanghomes',
      locale,
      eventName: 'property_showing_requested',
      source: 'property-detail',
      pagePath: window.location.pathname,
      metadata: { propertySlug: property.slug },
    });
    setShowingSubmitting(false);
    setShowingSubmitted(true);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--secondary)', borderTopColor: 'transparent' }} /></div>;
  if (!property) return <div className="min-h-screen flex items-center justify-center pt-20"><Link href={`/${locale}/properties`} className="btn-gold">← Back to Properties</Link></div>;

  const images = [property.coverImage, ...(property.gallery||[]).map((g: any) => g.image||g)].filter(Boolean);
  const STATUS_LABEL: Record<string,string> = { 'active':'For Sale','pending':'Pending','sold':'Sold','for-lease':'For Lease','coming-soon':'Coming Soon' };
  const virtualTourEmbed = toEmbedUrl(property.virtualTourUrl);

  return (
    <>
      {/* BACK */}
      <div className="pt-20 pb-4" style={{ background: 'var(--primary)' }}>
        <div className="container-custom">
          <Link href={`/${locale}/properties`} className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Properties
          </Link>
        </div>
      </div>

      {/* PHOTO GALLERY */}
      <div style={{ background: 'var(--primary)' }}>
        <div className="container-custom pb-0">
          <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-t-xl">
            {images[activeImage]
              ? <Image src={images[activeImage]} alt={property.address||''} fill className="object-cover" sizes="100vw" priority />
              : <div className="w-full h-full" style={{ background: 'var(--backdrop-mid)' }} />}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto py-3 hide-scrollbar">
              {images.slice(0,8).map((img: string, i: number) => (
                <button key={i} onClick={() => setActiveImage(i)}
                  className={`relative flex-shrink-0 w-20 h-14 overflow-hidden rounded-lg border-2 transition-all ${i === activeImage ? 'border-[var(--secondary)]' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                  <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
            {/* Main */}
            <div>
              {/* Header */}
              <div className="mb-6 pb-6 border-b border-[var(--border)]">
                <div className="flex items-start justify-between flex-wrap gap-3 mb-2">
                  <div>
                    <p className="font-serif text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--secondary)' }}>
                      {property.priceDisplay||(property.price?`$${property.price.toLocaleString()}`:'')}
                    </p>
                    <span className="px-2 py-0.5 text-xs font-semibold text-white rounded mt-1 inline-block" style={{ background: 'var(--status-active)', borderRadius: 'var(--effect-badge-radius)' }}>
                      {STATUS_LABEL[property.status]||property.status}
                    </span>
                  </div>
                  {property.mlsNumber && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>MLS# {property.mlsNumber}</p>}
                </div>
                <h1 className="font-serif text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>{property.address}</h1>
                <p className="flex items-center gap-1 text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  <MapPin className="w-3.5 h-3.5" />{property.city}, {property.state} {property.zip}
                </p>
                <div className="flex flex-wrap gap-5 mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {property.beds&&<span className="flex items-center gap-1.5"><Bed className="w-4 h-4"/><strong style={{color:'var(--primary)'}}>{property.beds}</strong> Bedrooms</span>}
                  {property.baths&&<span className="flex items-center gap-1.5"><Bath className="w-4 h-4"/><strong style={{color:'var(--primary)'}}>{property.baths}</strong> Bathrooms</span>}
                  {property.sqft&&<span className="flex items-center gap-1.5"><Maximize2 className="w-4 h-4"/><strong style={{color:'var(--primary)'}}>{property.sqft.toLocaleString()}</strong> Sq Ft</span>}
                </div>
              </div>

              {/* Key details */}
              {[property.lotSize,property.yearBuilt,property.garage,property.schoolDistrict,property.hoa].some(Boolean) && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-[var(--border)]">
                  {[
                    { l: 'Lot Size', v: property.lotSize },
                    { l: 'Year Built', v: property.yearBuilt },
                    { l: 'Garage', v: property.garage },
                    { l: 'School District', v: property.schoolDistrict },
                    { l: 'HOA', v: property.hoa ? `$${property.hoa}/mo` : 'None' },
                    { l: 'Property Type', v: property.type?.replace(/-/g,' ').replace(/\b\w/g,(c:string)=>c.toUpperCase()) },
                  ].filter(s=>s.v).map((s,i)=>(
                    <div key={i}>
                      <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--text-secondary)' }}>{s.l}</p>
                      <p className="font-medium text-sm mt-0.5" style={{ color: 'var(--primary)' }}>{s.v}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              {property.description && (
                <div className="mb-6 pb-6 border-b border-[var(--border)]">
                  <h2 className="font-serif text-xl font-semibold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>About This Home</h2>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>{property.description}</p>
                </div>
              )}

              {/* Features */}
              {property.features && Object.keys(property.features).length > 0 && (
                <div className="mb-6 pb-6 border-b border-[var(--border)]">
                  <h2 className="font-serif text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>Features & Amenities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {Object.entries(property.features).map(([cat, items]: [string, any]) => (
                      <div key={cat}>
                        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--secondary)' }}>{cat}</p>
                        <ul className="space-y-1">
                          {(items as string[]).map((item: string, i: number) => (
                            <li key={i} className="text-sm" style={{ color: 'var(--text-secondary)' }}>· {item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Virtual tour */}
              {virtualTourEmbed && (
                <div className="mb-6 pb-6 border-b border-[var(--border)]">
                  <h2 className="font-serif text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                    3D Tour & Walkthrough
                  </h2>
                  <div className="rounded-xl overflow-hidden border border-[var(--border)]">
                    <iframe
                      title="Property virtual tour"
                      src={virtualTourEmbed}
                      className="w-full aspect-video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <a
                    href={property.virtualTourUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--primary)' }}
                  >
                    <PlayCircle className="w-4 h-4" />
                    Open virtual tour in new tab
                  </a>
                </div>
              )}

              {/* Mortgage calculator */}
              <div className="mb-6">
                <MortgageCalculator
                  title="Estimate Your Payment"
                  subtitle="Includes principal, interest, taxes, insurance, HOA, and PMI for planning."
                  defaultPrice={property?.price ? String(property.price) : ''}
                />
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-5">
              {/* Listing agent */}
              {agent && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-secondary)' }}>Listed By</p>
                  <AgentCard agent={agent} locale={locale} variant="compact" />
                  <div className="flex gap-2 mt-3">
                    {(agent as any).phone && (
                      <a href={`tel:${(agent as any).phone?.replace(/\D/g,'')}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold border border-[var(--border)] hover:bg-gray-50"
                        style={{ color: 'var(--primary)' }}>
                        <Phone className="w-3.5 h-3.5" /> Call
                      </a>
                    )}
                    {(agent as any).email && (
                      <a href={`mailto:${(agent as any).email}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold border border-[var(--border)] hover:bg-gray-50"
                        style={{ color: 'var(--primary)' }}>
                        <Mail className="w-3.5 h-3.5" /> Email
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Inquiry form */}
              <div className="p-5 bg-white rounded-xl border border-[var(--border)]"
                style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}>
                {submitted ? (
                  <p className="text-sm text-center py-4 font-semibold" style={{ color: 'var(--primary)' }}>Message sent! We'll be in touch shortly.</p>
                ) : (
                  <form onSubmit={handleInquiry} className="space-y-3">
                    <p className="font-semibold text-sm mb-3" style={{ color: 'var(--primary)' }}>Inquire About This Property</p>
                    <input required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Your Name" className="calc-input w-full text-sm" />
                    <input required type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="Email" className="calc-input w-full text-sm" />
                    <input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="Phone (optional)" className="calc-input w-full text-sm" />
                    <textarea value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} placeholder="I'm interested in this property…" className="calc-input w-full text-sm min-h-[80px]" />
                    <button type="submit" className="btn-gold w-full py-2.5 text-sm">Send Message</button>
                  </form>
                )}
              </div>

              {/* Showing request */}
              <div className="p-5 bg-white rounded-xl border border-[var(--border)]"
                style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}>
                {showingSubmitted ? (
                  <p className="text-sm text-center py-4 font-semibold" style={{ color: 'var(--primary)' }}>
                    Showing request sent! We will confirm your appointment shortly.
                  </p>
                ) : (
                  <form onSubmit={handleShowingRequest} className="space-y-3">
                    <p className="font-semibold text-sm mb-3 flex items-center gap-1.5" style={{ color: 'var(--primary)' }}>
                      <Calendar className="w-4 h-4" /> Schedule a Showing
                    </p>
                    <input required value={showingForm.name} onChange={e=>setShowingForm(f=>({...f,name:e.target.value}))} placeholder="Your Name" className="calc-input w-full text-sm" />
                    <input required type="email" value={showingForm.email} onChange={e=>setShowingForm(f=>({...f,email:e.target.value}))} placeholder="Email" className="calc-input w-full text-sm" />
                    <input value={showingForm.phone} onChange={e=>setShowingForm(f=>({...f,phone:e.target.value}))} placeholder="Phone (optional)" className="calc-input w-full text-sm" />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="date" value={showingForm.preferredDate} onChange={e=>setShowingForm(f=>({...f,preferredDate:e.target.value}))} className="calc-input w-full text-sm" />
                      <input value={showingForm.preferredTime} onChange={e=>setShowingForm(f=>({...f,preferredTime:e.target.value}))} placeholder="Preferred time" className="calc-input w-full text-sm" />
                    </div>
                    <textarea value={showingForm.message} onChange={e=>setShowingForm(f=>({...f,message:e.target.value}))} placeholder="Any access notes or requests…" className="calc-input w-full text-sm min-h-[72px]" />
                    <button disabled={showingSubmitting} type="submit" className="btn-gold w-full py-2.5 text-sm disabled:opacity-60">
                      {showingSubmitting ? 'Submitting...' : 'Request Showing'}
                    </button>
                    <Link href={`/${locale}/contact`} className="block text-center text-xs hover:underline" style={{ color: 'var(--text-secondary)' }}>
                      Prefer general contact? Use contact page
                    </Link>
                  </form>
                )}
              </div>

              {/* Compliance */}
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Listed by Jin Pang Homes · License #{process.env.NEXT_PUBLIC_DEFAULT_SITE_ID||'—'} · All information deemed reliable but not guaranteed.
              </p>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

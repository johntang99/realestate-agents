'use client';

import { useState, useEffect } from 'react';
import { Save, User, Phone, Mail, Instagram, Linkedin, Facebook, Star, X, Plus } from 'lucide-react';

const SPECIALTY_OPTIONS = [
  'Buyers', 'Sellers', 'Luxury', 'Investment', 'First-Time Buyers',
  'Relocation', 'Commercial', 'New Construction', 'Multifamily', '1031 Exchange',
];

const LANGUAGE_OPTIONS = [
  'English', 'Spanish', 'Mandarin Chinese', 'Cantonese', 'Korean',
  'French', 'Portuguese', 'Hindi', 'Arabic', 'Russian',
];

interface Testimonial {
  id: string;
  reviewer: string;
  reviewDate: string;
  rating: number;
  text: string;
  transactionType: string;
  verified: boolean;
}

interface AgentData {
  name?: string;
  photo?: string;
  bio?: string;
  phone?: string;
  email?: string;
  social?: { instagram?: string; linkedin?: string; facebook?: string };
  specialties?: string[];
  languages?: string[];
  testimonials?: Testimonial[];
  slug?: string;
  title?: string;
  licenseNumber?: string;
}

export default function AgentProfilePage() {
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/agent-self')
      .then((r) => r.json())
      .then((d) => { setAgent(d.agent || {}); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const update = (key: string, value: unknown) => {
    setAgent((prev) => prev ? { ...prev, [key]: value } : prev);
  };

  const updateSocial = (platform: string, value: string) => {
    setAgent((prev) => prev ? { ...prev, social: { ...(prev.social || {}), [platform]: value } } : prev);
  };

  const toggleSpecialty = (s: string) => {
    const curr = agent?.specialties || [];
    update('specialties', curr.includes(s) ? curr.filter((x) => x !== s) : [...curr, s]);
  };

  const toggleLanguage = (l: string) => {
    const curr = agent?.languages || [];
    update('languages', curr.includes(l) ? curr.filter((x) => x !== l) : [...curr, l]);
  };

  const addTestimonial = () => {
    const curr = agent?.testimonials || [];
    update('testimonials', [...curr, {
      id: `t-${Date.now()}`,
      reviewer: '', reviewDate: new Date().toISOString().slice(0, 7),
      rating: 5, text: '', transactionType: 'buyer', verified: false,
    }]);
  };

  const removeTestimonial = (id: string) => {
    update('testimonials', (agent?.testimonials || []).filter((t) => t.id !== id));
  };

  const updateTestimonial = (id: string, key: string, value: unknown) => {
    update('testimonials', (agent?.testimonials || []).map((t) => t.id === id ? { ...t, [key]: value } : t));
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch('/api/admin/agent-self', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent }),
      });
      if (!res.ok) throw new Error('Save failed');
      setStatus('Saved successfully.');
    } catch {
      setStatus('Error saving. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading your profile…</div>;
  if (!agent) return <div className="p-8 text-gray-500">Profile not found. Contact your broker admin.</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome, {agent.name || 'Agent'}. Update your public profile here.
        </p>
      </div>

      {status && (
        <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${status.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {status}
        </div>
      )}

      <div className="space-y-6">
        {/* Photo */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-700 uppercase mb-4 flex items-center gap-2"><User className="w-4 h-4" /> Professional Photo</h2>
          <div className="flex items-center gap-4">
            {agent.photo && <img src={agent.photo} alt="Photo" className="w-20 h-20 rounded-full object-cover border" />}
            <input
              className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={agent.photo || ''}
              onChange={(e) => update('photo', e.target.value)}
              placeholder="Paste photo URL or use Media Manager"
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">Use the Media Manager to upload a new photo, then paste the URL here.</p>
        </div>

        {/* Bio */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-700 uppercase mb-4">About Me / Bio</h2>
          <textarea
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm min-h-[140px]"
            value={agent.bio || ''}
            onChange={(e) => update('bio', e.target.value)}
            placeholder="Tell your professional story (100–1000 characters)…"
          />
        </div>

        {/* Contact */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-700 uppercase mb-4 flex items-center gap-2"><Phone className="w-4 h-4" /> Contact Info</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Phone</label>
              <input className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={agent.phone || ''} onChange={(e) => update('phone', e.target.value)} placeholder="(845) 555-0100" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Email (public display)</label>
              <input className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={agent.email || ''} onChange={(e) => update('email', e.target.value)} placeholder="you@jinpanghomes.com" />
            </div>
          </div>
        </div>

        {/* Social */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-700 uppercase mb-4">Social Links</h2>
          <div className="space-y-3">
            {[
              { key: 'instagram', label: 'Instagram', icon: Instagram },
              { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
              { key: 'facebook', label: 'Facebook', icon: Facebook },
            ].map(({ key, label, icon: Icon }) => (
              <div key={key} className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={agent.social?.[key as keyof typeof agent.social] || ''}
                  onChange={(e) => updateSocial(key, e.target.value)}
                  placeholder={`https://${key}.com/yourusername`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Specialties */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-700 uppercase mb-4">Specialties</h2>
          <div className="flex flex-wrap gap-2">
            {SPECIALTY_OPTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSpecialty(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  agent.specialties?.includes(s)
                    ? 'bg-[#1A2744] text-white border-[#1A2744]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-700 uppercase mb-4">Languages Spoken</h2>
          <div className="flex flex-wrap gap-2">
            {LANGUAGE_OPTIONS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => toggleLanguage(l)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  agent.languages?.includes(l)
                    ? 'bg-[#C9A96E] text-white border-[#C9A96E]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase flex items-center gap-2"><Star className="w-4 h-4" /> My Testimonials</h2>
            <button type="button" onClick={addTestimonial} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 text-xs hover:bg-gray-50">
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          <div className="space-y-4">
            {(agent.testimonials || []).map((t) => (
              <div key={t.id} className="border border-gray-100 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500">Testimonial</span>
                  <button type="button" onClick={() => removeTestimonial(t.id)} className="text-red-400 hover:text-red-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid gap-2 md:grid-cols-3">
                  <input className="rounded-md border border-gray-200 px-3 py-2 text-sm" value={t.reviewer} onChange={(e) => updateTestimonial(t.id, 'reviewer', e.target.value)} placeholder="Reviewer name" />
                  <input type="month" className="rounded-md border border-gray-200 px-3 py-2 text-sm" value={t.reviewDate} onChange={(e) => updateTestimonial(t.id, 'reviewDate', e.target.value)} />
                  <select className="rounded-md border border-gray-200 px-3 py-2 text-sm bg-white" value={t.transactionType} onChange={(e) => updateTestimonial(t.id, 'transactionType', e.target.value)}>
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                    <option value="investor">Investor</option>
                    <option value="relocator">Relocator</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Rating:</span>
                  {[1,2,3,4,5].map((n) => (
                    <button key={n} type="button" onClick={() => updateTestimonial(t.id, 'rating', n)} className={`w-5 h-5 ${n <= t.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</button>
                  ))}
                </div>
                <textarea
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm min-h-[80px]"
                  value={t.text}
                  onChange={(e) => updateTestimonial(t.id, 'text', e.target.value)}
                  placeholder="Testimonial text…"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pb-8">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
            style={{ background: '#1A2744' }}
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}

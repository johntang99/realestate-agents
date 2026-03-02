'use client';

import { useState } from 'react';
import { type Locale } from '@/lib/i18n';

interface FormField {
  label?: string; labelCn?: string; type?: string; required?: boolean;
  options?: Array<{ value: string; label: string; labelCn?: string }>;
}

interface FormConfig {
  submitLabel?: string; submitLabelCn?: string;
  successMessage?: string; successMessageCn?: string;
  fields?: Record<string, FormField>;
}

interface Props {
  locale: Locale;
  formConfig?: FormConfig;
  siteId: string;
}

export default function ContactForm({ locale, formConfig, siteId }: Props) {
  const isCn = locale === 'zh';
  const tx = (en?: string, cn?: string) => (isCn && cn) ? cn : (en || '');

  const [form, setForm] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const inputClass = "w-full border-b border-[var(--border)] bg-transparent py-2.5 text-sm outline-none focus:border-[var(--secondary)] transition-colors placeholder-[var(--text-secondary)]";
  const labelClass = "block text-xs font-semibold uppercase tracking-wider mb-1 opacity-60";

  const fieldDefs = formConfig?.fields || {};

  const selectOptions = (key: string) =>
    fieldDefs[key]?.options?.map(o => ({ value: o.value, label: tx(o.label, o.labelCn) })) || [];

  const validate = () => {
    const newErrors: Record<string, boolean> = {};
    ['name', 'email', 'message', 'projectType', 'scope'].forEach(k => {
      if (fieldDefs[k]?.required !== false && !form[k]) newErrors[k] = true;
    });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, siteId, locale, type: 'consultation' }),
      });
      if (res.ok) {
        setStatus('success');
        setForm({});
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="py-16 text-center">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--secondary-50)' }}>
          <svg className="w-6 h-6" style={{ color: 'var(--secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <p className="font-serif text-2xl font-semibold mb-3" style={{ color: 'var(--primary)' }}>
          {isCn ? '感谢您！' : 'Thank you!'}
        </p>
        <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
          {tx(formConfig?.successMessage, formConfig?.successMessageCn) || (isCn ? '我们将在24小时内联系您。' : "We'll be in touch within 24 hours.")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* Row: Name + Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        <div>
          <label className={labelClass} style={{ color: 'var(--primary)' }}>{tx(fieldDefs.name?.label, fieldDefs.name?.labelCn) || (isCn ? '姓名' : 'Full Name')} *</label>
          <input type="text" value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder={isCn ? '您的姓名' : 'Your name'} className={`${inputClass} ${errors.name ? 'border-red-400' : ''}`} />
        </div>
        <div>
          <label className={labelClass} style={{ color: 'var(--primary)' }}>{tx(fieldDefs.email?.label, fieldDefs.email?.labelCn) || 'Email'} *</label>
          <input type="email" value={form.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder={isCn ? '您的邮箱' : 'Your email'} className={`${inputClass} ${errors.email ? 'border-red-400' : ''}`} />
        </div>
      </div>

      {/* Row: Phone + Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        <div>
          <label className={labelClass} style={{ color: 'var(--primary)' }}>{tx(fieldDefs.phone?.label, fieldDefs.phone?.labelCn) || (isCn ? '电话' : 'Phone')}</label>
          <input type="tel" value={form.phone || ''} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            placeholder={isCn ? '您的电话' : 'Your phone (optional)'} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} style={{ color: 'var(--primary)' }}>{tx(fieldDefs.location?.label, fieldDefs.location?.labelCn) || (isCn ? '项目地址' : 'Project Location')}</label>
          <input type="text" value={form.location || ''} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
            placeholder={isCn ? '城市/州' : 'City, State'} className={inputClass} />
        </div>
      </div>

      {/* Row: Project Type + Scope */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        <div>
          <label className={labelClass} style={{ color: 'var(--primary)' }}>{tx(fieldDefs.projectType?.label, fieldDefs.projectType?.labelCn) || (isCn ? '项目类型' : 'Project Type')} *</label>
          <select value={form.projectType || ''} onChange={e => setForm(f => ({ ...f, projectType: e.target.value }))}
            className={`${inputClass} appearance-none bg-transparent ${errors.projectType ? 'border-red-400' : ''}`}>
            <option value="">{isCn ? '请选择' : 'Select one'}</option>
            {(selectOptions('projectType').length ? selectOptions('projectType') : [
              { value: 'residential', label: isCn ? '住宅' : 'Residential' },
              { value: 'commercial', label: isCn ? '商业/办公' : 'Commercial / Office' },
              { value: 'exhibition', label: isCn ? '展览/活动' : 'Exhibition / Event' },
              { value: 'furniture', label: isCn ? '仅家具' : 'Furniture Only' },
              { value: 'other', label: isCn ? '其他' : 'Other' },
            ]).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass} style={{ color: 'var(--primary)' }}>{tx(fieldDefs.scope?.label, fieldDefs.scope?.labelCn) || (isCn ? '项目范围' : 'Project Scope')} *</label>
          <select value={form.scope || ''} onChange={e => setForm(f => ({ ...f, scope: e.target.value }))}
            className={`${inputClass} appearance-none bg-transparent ${errors.scope ? 'border-red-400' : ''}`}>
            <option value="">{isCn ? '请选择' : 'Select one'}</option>
            {(selectOptions('scope').length ? selectOptions('scope') : [
              { value: 'full-design', label: isCn ? '全案设计' : 'Full-Service Design' },
              { value: 'room-refresh', label: isCn ? '空间焕新' : 'Room Refresh' },
              { value: 'virtual', label: isCn ? '线上设计' : 'Virtual Design' },
              { value: 'consultation', label: isCn ? '仅咨询' : 'Consultation Only' },
            ]).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Row: Budget + Referral */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        <div>
          <label className={labelClass} style={{ color: 'var(--primary)' }}>{tx(fieldDefs.budget?.label, fieldDefs.budget?.labelCn) || (isCn ? '预算范围' : 'Budget Range')}</label>
          <select value={form.budget || ''} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
            className={`${inputClass} appearance-none bg-transparent`}>
            <option value="">{isCn ? '请选择（可选）' : 'Select (optional)'}</option>
            {[
              { value: 'under-25k', label: isCn ? '$25,000以下' : 'Under $25,000' },
              { value: '25k-75k', label: '$25,000 – $75,000' },
              { value: '75k-200k', label: '$75,000 – $200,000' },
              { value: '200k-plus', label: '$200,000+' },
            ].map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass} style={{ color: 'var(--primary)' }}>{tx(fieldDefs.preferredLanguage?.label, fieldDefs.preferredLanguage?.labelCn) || (isCn ? '首选语言' : 'Preferred Language')}</label>
          <select value={form.preferredLanguage || ''} onChange={e => setForm(f => ({ ...f, preferredLanguage: e.target.value }))}
            className={`${inputClass} appearance-none bg-transparent`}>
            <option value="en">English</option>
            <option value="zh">中文</option>
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label className={labelClass} style={{ color: 'var(--primary)' }}>{tx(fieldDefs.message?.label, fieldDefs.message?.labelCn) || (isCn ? '告诉我们您的愿景' : 'Tell us about your vision')} *</label>
        <textarea rows={5} value={form.message || ''} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          placeholder={isCn ? '请描述您的项目和愿景...' : 'Describe your project, style, and vision...'}
          className={`${inputClass} resize-none ${errors.message ? 'border-red-400' : ''}`} />
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-500">{isCn ? '提交失败，请重试。' : 'Something went wrong. Please try again.'}</p>
      )}

      <button type="submit" disabled={status === 'loading'}
        className="btn-gold text-base px-10 py-4 disabled:opacity-60 disabled:cursor-not-allowed">
        {status === 'loading' ? (isCn ? '发送中...' : 'Sending...') : tx(formConfig?.submitLabel, formConfig?.submitLabelCn) || (isCn ? '提交咨询请求' : 'Request Consultation')}
      </button>
    </form>
  );
}

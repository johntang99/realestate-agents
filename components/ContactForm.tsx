'use client';

import { useState } from 'react';
import { Button, Icon, Input, Textarea, Select } from '@/components/ui';
import { Locale } from '@/lib/types';

interface FormConfig {
  variant?: 'single-column' | 'two-column' | 'multi-step' | 'modal' | 'inline-minimal';
  title: string;
  subtitle: string;
  fields: {
    name: { label: string; placeholder: string; required: boolean };
    email: { label: string; placeholder: string; required: boolean };
    phone: { label: string; placeholder: string; required: boolean };
    reason: { label: string; placeholder: string; required: boolean; options: string[] };
    message: { label: string; placeholder: string; required: boolean };
  };
  submitButton: { text: string };
  successMessage: string;
  errorMessage: string;
}

interface ContactFormProps {
  formConfig: FormConfig;
  locale: Locale;
}

export default function ContactForm({ formConfig, locale }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    reason: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          locale, // Include locale for potential future email localization
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', reason: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (submitStatus !== 'idle') setSubmitStatus('idle');
  };

  const { fields, submitButton, successMessage, errorMessage } = formConfig;
  const variant = formConfig.variant || 'single-column';
  const useTwoColumn = variant === 'two-column';
  const isInlineMinimal = variant === 'inline-minimal';

  return (
    <form onSubmit={handleSubmit} className={isInlineMinimal ? 'space-y-4' : 'space-y-6'}>
      <div className={useTwoColumn ? 'grid md:grid-cols-2 gap-6' : 'space-y-6'}>
        {/* Name */}
        <Input
          label={fields.name.label}
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder={fields.name.placeholder}
          required={fields.name.required}
        />

        {/* Email */}
        <Input
          label={fields.email.label}
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder={fields.email.placeholder}
          required={fields.email.required}
        />

        {/* Phone */}
        <Input
          label={fields.phone.label}
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder={fields.phone.placeholder}
          required={fields.phone.required}
        />

        {/* Reason */}
        <Select
          label={fields.reason.label}
          value={formData.reason}
          onChange={(e) => handleChange('reason', e.target.value)}
          required={fields.reason.required}
        >
          <option value="">{fields.reason.placeholder}</option>
          {fields.reason.options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </div>

      {/* Message */}
      <Textarea
        label={fields.message.label}
        value={formData.message}
        onChange={(e) => handleChange('message', e.target.value)}
        placeholder={fields.message.placeholder}
        rows={isInlineMinimal ? 4 : 6}
        required={fields.message.required}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Icon name="Loader" className="animate-spin mr-2" size="sm" />
            {locale === 'en' ? 'Sending...' : '发送中...'}
          </>
        ) : (
          <>
            <Icon name="Send" className="mr-2" size="sm" />
            {submitButton.text}
          </>
        )}
      </Button>

      {/* Success Message */}
      {submitStatus === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <Icon name="CheckCircle" className="text-green-600 flex-shrink-0" />
          <p className="text-green-800 text-sm">
            {successMessage}
          </p>
        </div>
      )}

      {/* Error Message */}
      {submitStatus === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <Icon name="AlertCircle" className="text-red-600 flex-shrink-0" />
          <p className="text-red-800 text-sm">
            {errorMessage}
          </p>
        </div>
      )}
    </form>
  );
}

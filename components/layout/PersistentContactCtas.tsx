'use client';

import Link from 'next/link';
import { MessageSquare, Phone } from 'lucide-react';

export function PersistentContactCtas({
  locale,
  phone,
  smsPhone,
  ctaHref = '/contact',
  ctaLabel = 'Schedule Consultation',
}: {
  locale: string;
  phone?: string;
  smsPhone?: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  const normalizedPhone = phone ? phone.replace(/\D/g, '') : '';
  const normalizedSms = (smsPhone || phone || '').replace(/\D/g, '');

  return (
    <>
      <div className="hidden md:flex fixed right-5 bottom-5 z-40 items-center gap-2">
        {normalizedPhone ? (
          <a
            href={`tel:${normalizedPhone}`}
            className="px-3 py-2 rounded-md text-sm font-semibold border border-[var(--secondary)] bg-white text-[var(--primary)] hover:bg-[var(--backdrop-mid)] transition-colors"
          >
            <span className="inline-flex items-center gap-1.5">
              <Phone className="w-4 h-4" />
              Call
            </span>
          </a>
        ) : null}
        {normalizedSms ? (
          <a
            href={`sms:${normalizedSms}`}
            className="px-3 py-2 rounded-md text-sm font-semibold border border-[var(--secondary)] bg-white text-[var(--primary)] hover:bg-[var(--backdrop-mid)] transition-colors"
          >
            <span className="inline-flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" />
              Text
            </span>
          </a>
        ) : null}
        <Link href={`/${locale}${ctaHref}`} className="btn-gold px-4 py-2.5 text-sm shadow-md">
          {ctaLabel}
        </Link>
      </div>

      <div className="md:hidden fixed left-0 right-0 bottom-0 z-40 bg-white border-t border-[var(--border)] safe-area-pb">
        <div className="grid grid-cols-3 gap-2 p-2">
          <a
            href={normalizedPhone ? `tel:${normalizedPhone}` : '#'}
            className={`h-10 rounded-md text-xs font-semibold flex items-center justify-center ${
              normalizedPhone ? 'border border-[var(--secondary)] text-[var(--primary)]' : 'border border-gray-200 text-gray-400 pointer-events-none'
            }`}
          >
            <span className="inline-flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              Call
            </span>
          </a>
          <a
            href={normalizedSms ? `sms:${normalizedSms}` : '#'}
            className={`h-10 rounded-md text-xs font-semibold flex items-center justify-center ${
              normalizedSms ? 'border border-[var(--secondary)] text-[var(--primary)]' : 'border border-gray-200 text-gray-400 pointer-events-none'
            }`}
          >
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              Text
            </span>
          </a>
          <Link href={`/${locale}${ctaHref}`} className="h-10 rounded-md text-xs font-semibold flex items-center justify-center btn-gold">
            {ctaLabel}
          </Link>
        </div>
      </div>
    </>
  );
}

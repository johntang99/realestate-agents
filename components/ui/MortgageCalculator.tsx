'use client';

import { useMemo, useState } from 'react';

type MortgageCalculatorProps = {
  title?: string;
  subtitle?: string;
  defaultPrice?: string;
};

function toNumber(value: string) {
  const parsed = Number(value.replace(/,/g, '').trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

export function MortgageCalculator({
  title = 'Estimate Your Monthly Payment',
  subtitle = 'Calculator for planning only. Final amounts depend on lender terms and local taxes.',
  defaultPrice = '',
}: MortgageCalculatorProps) {
  const [form, setForm] = useState({
    price: defaultPrice,
    downPercent: '20',
    rate: '6.75',
    termYears: '30',
    taxAnnual: '',
    insuranceMonthly: '',
    hoaMonthly: '',
    pmiMonthly: '',
  });

  const result = useMemo(() => {
    const price = toNumber(form.price);
    const downPercent = toNumber(form.downPercent);
    const annualRate = toNumber(form.rate);
    const termYears = toNumber(form.termYears);
    const taxAnnual = toNumber(form.taxAnnual);
    const insuranceMonthly = toNumber(form.insuranceMonthly);
    const hoaMonthly = toNumber(form.hoaMonthly);
    const pmiMonthly = toNumber(form.pmiMonthly);

    const downPayment = price * (downPercent / 100);
    const principal = Math.max(0, price - downPayment);
    const monthlyRate = annualRate / 100 / 12;
    const months = Math.max(1, Math.round(termYears * 12));

    let principalAndInterest = 0;
    if (principal > 0 && monthlyRate > 0) {
      principalAndInterest =
        principal *
        ((monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1));
    } else if (principal > 0) {
      principalAndInterest = principal / months;
    }

    const taxMonthly = taxAnnual / 12;
    const totalMonthly =
      principalAndInterest + taxMonthly + insuranceMonthly + hoaMonthly + pmiMonthly;

    return {
      principalAndInterest,
      taxMonthly,
      insuranceMonthly,
      hoaMonthly,
      pmiMonthly,
      totalMonthly,
      hasValidPrice: price > 0,
    };
  }, [form]);

  const inputCls =
    'calc-input w-full text-sm';

  return (
    <div
      className="bg-white p-7 rounded-2xl border border-[var(--border)]"
      style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}
    >
      <div className="text-center mb-6">
        <h3
          className="font-serif text-2xl font-semibold"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}
        >
          {title}
        </h3>
        <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Home Price ($)</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            placeholder="875000"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Down Payment (%)</label>
          <input
            type="number"
            value={form.downPercent}
            onChange={(e) => setForm((f) => ({ ...f, downPercent: e.target.value }))}
            placeholder="20"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Interest Rate (%)</label>
          <input
            type="number"
            value={form.rate}
            onChange={(e) => setForm((f) => ({ ...f, rate: e.target.value }))}
            placeholder="6.75"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Loan Term (years)</label>
          <input
            type="number"
            value={form.termYears}
            onChange={(e) => setForm((f) => ({ ...f, termYears: e.target.value }))}
            placeholder="30"
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Property Tax / year ($)</label>
          <input
            type="number"
            value={form.taxAnnual}
            onChange={(e) => setForm((f) => ({ ...f, taxAnnual: e.target.value }))}
            placeholder="12000"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Insurance / month ($)</label>
          <input
            type="number"
            value={form.insuranceMonthly}
            onChange={(e) => setForm((f) => ({ ...f, insuranceMonthly: e.target.value }))}
            placeholder="180"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">HOA / month ($)</label>
          <input
            type="number"
            value={form.hoaMonthly}
            onChange={(e) => setForm((f) => ({ ...f, hoaMonthly: e.target.value }))}
            placeholder="0"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">PMI / month ($)</label>
          <input
            type="number"
            value={form.pmiMonthly}
            onChange={(e) => setForm((f) => ({ ...f, pmiMonthly: e.target.value }))}
            placeholder="0"
            className={inputCls}
          />
        </div>
      </div>

      {result.hasValidPrice && (
        <div className="rounded-xl p-5" style={{ background: 'var(--backdrop-light)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-secondary)' }}>
            Estimated Total Monthly
          </p>
          <p
            className="font-serif text-4xl font-bold"
            style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}
          >
            ${Math.round(result.totalMonthly).toLocaleString()}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4 text-xs">
            <p style={{ color: 'var(--text-secondary)' }}>P&I: ${Math.round(result.principalAndInterest).toLocaleString()}</p>
            <p style={{ color: 'var(--text-secondary)' }}>Tax: ${Math.round(result.taxMonthly).toLocaleString()}</p>
            <p style={{ color: 'var(--text-secondary)' }}>Ins: ${Math.round(result.insuranceMonthly).toLocaleString()}</p>
            <p style={{ color: 'var(--text-secondary)' }}>HOA: ${Math.round(result.hoaMonthly).toLocaleString()}</p>
            <p style={{ color: 'var(--text-secondary)' }}>PMI: ${Math.round(result.pmiMonthly).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';

const DEFAULT_FAQ = {
  Buyers: [
    { q: 'Do I need a buyer\'s agent?', a: 'Yes — in New York, buyer representation is strongly recommended and is typically paid by the seller at no cost to you.' },
    { q: 'How long does the buying process take?', a: 'From accepted offer to closing typically takes 60–90 days. The search itself varies based on your criteria and the market.' },
    { q: 'What credit score do I need?', a: 'Most conventional loans require a minimum 620 score. FHA loans may allow lower scores. Your lender will advise based on your full profile.' },
    { q: 'How much should I put down?', a: '20% avoids PMI on conventional loans. FHA allows 3.5% down. VA loans allow 0% for qualifying veterans. Programs also exist for down payment assistance.' },
  ],
  Sellers: [
    { q: 'When is the best time to sell in Orange County?', a: 'Spring (March–June) is typically the most active season. However, well-priced homes sell in any season — serious buyers exist year-round.' },
    { q: 'How do you determine listing price?', a: 'We prepare a comprehensive Comparative Market Analysis (CMA) examining recent comparable sales, active competition, and current market trends.' },
    { q: 'What should I do to prepare my home?', a: 'Focus on curb appeal, decluttering, deep cleaning, and minor repairs. We provide a specific staging consultation before your listing.' },
    { q: 'What are your fees?', a: 'Standard brokerage commission applies. We discuss specifics in your free listing consultation. Our results consistently justify our approach.' },
  ],
  Investors: [
    { q: 'What cap rates can I expect in Orange County?', a: 'Current Orange County cap rates range from approximately 4–7% depending on property type, location, and condition. Multi-family properties in emerging areas can reach higher yields.' },
    { q: 'Do you have access to off-market properties?', a: 'Yes — our agent network surfaces off-market deals regularly. Sign up for our off-market investor list on the Investing page.' },
    { q: 'Do you assist with 1031 exchanges?', a: 'Yes — we work with qualified intermediaries to facilitate 1031 exchanges and can coordinate the full process on both the sell and buy sides.' },
  ],
  Relocating: [
    { q: 'How do I choose which Orange County town to live in?', a: 'We help you prioritize: school district, commute time, budget, lifestyle, and community. Each town has a distinct character — our agents can walk you through each one.' },
    { q: 'Are Orange County property taxes really that high?', a: 'Yes — Orange County has among the highest property taxes in the US. Budget them from day one. The tradeoff: exceptional schools, infrastructure, and community quality.' },
    { q: 'Can international buyers purchase property in Orange County?', a: 'Yes — foreigners can purchase US real estate. Requirements differ for financing. We can connect you with lenders and attorneys experienced in international transactions.' },
  ],
  'Joining the Team': [
    { q: 'Is Jin Pang Homes hiring new agents?', a: 'We\'re always evaluating qualified candidates. Fill out the form on our Join page and our broker will be in touch.' },
    { q: 'What makes Jin Pang Homes different from a franchise?', a: 'Independent model, personal mentorship, competitive splits, real marketing support, and a culture where agents are treated as professionals — not numbers.' },
  ],
};

export default function FAQPage() {
  const [d, setD] = useState<any>({});
  const [locale, setLocale] = useState('en');
  const [activeSection, setActiveSection] = useState(Object.keys(DEFAULT_FAQ)[0]);
  const [openItem, setOpenItem] = useState<number | null>(null);

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    fetch(`/api/content/file?locale=${loc}&path=pages/faq.json`).then(r=>r.json())
      .then(res => { try { setD(JSON.parse(res.content||'{}')); } catch {} });
  }, []);

  const sections = Object.keys(DEFAULT_FAQ);
  const items = DEFAULT_FAQ[activeSection as keyof typeof DEFAULT_FAQ] || [];

  return (
    <>
      <section className="relative pt-20" style={{ minHeight: '36vh', background: 'var(--primary)' }}>
        <div className="container-custom pt-14 pb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Help Center</p>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white" style={{ fontFamily: 'var(--font-heading)' }}>Frequently Asked Questions</h1>
          <p className="text-white/70 mt-3">Quick answers for buyers, sellers, investors, relocators, and prospective agents.</p>
        </div>
      </section>

      <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
            {/* Sidebar */}
            <nav className="space-y-1">
              {sections.map(section => (
                <button key={section} onClick={() => { setActiveSection(section); setOpenItem(null); }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === section ? 'text-white' : 'hover:bg-white'}`}
                  style={activeSection === section ? { background: 'var(--secondary)', color: 'white' } : { color: 'var(--text-secondary)' }}>
                  {section}
                </button>
              ))}
            </nav>

            {/* FAQ accordion */}
            <div className="space-y-3">
              <h2 className="font-serif text-2xl font-semibold mb-5" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>{activeSection}</h2>
              {items.map((item, i) => (
                <div key={i} className="bg-white rounded-xl border border-[var(--border)] overflow-hidden"
                  style={{ borderRadius: 'var(--effect-card-radius)' }}>
                  <button className="w-full flex items-center justify-between p-5 text-left"
                    onClick={() => setOpenItem(openItem === i ? null : i)}>
                    <span className="font-semibold text-sm pr-4" style={{ color: 'var(--primary)' }}>{item.q}</span>
                    {openItem === i ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--secondary)' }} />
                      : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />}
                  </button>
                  {openItem === i && (
                    <div className="px-5 pb-5 text-sm" style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>{item.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-white border-t border-[var(--border)]">
        <div className="container-custom text-center">
          <h2 className="font-serif text-xl font-semibold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>Still Have Questions?</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Our agents are available 7 days a week. We'll get back to you within 2 hours.</p>
          <Link href={`/${locale}/contact`} className="btn-gold inline-block">Contact Us</Link>
        </div>
      </section>
    </>
  );
}

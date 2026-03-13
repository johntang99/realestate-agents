import Link from 'next/link';
import { Instagram, Facebook, Linkedin, Youtube } from 'lucide-react';
import type { Locale } from '@/lib/i18n';

export interface JuliaFooterData {
  tagline?: string;
  taglineCn?: string;
  columns?: Array<{
    title: string; titleCn?: string;
    links: Array<{ label: string; labelCn?: string; href: string }>;
  }>;
  newsletter?: { enabled?: boolean; headline?: string; headlineCn?: string; subline?: string; sublineCn?: string; submitLabel?: string };
  compliance?: {
    showEqualHousingLogo?: boolean;
    showMlsDisclaimer?: boolean;
    showLicenseNumber?: boolean;
    showBrokerageLogo?: boolean;
  };
  legalLinks?: Array<{ label: string; labelCn?: string; href: string }>;
  copyright?: string;
}

interface FooterProps {
  locale: Locale;
  siteId: string;
  footer?: JuliaFooterData | Record<string, unknown>;
  siteInfo?: Record<string, unknown> | null;
}

export default function Footer({ locale, footer, siteInfo }: FooterProps) {
  const data = (footer ?? {}) as JuliaFooterData;
  const isCn = locale === 'zh';
  const tx = (en?: string, cn?: string) => (isCn && cn) ? cn : (en || '');

  const year = new Date().getFullYear();
  // Support both old tagline field and first-column content field
  const tagline = tx(data.tagline, data.taglineCn)
    || ((data as any).columns?.[0]?.content as string | undefined)
    || '';
  const brokerageName = (siteInfo as any)?.name || (siteInfo as any)?.brokerage?.name || 'Jin Pang Homes';
  const copyright = (data as any).compliance?.copyrightYear
    ? `© ${(data as any).compliance.copyrightYear} ${(data as any).compliance.brokerageName || brokerageName}. ${(data as any).compliance.copyrightSuffix || 'All rights reserved.'}`
    : data.copyright || `© ${year} ${brokerageName}. All rights reserved.`;

  // Support both socialLinks and social field names
  const social = (siteInfo as any)?.social || (siteInfo as any)?.socialLinks || {};

  const licenseNumber =
    ((siteInfo as any)?.licenseNumber as string | undefined) ||
    ((siteInfo as any)?.license?.licenseNumber as string | undefined);
  const principalBrokerLicense = (siteInfo as any)?.license?.principalBrokerLicense as string | undefined;
  const mlsDisclaimer = (siteInfo as any)?.compliance?.mlsDisclaimer as string | undefined;
  const fairHousingStatement = (siteInfo as any)?.compliance?.fairHousingStatement as string | undefined;
  const equalHousingText = (siteInfo as any)?.compliance?.equalHousingText as string | undefined;
  const brokerageAddress = (data as any)?.compliance?.brokerageAddress as string | undefined;

  const defaultColumns: JuliaFooterData['columns'] = [
    { title: 'Properties', links: [
      { label: 'All Listings', href: '/properties' },
      { label: 'For Sale', href: '/properties?status=for-sale' },
      { label: 'Sold Portfolio', href: '/sold' },
      { label: 'Neighborhoods', href: '/neighborhoods' },
    ]},
    { title: 'Services', links: [
      { label: 'Buying', href: '/services#buying' },
      { label: 'Selling', href: '/services#selling' },
      { label: 'Leasing', href: '/services#leasing' },
      { label: 'Commercial', href: '/services#commercial' },
      { label: 'Investment', href: '/services#investment' },
    ]},
    { title: 'Resources', links: [
      { label: 'Blog & Insights', href: '/blog' },
      { label: 'Market Reports', href: '/market-reports' },
      { label: "Buyer's Guide", href: '/buyers-guide' },
      { label: "Seller's Guide", href: '/sellers-guide' },
      { label: 'FAQ', href: '/faq' },
    ]},
    { title: 'Connect', links: [
      { label: 'Contact Me', href: '/contact' },
      { label: 'Home Valuation', href: '/home-valuation' },
      { label: 'About', href: '/about' },
      { label: 'Testimonials', href: '/testimonials' },
      { label: 'Press & Awards', href: '/press' },
    ]},
  ];

  const columns = data.columns || defaultColumns;
  const newsletter = data.newsletter;
  const compliance = data.compliance;

  return (
    <footer style={{ background: 'var(--backdrop-secondary, #1A1A1A)', color: 'var(--text-on-dark, #FFFFFF)' }}>
      <div className="container-custom py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand col */}
          <div className="lg:col-span-1">
            <div className="font-serif text-xl font-semibold mb-3" style={{ color: 'var(--text-on-dark)' }}>
              {brokerageName}
            </div>
            {tagline && <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--on-dark-medium)' }}>{tagline}</p>}

            {/* Social icons */}
            <div className="flex gap-4">
              {social?.instagram && (
                <a href={social.instagram} target="_blank" rel="noreferrer"
                  className="hover:text-[var(--secondary)] transition-colors" style={{ color: 'var(--on-dark-subtle)' }}>
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {social?.facebook && (
                <a href={social.facebook} target="_blank" rel="noreferrer"
                  className="hover:text-[var(--secondary)] transition-colors" style={{ color: 'var(--on-dark-subtle)' }}>
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {social?.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noreferrer"
                  className="hover:text-[var(--secondary)] transition-colors" style={{ color: 'var(--on-dark-subtle)' }}>
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {social?.youtube && (
                <a href={social.youtube} target="_blank" rel="noreferrer"
                  className="hover:text-[var(--secondary)] transition-colors" style={{ color: 'var(--on-dark-subtle)' }}>
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Nav columns */}
          {columns.filter((col) => Array.isArray((col as any).links)).map((col) => (
            <div key={(col as any).heading || col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--secondary)' }}>
                {isCn ? (col.titleCn || (col as any).heading || col.title) : ((col as any).heading || col.title)}
              </h4>
              <ul className="space-y-2.5">
                {((col as any).links as Array<{ label: string; labelCn?: string; href: string }>).map((link) => (
                  <li key={link.href}>
                    <Link href={`/${locale}${link.href}`}
                      className="text-sm hover:text-white transition-colors"
                      style={{ color: 'var(--on-dark-medium)' }}>
                      {isCn ? (link.labelCn || link.label) : link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        {newsletter?.enabled !== false && newsletter && (
          <div className="mt-12 pt-10 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="max-w-md">
              <p className="font-serif text-base font-semibold mb-1" style={{ color: 'var(--text-on-dark)' }}>
                {tx(newsletter.headline, newsletter.headlineCn) || 'Get Market Updates'}
              </p>
              {newsletter.subline && <p className="text-sm mb-4" style={{ color: 'var(--on-dark-medium)' }}>{tx(newsletter.subline, newsletter.sublineCn)}</p>}
              <div className="flex gap-2">
                <input type="email" placeholder="Your email address"
                  className="flex-1 rounded-sm px-3 py-2 text-sm outline-none focus:border-[var(--secondary)]"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--text-on-dark)' }} />
                <button className="px-4 py-2 text-xs font-semibold rounded-sm"
                  style={{ background: 'var(--secondary)', color: '#1A1A1A' }}>
                  {newsletter.submitLabel || 'Subscribe'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Compliance row — REQUIRED for real estate */}
      {(compliance?.showEqualHousingLogo || compliance?.showLicenseNumber || compliance?.showMlsDisclaimer || licenseNumber || fairHousingStatement || equalHousingText) && (
        <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)' }}>
          <div className="container-custom py-6">
            <div className="flex flex-wrap items-start gap-6">
              {/* Equal Housing symbol */}
              {compliance?.showEqualHousingLogo !== false && (
                <div className="flex-shrink-0 flex items-center gap-2">
                  <div className="w-8 h-8 border-2 border-white/30 rounded flex items-center justify-center">
                    <span className="font-bold text-xs text-white/60">⊜</span>
                  </div>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Equal Housing<br />Opportunity</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                {licenseNumber && compliance?.showLicenseNumber !== false && (
                  <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    License: {licenseNumber}
                  </p>
                )}
                {((data as any).compliance?.brokerageName || brokerageName || brokerageAddress) && (
                  <p className="text-xs mb-2 leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Brokerage: {(data as any).compliance?.brokerageName || brokerageName}
                    {brokerageAddress ? `, ${brokerageAddress}` : ''}
                  </p>
                )}
                {principalBrokerLicense && (
                  <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Principal Broker License: {principalBrokerLicense}
                  </p>
                )}
                {equalHousingText && (
                  <p className="text-xs mb-2 leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {equalHousingText}
                  </p>
                )}
                {fairHousingStatement && (
                  <p className="text-xs mb-2 leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {fairHousingStatement}
                  </p>
                )}
                {mlsDisclaimer && compliance?.showMlsDisclaimer !== false && (
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {mlsDisclaimer}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="container-custom py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: 'var(--text-on-dark)' }}>{copyright}</p>
          <div className="flex gap-5 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {(data.legalLinks || [
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
            ]).map(link => (
              <Link key={link.href} href={`/${locale}${link.href}`}
                className="transition-colors hover:opacity-80">
                {isCn ? (link.labelCn || link.label) : link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

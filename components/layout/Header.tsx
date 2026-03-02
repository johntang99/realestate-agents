'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Phone,
  MessageSquare,
  MapPin,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from 'lucide-react';
import type { Locale } from '@/lib/i18n';

export interface JuliaHeaderConfig {
  logo?: string;
  logoText?: string;
  navigation?: Array<{
    label: string; labelCn?: string; href: string;
    children?: Array<{ label: string; labelCn?: string; href: string }>;
  }>;
  ctaButton?: { label?: string; labelCn?: string; href?: string; variant?: string };
  showLanguageSwitcher?: boolean;
  showPhone?: boolean;
  transparentOnHero?: boolean;
}

interface HeaderProps {
  locale: Locale;
  siteId: string;
  siteInfo?: Record<string, unknown> | null;
  headerConfig?: JuliaHeaderConfig | null;
}

export default function Header({ locale, siteInfo, headerConfig }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const config = headerConfig || {};
  const transparentOnHero = config.transparentOnHero !== false;
  const phone = (siteInfo as any)?.phone as string | undefined;
  const smsPhone = (siteInfo as any)?.smsPhone as string | undefined;
  const email = (siteInfo as any)?.email as string | undefined;
  const address =
    (siteInfo as any)?.address?.full ||
    [((siteInfo as any)?.address?.street || ''), ((siteInfo as any)?.address?.city || ''), ((siteInfo as any)?.address?.state || '')]
      .filter(Boolean)
      .join(', ');
  const social = ((siteInfo as any)?.social || {}) as Record<string, string>;
  const navItems = config.navigation || [
    { label: 'Buy', href: '/buying' },
    { label: 'Sell', href: '/selling' },
    { label: 'Invest', href: '/investing' },
    { label: 'Relocate', href: '/relocating' },
    { label: 'Properties', href: '/properties' },
    { label: 'Blog', href: '/knowledge-center' },
    { label: 'About Jin Pang', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];
  const cta = config.ctaButton || { label: 'Schedule Consultation', href: '/contact' };
  const logoText = config.logoText || (siteInfo as any)?.name || 'Alexandra Reeves';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const pathWithoutLocale = (pathname || '/').replace(/^\/(en|zh)(?=\/|$)/, '') || '/';
  const isHomeRoute = pathWithoutLocale === '/';
  const allowTransparent = transparentOnHero && isHomeRoute;
  const isSolid = !allowTransparent || scrolled || mobileOpen;
  const showLanguageSwitcher = config.showLanguageSwitcher !== false;
  const enHref = `/en${pathWithoutLocale}`;
  const zhHref = `/zh${pathWithoutLocale}`;
  const transparentHeaderBackground =
    'linear-gradient(to bottom, rgba(7, 16, 30, 0.52) 0%, rgba(7, 16, 30, 0.3) 45%, rgba(7, 16, 30, 0) 100%)';

  const navLink = `text-sm font-medium transition-colors hover:opacity-70 ${isSolid ? '' : 'text-white'}`;
  const topbarLinkColor = isSolid ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.9)';
  const topbarTextColor = isSolid ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.78)';
  const socialLinks = [
    { key: 'facebook', href: social.facebook, Icon: Facebook, label: 'Facebook' },
    { key: 'instagram', href: social.instagram, Icon: Instagram, label: 'Instagram' },
    { key: 'linkedin', href: social.linkedin, Icon: Linkedin, label: 'LinkedIn' },
    { key: 'youtube', href: social.youtube, Icon: Youtube, label: 'YouTube' },
  ].filter((item) => typeof item.href === 'string' && item.href.trim().length > 0);
  const showTopbar = Boolean(address || email || phone || smsPhone || socialLinks.length > 0);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: isSolid ? 'white' : transparentHeaderBackground,
          boxShadow: isSolid ? '0 1px 20px rgba(0,0,0,0.08)' : 'none',
          backdropFilter: 'none',
          borderBottom: 'none',
        }}
      >
        {showTopbar && (
          <div
            className="hidden lg:block border-b border-white/15"
            style={{ background: isSolid ? 'var(--primary)' : 'rgba(10, 20, 35, 0.72)' }}
          >
            <div className="container-custom h-9 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4 xl:gap-5 min-w-0">
                {address ? (
                  <span className="flex items-center gap-1.5 truncate" style={{ color: topbarTextColor }}>
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{address}</span>
                  </span>
                ) : null}
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="hidden xl:flex items-center gap-1.5 transition-opacity hover:opacity-75"
                    style={{ color: topbarLinkColor }}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {email}
                  </a>
                ) : null}
                {phone ? (
                  <a
                    href={`tel:${phone.replace(/\D/g, '')}`}
                    className="flex items-center gap-1.5 transition-opacity hover:opacity-75"
                    style={{ color: topbarLinkColor }}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {phone}
                  </a>
                ) : null}
                {smsPhone ? (
                  <a
                    href={`sms:${smsPhone.replace(/\D/g, '')}`}
                    className="flex items-center gap-1.5 transition-opacity hover:opacity-75"
                    style={{ color: topbarLinkColor }}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Text
                  </a>
                ) : null}
              </div>
              <div className="flex items-center gap-3">
                {socialLinks.length > 0 ? (
                  <div className="flex items-center gap-2.5">
                    {socialLinks.map(({ key, href, Icon, label }) => (
                      <a
                        key={key}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={label}
                        className="transition-opacity hover:opacity-75"
                        style={{ color: topbarLinkColor }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </a>
                    ))}
                  </div>
                ) : null}
                {showLanguageSwitcher ? (
                  <div className="flex items-center gap-1.5 pl-3 border-l border-white/20">
                    <Link
                      href={enHref}
                      className="text-[11px] font-semibold tracking-wide transition-opacity hover:opacity-75"
                      style={{ color: locale === 'en' ? topbarLinkColor : topbarTextColor }}
                    >
                      EN
                    </Link>
                    <span style={{ color: topbarTextColor }}>/</span>
                    <Link
                      href={zhHref}
                      className="text-[11px] font-semibold tracking-wide transition-opacity hover:opacity-75"
                      style={{ color: locale === 'zh' ? topbarLinkColor : topbarTextColor }}
                    >
                      中文
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}

        <div className="container-custom flex items-center justify-between h-16">

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3 flex-shrink-0">
            {(() => {
              const logoSrc = typeof config.logo === 'string' ? config.logo : (config.logo as any)?.src;
              return logoSrc ? (
                <img src={logoSrc} alt={logoText} className="h-8 w-auto" />
              ) : (
                <span className="font-serif text-lg font-semibold tracking-wide transition-colors"
                  style={{ color: isSolid ? 'var(--primary)' : 'rgba(255,255,255,0.96)', textShadow: isSolid ? 'none' : '0 1px 8px rgba(0,0,0,0.35)' }}>
                  {logoText}
                </span>
              );
            })()}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map(item => (
              <Link key={item.href} href={`/${locale}${item.href}`}
                className={navLink}
                style={{ color: isSolid ? 'var(--primary)' : '#ffffff', textShadow: isSolid ? 'none' : '0 1px 2px rgba(0,0,0,0.45)' }}>
                {locale === 'zh' ? (item.labelCn || item.label) : item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right */}
          <div className="hidden lg:flex items-center gap-4">
            {cta.href && (
              <Link href={`/${locale}${cta.href}`} className="btn-gold text-xs px-5 py-2.5">
                {locale === 'zh' ? (cta.labelCn || cta.label) : (cta.label || 'Schedule Consultation')}
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen
              ? <X className="w-6 h-6" style={{ color: 'white' }} />
              : <Menu className="w-6 h-6" style={{ color: isSolid ? 'var(--primary)' : 'rgba(255,255,255,0.96)', filter: isSolid ? 'none' : 'drop-shadow(0 1px 6px rgba(0,0,0,0.35))' }} />}
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 flex flex-col transition-all duration-300 lg:hidden ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'var(--primary)' }}
      >
        <div className="flex items-center justify-between px-6 h-16">
          <span className="font-serif text-lg font-semibold text-white">{logoText}</span>
          <button onClick={() => setMobileOpen(false)}>
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-6 py-6 flex-1">
          {navItems.map(item => (
            <Link key={item.href} href={`/${locale}${item.href}`}
              onClick={() => setMobileOpen(false)}
              className="font-serif text-2xl font-medium text-white py-3 border-b border-white/10 hover:opacity-70 transition-opacity">
              {locale === 'zh' ? (item.labelCn || item.label) : item.label}
            </Link>
          ))}
        </nav>
        <div className="px-6 pb-10 space-y-4">
          {phone && (
            <a href={`tel:${phone.replace(/\D/g, '')}`}
              className="flex items-center gap-2 text-white/70 text-sm font-medium">
              <Phone className="w-4 h-4" />{phone}
            </a>
          )}
          {(siteInfo as any)?.smsPhone && (
            <a href={`sms:${String((siteInfo as any).smsPhone).replace(/\D/g, '')}`}
              className="flex items-center gap-2 text-white/70 text-sm font-medium">
              <MessageSquare className="w-4 h-4" />Text
            </a>
          )}
          {cta.href && (
            <Link href={`/${locale}${cta.href}`} onClick={() => setMobileOpen(false)}
              className="block w-full btn-gold text-center py-3.5">
              {cta.label || 'Schedule Consultation'}
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

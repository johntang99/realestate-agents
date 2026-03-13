'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Star,
  Search,
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Phone,
} from 'lucide-react';
import { GoalEntryPaths } from '@/components/sections/GoalEntryPaths';
import { TrustPromise } from '@/components/sections/TrustPromise';
import VideoSplash from '@/components/VideoSplash';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Slide {
  image?: string;
  video?: string;
  poster?: string;
  alt?: string;
}
interface StatItem {
  value?: string;
  label?: string;
  prefix?: string;
  suffix?: string;
}
interface Property {
  slug: string;
  address?: string;
  city?: string;
  state?: string;
  price?: number;
  priceDisplay?: string;
  status?: string;
  type?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  coverImage?: string;
  featured?: boolean;
  listingAgentSlug?: string;
  soldDetails?: { soldPrice?: number; soldDate?: string };
}
interface Neighborhood {
  slug: string;
  name?: string;
  tagline?: string;
  coverImage?: string;
  marketSnapshot?: { medianPrice?: string };
}
interface Testimonial {
  id?: string;
  quote?: string;
  text?: string;
  reviewer?: string;
  author?: string;
  title?: string;
  rating?: number;
  agentSlug?: string;
}
interface KnowledgePost {
  slug: string;
  title?: string;
  category?: string;
  publishDate?: string;
  heroImage?: string;
  excerpt?: string;
  readTime?: string;
}
interface SiteData {
  name?: string;
  stats?: Record<string, string>;
  phone?: string;
}

interface HomeData {
  hero?: {
    variant?: string;
    slides?: Slide[];
    frontVideoEnabled?: boolean;
    frontVideoUrl?: string;
    headline?: string;
    subline?: string;
    ctaPrimary?: { label?: string; href?: string };
    ctaSecondary?: { label?: string; href?: string };
    overlayOpacity?: number;
  };
  goalPaths?: {
    headline?: string;
    items?: Array<{
      label: string;
      subline?: string;
      href: string;
      icon: string;
    }>;
  };
  statsBar?: { variant?: string; items?: StatItem[] };
  intro?: {
    headline?: string;
    body?: string;
    ctaLabel?: string;
    ctaHref?: string;
    image?: string;
  };
  whyChooseUs?: {
    headline?: string;
    items?: Array<{ icon?: string; heading?: string; description?: string }>;
  };
  teamPreview?: {
    headline?: string;
    subline?: string;
    ctaLabel?: string;
    ctaHref?: string;
    agentSlugs?: string[];
  };
  testimonialStrip?: { headline?: string; testimonialIds?: string[] };
  neighborhoodSpotlight?: {
    headline?: string;
    subline?: string;
    ctaLabel?: string;
    ctaHref?: string;
    neighborhoodSlugs?: string[];
  };
  marketReportTeaser?: {
    headline?: string;
    subline?: string;
    keyStat?: string;
    ctaLabel?: string;
    ctaHref?: string;
  };
  knowledgeCenterPreview?: {
    headline?: string;
    ctaLabel?: string;
    ctaHref?: string;
    postSlugs?: string[];
  };
  consultationCta?: {
    headline?: string;
    subline?: string;
    ctaLabel?: string;
    ctaHref?: string;
    backgroundImage?: string;
    reviewQuote?: { text?: string; author?: string; source?: string };
  };
  contactForm?: { headline?: string; subline?: string };
  featuredListings?: {
    headline?: string;
    subline?: string;
    ctaLabel?: string;
    ctaHref?: string;
    maxDisplay?: number;
    propertySlugs?: string[];
  };
}

// ── Status helpers ─────────────────────────────────────────────────────────────
const STATUS_BADGE: Record<string, string> = {
  active: 'bg-[var(--status-active)]',
  pending: 'bg-[var(--status-pending)]',
  sold: 'bg-[var(--status-sold)]',
  'for-lease': 'bg-[var(--status-lease)]',
  'coming-soon': 'bg-[var(--status-coming-soon)]',
};
const STATUS_LABELS: Record<string, Record<string, string>> = {
  en: {
    active: 'For Sale',
    pending: 'Pending',
    sold: 'Sold',
    'for-lease': 'For Lease',
    'coming-soon': 'Coming Soon',
  },
  zh: {
    active: '在售',
    pending: '待定',
    sold: '已售',
    'for-lease': '出租',
    'coming-soon': '即将上市',
  },
};

// ── Property Card ──────────────────────────────────────────────────────────────
function PropertyCard({ p, locale }: { p: Property; locale: string }) {
  const statusLabels = locale === 'zh' ? STATUS_LABELS.zh : STATUS_LABELS.en;
  return (
    <Link
      href={`/${locale}/properties/${p.slug}`}
      className="group block bg-white border border-[var(--border)] hover:border-[var(--secondary)] transition-all"
      style={{
        borderRadius: 'var(--effect-card-radius)',
        boxShadow: 'var(--effect-card-shadow)',
      }}
    >
      <div
        className="relative aspect-[4/3] overflow-hidden"
        style={{
          borderRadius:
            'var(--effect-card-radius) var(--effect-card-radius) 0 0',
        }}
      >
        {p.coverImage ? (
          <Image
            src={p.coverImage}
            alt={p.address || ''}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width:768px) 100vw, 33vw"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: 'var(--backdrop-mid)' }}
          />
        )}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 text-xs font-semibold text-white rounded ${STATUS_BADGE[p.status || ''] || 'bg-gray-500'}`}
            style={{ borderRadius: 'var(--effect-badge-radius)' }}
          >
            {statusLabels[p.status || ''] || p.status}
          </span>
        </div>
      </div>
      <div className="p-4">
        <p
          className="font-semibold text-lg mb-0.5"
          style={{
            color: 'var(--secondary)',
            fontFamily: 'var(--font-heading)',
          }}
        >
          {p.priceDisplay || (p.price ? `$${p.price.toLocaleString()}` : '')}
        </p>
        <p
          className="text-sm font-medium truncate"
          style={{ color: 'var(--primary)' }}
        >
          {p.address}
        </p>
        <p
          className="text-xs mb-2 truncate"
          style={{ color: 'var(--text-secondary)' }}
        >
          {p.city}, {p.state}
        </p>
        <div
          className="flex gap-3 text-xs"
          style={{ color: 'var(--text-secondary)' }}
        >
          {p.beds && (
            <span className="flex items-center gap-1">
              <Bed className="w-3 h-3" />
              {p.beds} bd
            </span>
          )}
          {p.baths && (
            <span className="flex items-center gap-1">
              <Bath className="w-3 h-3" />
              {p.baths} ba
            </span>
          )}
          {p.sqft && (
            <span className="flex items-center gap-1">
              <Maximize2 className="w-3 h-3" />
              {p.sqft.toLocaleString()} sf
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ── Animated stat ──────────────────────────────────────────────────────────────
function AnimatedStat({ item }: { item: StatItem }) {
  const [displayed, setDisplayed] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const target = parseInt(item.value?.replace(/\D/g, '') || '0', 10);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.3 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started || target === 0) return;
    const steps = 60;
    const inc = target / steps;
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + inc, target);
      setDisplayed(Math.round(cur));
      if (cur >= target) clearInterval(t);
    }, 1800 / steps);
    return () => clearInterval(t);
  }, [started, target]);

  return (
    <div ref={ref} className="text-center px-4 py-2">
      <p
        className="font-semibold text-4xl md:text-5xl mb-2"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--secondary)' }}
      >
        {item.prefix}
        {displayed.toLocaleString()}
        {item.suffix}
      </p>
      <p className="text-sm" style={{ color: 'var(--text-on-dark-muted)' }}>
        {item.label}
      </p>
    </div>
  );
}

// ── Hero Slideshow ─────────────────────────────────────────────────────────────
function HeroSlideshow({
  site,
  slides,
  headline,
  subline,
  ctaPrimary,
  ctaSecondary,
  locale,
  overlayOpacity,
}: {
  site?: SiteData;
  slides: Slide[];
  headline?: string;
  subline?: string;
  ctaPrimary?: { label?: string; href?: string };
  ctaSecondary?: { label?: string; href?: string };
  locale: string;
  overlayOpacity?: number;
}) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(
      () => setActive((i) => (i + 1) % slides.length),
      5500,
    );
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <section className="relative h-screen min-h-[640px] overflow-hidden flex items-end">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1200 ${i === active ? 'opacity-100' : 'opacity-0'}`}
        >
          {slide.video ? (
            <video
              className="w-full h-full object-cover"
              src={slide.video}
              poster={slide.poster || slide.image}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : slide.image ? (
            <Image
              src={slide.image}
              alt={slide.alt || ''}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="100vw"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{ background: 'var(--primary)' }}
            />
          )}
        </div>
      ))}
      {/* Directional gradient — bright photo, readable text */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top right, rgba(26,39,68,${overlayOpacity ?? 0.28}) 0%, rgba(26,39,68,0.12) 42%, rgba(26,39,68,0.03) 72%, transparent 100%)`,
        }}
      />
      {/* Slide dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === active ? 'bg-white w-6' : 'bg-white/40 w-2'}`}
            />
          ))}
        </div>
      )}
      {/* Content panel */}
      <div className="relative z-10 w-full pb-24 md:pb-32 pl-4 sm:pl-8 md:pl-12 lg:pl-16">
        <div
          className="max-w-2xl rounded-sm px-6 py-6 md:px-8 md:py-8"
          style={{
            background: 'rgba(26,39,68,0.12)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-[0.25em] mb-3"
            style={{ color: 'var(--secondary)' }}
          >
            {site?.name}
          </p>
          <h1
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-4 leading-tight"
            style={{
              fontFamily: 'var(--font-heading)',
              textShadow: '0 2px 10px rgba(0,0,0,0.35)',
            }}
          >
            {headline || 'Find Your Home in Orange County, NY'}
          </h1>
          <p
            className="text-lg text-white/85 mb-7 max-w-xl"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.28)' }}
          >
            {subline}
          </p>
          <div className="flex flex-wrap gap-3">
            {ctaPrimary?.href && (
              <Link
                href={`/${locale}${ctaPrimary.href}`}
                className="btn-gold text-sm px-7 py-3"
              >
                {ctaPrimary.label || 'Search Properties'}
              </Link>
            )}
            {ctaSecondary?.href && (
              <Link
                href={`/${locale}${ctaSecondary.href}`}
                className="border-2 border-white text-white hover:bg-white/15 transition-colors text-sm px-7 py-3 font-semibold"
                style={{ borderRadius: 'var(--effect-button-radius)' }}
              >
                {ctaSecondary.label || 'Free Consultation'}
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 z-20 flex flex-col items-center gap-1.5">
        <div className="w-px h-10 bg-white/40" />
        <span className="text-white/50 text-[10px] rotate-90 tracking-widest">
          {locale === 'zh' ? '下滑' : 'SCROLL'}
        </span>
      </div>
    </section>
  );
}

// ── Contact Form ───────────────────────────────────────────────────────────────
function InlineContactForm({
  locale,
  headline,
  subline,
}: {
  locale: string;
  headline?: string;
  subline?: string;
}) {
  const isZh = locale === 'zh';
  const copy = {
    thankYou: isZh ? '谢谢您！' : 'Thank you!',
    followup: isZh
      ? '我们会在 2 个工作小时内与您联系。'
      : "We'll be in touch within 2 business hours.",
    firstName: isZh ? '名' : 'First Name',
    lastName: isZh ? '姓' : 'Last Name',
    email: isZh ? '邮箱地址' : 'Email Address',
    phone: isZh ? '电话（可选）' : 'Phone (optional)',
    categoryPrompt: isZh ? '请告诉我们您的需求' : 'How can we help?',
    buy: isZh ? '我想买房' : 'I want to buy',
    sell: isZh ? '我想卖房' : 'I want to sell',
    invest: isZh ? '我是投资者' : "I'm an investor",
    relocate: isZh ? '我正在搬迁' : "I'm relocating",
    join: isZh ? '我想加入你们团队' : "I'm interested in joining your team",
    other: isZh ? '其他' : 'Other',
    message: isZh ? '留言（可选）' : 'Message (optional)',
    sending: isZh ? '发送中…' : 'Sending…',
    send: isZh ? '发送消息' : 'Send Message',
  };
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    category: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale }),
      });
      setDone(true);
    } catch {}
    setSubmitting(false);
  };

  if (done)
    return (
      <div className="text-center py-8">
        <p
          className="text-lg font-semibold"
          style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}
        >
          {copy.thankYou}
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          {copy.followup}
        </p>
      </div>
    );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          required
          value={form.firstName}
          onChange={(e) =>
            setForm((f) => ({ ...f, firstName: e.target.value }))
          }
          placeholder={copy.firstName}
          className="calc-input"
        />
        <input
          required
          value={form.lastName}
          onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
          placeholder={copy.lastName}
          className="calc-input"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder={copy.email}
          className="calc-input"
        />
        <input
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          placeholder={copy.phone}
          className="calc-input"
        />
      </div>
      <select
        value={form.category}
        onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
        className="calc-input w-full"
      >
        <option value="">{copy.categoryPrompt}</option>
        <option value="buy">{copy.buy}</option>
        <option value="sell">{copy.sell}</option>
        <option value="invest">{copy.invest}</option>
        <option value="relocate">{copy.relocate}</option>
        <option value="join">{copy.join}</option>
        <option value="other">{copy.other}</option>
      </select>
      <textarea
        value={form.message}
        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        placeholder={copy.message}
        className="calc-input w-full min-h-[100px]"
      />
      <button
        type="submit"
        disabled={submitting}
        className="btn-gold w-full py-3.5 font-semibold"
      >
        {submitting ? copy.sending : copy.send}
      </button>
    </form>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [home, setH] = useState<HomeData>({});
  const [site, setSite] = useState<SiteData>({});
  const [properties, setProperties] = useState<Property[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [posts, setPosts] = useState<KnowledgePost[]>([]);
  const [locale, setLocale] = useState('en');
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const isZh = locale === 'zh';
  const ui = {
    loading: isZh ? '加载中…' : 'Loading…',
    fallbackHeroTitle: isZh
      ? '在 Orange County, NY 找到理想之家'
      : 'Find Your Home in Orange County, NY',
    searchProperties: isZh ? '搜索房源' : 'Search Properties',
    freeConsultation: isZh ? '免费咨询' : 'Free Consultation',
    goalPathsHeadline: isZh ? '我们如何帮助您？' : 'How Can We Help You?',
    ourStoryTag: isZh ? '我们的故事' : 'Our Story',
    introFallbackHeadline: isZh
      ? '以专业与信任为核心的精品地产团队'
      : 'An Independent Brokerage Built on Expertise',
    listingsTag: isZh ? '房源推荐' : 'Listings',
    featuredListingsFallbackHeadline: isZh ? '精选房源' : 'Featured Properties',
    viewAll: isZh ? '查看全部' : 'View All',
    whyJinPangTag: isZh ? '为什么选择 Jin Pang Homes' : 'Why Jin Pang Homes',
    whyJinPangFallbackHeadline: isZh
      ? '为什么选择 Jin Pang Homes'
      : 'Why Choose Jin Pang Homes',
    testimonialFallbackHeadline: isZh ? '客户怎么说' : 'What Our Clients Say',
    localExpertiseTag: isZh ? '本地洞察' : 'Local Expertise',
    exploreNeighborhoods: isZh ? '探索社区' : 'Explore Neighborhoods',
    allNeighborhoods: isZh ? '全部社区' : 'All Neighborhoods',
    median: isZh ? '中位价' : 'Median',
    marketReport: isZh ? '市场报告' : 'Market Report',
    marketReportFallbackSubline: isZh
      ? 'Orange County, NY — 最新更新'
      : 'Orange County, NY — Latest Update',
    readFullReport: isZh ? '阅读完整报告' : 'Read Full Report',
    mlsSearchTag: isZh ? 'MLS 搜索' : 'MLS Search',
    mlsSearchHeadline: isZh ? '搜索全部在售房源' : 'Search All Available Homes',
    mlsSearchBody: isZh
      ? '浏览 Orange County, NY 及周边区域 MLS 数据库中的全部房源。'
      : 'Browse the complete MLS database for Orange County, NY and surrounding areas.',
    browseAllProperties: isZh ? '浏览全部房源' : 'Browse All Properties',
    listingCountSuffix: isZh ? '套房源可浏览' : 'listings currently available',
    mlsUpdated: isZh ? 'MLS 数据持续更新' : 'Updated regularly from MLS',
    insightsTag: isZh ? '洞察' : 'Insights',
    knowledgeFallbackHeadline: isZh
      ? '知识中心精选'
      : 'From Our Knowledge Center',
    allPosts: isZh ? '全部文章' : 'All Posts',
    getStartedTag: isZh ? '立即开始' : 'Get Started',
    consultationFallbackHeadline: isZh
      ? '准备好迈出下一步了吗？'
      : 'Ready to Take the Next Step?',
    consultationFallbackSubline: isZh
      ? '我们的团队已准备就绪，欢迎预约免费咨询。'
      : 'Our team is ready to help. Schedule your free consultation today.',
    scheduleConsultation: isZh ? '预约咨询' : 'Schedule Consultation',
    reviewAuthorFallback: isZh ? '客户' : 'Client',
    contactUsTag: isZh ? '联系我们' : 'Contact Us',
    getInTouch: isZh ? '联系咨询' : 'Get in Touch',
  };

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    Promise.all([
      fetch(`/api/content/file?locale=${loc}&path=pages/home.json`).then((r) =>
        r.json(),
      ),
      fetch(`/api/content/file?locale=${loc}&path=site.json`).then((r) =>
        r.json(),
      ),
      fetch(`/api/content/items?locale=${loc}&directory=properties`).then((r) =>
        r.json(),
      ),
      fetch(`/api/content/items?locale=${loc}&directory=neighborhoods`).then(
        (r) => r.json(),
      ),
      fetch(`/api/content/file?locale=${loc}&path=testimonials.json`).then(
        (r) => r.json(),
      ),
      fetch(`/api/content/items?locale=${loc}&directory=knowledge-center`).then(
        (r) => r.json(),
      ),
    ])
      .then(([homeRes, siteRes, propsRes, nbRes, testRes, postsRes]) => {
        try {
          setH(JSON.parse(homeRes.content || '{}'));
        } catch {}
        try {
          setSite(JSON.parse(siteRes.content || '{}'));
        } catch {}
        setProperties(
          Array.isArray(propsRes.items) ? (propsRes.items as Property[]) : [],
        );
        setNeighborhoods(
          Array.isArray(nbRes.items) ? (nbRes.items as Neighborhood[]) : [],
        );
        try {
          const t = JSON.parse(testRes.content || '{}');
          setTestimonials(Array.isArray(t.items) ? t.items : []);
        } catch {}
        const rawPosts = Array.isArray(postsRes.items)
          ? (postsRes.items as KnowledgePost[])
          : [];
        setPosts(
          rawPosts.sort((a, b) =>
            (b.publishDate || '').localeCompare(a.publishDate || ''),
          ),
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const t = setInterval(
      () =>
        setActiveTestimonial((i) => (i + 1) % Math.min(testimonials.length, 5)),
      6000,
    );
    return () => clearInterval(t);
  }, [testimonials.length]);

  const allSlides = home.hero?.slides || [];
  const introVideo =
    home.hero?.frontVideoEnabled === false
      ? undefined
      : home.hero?.frontVideoUrl || allSlides.find((s) => s.video)?.video;
  const slides = allSlides
    .filter((s) => s.image)
    .map((s) => ({ image: s.image, alt: s.alt }));
  const stats: StatItem[] = home.statsBar?.items || [
    { value: '180', label: 'In Total Sales', prefix: '$', suffix: 'M+' },
    { value: '620', label: 'Transactions Closed', suffix: '+' },
    { value: '12', label: 'Years in Business' },
    { value: '18', label: 'Expert Agents' },
    { value: '200', label: 'Five-Star Reviews', suffix: '+' },
  ];
  const featuredProps = (() => {
    const slugs = home.featuredListings?.propertySlugs || [];
    const pinned = slugs
      .map((s) => properties.find((p) => p.slug === s))
      .filter(Boolean) as Property[];
    if (pinned.length > 0)
      return pinned.slice(0, home.featuredListings?.maxDisplay || 6);
    return properties
      .filter((p) => p.featured && p.status === 'active')
      .slice(0, home.featuredListings?.maxDisplay || 6);
  })();
  const spotlightNbs = (() => {
    const slugs = home.neighborhoodSpotlight?.neighborhoodSlugs || [];
    const pinned = slugs
      .map((s) => neighborhoods.find((n) => n.slug === s))
      .filter(Boolean) as Neighborhood[];
    return (pinned.length > 0 ? pinned : neighborhoods).slice(0, 3);
  })();
  const stripTests = testimonials.filter((t) => !t.agentSlug).slice(0, 5);
  const previewPosts = (() => {
    const slugs = home.knowledgeCenterPreview?.postSlugs || [];
    const pinned = slugs
      .map((s) => posts.find((p) => p.slug === s))
      .filter(Boolean) as KnowledgePost[];
    return (
      pinned.length > 0 ? pinned : posts.filter((p) => (p as any).featured)
    ).slice(0, 3);
  })();

  if (loading)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--backdrop-light)' }}
      >
        <div className="text-center">
          <div
            className="w-10 h-10 border-2 rounded-full animate-spin mx-auto mb-4"
            style={{
              borderColor: 'var(--secondary)',
              borderTopColor: 'transparent',
            }}
          />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {ui.loading}
          </p>
        </div>
      </div>
    );

  return (
    <>
      {introVideo && <VideoSplash src={introVideo} skipAfter={2} />}

      {/* 1. HERO */}
      {slides.length > 0 ? (
        <HeroSlideshow
          site={site}
          slides={slides}
          headline={home.hero?.headline}
          subline={home.hero?.subline}
          ctaPrimary={home.hero?.ctaPrimary}
          ctaSecondary={home.hero?.ctaSecondary}
          locale={locale}
          overlayOpacity={home.hero?.overlayOpacity}
        />
      ) : (
        <section
          className="relative min-h-[70vh] flex items-end"
          style={{ background: 'var(--primary)' }}
        >
          <div className="relative z-10 w-full pb-20 pl-8 md:pl-16">
            <h1
              className="font-serif text-5xl font-semibold text-white mb-4 max-w-2xl leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {home.hero?.headline || ui.fallbackHeroTitle}
            </h1>
            <p className="text-lg text-white/80 mb-7 max-w-xl">
              {home.hero?.subline}
            </p>
            <div className="flex gap-3">
              <Link
                href={`/${locale}/properties`}
                className="btn-gold px-7 py-3"
              >
                {ui.searchProperties}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="border-2 border-white text-white px-7 py-3 hover:bg-white/10 transition-colors"
                style={{ borderRadius: 'var(--effect-button-radius)' }}
              >
                {ui.freeConsultation}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 2. GOAL ENTRY PATHS */}
      <GoalEntryPaths
        headline={home.goalPaths?.headline || ui.goalPathsHeadline}
        items={home.goalPaths?.items}
        locale={locale}
      />

      <TrustPromise locale={locale} />

      {/* 3. STATS BAR */}
      <section className="py-14" style={{ background: 'var(--backdrop-dark)' }}>
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 divide-x divide-white/10">
            {stats.map((item, i) => (
              <AnimatedStat key={i} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. BROKERAGE INTRO */}
      {home.intro && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-[0.25em] mb-4"
                  style={{ color: 'var(--secondary)' }}
                >
                  {ui.ourStoryTag}
                </p>
                <h2
                  className="font-serif text-3xl md:text-4xl font-semibold mb-6"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--primary)',
                  }}
                >
                  {home.intro.headline || ui.introFallbackHeadline}
                </h2>
                <p
                  className="text-base leading-relaxed mb-7"
                  style={{ color: 'var(--text-secondary)', lineHeight: '1.85' }}
                >
                  {home.intro.body}
                </p>
                {home.intro.ctaHref && (
                  <Link
                    href={`/${locale}${home.intro.ctaHref}`}
                    className="inline-flex items-center gap-2 font-semibold group"
                    style={{ color: 'var(--secondary)' }}
                  >
                    {home.intro.ctaLabel || ui.ourStoryTag}{' '}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
              <div
                className="relative aspect-[4/3] rounded-xl overflow-hidden"
                style={{ boxShadow: 'var(--photo-shadow)' }}
              >
                {home.intro.image ? (
                  <Image
                    src={home.intro.image}
                    alt="Jin Pang Homes"
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                ) : (
                  <div
                    className="w-full h-full"
                    style={{ background: 'var(--backdrop-mid)' }}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. FEATURED LISTINGS */}
      {featuredProps.length > 0 && (
        <section
          className="section-padding"
          style={{ background: 'var(--backdrop-light)' }}
        >
          <div className="container-custom">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color: 'var(--secondary)' }}
                >
                  {ui.listingsTag}
                </p>
                <h2
                  className="font-serif text-3xl md:text-4xl font-semibold"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--primary)',
                  }}
                >
                  {home.featuredListings?.headline ||
                    ui.featuredListingsFallbackHeadline}
                </h2>
                {home.featuredListings?.subline && (
                  <p
                    className="text-sm mt-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {home.featuredListings.subline}
                  </p>
                )}
              </div>
              <Link
                href={`/${locale}${home.featuredListings?.ctaHref || '/properties'}`}
                className="hidden md:flex items-center gap-2 text-sm font-semibold group"
                style={{ color: 'var(--secondary)' }}
              >
                {home.featuredListings?.ctaLabel || ui.viewAll}{' '}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProps.map((p) => (
                <PropertyCard key={p.slug} p={p} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. WHY CHOOSE US */}
      {home.whyChooseUs?.items && home.whyChooseUs.items.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: 'var(--secondary)' }}
              >
                {ui.whyJinPangTag}
              </p>
              <h2
                className="font-serif text-3xl md:text-4xl font-semibold"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--primary)',
                }}
              >
                {home.whyChooseUs.headline || ui.whyJinPangFallbackHeadline}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {home.whyChooseUs.items.map((item, i) => (
                <div
                  key={i}
                  className="p-7 border border-[var(--border)] rounded-xl"
                  style={{
                    borderRadius: 'var(--effect-card-radius)',
                    boxShadow: 'var(--effect-card-shadow)',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ background: 'var(--backdrop-mid)' }}
                  >
                    <MapPin
                      className="w-5 h-5"
                      style={{ color: 'var(--secondary)' }}
                    />
                  </div>
                  <h3
                    className="font-serif text-lg font-semibold mb-2"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: 'var(--primary)',
                    }}
                  >
                    {item.heading}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. TESTIMONIAL STRIP */}
      {stripTests.length > 0 && (
        <section
          className="py-20 overflow-hidden"
          style={{ background: 'var(--primary)' }}
        >
          <div className="container-custom max-w-4xl mx-auto">
            <p
              className="text-xs font-semibold uppercase tracking-[0.25em] mb-8 text-center"
              style={{ color: 'var(--secondary)' }}
            >
              {home.testimonialStrip?.headline ||
                ui.testimonialFallbackHeadline}
            </p>
            <div className="relative min-h-[200px]">
              {stripTests.map((t, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700 px-4 ${i === activeTestimonial % stripTests.length ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                  <div className="flex gap-1 mb-5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${s <= (t.rating || 5) ? 'fill-current' : ''}`}
                        style={{ color: 'var(--gold-star)' }}
                      />
                    ))}
                  </div>
                  <blockquote
                    className="font-serif text-xl md:text-2xl font-medium text-white text-center leading-relaxed mb-6 max-w-3xl"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      borderLeft: '3px solid var(--secondary)',
                      paddingLeft: '1.5rem',
                      textAlign: 'left',
                    }}
                  >
                    "{t.text || t.quote}"
                  </blockquote>
                  <p className="font-semibold text-white text-sm">
                    {t.reviewer || t.author}
                  </p>
                </div>
              ))}
            </div>
            {stripTests.length > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {stripTests.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${i === activeTestimonial % stripTests.length ? 'w-6' : 'w-2 bg-white/30'}`}
                    style={{
                      background:
                        i === activeTestimonial % stripTests.length
                          ? 'var(--secondary)'
                          : undefined,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 9. NEIGHBORHOOD SPOTLIGHT */}
      {spotlightNbs.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color: 'var(--secondary)' }}
                >
                  {ui.localExpertiseTag}
                </p>
                <h2
                  className="font-serif text-3xl md:text-4xl font-semibold"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--primary)',
                  }}
                >
                  {home.neighborhoodSpotlight?.headline ||
                    ui.exploreNeighborhoods}
                </h2>
                {home.neighborhoodSpotlight?.subline && (
                  <p
                    className="text-sm mt-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {home.neighborhoodSpotlight.subline}
                  </p>
                )}
              </div>
              <Link
                href={`/${locale}${home.neighborhoodSpotlight?.ctaHref || '/neighborhoods'}`}
                className="hidden md:flex items-center gap-2 text-sm font-semibold group"
                style={{ color: 'var(--secondary)' }}
              >
                {home.neighborhoodSpotlight?.ctaLabel || ui.allNeighborhoods}{' '}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {spotlightNbs.map((nb) => (
                <Link
                  key={nb.slug}
                  href={`/${locale}/neighborhoods/${nb.slug}`}
                  className="group relative overflow-hidden rounded-xl"
                  style={{
                    borderRadius: 'var(--effect-card-radius)',
                    boxShadow: 'var(--effect-card-shadow)',
                  }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {nb.coverImage ? (
                      <Image
                        src={nb.coverImage}
                        alt={nb.name || ''}
                        fill
                        className="object-cover transition-transform duration-600 group-hover:scale-105"
                        sizes="33vw"
                      />
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{ background: 'var(--backdrop-mid)' }}
                      />
                    )}
                    <div
                      className="absolute inset-0 transition-opacity duration-300"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(26,39,68,0.65) 0%, rgba(26,39,68,0.2) 50%, transparent 100%)',
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3
                        className="font-serif text-xl font-semibold text-white mb-1"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {nb.name}
                      </h3>
                      <p className="text-white/80 text-sm mb-1 truncate">
                        {nb.tagline}
                      </p>
                      {nb.marketSnapshot?.medianPrice && (
                        <p
                          className="text-xs font-semibold"
                          style={{ color: 'var(--secondary)' }}
                        >
                          {ui.median}: {nb.marketSnapshot.medianPrice}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 10. MARKET REPORT TEASER */}
      {home.marketReportTeaser && (
        <section
          className="py-16"
          style={{ background: 'var(--backdrop-dark)' }}
        >
          <div className="container-custom">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: 'var(--secondary)' }}
                >
                  {home.marketReportTeaser.headline || ui.marketReport}
                </p>
                <h2
                  className="font-serif text-2xl md:text-3xl font-semibold text-white mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {home.marketReportTeaser.subline ||
                    ui.marketReportFallbackSubline}
                </h2>
                {home.marketReportTeaser.keyStat && (
                  <p
                    className="text-lg font-semibold mb-4"
                    style={{ color: 'var(--secondary)' }}
                  >
                    {home.marketReportTeaser.keyStat}
                  </p>
                )}
              </div>
              <Link
                href={`/${locale}${home.marketReportTeaser.ctaHref || '/market-reports'}`}
                className="btn-gold flex-shrink-0 px-8 py-3.5"
              >
                {home.marketReportTeaser.ctaLabel || ui.readFullReport}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 11. IDX SEARCH CTA */}
      <section
        className="section-padding"
        style={{ background: 'var(--backdrop-light)' }}
      >
        <div className="container-custom text-center">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--secondary)' }}
          >
            {ui.mlsSearchTag}
          </p>
          <h2
            className="font-serif text-3xl md:text-4xl font-semibold mb-4"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--primary)',
            }}
          >
            {ui.mlsSearchHeadline}
          </h2>
          <p
            className="text-base mb-7 max-w-xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            {ui.mlsSearchBody}
          </p>
          <Link
            href={`/${locale}/properties`}
            className="btn-gold inline-flex items-center gap-2 px-8 py-4 text-base font-semibold"
          >
            <Search className="w-4 h-4" /> {ui.browseAllProperties}
          </Link>
          <p
            className="text-xs mt-3"
            style={{ color: 'var(--text-secondary)' }}
          >
            {properties.length > 0
              ? `${properties.length} ${ui.listingCountSuffix}`
              : ui.mlsUpdated}
          </p>
        </div>
      </section>

      {/* 12. KNOWLEDGE CENTER PREVIEW */}
      {previewPosts.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color: 'var(--secondary)' }}
                >
                  {ui.insightsTag}
                </p>
                <h2
                  className="font-serif text-3xl md:text-4xl font-semibold"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--primary)',
                  }}
                >
                  {home.knowledgeCenterPreview?.headline ||
                    ui.knowledgeFallbackHeadline}
                </h2>
              </div>
              <Link
                href={`/${locale}${home.knowledgeCenterPreview?.ctaHref || '/knowledge-center'}`}
                className="hidden md:flex items-center gap-2 text-sm font-semibold group"
                style={{ color: 'var(--secondary)' }}
              >
                {home.knowledgeCenterPreview?.ctaLabel || ui.allPosts}{' '}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {previewPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/${locale}/knowledge-center/${post.slug}`}
                  className="group block border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--secondary)] transition-colors"
                  style={{
                    borderRadius: 'var(--effect-card-radius)',
                    boxShadow: 'var(--effect-card-shadow)',
                  }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {post.heroImage ? (
                      <Image
                        src={post.heroImage}
                        alt={post.title || ''}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="33vw"
                      />
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{ background: 'var(--backdrop-mid)' }}
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <span
                      className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: 'var(--secondary)' }}
                    >
                      {post.category
                        ?.replace(/-/g, ' ')
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                    <h3
                      className="font-serif text-base font-semibold mt-2 mb-2 leading-snug group-hover:opacity-70 transition-opacity"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        color: 'var(--primary)',
                      }}
                    >
                      {post.title}
                    </h3>
                    <p
                      className="text-xs"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {post.readTime} · {post.publishDate}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 13. CONSULTATION CTA */}
      <section className="relative min-h-[56vh] md:min-h-[62vh] overflow-hidden flex items-end">
        {home.consultationCta?.backgroundImage && (
          <Image
            src={home.consultationCta.backgroundImage}
            alt=""
            fill
            className="object-cover opacity-100"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top left, rgba(20,30,48,0.22) 0%, rgba(20,30,48,0.12) 36%, rgba(20,30,48,0.06) 68%, rgba(20,30,48,0.02) 100%)',
          }}
        />
        <div
          className="relative z-10 w-full pb-12 md:pb-16 pr-4 sm:pr-8 md:pr-12 lg:pr-20 flex justify-end text-left"
          style={{
            background: !home.consultationCta?.backgroundImage
              ? 'var(--primary)'
              : undefined,
          }}
        >
          <div className="max-w-2xl">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--secondary)' }}
            >
              {ui.getStartedTag}
            </p>
            <h2
              className="font-serif text-3xl md:text-5xl font-semibold text-white mb-4 leading-tight"
              style={{
                fontFamily: 'var(--font-heading)',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              }}
            >
              {home.consultationCta?.headline ||
                ui.consultationFallbackHeadline}
            </h2>
            <p
              className="text-lg text-white/85 mb-8"
              style={{ textShadow: '0 1px 6px rgba(0,0,0,0.25)' }}
            >
              {home.consultationCta?.subline || ui.consultationFallbackSubline}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${locale}${home.consultationCta?.ctaHref || '/contact'}`}
                className="btn-gold text-sm px-8 py-3.5"
              >
                {home.consultationCta?.ctaLabel || ui.scheduleConsultation}
              </Link>
              {site.phone && (
                <a
                  href={`tel:${site.phone?.replace(/\D/g, '')}`}
                  className="flex items-center gap-2 border-2 border-white text-white hover:bg-white/15 transition-colors text-sm px-7 py-3 font-semibold"
                  style={{ borderRadius: 'var(--effect-button-radius)' }}
                >
                  <Phone className="w-4 h-4" /> {site.phone}
                </a>
              )}
            </div>
            {home.consultationCta?.reviewQuote?.text && (
              <div className="mt-6 p-4 rounded-lg border border-white/20 bg-black/20 backdrop-blur-[1px] max-w-xl">
                <p className="text-sm md:text-base text-white/90 leading-relaxed">
                  "{home.consultationCta.reviewQuote.text}"
                </p>
                <p className="text-xs mt-2 text-white/70">
                  {home.consultationCta.reviewQuote.author ||
                    ui.reviewAuthorFallback}
                  {home.consultationCta.reviewQuote.source
                    ? ` · ${home.consultationCta.reviewQuote.source}`
                    : ''}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 14. INLINE CONTACT FORM */}
      <section
        className="section-padding"
        style={{ background: 'var(--backdrop-light)' }}
      >
        <div className="container-custom max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--secondary)' }}
            >
              {ui.contactUsTag}
            </p>
            <h2
              className="font-serif text-3xl font-semibold"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--primary)',
              }}
            >
              {home.contactForm?.headline || ui.getInTouch}
            </h2>
            {home.contactForm?.subline && (
              <p
                className="text-sm mt-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                {home.contactForm.subline}
              </p>
            )}
          </div>
          <div
            className="bg-white p-7 rounded-2xl border border-[var(--border)]"
            style={{
              borderRadius: 'var(--effect-card-radius)',
              boxShadow: 'var(--effect-card-shadow)',
            }}
          >
            <InlineContactForm locale={locale} />
          </div>
        </div>
      </section>
    </>
  );
}

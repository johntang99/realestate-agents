'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Locale, SiteConfig } from '@/lib/types';
import { Button } from '@/components/ui';
import { CONTENT_TEMPLATES } from '@/lib/admin/templates';
import { ImagePickerModal } from '@/components/admin/ImagePickerModal';
import { JournalItemPanel } from '@/components/admin/panels/JournalItemPanel';
import { BlogPostItemPanel } from '@/components/admin/panels/BlogPostItemPanel';
import { PropertyItemPanel } from '@/components/admin/panels/PropertyItemPanel';
import { NeighborhoodItemPanel } from '@/components/admin/panels/NeighborhoodItemPanel';
import { MarketReportPanel } from '@/components/admin/panels/MarketReportPanel';
import { REATestimonialsPanel } from '@/components/admin/panels/REATestimonialsPanel';
import { SeoPanel } from '@/components/admin/panels/SeoPanel';
import { HeaderPanel } from '@/components/admin/panels/HeaderPanel';
import { FooterPanel } from '@/components/admin/panels/FooterPanel';
import { SitePanel } from '@/components/admin/panels/SitePanel';
import { ThemePanel } from '@/components/admin/panels/ThemePanel';
import { SectionVariantsPanel } from '@/components/admin/panels/SectionVariantsPanel';
import { HomeSectionPhotosPanel } from '@/components/admin/panels/HomeSectionPhotosPanel';
import { HomeSectionVisualsPanel } from '@/components/admin/panels/HomeSectionVisualsPanel';
import { ProfilePanel } from '@/components/admin/panels/ProfilePanel';
import { IntroductionPanel } from '@/components/admin/panels/IntroductionPanel';
import { HeroPanel } from '@/components/admin/panels/HeroPanel';
import { GalleryPhotosPanel } from '@/components/admin/panels/GalleryPhotosPanel';
import { CtaPanel } from '@/components/admin/panels/CtaPanel';
import { ServicesPanel } from '@/components/admin/panels/ServicesPanel';
import { ConditionsPanel } from '@/components/admin/panels/ConditionsPanel';
import { CaseStudiesPanel } from '@/components/admin/panels/CaseStudiesPanel';
import { ServicesListPanel } from '@/components/admin/panels/ServicesListPanel';
import { FeaturedPostPanel } from '@/components/admin/panels/FeaturedPostPanel';
import { PostsPanel } from '@/components/admin/panels/PostsPanel';
import { AboutPagePanel } from '@/components/admin/panels/AboutPagePanel';
import { AgentItemPanel } from '@/components/admin/panels/AgentItemPanel';
import { JsonMatchingPanel } from '@/components/admin/panels/JsonMatchingPanel';

interface ContentFileItem {
  id: string;
  label: string;
  path: string;
  scope: 'locale' | 'site';
  publishDate?: string;
}

interface ContentEditorProps {
  sites: SiteConfig[];
  selectedSiteId: string;
  selectedLocale: string;
  initialFilePath?: string;
  fileFilter?: 'all' | 'blog' | 'siteSettings' | 'portfolio' | 'shopProducts' | 'journal' | 'collections' | 'testimonials' | 'properties' | 'neighborhoods' | 'market-reports' | 'agents' | 'knowledge-center' | 'new-construction' | 'events' | 'guides' | 'case-studies' | 'resources';
  titleOverride?: string;
  basePath?: string;
}

const SECTION_VARIANT_OPTIONS: Record<string, string[]> = {
  hero: [
    'centered',
    'split-photo-right',
    'split-photo-left',
    'photo-background',
    'overlap',
    'video-background',
    'gallery-background',
  ],
  testimonials: ['carousel', 'grid', 'masonry', 'slider-vertical', 'featured-single'],
  howItWorks: ['horizontal', 'vertical', 'cards', 'vertical-image-right'],
  conditions: ['grid-cards', 'categories-tabs', 'list-detailed', 'icon-grid'],
  services: ['grid-cards-2x', 'grid-cards-3x', 'featured-large', 'list-horizontal', 'accordion', 'tabs', 'detail-alternating', 'detail-image-right'],
  designServices: ['detailed-list', 'grid-cards-2x', 'grid-cards-3x', 'list-horizontal'],
  constructionServices: ['text-image', 'image-text', 'centered'],
  furnishingServices: ['text-image', 'image-text', 'centered'],
  servicesList: ['grid-cards-2x', 'grid-cards-3x', 'featured-large', 'list-horizontal', 'accordion', 'tabs', 'detail-alternating', 'detail-image-right'],
  process: ['horizontal', 'vertical', 'cards', 'vertical-image-right'],
  specialties: ['icon-grid', 'grid', 'list'],
  overview: ['centered', 'left'],
  blog: ['cards-grid', 'featured-side', 'list-detailed', 'carousel'],
  gallery: ['grid-masonry', 'grid-uniform', 'carousel', 'lightbox-grid'],
  cta: ['centered', 'split', 'banner', 'card-elevated'],
  profile: ['split', 'stacked'],
  credentials: ['list', 'grid'],
  specializations: ['grid-2', 'grid-3', 'list'],
  philosophy: ['cards', 'timeline'],
  journey: ['prose', 'card'],
  affiliations: ['compact', 'detailed'],
  continuingEducation: ['compact', 'detailed'],
  clinic: ['split', 'cards'],
  introduction: ['centered', 'left'],
  hours: ['grid', 'list'],
  form: ['single-column', 'two-column', 'multi-step', 'modal', 'inline-minimal'],
  map: ['shown', 'hidden'],
  faq: ['accordion', 'simple', 'card'],
  individualTreatments: ['grid-3', 'grid-2', 'list'],
  packages: ['grid-3', 'grid-2', 'list'],
  insurance: ['split', 'stacked'],
  policies: ['grid', 'list'],
  statistics: ['horizontal-row', 'grid-2x2', 'vertical-cards', 'inline-badges'],
};

const toTitleCase = (value: string) =>
  value
    .replace(/([A-Z])/g, ' $1')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, (match) => match.toUpperCase());

const SITE_SETTINGS_PATHS = new Set([
  'navigation.json',
  'header.json',
  'footer.json',
  'seo.json',
  'theme.json',
  'site.json',
]);

export function ContentEditor({
  sites,
  selectedSiteId,
  selectedLocale,
  initialFilePath,
  fileFilter = 'all',
  titleOverride,
  basePath = '/admin/content',
}: ContentEditorProps) {
  const router = useRouter();
  const [siteId, setSiteId] = useState(selectedSiteId);
  const [locale, setLocale] = useState<Locale>(selectedLocale as Locale);
  const [files, setFiles] = useState<ContentFileItem[]>([]);
  const [activeFile, setActiveFile] = useState<ContentFileItem | null>(null);
  const [content, setContent] = useState('');
  const [formData, setFormData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'json'>('form');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showDynamicFields, setShowDynamicFields] = useState(false);
  const [imageFieldPath, setImageFieldPath] = useState<string[] | null>(null);
  const [markdownPreview, setMarkdownPreview] = useState<Record<string, boolean>>({});
  const [seoPopulating, setSeoPopulating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [blogServiceOptions, setBlogServiceOptions] = useState<
    Array<{ id: string; title: string }>
  >([]);
  const [blogConditionOptions, setBlogConditionOptions] = useState<
    Array<{ id: string; title: string }>
  >([]);
  const [portfolioCategoryOptions, setPortfolioCategoryOptions] = useState<
    Array<{ value: string; label: string; labelCn?: string }>
  >([]);
  const [portfolioStyleOptions, setPortfolioStyleOptions] = useState<
    Array<{ value: string; label: string; labelCn?: string }>
  >([]);
  const [journalCategoryOptions, setJournalCategoryOptions] = useState<
    Array<{ value: string; label: string; labelCn?: string }>
  >([]);
  const [shopCategoryOptions, setShopCategoryOptions] = useState<
    Array<{ value: string; label: string; labelCn?: string }>
  >([]);
  const [shopRoomOptions, setShopRoomOptions] = useState<
    Array<{ value: string; label: string; labelCn?: string }>
  >([]);
  const [testimonialCategoryOptions, setTestimonialCategoryOptions] = useState<
    Array<{ value: string; label: string; labelCn?: string }>
  >([]);
  const COLLECTION_PREFIXES: Record<string, string> = {
    portfolio: 'portfolio/',
    shopProducts: 'shop-products/',
    journal: 'journal/',
    collections: 'collections/',
    testimonials: 'testimonials',
    properties: 'properties/',
    neighborhoods: 'neighborhoods/',
    'market-reports': 'market-reports/',
    agents: 'agents/',
    'knowledge-center': 'knowledge-center/',
    'new-construction': 'new-construction/',
    events: 'events',
    guides: 'guides',
    'case-studies': 'case-studies/',
    resources: 'resources/',
  };
  const TARGET_DIR_BY_FILTER: Record<string, string> = {
    blog: 'blog',
    portfolio: 'portfolio',
    shopProducts: 'shop-products',
    journal: 'journal',
    collections: 'collections',
    testimonials: 'testimonials',
    properties: 'properties',
    neighborhoods: 'neighborhoods',
    'market-reports': 'market-reports',
    agents: 'agents',
    'knowledge-center': 'knowledge-center',
    'new-construction': 'new-construction',
    events: 'events',
    guides: 'guides',
    'case-studies': 'case-studies',
    resources: 'resources',
  };
  const isCollectionFilter = fileFilter && fileFilter in COLLECTION_PREFIXES;
  const filesTitle =
    fileFilter === 'blog' ? 'Blog Posts'
    : fileFilter === 'siteSettings' ? 'Site Settings'
    : fileFilter === 'portfolio' ? 'Portfolio Projects'
    : fileFilter === 'shopProducts' ? 'Shop Products'
    : fileFilter === 'journal' ? 'Journal Posts'
    : fileFilter === 'collections' ? 'Design Collections'
    : fileFilter === 'testimonials' ? 'Testimonials'
    : fileFilter === 'properties' ? 'Properties'
    : fileFilter === 'neighborhoods' ? 'Neighborhoods'
    : fileFilter === 'market-reports' ? 'Market Reports'
    : fileFilter === 'agents' ? 'Agents'
    : fileFilter === 'knowledge-center' ? 'Knowledge Center'
    : fileFilter === 'new-construction' ? 'New Construction'
    : fileFilter === 'events' ? 'Events'
    : fileFilter === 'guides' ? 'Guides'
    : fileFilter === 'case-studies' ? 'Case Studies'
    : fileFilter === 'resources' ? 'Resources'
    : 'Files';

  const site = useMemo(
    () => sites.find((item) => item.id === siteId),
    [sites, siteId]
  );
  const availableLocales = useMemo<Locale[]>(() => {
    const seeded = [
      ...(site?.supportedLocales || []),
      site?.defaultLocale || 'en',
      'en',
      'zh',
    ].filter(Boolean) as Locale[];
    return Array.from(new Set(seeded));
  }, [site]);

  useEffect(() => {
    if (!site) return;
    if (!availableLocales.includes(locale as Locale)) {
      setLocale(site.defaultLocale);
    }
  }, [site, locale, availableLocales]);

  useEffect(() => {
    if (!siteId || !locale) return;
    const params = new URLSearchParams({ siteId, locale });
    router.replace(`${basePath}?${params.toString()}`);
  }, [router, siteId, locale, basePath]);

  const loadFiles = async (preferredPath?: string) => {
    if (!siteId || !locale) return;
    setLoading(true);
    setStatus(null);
    try {
      const response = await fetch(
        `/api/admin/content/files?siteId=${siteId}&locale=${locale}`
      );
      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.message || 'Failed to load files');
      }
      const payload = await response.json();
      let nextFiles: ContentFileItem[] = payload.files || [];
      if (fileFilter === 'blog') {
        nextFiles = nextFiles.filter((file) => file.path.startsWith('blog/'));
        nextFiles = [...nextFiles].sort((a, b) =>
          (b.publishDate || '').localeCompare(a.publishDate || '')
        );
      } else if (fileFilter === 'siteSettings') {
        nextFiles = nextFiles.filter((file) => SITE_SETTINGS_PATHS.has(file.path));
        nextFiles = [...nextFiles].sort((a, b) => a.label.localeCompare(b.label));
      } else if (isCollectionFilter && fileFilter) {
        const prefix = COLLECTION_PREFIXES[fileFilter];
        nextFiles = nextFiles.filter((file) => file.path.startsWith(prefix) || file.path === prefix);
        nextFiles = [...nextFiles].sort((a, b) => a.label.localeCompare(b.label));
      } else {
        // 'all' — exclude all collection files so Content editor stays clean
        const allCollectionPrefixes = Object.values(COLLECTION_PREFIXES);
        nextFiles = nextFiles.filter(
          (file) =>
            !file.path.startsWith('blog/') &&
            !SITE_SETTINGS_PATHS.has(file.path) &&
            !allCollectionPrefixes.some(prefix => file.path.startsWith(prefix) || file.path === prefix)
        );
        nextFiles = [...nextFiles].sort((a, b) => a.label.localeCompare(b.label));
      }
      setFiles(nextFiles);
      if (preferredPath) {
        const matched = nextFiles.find((file) => file.path === preferredPath);
        setActiveFile(matched || nextFiles[0] || null);
      } else {
        setActiveFile(nextFiles[0] || null);
      }
    } catch (error: any) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles(initialFilePath);
  }, [siteId, locale, initialFilePath, fileFilter]);

  useEffect(() => {
    if (!activeFile) return;
    setLoading(true);
    setStatus(null);
    fetch(
      `/api/admin/content/file?siteId=${siteId}&locale=${locale}&path=${encodeURIComponent(
        activeFile.path
      )}`
    )
      .then(async (response) => {
        if (!response.ok) {
          const payload = await response.json();
          throw new Error(payload.message || 'Failed to load content');
        }
        return response.json();
      })
      .then((payload) => {
        const nextContent = payload.content || '';
        setContent(nextContent);
        try {
          setFormData(JSON.parse(nextContent));
        } catch (error) {
          setFormData(null);
        }
      })
      .catch((error) => setStatus(error.message))
      .finally(() => setLoading(false));
  }, [activeFile, siteId, locale]);

  useEffect(() => {
    if (!activeFile) return;
    if (activeFile.path.startsWith('blog/')) {
      loadBlogLinkOptions();
    }
    if (activeFile.path.startsWith('portfolio/')) {
      loadPortfolioFilterOptions();
    }
    if (activeFile.path.startsWith('journal/')) {
      loadJournalFilterOptions();
    }
    if (activeFile.path.startsWith('shop-products/')) {
      loadShopFilterOptions();
    }
    if (activeFile.path === 'testimonials.json' || activeFile.path.startsWith('testimonials/')) {
      loadTestimonialCategoryOptions();
    }
  }, [activeFile, siteId, locale]);

  const handleSave = async () => {
    setStatus(null);
    if (!activeFile) return;
    try {
      JSON.parse(content);
    } catch (error) {
      setStatus('Invalid JSON. Please fix before saving.');
      return;
    }

    const response = await fetch('/api/admin/content/file', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        siteId,
        locale,
        path: activeFile.path,
        content,
      }),
    });

    if (!response.ok) {
      const payload = await response.json();
      setStatus(payload.message || 'Save failed');
      return;
    }

    const payload = await response.json();
    setStatus(payload.message || 'Saved');
  };

  const handleImport = async (
    mode: 'missing' | 'overwrite' = 'missing',
    options?: { dryRun?: boolean; force?: boolean }
  ) => {
    setStatus(null);
    setLoading(true);
    setImporting(true);
    try {
      const response = await fetch('/api/admin/content/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId,
          locale,
          mode,
          dryRun: Boolean(options?.dryRun),
          force: Boolean(options?.force),
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || 'Import failed');
      }
      if (options?.dryRun) {
        return payload;
      }
      const skipped = payload.skipped || 0;
      const imported = payload.imported || 0;
      setStatus(payload.message || (skipped
        ? `Imported ${imported} items. Skipped ${skipped} existing DB entries.`
        : `Imported ${imported} items from JSON.`));
      await loadFiles(activeFile?.path);
      return payload;
    } catch (error: any) {
      setStatus(error?.message || 'Import failed');
      return null;
    } finally {
      setLoading(false);
      setImporting(false);
    }
  };

  const handleOverwriteImport = async () => {
    const dryRun = await handleImport('overwrite', { dryRun: true });
    if (!dryRun) return;

    const conflicts = Array.isArray(dryRun.conflicts) ? dryRun.conflicts : [];
    if (conflicts.length > 0) {
      const conflictPreview = conflicts
        .slice(0, 5)
        .map((item: any) => `${item.locale}:${item.path}`)
        .join('\n');
      const forceConfirmed = window.confirm(
        `Safety check found ${conflicts.length} newer DB entries.\n\n` +
          `${conflictPreview}${conflicts.length > 5 ? '\n...' : ''}\n\n` +
          'Abort by default. Continue with FORCE overwrite anyway?'
      );
      if (!forceConfirmed) {
        setStatus('Overwrite cancelled due to newer DB entries.');
        return;
      }
      await handleImport('overwrite', { force: true });
      return;
    }

    const confirmed = window.confirm(
      `Dry-run summary:\n` +
        `Create: ${dryRun.toCreate || 0}\n` +
        `Update: ${dryRun.toUpdate || 0}\n` +
        `Unchanged: ${dryRun.unchanged || 0}\n\n` +
        `${Array.isArray(dryRun.toUpdatePaths) && dryRun.toUpdatePaths.length > 0
          ? `Update paths:\n${dryRun.toUpdatePaths.slice(0, 8).join('\n')}${dryRun.toUpdatePaths.length > 8 ? '\n...' : ''}\n\n`
          : ''}` +
        `${Array.isArray(dryRun.toCreatePaths) && dryRun.toCreatePaths.length > 0
          ? `Create paths:\n${dryRun.toCreatePaths.slice(0, 8).join('\n')}${dryRun.toCreatePaths.length > 8 ? '\n...' : ''}\n\n`
          : ''}` +
        'Proceed with overwrite import?'
    );
    if (!confirmed) return;
    await handleImport('overwrite');
  };

  const handleCheckUpdateFromDb = async () => {
    const dryRun = await handleImport('overwrite', { dryRun: true });
    if (!dryRun) return;

    const updatePaths = Array.isArray(dryRun.toUpdatePaths) ? dryRun.toUpdatePaths : [];
    const createPaths = Array.isArray(dryRun.toCreatePaths) ? dryRun.toCreatePaths : [];
    const conflicts = Array.isArray(dryRun.conflicts) ? dryRun.conflicts : [];
    const conflictPaths = conflicts.map((item: any) => `${item.locale}:${item.path}`);

    const allDifferentPaths = Array.from(new Set([...updatePaths, ...createPaths, ...conflictPaths]));
    const preview = allDifferentPaths.slice(0, 20).join('\n');
    const folderOrder = [
      'pages',
      'blog',
      'portfolio',
      'shop-products',
      'journal',
      'collections',
      'testimonials',
      'properties',
      'neighborhoods',
      'market-reports',
      'agents',
      'knowledge-center',
      'new-construction',
      'events',
      'guides',
      'case-studies',
      'resources',
      'case-studies',
      'resources',
      'root',
    ];
    const byFolder = new Map<string, number>(folderOrder.map((folder) => [folder, 0]));
    allDifferentPaths.forEach((entryPath) => {
      const rawPath = String(entryPath).includes(':')
        ? String(entryPath).split(':').slice(1).join(':')
        : String(entryPath);
      const folder = rawPath.includes('/') ? rawPath.split('/')[0] : 'root';
      byFolder.set(folder, (byFolder.get(folder) || 0) + 1);
    });
    const folderBreakdown = folderOrder
      .map((folder) => `${folder}: ${byFolder.get(folder) || 0}`)
      .join('\n');

    window.alert(
      `Check Update From DB\n\n` +
        `Different files: ${allDifferentPaths.length}\n` +
        `Create: ${createPaths.length}\n` +
        `Update: ${updatePaths.length}\n` +
        `DB newer conflicts: ${conflicts.length}\n\n` +
        `By folder:\n${folderBreakdown}\n\n` +
        `${allDifferentPaths.length > 0 ? `Paths:\n${preview}${allDifferentPaths.length > 20 ? '\n...' : ''}` : 'No differences found.'}`
    );

    setStatus(
      allDifferentPaths.length > 0
        ? `Found ${allDifferentPaths.length} files different from DB (create ${createPaths.length}, update ${updatePaths.length}, conflicts ${conflicts.length}).`
        : 'No differences between local JSON and DB.'
    );
  };

  const handleExport = async () => {
    setStatus(null);
    setLoading(true);
    setExporting(true);
    try {
      const response = await fetch('/api/admin/content/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId, locale }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || 'Export failed');
      }
      const details = [];
      if (typeof payload.backfilled === 'number') {
        details.push(`backfilled ${payload.backfilled}`);
      }
      if (typeof payload.backfillErrors === 'number' && payload.backfillErrors > 0) {
        details.push(`backfill errors ${payload.backfillErrors}`);
      }
      setStatus(
        `${payload.message || 'Export completed'}${details.length ? ` (${details.join(', ')})` : ''}`
      );
    } catch (error: any) {
      setStatus(error?.message || 'Export failed');
    } finally {
      setLoading(false);
      setExporting(false);
    }
  };

  const handleCreate = async () => {
    const targetDir = TARGET_DIR_BY_FILTER[fileFilter] || 'pages';
    const isBlog = targetDir === 'blog';
    const isCollection = [
      'portfolio',
      'shop-products',
      'journal',
      'collections',
      'testimonials',
      'properties',
      'neighborhoods',
      'market-reports',
      'agents',
      'knowledge-center',
      'new-construction',
      'events',
      'guides',
    ].includes(targetDir);
    const slug = window.prompt(
      isBlog
        ? 'New blog slug (example: my-post)'
        : isCollection
          ? `New item slug for ${targetDir} (example: my-item)`
          : 'New page slug (example: faq)'
    );
    if (!slug) return;
    const normalizedSlug = slug.trim().toLowerCase();

    const getCollectionInitialContent = () => {
      if (targetDir === 'portfolio') {
        return {
          slug: normalizedSlug,
          title: '',
          titleCn: '',
          category: 'residential',
          style: '',
          location: '',
          year: '',
          coverImage: '',
          overview: { body: '', bodyCn: '' },
          details: {
            scope: '',
            scopeCn: '',
            duration: '',
            durationCn: '',
            rooms: [],
            roomsCn: [],
            keyMaterials: [],
            keyMaterialsCn: [],
          },
          gallery: [],
          shopThisLook: [],
          relatedProjects: [],
        };
      }

      if (targetDir === 'shop-products') {
        return {
          slug: normalizedSlug,
          title: '',
          titleCn: '',
          category: '',
          room: '',
          price: 0,
          status: 'available',
          featured: false,
          description: '',
          descriptionCn: '',
          images: [{ src: '', alt: '' }],
          specifications: {
            dimensions: '',
            material: '',
            materialCn: '',
            finish: '',
            finishCn: '',
            leadTime: '',
            leadTimeCn: '',
          },
          seenInProjects: [],
          relatedProducts: [],
        };
      }

      if (targetDir === 'journal') {
        return {
          slug: normalizedSlug,
          title: '',
          titleCn: '',
          excerpt: '',
          excerptCn: '',
          coverImage: '',
          body: '',
          bodyCn: '',
          category: 'design-tips',
          type: 'article',
          date: new Date().toISOString().slice(0, 10),
          author: '',
          featured: false,
          relatedPosts: [],
          relatedProducts: [],
        };
      }

      if (targetDir === 'collections') {
        return {
          slug: normalizedSlug,
          title: '',
          titleCn: '',
          description: '',
          descriptionCn: '',
          coverImage: '',
          moodImages: [],
          portfolioProjects: [],
          shopProducts: [],
        };
      }

      if (targetDir === 'agents') {
        return {
          slug: normalizedSlug,
          status: 'active',
          displayOrder: 1,
          role: 'agent',
          name: '',
          title: '',
          photo: '',
          bio: '',
          phone: '',
          email: '',
          social: {
            instagram: '',
            linkedin: '',
            facebook: '',
          },
          licenseNumber: '',
          licenseState: '',
          specialties: [],
          languages: [],
          yearsExperience: 0,
          transactionCount: 0,
          volumeLabel: '',
          avgDaysOnMarket: 0,
          saleToListRatio: '',
          neighborhoods: [],
          awards: [],
          testimonials: [],
          featured: false,
        };
      }

      if (targetDir === 'testimonials') {
        return {
          id: `t-${Date.now()}`,
          text: '',
          rating: 5,
          featured: false,
          location: '',
          reviewer: '',
          verified: true,
          agentSlug: '',
          reviewDate: new Date().toISOString().slice(0, 7),
          transactionType: 'buyer',
        };
      }

      if (targetDir === 'properties') {
        return {
          slug: normalizedSlug,
          status: 'active',
          type: 'single-family',
          featured: false,
          address: '',
          city: '',
          state: 'NY',
          zip: '',
          neighborhood: '',
          schoolDistrict: '',
          price: 0,
          priceDisplay: '',
          beds: 0,
          baths: 0,
          sqft: 0,
          lotSize: '',
          yearBuilt: new Date().getFullYear(),
          mlsNumber: '',
          garage: '',
          hoa: null,
          description: '',
          coverImage: '',
          gallery: [],
          features: {
            interior: [],
            exterior: [],
            systems: [],
          },
          listingAgentSlug: '',
          seo: {
            title: '',
            description: '',
          },
        };
      }

      if (targetDir === 'neighborhoods') {
        return {
          slug: normalizedSlug,
          name: '',
          region: '',
          featured: false,
          tagline: '',
          overview: '',
          coverImage: '',
          gallery: [],
          lifestyle: [],
          schools: [],
          marketSnapshot: {
            medianPrice: '',
            yoyChange: '',
            pricePerSqft: '',
            inventoryCount: '',
            avgDaysOnMarket: '',
          },
          seo: {
            title: '',
            description: '',
          },
        };
      }

      if (targetDir === 'market-reports') {
        return {
          slug: normalizedSlug,
          title: '',
          date: new Date().toISOString().slice(0, 10),
          area: '',
          heroImage: '',
          excerpt: '',
          body: '',
          keyMetrics: [],
          neighborhoodBreakdown: [],
          seo: {
            title: '',
            description: '',
          },
        };
      }

      if (targetDir === 'knowledge-center' || targetDir === 'guides') {
        return {
          slug: normalizedSlug,
          title: '',
          category: '',
          type: 'article',
          author: '',
          publishDate: new Date().toISOString().slice(0, 10),
          heroImage: '',
          excerpt: '',
          readTime: '',
          featured: false,
          tags: [],
          body: '',
        };
      }

      if (targetDir === 'case-studies' || targetDir === 'resources') {
        return {
          slug: normalizedSlug,
          title: '',
          category: '',
          type: targetDir === 'resources' ? 'resource' : 'case-study',
          author: '',
          publishDate: new Date().toISOString().slice(0, 10),
          heroImage: '',
          excerpt: '',
          readTime: '',
          featured: false,
          tags: [],
          body: '',
        };
      }

      if (targetDir === 'new-construction') {
        return {
          slug: normalizedSlug,
          status: 'planned',
          name: '',
          builder: '',
          location: '',
          neighborhood: '',
          priceFrom: 0,
          priceTo: 0,
          priceRange: '',
          description: '',
          heroImage: '',
          gallery: [],
          features: [],
          floorPlans: [],
          virtualTourUrl: '',
          estimatedCompletion: '',
          inquiryAgentSlug: '',
          seo: {
            title: '',
            description: '',
          },
        };
      }

      if (targetDir === 'events') {
        return {
          slug: normalizedSlug,
          title: '',
          status: 'upcoming',
          eventType: '',
          startDate: '',
          endDate: '',
          startTime: '',
          endTime: '',
          timezone: '',
          location: '',
          address: '',
          organizer: '',
          contactEmail: '',
          registrationUrl: '',
          heroImage: '',
          excerpt: '',
          description: '',
          featured: false,
          tags: [],
        };
      }

      return null;
    };

    const templateId = isCollection
      ? 'empty'
      : (
          window.prompt(
            `Template: ${CONTENT_TEMPLATES.map((t) => t.id).join(', ')}`,
            CONTENT_TEMPLATES[0]?.id || 'basic'
          ) || CONTENT_TEMPLATES[0]?.id
        );

    const initialContent = isCollection ? getCollectionInitialContent() : null;
    const response = await fetch('/api/admin/content/file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        siteId,
        locale,
        action: 'create',
        slug: normalizedSlug,
        templateId,
        targetDir,
        initialContent,
      }),
    });

    if (!response.ok) {
      const payload = await response.json();
      setStatus(payload.message || 'Create failed');
      return;
    }

    const payload = await response.json();
    await loadFiles(payload.path);
  };

  const handleDuplicate = async () => {
    if (!activeFile) return;
    const sourceDir = activeFile.path.includes('/') ? activeFile.path.split('/')[0] : 'pages';
    const isBlog = sourceDir === 'blog';
    const isCollection = [
      'portfolio',
      'shop-products',
      'journal',
      'collections',
      'testimonials',
      'properties',
      'neighborhoods',
      'market-reports',
      'agents',
      'knowledge-center',
      'new-construction',
      'events',
      'guides',
      'case-studies',
      'resources',
    ].includes(sourceDir);
    const slug = window.prompt(
      isBlog
        ? 'Duplicate blog slug (example: my-post-copy)'
        : isCollection
          ? `Duplicate item slug for ${sourceDir} (example: my-item-copy)`
          : 'Duplicate page slug (example: faq-copy)'
    );
    if (!slug) return;
    const response = await fetch('/api/admin/content/file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        siteId,
        locale,
        action: 'duplicate',
        path: activeFile.path,
        slug,
        targetDir: sourceDir,
      }),
    });

    if (!response.ok) {
      const payload = await response.json();
      setStatus(payload.message || 'Duplicate failed');
      return;
    }

    const payload = await response.json();
    await loadFiles(payload.path);
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(content);
      const formatted = JSON.stringify(parsed, null, 2);
      setContent(formatted);
      setFormData(parsed);
      setStatus('Formatted');
    } catch (error) {
      setStatus('Invalid JSON. Unable to format.');
    }
  };

  const handleDelete = async () => {
    if (!activeFile) return;
    const confirmed = window.confirm(`Delete ${activeFile.path}? This cannot be undone.`);
    if (!confirmed) return;
    const response = await fetch(
      `/api/admin/content/file?siteId=${siteId}&locale=${locale}&path=${encodeURIComponent(
        activeFile.path
      )}`,
      { method: 'DELETE' }
    );
    if (!response.ok) {
      const payload = await response.json();
      setStatus(payload.message || 'Delete failed');
      return;
    }
    await loadFiles();
  };

  const loadBlogLinkOptions = async () => {
    if (!siteId || !locale) return;
    try {
      const [servicesRes, conditionsRes] = await Promise.all([
        fetch(
          `/api/admin/content/file?siteId=${siteId}&locale=${locale}&path=${encodeURIComponent(
            'pages/services.json'
          )}`
        ),
        fetch(
          `/api/admin/content/file?siteId=${siteId}&locale=${locale}&path=${encodeURIComponent(
            'pages/conditions.json'
          )}`
        ),
      ]);
      const [servicesPayload, conditionsPayload] = await Promise.all([
        servicesRes.ok ? servicesRes.json() : Promise.resolve(null),
        conditionsRes.ok ? conditionsRes.json() : Promise.resolve(null),
      ]);

      const servicesData = servicesPayload?.content
        ? JSON.parse(servicesPayload.content)
        : null;
      const conditionsData = conditionsPayload?.content
        ? JSON.parse(conditionsPayload.content)
        : null;

      const servicesOptions = Array.isArray(servicesData?.services)
        ? servicesData.services
            .map((service: any) => ({
              id: String(service?.id || ''),
              title: String(service?.title || service?.name || ''),
            }))
            .filter((item: any) => item.id && item.title)
        : [];
      const conditionsOptions = Array.isArray(conditionsData?.conditions)
        ? conditionsData.conditions
            .map((condition: any) => ({
              id: String(condition?.id || ''),
              title: String(condition?.title || condition?.name || ''),
            }))
            .filter((item: any) => item.id && item.title)
        : [];

      setBlogServiceOptions(servicesOptions);
      setBlogConditionOptions(conditionsOptions);
    } catch (error) {
      setBlogServiceOptions([]);
      setBlogConditionOptions([]);
    }
  };

  const loadPortfolioFilterOptions = async () => {
    if (!siteId || !locale) return;
    try {
      const response = await fetch(
        `/api/admin/content/file?siteId=${siteId}&locale=${locale}&path=${encodeURIComponent(
          'pages/portfolio.json'
        )}`
      );
      if (!response.ok) {
        setPortfolioCategoryOptions([]);
        setPortfolioStyleOptions([]);
        return;
      }
      const payload = await response.json();
      const parsed = payload?.content ? JSON.parse(payload.content) : {};

      const categories = Array.isArray(parsed?.filters?.categories)
        ? parsed.filters.categories
            .map((item: any) => ({
              value: String(item?.value || ''),
              label: String(item?.label || item?.value || ''),
              labelCn: typeof item?.labelCn === 'string' ? item.labelCn : undefined,
            }))
            .filter((item: any) => item.value)
        : [];

      const styles = Array.isArray(parsed?.filters?.styles)
        ? parsed.filters.styles
            .map((item: any) => ({
              value: String(item?.value || ''),
              label: String(item?.label || item?.value || ''),
              labelCn: typeof item?.labelCn === 'string' ? item.labelCn : undefined,
            }))
            .filter((item: any) => item.value)
        : [];

      setPortfolioCategoryOptions(categories);
      setPortfolioStyleOptions(styles);
    } catch {
      setPortfolioCategoryOptions([]);
      setPortfolioStyleOptions([]);
    }
  };

  const loadJournalFilterOptions = async () => {
    if (!siteId || !locale) return;
    try {
      const response = await fetch(
        `/api/admin/content/file?siteId=${siteId}&locale=${locale}&path=${encodeURIComponent(
          'pages/journal.json'
        )}`
      );
      if (!response.ok) {
        setJournalCategoryOptions([]);
        return;
      }
      const payload = await response.json();
      const parsed = payload?.content ? JSON.parse(payload.content) : {};
      const categories = Array.isArray(parsed?.filters?.categories)
        ? parsed.filters.categories
            .map((item: any) => ({
              value: String(item?.value || ''),
              label: String(item?.label || item?.value || ''),
              labelCn: typeof item?.labelCn === 'string' ? item.labelCn : undefined,
            }))
            .filter((item: any) => item.value)
        : [];
      setJournalCategoryOptions(categories);
    } catch {
      setJournalCategoryOptions([]);
    }
  };

  const loadShopFilterOptions = async () => {
    if (!siteId || !locale) return;
    try {
      const response = await fetch(
        `/api/admin/content/file?siteId=${siteId}&locale=${locale}&path=${encodeURIComponent(
          'pages/shop.json'
        )}`
      );
      if (!response.ok) {
        setShopCategoryOptions([]);
        setShopRoomOptions([]);
        return;
      }
      const payload = await response.json();
      const parsed = payload?.content ? JSON.parse(payload.content) : {};

      const categories = Array.isArray(parsed?.filters?.categories)
        ? parsed.filters.categories
            .map((item: any) => ({
              value: String(item?.value || ''),
              label: String(item?.label || item?.value || ''),
              labelCn: typeof item?.labelCn === 'string' ? item.labelCn : undefined,
            }))
            .filter((item: any) => item.value)
        : [];

      const rooms = Array.isArray(parsed?.filters?.rooms)
        ? parsed.filters.rooms
            .map((item: any) => ({
              value: String(item?.value || ''),
              label: String(item?.label || item?.value || ''),
              labelCn: typeof item?.labelCn === 'string' ? item.labelCn : undefined,
            }))
            .filter((item: any) => item.value)
        : [];

      setShopCategoryOptions(categories);
      setShopRoomOptions(rooms);
    } catch {
      setShopCategoryOptions([]);
      setShopRoomOptions([]);
    }
  };

  const loadTestimonialCategoryOptions = async () => {
    if (!siteId || !locale) return;
    try {
      const response = await fetch(
        `/api/admin/content/file?siteId=${siteId}&locale=${locale}&path=${encodeURIComponent(
          'pages/testimonials.json'
        )}`
      );
      if (!response.ok) {
        setTestimonialCategoryOptions([]);
        return;
      }
      const payload = await response.json();
      const parsed = payload?.content ? JSON.parse(payload.content) : {};
      const categories = Array.isArray(parsed?.display?.categories)
        ? parsed.display.categories
            .map((item: any) => ({
              value: String(item?.value || ''),
              label: String(item?.label || item?.value || ''),
              labelCn: typeof item?.labelCn === 'string' ? item.labelCn : undefined,
            }))
            .filter((item: any) => item.value && item.value !== 'all')
        : [];
      setTestimonialCategoryOptions(categories);
    } catch {
      setTestimonialCategoryOptions([]);
    }
  };

  const getPreviewPath = () => {
    if (!activeFile) return `/${locale}`;
    if (activeFile.path.startsWith('pages/')) {
      const slug = activeFile.path.replace('pages/', '').replace('.json', '');
      if (slug === 'home') return `/${locale}`;
      return `/${locale}/${slug}`;
    }
    if (activeFile.path.startsWith('portfolio/')) {
      const slug = activeFile.path.replace('portfolio/', '').replace('.json', '');
      return `/${locale}/portfolio/${slug}`;
    }
    if (activeFile.path.startsWith('shop-products/')) {
      const slug = activeFile.path.replace('shop-products/', '').replace('.json', '');
      return `/${locale}/shop/${slug}`;
    }
    if (activeFile.path.startsWith('journal/')) {
      const slug = activeFile.path.replace('journal/', '').replace('.json', '');
      return `/${locale}/journal/${slug}`;
    }
    if (activeFile.path.startsWith('collections/')) {
      const slug = activeFile.path.replace('collections/', '').replace('.json', '');
      return `/${locale}/collections/${slug}`;
    }
    if (activeFile.path === 'testimonials.json') {
      return `/${locale}/testimonials`;
    }
    return `/${locale}`;
  };

  const updateFormValue = (path: string[], value: any) => {
    if (!formData) return;
    if (path.length === 0) {
      setFormData(value);
      setContent(JSON.stringify(value, null, 2));
      return;
    }
    const next = { ...formData };
    let cursor: any = next;
    path.forEach((key, index) => {
      if (index === path.length - 1) {
        cursor[key] = value;
      } else {
        cursor[key] = cursor[key] ?? {};
        cursor = cursor[key];
      }
    });
    setFormData(next);
    setContent(JSON.stringify(next, null, 2));
  };

  const openImagePicker = (path: string[]) => {
    setImageFieldPath(path);
    setShowImagePicker(true);
  };

  const handleImageSelect = (url: string) => {
    if (!imageFieldPath) return;
    updateFormValue(imageFieldPath, url);
  };

  const toggleMarkdownPreview = (key: string) => {
    setMarkdownPreview((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const normalizeMarkdown = (text: string) =>
    text
      .replace(/\r\n/g, '\n')
      .replace(/([^\n])\n-\s+/g, '$1\n\n- ')
      .replace(/([^\n])\n\*\s+/g, '$1\n\n- ');

  const getPathValue = (path: string[]) =>
    path.reduce<any>((acc, key) => acc?.[key], formData);

  const isSeoFile = activeFile?.path === 'seo.json';
  const isBlogPostFile = activeFile?.path.startsWith('blog/');
  const isPortfolioItemFile = activeFile?.path.startsWith('portfolio/');
  const isJournalItemFile = activeFile?.path.startsWith('journal/');
  const isShopProductItemFile = activeFile?.path.startsWith('shop-products/');
  const isCollectionItemFile = activeFile?.path.startsWith('collections/');
  const isTestimonialsFile =
    activeFile?.path === 'testimonials.json' || activeFile?.path.startsWith('testimonials/');
  // REA-specific panels
  const isPropertyItemFile = activeFile?.path.startsWith('properties/');
  const isNeighborhoodItemFile = activeFile?.path.startsWith('neighborhoods/');
  const isMarketReportFile = activeFile?.path.startsWith('market-reports/');
  const isAgentItemFile = activeFile?.path.startsWith('agents/');
  const isKnowledgeCenterItemFile = activeFile?.path.startsWith('knowledge-center/');
  const isNewConstructionItemFile = activeFile?.path.startsWith('new-construction/');
  const isEventsItemFile = activeFile?.path.startsWith('events/');
  const isGuidesItemFile = activeFile?.path.startsWith('guides/');
  const isCaseStudiesItemFile = activeFile?.path.startsWith('case-studies/');
  const isResourcesItemFile = activeFile?.path.startsWith('resources/');
  const canDeleteActiveFile = Boolean(
    activeFile &&
      (
        activeFile.path.startsWith('pages/') ||
        activeFile.path.startsWith('blog/') ||
        activeFile.path.startsWith('portfolio/') ||
        activeFile.path.startsWith('shop-products/') ||
        activeFile.path.startsWith('journal/') ||
        activeFile.path.startsWith('collections/') ||
        activeFile.path.startsWith('properties/') ||
        activeFile.path.startsWith('neighborhoods/') ||
        activeFile.path.startsWith('market-reports/') ||
        activeFile.path.startsWith('agents/') ||
        activeFile.path.startsWith('knowledge-center/') ||
        activeFile.path.startsWith('new-construction/') ||
        activeFile.path.startsWith('events/') ||
        activeFile.path.startsWith('guides/') ||
        activeFile.path.startsWith('case-studies/') ||
        activeFile.path.startsWith('resources/')
      )
  );
  const isHeaderFile = activeFile?.path === 'header.json';
  const isFooterFile = activeFile?.path === 'footer.json';
  const isSiteFile = activeFile?.path === 'site.json';
  const isThemeFile = activeFile?.path === 'theme.json';
  const isHomePageFile = activeFile?.path === 'pages/home.json';
  const isAboutPageFile = activeFile?.path === 'pages/about.json';
  const isServicesPageFile = activeFile?.path === 'pages/services.json';
  const allowCreateOrDuplicate = fileFilter !== 'siteSettings';
  const variantSections = formData
    ? Object.entries(SECTION_VARIANT_OPTIONS).filter(
        ([key]) =>
          formData[key] &&
          typeof formData[key] === 'object' &&
          !Array.isArray(formData[key])
      )
    : [];
  const galleryCategories = Array.isArray(formData?.categories)
    ? formData.categories
        .map((category: any) => ({
          id: typeof category?.id === 'string' ? category.id : '',
          name: typeof category?.name === 'string' ? category.name : '',
        }))
        .filter((category: any) => category.id && category.name)
    : [];
  const caseStudyCategories = Array.isArray(formData?.categories)
    ? formData.categories
        .map((category: any) => ({
          id: typeof category?.id === 'string' ? category.id : '',
          name: typeof category?.name === 'string' ? category.name : '',
        }))
        .filter((category: any) => category.id && category.name)
    : [];
  const homePhotoFields = useMemo(() => {
    if (!isHomePageFile || !formData) return [] as Array<{ path: string[]; label: string }>;

    const fields: Array<{ path: string[]; label: string }> = [];
    const IMAGE_KEYS = new Set(['image', 'backgroundImage', 'beforeImage', 'afterImage', 'src', 'portrait']);
    const EXCLUDED_ROOT_KEYS = new Set(['menu', 'topBar', 'topbar']);
    const DISPLAY_KEYS = [
      'title',
      'name',
      'label',
      'condition',
      'businessName',
      'clinicName',
      'tagline',
      'text',
      'id',
      'slug',
    ];

    const getNodeDisplayLabel = (node: any, fallbackIndex?: number) => {
      if (!node || typeof node !== 'object') {
        return typeof fallbackIndex === 'number' ? `Item ${fallbackIndex + 1}` : '';
      }

      for (const key of DISPLAY_KEYS) {
        const value = node?.[key];
        if (typeof value === 'string' && value.trim()) {
          return key === 'id' || key === 'slug' ? toTitleCase(value) : value.trim();
        }
      }

      if (typeof fallbackIndex === 'number') {
        return `Item ${fallbackIndex + 1}`;
      }
      return '';
    };

    const collectFields = (node: any, path: string[] = [], contextHint = '') => {
      if (Array.isArray(node)) {
        node.forEach((item, index) => {
          const itemHint = getNodeDisplayLabel(item, index);
          collectFields(item, [...path, String(index)], itemHint);
        });
        return;
      }

      if (!node || typeof node !== 'object') {
        return;
      }

      Object.entries(node).forEach(([key, value]) => {
        if (path.length === 0 && EXCLUDED_ROOT_KEYS.has(key)) {
          return;
        }

        const nextPath = [...path, key];
        const isImageField = IMAGE_KEYS.has(key);

        if (isImageField && typeof value === 'string') {
          const sectionLabel = nextPath
            .filter((part) => !/^\d+$/.test(part))
            .map((part) => toTitleCase(part))
            .join(' > ');
          const localHint = getNodeDisplayLabel(node);
          const hint = localHint || contextHint;
          const label = hint ? `${sectionLabel} (${hint})` : sectionLabel;
          fields.push({ path: nextPath, label });
          return;
        }

        if (typeof value === 'object' && value !== null) {
          collectFields(value, nextPath, contextHint);
        }
      });
    };

    collectFields(formData);
    return fields;
  }, [isHomePageFile, formData]);
  const homeSectionImageFields = useMemo(() => {
    if (!isHomePageFile || !formData) return [] as Array<{ path: string[]; label: string }>;

    const fields: Array<{ path: string[]; label: string }> = [
      { path: ['featuredCollection', 'image'], label: 'Featured Collection > Image' },
      { path: ['portfolioPreview', 'image1'], label: 'Portfolio Preview > Image 1' },
      { path: ['portfolioPreview', 'image2'], label: 'Portfolio Preview > Image 2' },
      { path: ['portfolioPreview', 'image3'], label: 'Portfolio Preview > Image 3' },
      { path: ['portfolioPreview', 'image4'], label: 'Portfolio Preview > Image 4' },
      { path: ['portfolioPreview', 'image5'], label: 'Portfolio Preview > Image 5' },
      { path: ['portfolioPreview', 'image6'], label: 'Portfolio Preview > Image 6' },
      { path: ['shopPreview', 'image1'], label: 'Shop Preview > Image 1' },
      { path: ['shopPreview', 'image2'], label: 'Shop Preview > Image 2' },
      { path: ['shopPreview', 'image3'], label: 'Shop Preview > Image 3' },
      { path: ['shopPreview', 'image4'], label: 'Shop Preview > Image 4' },
      { path: ['shopPreview', 'image5'], label: 'Shop Preview > Image 5' },
      { path: ['shopPreview', 'image6'], label: 'Shop Preview > Image 6' },
      { path: ['journalPreview', 'image1'], label: 'Journal Preview > Image 1' },
      { path: ['journalPreview', 'image2'], label: 'Journal Preview > Image 2' },
      { path: ['journalPreview', 'image3'], label: 'Journal Preview > Image 3' },
    ];

    if (Array.isArray(formData?.servicesOverview?.services)) {
      formData.servicesOverview.services.forEach((service: any, index: number) => {
        const serviceName =
          String(service?.title || service?.titleCn || `Service ${index + 1}`).trim() ||
          `Service ${index + 1}`;
        fields.push({
          path: ['servicesOverview', 'services', String(index), 'image'],
          label: `Services Overview > ${serviceName} > Image`,
        });
      });
    }

    return fields;
  }, [isHomePageFile, formData]);

  const addSeoPage = () => {
    if (!formData) return;
    const slug = window.prompt('Page slug (example: services)');
    if (!slug) return;
    updateFormValue(['pages', slug], {
      title: '',
      description: '',
    });
  };

  const removeSeoPage = (slug: string) => {
    if (!formData) return;
    const next = { ...formData };
    if (next.pages && typeof next.pages === 'object') {
      const pages = { ...next.pages };
      delete pages[slug];
      next.pages = pages;
      setFormData(next);
      setContent(JSON.stringify(next, null, 2));
    }
  };

  const addGalleryImage = () => {
    if (!formData) return;
    const images = Array.isArray(formData.images) ? [...formData.images] : [];
    const maxOrder = images.reduce((max: number, image: any) => {
      const order = typeof image?.order === 'number' ? image.order : 0;
      return Math.max(max, order);
    }, 0);
    images.push({
      id: `gallery-${Date.now()}`,
      src: '',
      alt: '',
      title: '',
      category: '',
      description: '',
      featured: false,
      order: maxOrder + 1,
    });
    updateFormValue(['images'], images);
  };

  const removeGalleryImage = (index: number) => {
    if (!formData || !Array.isArray(formData.images)) return;
    const images = [...formData.images];
    images.splice(index, 1);
    updateFormValue(['images'], images);
  };

  const addPortfolioGalleryItem = () => {
    if (!formData) return;
    const gallery = Array.isArray(formData.gallery) ? [...formData.gallery] : [];
    gallery.push({
      image: '',
      alt: '',
      altCn: '',
      layout: 'full',
    });
    updateFormValue(['gallery'], gallery);
  };

  const removePortfolioGalleryItem = (index: number) => {
    if (!formData || !Array.isArray(formData.gallery)) return;
    const gallery = [...formData.gallery];
    gallery.splice(index, 1);
    updateFormValue(['gallery'], gallery);
  };

  const addCollectionMoodImage = () => {
    if (!formData) return;
    const moodImages = Array.isArray(formData.moodImages) ? [...formData.moodImages] : [];
    moodImages.push('');
    updateFormValue(['moodImages'], moodImages);
  };

  const removeCollectionMoodImage = (index: number) => {
    if (!formData || !Array.isArray(formData.moodImages)) return;
    const moodImages = [...formData.moodImages];
    moodImages.splice(index, 1);
    updateFormValue(['moodImages'], moodImages);
  };

  const addTestimonialItem = () => {
    if (!formData) return;
    const items = Array.isArray(formData.items) ? [...formData.items] : [];
    items.push({
      id: `t-${Date.now()}`,
      quote: '',
      quoteCn: '',
      author: '',
      authorCn: '',
      title: '',
      titleCn: '',
      category: '',
      projectSlug: '',
      rating: 5,
      featured: false,
      date: '',
    });
    updateFormValue(['items'], items);
  };

  const removeTestimonialItem = (index: number) => {
    if (!formData || !Array.isArray(formData.items)) return;
    const items = [...formData.items];
    items.splice(index, 1);
    updateFormValue(['items'], items);
  };

  const addHeaderMenuItem = () => {
    if (!formData) return;
    const items = Array.isArray(formData.menu?.items) ? [...formData.menu.items] : [];
    items.push({ text: '', url: '' });
    updateFormValue(['menu', 'items'], items);
  };

  const removeHeaderMenuItem = (index: number) => {
    if (!formData || !Array.isArray(formData.menu?.items)) return;
    const items = [...formData.menu.items];
    items.splice(index, 1);
    updateFormValue(['menu', 'items'], items);
  };

  const addHeaderLanguage = () => {
    if (!formData) return;
    const languages = Array.isArray(formData.languages) ? [...formData.languages] : [];
    languages.push({ label: '', locale: '', url: '' });
    updateFormValue(['languages'], languages);
  };

  const removeHeaderLanguage = (index: number) => {
    if (!formData || !Array.isArray(formData.languages)) return;
    const languages = [...formData.languages];
    languages.splice(index, 1);
    updateFormValue(['languages'], languages);
  };

  const toggleSelection = (path: string[], value: string) => {
    if (!formData) return;
    const current = Array.isArray(path.reduce<any>((acc, key) => acc?.[key], formData))
      ? (path.reduce<any>((acc, key) => acc?.[key], formData) as string[])
      : [];
    const exists = current.includes(value);
    const next = exists ? current.filter((item) => item !== value) : [...current, value];
    updateFormValue(path, next);
  };

  const populateSeoFromHeroes = async () => {
    if (!formData) return;
    setSeoPopulating(true);
    setStatus(null);
    try {
      const pageFiles = files
        .filter((file) => file.path.startsWith('pages/'))
        .map((file) => ({
          path: file.path,
          slug: file.path.replace('pages/', '').replace('.json', ''),
        }));

      const results = await Promise.all(
        pageFiles.map(async (page) => {
          try {
            const response = await fetch(
              `/api/admin/content/file?siteId=${siteId}&locale=${locale}&path=${encodeURIComponent(
                page.path
              )}`
            );
            if (!response.ok) {
              return null;
            }
            const payload = await response.json();
            const parsed = JSON.parse(payload.content || '{}');
            const hero = parsed?.hero;
            const title = hero?.title;
            const description = hero?.description || hero?.subtitle;
            if (!title && !description) {
              return null;
            }
            return { slug: page.slug, title, description };
          } catch (error) {
            return null;
          }
        })
      );

      const next = { ...formData };
      const pages = typeof next.pages === 'object' && next.pages ? { ...next.pages } : {};

      results.forEach((entry) => {
        if (!entry) return;
        if (entry.slug === 'home') {
          const currentHome = next.home || {};
          next.home = {
            title: currentHome.title || entry.title || '',
            description: currentHome.description || entry.description || '',
          };
          return;
        }

        const current = pages[entry.slug] || {};
        pages[entry.slug] = {
          title: current.title || entry.title || '',
          description: current.description || entry.description || '',
        };
      });

      next.pages = pages;
      setFormData(next);
      setContent(JSON.stringify(next, null, 2));
      setStatus('SEO populated from hero sections.');
    } catch (error: any) {
      setStatus(error?.message || 'Failed to populate SEO.');
    } finally {
      setSeoPopulating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {titleOverride || 'Content Editor'}
          </h1>
          <p className="text-sm text-gray-600">
            Select a site and locale to edit JSON content files.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div>
            <label className="block text-xs font-medium text-gray-500">Site</label>
            <select
              className="mt-1 rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={siteId}
              onChange={(event) => {
                setSiteId(event.target.value);
              }}
            >
              {sites.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">Locale</label>
            <select
              className="mt-1 rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={locale}
              onChange={(event) => setLocale(event.target.value as Locale)}
            >
              {availableLocales.map((item) => (
                <option key={item} value={item}>
                  {item === 'en' ? 'English' : item === 'zh' ? 'Chinese' : item}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2 pt-4 sm:pt-0">
            <button
              type="button"
              onClick={() => handleImport('missing')}
              disabled={importing || loading}
              className="px-3 py-2 rounded-md border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              {importing ? 'Importing…' : 'Import JSON'}
            </button>
            <button
              type="button"
              onClick={handleCheckUpdateFromDb}
              disabled={importing || loading}
              className="px-3 py-2 rounded-md border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              Check Update From DB
            </button>
            <button
              type="button"
              onClick={handleOverwriteImport}
              disabled={importing || loading}
              className="px-3 py-2 rounded-md border border-amber-200 text-xs text-amber-700 hover:bg-amber-50 disabled:opacity-60"
            >
              {importing ? 'Importing…' : 'Overwrite Import'}
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={exporting || loading}
              className="px-3 py-2 rounded-md border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              {exporting ? 'Exporting…' : 'Export JSON'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
            {filesTitle}
          </div>
          {loading && files.length === 0 ? (
            <div className="text-sm text-gray-500">Loading…</div>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <button
                  key={file.id}
                  type="button"
                  onClick={() => setActiveFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                    activeFile?.id === file.id
                      ? 'bg-[var(--primary)] text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="font-medium">{file.label}</div>
                  <div className="text-xs opacity-70">{file.path}</div>
                  {fileFilter === 'blog' && file.publishDate && (
                    <div className="text-[11px] text-gray-500 mt-1">
                      {new Date(file.publishDate).toLocaleDateString(
                        locale === 'zh' ? 'zh-CN' : 'en-US',
                        { year: 'numeric', month: 'short', day: 'numeric' }
                      )}
                    </div>
                  )}
                </button>
              ))}
              {files.length === 0 && (
                <div className="text-sm text-gray-500">
                  {fileFilter === 'blog'
                    ? 'No blog posts found for this locale.'
                    : 'No content files found for this locale.'}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-semibold text-gray-900">
                {activeFile?.label || 'Select a file'}
              </div>
              <div className="text-xs text-gray-500">{activeFile?.path}</div>
            </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.open(getPreviewPath(), '_blank')}
            className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50"
          >
            Preview
          </button>
          {allowCreateOrDuplicate && (
            <button
              type="button"
              onClick={handleCreate}
              className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50"
            >
              {fileFilter === 'blog' ? 'New Post' : fileFilter === 'all' ? 'New Page' : 'New Item'}
            </button>
          )}
          {allowCreateOrDuplicate && (
            <button
              type="button"
              onClick={handleDuplicate}
              disabled={!activeFile}
              className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Duplicate
            </button>
          )}
          <button
            type="button"
            onClick={handleFormat}
            disabled={!activeFile}
            className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Format
          </button>
          {canDeleteActiveFile && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-2 rounded-lg border border-red-200 text-xs text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            )}
          <Button onClick={handleSave} disabled={!activeFile}>
            Save
          </Button>
        </div>
          </div>

          {status && (
            <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
              {status}
            </div>
          )}

          <div className="flex items-center gap-2 mb-3">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`px-3 py-1.5 rounded-md text-xs ${
                activeTab === 'form'
                  ? 'bg-[var(--primary)] text-white'
                  : 'border border-gray-200 text-gray-700'
              }`}
            >
              Form
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1.5 rounded-md text-xs ${
                activeTab === 'json'
                  ? 'bg-[var(--primary)] text-white'
                  : 'border border-gray-200 text-gray-700'
              }`}
            >
              JSON
            </button>
            <button
              type="button"
              onClick={() => setShowDynamicFields((current) => !current)}
              className={`px-3 py-1.5 rounded-md text-xs ${
                showDynamicFields
                  ? 'bg-gray-900 text-white'
                  : 'border border-gray-200 text-gray-700'
              }`}
            >
              Dynamic Fields
            </button>
          </div>

          {activeTab === 'form' ? (
            <div className="space-y-6 text-sm">
              {!formData && (
                <div className="text-sm text-gray-500">
                  Invalid JSON. Switch to JSON tab to fix.
                </div>
              )}

              {isSeoFile && formData && (
                <SeoPanel
                  formData={formData}
                  seoPopulating={seoPopulating}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                  populateSeoFromHeroes={populateSeoFromHeroes}
                />
              )}

              {isHeaderFile && formData && (
                <HeaderPanel
                  formData={formData}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                  addHeaderMenuItem={addHeaderMenuItem}
                  removeHeaderMenuItem={removeHeaderMenuItem}
                  addHeaderLanguage={addHeaderLanguage}
                  removeHeaderLanguage={removeHeaderLanguage}
                />
              )}

              {isFooterFile && formData && (
                <FooterPanel
                  formData={formData}
                  updateFormValue={updateFormValue}
                />
              )}

              {isSiteFile && formData && (
                <SitePanel
                  formData={formData}
                  updateFormValue={updateFormValue}
                />
              )}

              {isThemeFile && formData && (
                <ThemePanel
                  getPathValue={getPathValue}
                  updateFormValue={updateFormValue}
                />
              )}

              {formData && variantSections.length > 0 && (
                <SectionVariantsPanel
                  variantSections={variantSections}
                  getPathValue={getPathValue}
                  updateFormValue={updateFormValue}
                  toTitleCase={toTitleCase}
                />
              )}

              {isHomePageFile && homePhotoFields.length > 0 && (
                <HomeSectionPhotosPanel
                  homePhotoFields={homePhotoFields}
                  getPathValue={getPathValue}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                />
              )}

              {isHomePageFile && homeSectionImageFields.length > 0 && (
                <HomeSectionVisualsPanel
                  homeSectionImageFields={homeSectionImageFields}
                  getPathValue={getPathValue}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                />
              )}

              {isAboutPageFile && formData && (
                <AboutPagePanel
                  formData={formData}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                />
              )}

              {formData?.hero && !isAboutPageFile && (
                <HeroPanel
                  formData={formData}
                  isHomePageFile={isHomePageFile}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                />
              )}

              {formData?.profile && (
                <ProfilePanel
                  formData={formData}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                />
              )}

              {formData?.introduction && (
                <IntroductionPanel
                  formData={formData}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                />
              )}

              {Array.isArray(formData?.images) && (
                <GalleryPhotosPanel
                  images={formData.images}
                  galleryCategories={galleryCategories}
                  addGalleryImage={addGalleryImage}
                  removeGalleryImage={removeGalleryImage}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                />
              )}

              {formData?.cta && !isAboutPageFile && (
                <CtaPanel
                  formData={formData}
                  updateFormValue={updateFormValue}
                />
              )}

              {Array.isArray(formData?.services) && !formData?.servicesList && (
                <ServicesPanel
                  services={formData.services}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                />
              )}

              {formData?.servicesList && (
                <ServicesListPanel
                  servicesList={formData.servicesList}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                />
              )}

              {Array.isArray(formData?.conditions) && (
                <ConditionsPanel
                  conditions={formData.conditions}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                />
              )}

              {Array.isArray(formData?.caseStudies) && (
                <CaseStudiesPanel
                  caseStudies={formData.caseStudies}
                  caseStudyCategories={caseStudyCategories}
                  markdownPreview={markdownPreview}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                  toggleMarkdownPreview={toggleMarkdownPreview}
                  normalizeMarkdown={normalizeMarkdown}
                />
              )}

              {formData?.featuredPost && (
                <FeaturedPostPanel
                  featuredPost={formData.featuredPost}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                />
              )}

              {Array.isArray(formData?.posts) && (
                <PostsPanel
                  posts={formData.posts}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                />
              )}

              {isPropertyItemFile && formData && (
                <PropertyItemPanel
                  formData={formData}
                  updateFormValue={(path: string, value: any) => updateFormValue(path.split('.'), value)}
                  openImagePicker={(field: string) => openImagePicker(field.split('.'))}
                />
              )}

              {isNeighborhoodItemFile && formData && (
                <NeighborhoodItemPanel
                  formData={formData}
                  updateFormValue={(path: string, value: any) => updateFormValue(path.split('.'), value)}
                  openImagePicker={(field: string) => openImagePicker(field.split('.'))}
                />
              )}

              {isMarketReportFile && formData && (
                <MarketReportPanel
                  formData={formData}
                  updateFormValue={(path: string, value: any) => updateFormValue(path.split('.'), value)}
                />
              )}

              {isAgentItemFile && formData && (
                <AgentItemPanel
                  formData={formData}
                  updateFormValue={(path: string, value: any) => updateFormValue(path.split('.'), value)}
                  openImagePicker={(field: string) => openImagePicker(field.split('.'))}
                />
              )}

              {(isKnowledgeCenterItemFile || isNewConstructionItemFile || isEventsItemFile || isGuidesItemFile || isCaseStudiesItemFile || isResourcesItemFile) && formData && (
                <JsonMatchingPanel
                  formData={formData}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                />
              )}

              {showDynamicFields && formData && typeof formData === 'object' && (
                <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="text-xs font-semibold text-gray-500 uppercase">
                    Dynamic Fields (Advanced)
                  </div>
                  <p className="text-xs text-gray-500">
                    Use this to add/edit arbitrary JSON keys that are not covered by fixed panels.
                  </p>
                  <JsonMatchingPanel
                    formData={formData}
                    updateFormValue={updateFormValue}
                    openImagePicker={openImagePicker}
                  />
                </div>
              )}

              {isTestimonialsFile && formData && (
                <REATestimonialsPanel
                  formData={formData}
                  updateFormValue={(path: string, value: any) => updateFormValue(path.split('.'), value)}
                />
              )}

              {isBlogPostFile && formData?.slug && (
                <BlogPostItemPanel
                  formData={formData}
                  updateFormValue={(path: string, value: any) => updateFormValue(path.split('.'), value)}
                  openImagePicker={(field: string) => openImagePicker(field.split('.'))}
                />
              )}

              {isJournalItemFile && formData && (
                <JournalItemPanel
                  formData={formData}
                  locale={locale}
                  journalCategoryOptions={journalCategoryOptions}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                />
              )}

              {formData && !formData.hero && !formData.introduction && !formData.cta && !isSeoFile && !isHeaderFile && !isFooterFile && !isSiteFile && !isThemeFile && !isBlogPostFile && !isJournalItemFile && !isPropertyItemFile && !isNeighborhoodItemFile && !isMarketReportFile && !isAgentItemFile && !isKnowledgeCenterItemFile && !isNewConstructionItemFile && !isEventsItemFile && !isGuidesItemFile && !isCaseStudiesItemFile && !isResourcesItemFile && !isTestimonialsFile && (
                <div className="text-sm text-gray-500">
                  No schema panels available for this file yet. Use the JSON tab.
                </div>
              )}
            </div>
          ) : (
            <textarea
              className="w-full min-h-[520px] rounded-lg border border-gray-200 p-3 font-mono text-xs text-gray-800"
              value={content}
              onChange={(event) => {
                const next = event.target.value;
                setContent(next);
                try {
                  setFormData(JSON.parse(next));
                } catch (error) {
                  setFormData(null);
                }
              }}
              placeholder="Select a file to begin editing."
            />
          )}
        </div>
      </div>
      <ImagePickerModal
        open={showImagePicker}
        siteId={siteId}
        onClose={() => setShowImagePicker(false)}
        onSelect={handleImageSelect}
      />
    </div>
  );
}

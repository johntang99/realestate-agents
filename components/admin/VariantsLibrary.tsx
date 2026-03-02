'use client';

import { useMemo, useState } from 'react';

interface VariantDefinition {
  id: string;
  label: string;
  description: string;
}

interface SectionDefinition {
  id: string;
  label: string;
  description: string;
  variants: VariantDefinition[];
  examplePath: string;
}

const SECTIONS: SectionDefinition[] = [
  {
    id: 'hero',
    label: 'Hero',
    description: 'Top-of-page hero layout.',
    examplePath: 'hero.variant',
    variants: [
      { id: 'centered', label: 'Centered', description: 'Text centered, classic hero.' },
      { id: 'split-photo-right', label: 'Split Photo Right', description: 'Text left, image right.' },
      { id: 'split-photo-left', label: 'Split Photo Left', description: 'Text right, image left.' },
      { id: 'overlap', label: 'Overlap', description: 'Text card overlaps photo.' },
      { id: 'photo-background', label: 'Photo Background', description: 'Full-bleed photo background.' },
      { id: 'video-background', label: 'Video Background', description: 'Full-bleed video background.' },
      { id: 'gallery-background', label: 'Gallery Background', description: 'Rotating gallery background.' },
    ],
  },
  {
    id: 'menu',
    label: 'Menu',
    description: 'Header/menu layout.',
    examplePath: 'menu.variant',
    variants: [
      { id: 'default', label: 'Default', description: 'Logo left, menu in one row.' },
      { id: 'stacked', label: 'Stacked', description: 'Logo centered, menu below.' },
      { id: 'centered', label: 'Centered', description: 'Centered header layout.' },
      { id: 'transparent', label: 'Transparent', description: 'Transparent header style.' },
    ],
  },
  {
    id: 'testimonials',
    label: 'Testimonials',
    description: 'Patient stories and social proof.',
    examplePath: 'testimonials.variant',
    variants: [
      { id: 'carousel', label: 'Carousel', description: 'Auto-rotating horizontal carousel.' },
      { id: 'grid', label: 'Grid', description: 'Static grid layout.' },
      { id: 'masonry', label: 'Masonry', description: 'Pinterest-style masonry.' },
      { id: 'slider-vertical', label: 'Slider Vertical', description: 'Stacked vertical list.' },
      { id: 'featured-single', label: 'Featured Single', description: 'One featured testimonial.' },
    ],
  },
  {
    id: 'services',
    label: 'Services',
    description: 'Service listings and featured service.',
    examplePath: 'services.variant',
    variants: [
      { id: 'grid-cards', label: 'Grid Cards', description: 'Equal-sized cards grid.' },
      { id: 'featured-large', label: 'Featured Large', description: 'One large featured card.' },
      { id: 'list-horizontal', label: 'List Horizontal', description: 'Horizontal scroll list.' },
      { id: 'accordion', label: 'Accordion', description: 'Expandable accordion list.' },
      { id: 'tabs', label: 'Tabs', description: 'Tabbed interface.' },
    ],
  },
  {
    id: 'howItWorks',
    label: 'How It Works',
    description: 'Process/steps section.',
    examplePath: 'howItWorks.variant',
    variants: [
      { id: 'horizontal', label: 'Horizontal', description: 'Steps in a row.' },
      { id: 'vertical', label: 'Vertical', description: 'Steps in a vertical list.' },
      { id: 'cards', label: 'Cards', description: 'Steps as cards.' },
      { id: 'vertical-image-right', label: 'Vertical + Image', description: 'Steps left, image right.' },
    ],
  },
  {
    id: 'conditions',
    label: 'Conditions',
    description: 'Conditions lists and category views.',
    examplePath: 'conditions.variant',
    variants: [
      { id: 'grid-cards', label: 'Grid Cards', description: 'Card grid.' },
      { id: 'categories-tabs', label: 'Categories Tabs', description: 'Tabbed by category.' },
      { id: 'list-detailed', label: 'List Detailed', description: 'Detailed list view.' },
      { id: 'icon-grid', label: 'Icon Grid', description: 'Icon + title grid.' },
    ],
  },
  {
    id: 'blog',
    label: 'Blog Preview',
    description: 'Homepage blog preview section.',
    examplePath: 'blog.variant',
    variants: [
      { id: 'cards-grid', label: 'Cards Grid', description: 'Card grid layout.' },
      { id: 'featured-side', label: 'Featured Side', description: 'Featured + list.' },
      { id: 'list-detailed', label: 'List Detailed', description: 'Detailed list view.' },
      { id: 'carousel', label: 'Carousel', description: 'Horizontal carousel.' },
    ],
  },
  {
    id: 'gallery',
    label: 'Gallery',
    description: 'Photo gallery layouts.',
    examplePath: 'gallery.variant',
    variants: [
      { id: 'grid-masonry', label: 'Grid Masonry', description: 'Masonry grid.' },
      { id: 'grid-uniform', label: 'Grid Uniform', description: 'Uniform grid.' },
      { id: 'carousel', label: 'Carousel', description: 'Carousel slider.' },
      { id: 'lightbox-grid', label: 'Lightbox Grid', description: 'Grid with lightbox.' },
    ],
  },
  {
    id: 'cta',
    label: 'CTA',
    description: 'Call-to-action section.',
    examplePath: 'cta.variant',
    variants: [
      { id: 'centered', label: 'Centered', description: 'Centered content.' },
      { id: 'split', label: 'Split', description: 'Split text and image.' },
      { id: 'banner', label: 'Banner', description: 'Full-width banner.' },
      { id: 'card-elevated', label: 'Card Elevated', description: 'Elevated card style.' },
    ],
  },
  {
    id: 'statistics',
    label: 'Stats',
    description: 'Statistics blocks (e.g., case studies).',
    examplePath: 'statistics.variant',
    variants: [
      { id: 'horizontal-row', label: 'Horizontal Row', description: 'Single row.' },
      { id: 'grid-2x2', label: 'Grid 2x2', description: '2x2 grid.' },
      { id: 'vertical-cards', label: 'Vertical Cards', description: 'Stacked cards.' },
      { id: 'inline-badges', label: 'Inline Badges', description: 'Inline badges.' },
    ],
  },
  {
    id: 'form',
    label: 'Form',
    description: 'Contact form layout.',
    examplePath: 'form.variant',
    variants: [
      { id: 'single-column', label: 'Single Column', description: 'Stacked fields.' },
      { id: 'two-column', label: 'Two Column', description: 'Two-column fields.' },
      { id: 'multi-step', label: 'Multi-step', description: 'Wizard/steps.' },
      { id: 'modal', label: 'Modal', description: 'Modal form.' },
      { id: 'inline-minimal', label: 'Inline Minimal', description: 'Inline minimal form.' },
    ],
  },
];

export function VariantsLibrary() {
  const [activeId, setActiveId] = useState(SECTIONS[0]?.id || 'hero');

  const activeSection = useMemo(
    () => SECTIONS.find((section) => section.id === activeId) || SECTIONS[0],
    [activeId]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Variants</h1>
        <p className="text-sm text-gray-600">
          Browse layout variants and apply them in JSON.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
            Sections
          </div>
          <div className="space-y-2">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveId(section.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                  activeSection?.id === section.id
                    ? 'bg-[var(--primary)] text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="font-medium">{section.label}</div>
                <div className="text-xs opacity-70">{section.examplePath}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {activeSection?.label}
            </div>
            <p className="text-sm text-gray-600">{activeSection?.description}</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {activeSection?.variants.map((variant) => (
              <div
                key={variant.id}
                className="border border-gray-200 rounded-lg p-3 space-y-2"
              >
                <div className="text-sm font-semibold text-gray-900">
                  {variant.label}
                </div>
                <div className="text-xs text-gray-600">{variant.description}</div>
                <pre className="text-xs bg-gray-50 border border-gray-200 rounded-md p-2 overflow-auto">
{`{
  "${activeSection.id}": {
    "variant": "${variant.id}"
  }
}`}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

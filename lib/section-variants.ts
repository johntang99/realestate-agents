// ============================================
// SECTION VARIANT SYSTEM
// Defines different layout variants for each section type
// ============================================

export type HeroVariant = 
  | 'centered'              // Text centered, background image
  | 'split-photo-right'     // Text left, photo right
  | 'split-photo-left'      // Text right, photo left
  | 'overlap'               // Text overlaps photo
  | 'photo-background'      // Photo as full background
  | 'video-background'      // Video as background
  | 'gallery-background';   // Photo carousel/gallery background

export type TestimonialsVariant =
  | 'carousel'              // Horizontal carousel
  | 'grid'                  // Static grid layout
  | 'masonry'               // Pinterest-style masonry
  | 'slider-vertical'       // Vertical slider
  | 'featured-single';      // One large testimonial

export type ServicesVariant =
  | 'grid-cards'            // Legacy grid-cards (mapped to detail-alternating)
  | 'grid-cards-2x'         // Card grid, 2 columns
  | 'grid-cards-3x'         // Card grid, 3 columns
  | 'featured-large'        // One large + smaller cards
  | 'list-horizontal'       // Horizontal scrolling list
  | 'accordion'             // Expandable accordion
  | 'tabs'                  // Tabbed interface
  | 'detail-alternating'    // Alternating detail rows
  | 'detail-image-right';   // Detail rows with image always on right

export type ConditionsVariant =
  | 'grid-cards'            // Card grid
  | 'categories-tabs'       // Tabbed by category
  | 'list-detailed'         // Detailed list view
  | 'icon-grid';            // Icon + title grid

export type CTAVariant =
  | 'centered'              // Centered text + buttons
  | 'split'                 // Text + image split
  | 'banner'                // Full-width banner
  | 'card-elevated';        // Elevated card style

export type GalleryVariant =
  | 'grid-masonry'          // Masonry grid
  | 'grid-uniform'          // Uniform grid
  | 'carousel'              // Carousel slider
  | 'lightbox-grid';        // Grid with lightbox

export type BlogPreviewVariant =
  | 'cards-grid'            // Grid of cards
  | 'featured-side'         // Large featured + list
  | 'list-detailed'         // Detailed list view
  | 'carousel';             // Horizontal carousel

export type StatsVariant =
  | 'horizontal-row'        // Single row
  | 'grid-2x2'              // 2x2 grid
  | 'vertical-cards'        // Vertical stacked cards
  | 'inline-badges';        // Inline badges

export type FormVariant =
  | 'single-column'         // Stacked fields
  | 'two-column'            // Side-by-side fields
  | 'multi-step'            // Wizard/steps
  | 'modal'                 // In modal popup
  | 'inline-minimal';       // Inline minimal form

// ============================================
// SECTION VARIANT CONFIGURATIONS
// ============================================

export interface SectionVariantConfig {
  variant: string;
  className?: string;
  layout?: 'container' | 'full-width' | 'narrow';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'none' | 'gradient' | 'image' | 'video';
}

// Default configurations for each variant
export const heroVariantConfig: Record<HeroVariant, SectionVariantConfig> = {
  'centered': {
    variant: 'centered',
    layout: 'container',
    padding: 'xl',
    className: 'text-center',
  },
  'split-photo-right': {
    variant: 'split-photo-right',
    layout: 'container',
    padding: 'lg',
    className: 'grid md:grid-cols-2 gap-12 items-center',
  },
  'split-photo-left': {
    variant: 'split-photo-left',
    layout: 'container',
    padding: 'lg',
    className: 'grid md:grid-cols-2 gap-12 items-center',
  },
  'overlap': {
    variant: 'overlap',
    layout: 'full-width',
    padding: 'none',
    className: 'relative',
  },
  'photo-background': {
    variant: 'photo-background',
    layout: 'full-width',
    padding: 'xl',
    background: 'image',
    className: 'relative bg-cover bg-center',
  },
  'video-background': {
    variant: 'video-background',
    layout: 'full-width',
    padding: 'xl',
    background: 'video',
    className: 'relative overflow-hidden',
  },
  'gallery-background': {
    variant: 'gallery-background',
    layout: 'full-width',
    padding: 'xl',
    className: 'relative',
  },
};

export const testimonialsVariantConfig: Record<TestimonialsVariant, SectionVariantConfig> = {
  'carousel': {
    variant: 'carousel',
    layout: 'container',
    padding: 'lg',
  },
  'grid': {
    variant: 'grid',
    layout: 'container',
    padding: 'lg',
    className: 'grid md:grid-cols-2 lg:grid-cols-3 gap-6',
  },
  'masonry': {
    variant: 'masonry',
    layout: 'container',
    padding: 'lg',
    className: 'columns-1 md:columns-2 lg:columns-3 gap-6',
  },
  'slider-vertical': {
    variant: 'slider-vertical',
    layout: 'narrow',
    padding: 'lg',
  },
  'featured-single': {
    variant: 'featured-single',
    layout: 'narrow',
    padding: 'lg',
    className: 'text-center',
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get variant configuration for a section
 */
export function getSectionVariant<T extends SectionVariantConfig>(
  variants: Record<string, T>,
  variantName: string
): T {
  return variants[variantName] || Object.values(variants)[0];
}

/**
 * Apply section variant styles
 */
export function getSectionClasses(config: SectionVariantConfig): string {
  const baseClasses = 'section-variant';
  
  const layoutClasses = {
    container: 'container-custom',
    'full-width': 'w-full',
    narrow: 'max-w-4xl mx-auto px-4',
  };
  
  const paddingClasses = {
    none: '',
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-16',
    lg: 'py-16 md:py-24',
    xl: 'py-20 md:py-32',
  };
  
  return [
    baseClasses,
    layoutClasses[config.layout || 'container'],
    paddingClasses[config.padding || 'md'],
    config.className || '',
  ].filter(Boolean).join(' ');
}

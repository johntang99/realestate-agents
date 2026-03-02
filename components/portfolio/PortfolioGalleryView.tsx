'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Locale } from '@/lib/i18n';

interface GalleryImage {
  image?: string;
  alt?: string;
  altCn?: string;
  layout?: 'full' | 'half';
}

interface PortfolioGalleryViewProps {
  locale: Locale;
  gallery: GalleryImage[];
}

function tx(en?: string, cn?: string, locale?: Locale) {
  return locale === 'zh' && cn ? cn : en || '';
}

export default function PortfolioGalleryView({ locale, gallery }: PortfolioGalleryViewProps) {
  const [mode, setMode] = useState<'listing' | 'slide'>('listing');
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = useMemo(() => gallery, [gallery]);

  const listingBlocks = useMemo(() => {
    const result: React.ReactNode[] = [];
    let i = 0;
    while (i < gallery.length) {
      const item = gallery[i];
      if (item.layout === 'full' || i === gallery.length - 1) {
        result.push(
          <div key={`full-${i}`} className="relative w-full aspect-[16/9] image-frame photo-shadow-lg">
            {item.image ? (
              <Image
                src={item.image}
                alt={tx(item.alt, item.altCn, locale) || ''}
                fill
                className="object-cover"
                sizes="100vw"
              />
            ) : (
              <div className="w-full h-full bg-[var(--primary-50)]" />
            )}
          </div>
        );
        i += 1;
      } else {
        const next = gallery[i + 1];
        result.push(
          <div key={`half-${i}`} className="grid grid-cols-2 detail-gap-gallery-pair">
            {[item, next].map((img, j) => (
              <div key={j} className="relative aspect-[4/3] image-frame photo-shadow-sm">
                {img?.image ? (
                  <Image
                    src={img.image}
                    alt={tx(img.alt, img.altCn, locale) || ''}
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--primary-50)]" />
                )}
              </div>
            ))}
          </div>
        );
        i += 2;
      }
    }
    return result;
  }, [gallery, locale]);

  const goPrev = () => setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  const goNext = () => setActiveIndex((prev) => (prev + 1) % slides.length);

  return (
    <section className="bg-white" style={{ paddingBottom: 'var(--detail-gallery-pb, 4rem)' }}>
      <div className="container-custom">
        <div className="mb-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode('listing')}
            className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
              mode === 'listing'
                ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                : 'border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--primary)]'
            }`}
          >
            Listing
          </button>
          <button
            type="button"
            onClick={() => setMode('slide')}
            className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
              mode === 'slide'
                ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                : 'border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--primary)]'
            }`}
          >
            Slide
          </button>
        </div>

        {mode === 'listing' ? (
          <div className="detail-space-y-md">{listingBlocks}</div>
        ) : (
          <div className="relative">
            <div className="relative h-[460px] md:h-[600px] w-full image-frame photo-shadow-lg bg-[var(--primary-50)]">
              {slides[activeIndex]?.image ? (
                <Image
                  src={slides[activeIndex].image || ''}
                  alt={tx(slides[activeIndex].alt, slides[activeIndex].altCn, locale) || ''}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              ) : (
                <div className="w-full h-full bg-[var(--primary-50)]" />
              )}
            </div>
            {slides.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 flex items-center justify-center text-[var(--primary)] shadow-sm"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 flex items-center justify-center text-[var(--primary)] shadow-sm"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}


'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import type { Locale } from '@/lib/i18n';

interface HeroSlide {
  image?: string;
  alt?: string;
  altCn?: string;
}

interface HeroBackgroundSlideshowProps {
  slides: HeroSlide[];
  locale: Locale;
  rotate?: boolean;
  imageOpacity?: number;
}

function tx(en: string | undefined, cn: string | undefined, locale: Locale): string {
  return locale === 'zh' && cn ? cn : en || '';
}

export default function HeroBackgroundSlideshow({
  slides,
  locale,
  rotate = true,
  imageOpacity = 1,
}: HeroBackgroundSlideshowProps) {
  const usableSlides = useMemo(() => slides.filter((slide) => Boolean(slide.image)), [slides]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!rotate || usableSlides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % usableSlides.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [rotate, usableSlides.length]);

  if (usableSlides.length === 0) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(160deg, var(--primary, #2C2C2C) 0%, var(--primary-dark, #1A1A1A) 60%, var(--primary-light, #4A4A4A) 100%)',
        }}
      />
    );
  }

  return (
    <div className="absolute inset-0">
      {usableSlides.map((slide, index) => (
        <div
          key={`${slide.image}-${index}`}
          className="absolute inset-0 transition-opacity duration-[1400ms] ease-in-out"
          style={{ opacity: index === activeIndex ? 1 : 0 }}
        >
          <Image
            src={slide.image!}
            alt={tx(slide.alt, slide.altCn, locale) || 'Jin Pang Homes'}
            fill
            className="object-cover"
            style={{ opacity: imageOpacity }}
            priority={index === 0}
            sizes="100vw"
          />
        </div>
      ))}
    </div>
  );
}

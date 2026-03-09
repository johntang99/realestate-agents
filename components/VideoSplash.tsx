'use client';

import { useEffect, useState } from 'react';

interface VideoSplashProps {
  src: string;
  skipAfter?: number;
}

export default function VideoSplash({ src, skipAfter = 2 }: VideoSplashProps) {
  const [visible, setVisible] = useState(Boolean(src));
  const [fading, setFading] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    if (!src) return;
    setVisible(true);
    const skipTimer = window.setTimeout(() => setShowSkip(true), skipAfter * 1000);
    return () => window.clearTimeout(skipTimer);
  }, [src, skipAfter]);

  const dismiss = () => {
    if (!visible || fading) return;
    setFading(true);
    window.setTimeout(() => setVisible(false), 500);
  };

  const handleVideoError = () => {
    // If onboarding generated a video path that does not exist,
    // remove the splash so the page content remains accessible.
    dismiss();
  };

  if (!visible || !src) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#000',
        transition: 'opacity 0.5s ease',
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      <video
        src={src}
        autoPlay
        muted
        playsInline
        onEnded={dismiss}
        onError={handleVideoError}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />

      {showSkip && (
        <button
          onClick={dismiss}
          className="absolute bottom-8 right-8 text-xs tracking-[0.16em] uppercase px-5 py-2 border"
          style={{
            borderColor: 'rgba(201,169,110,0.55)',
            color: 'var(--secondary)',
            background: 'rgba(0,0,0,0.45)',
            borderRadius: 'var(--effect-button-radius)',
          }}
        >
          Skip
        </button>
      )}
    </div>
  );
}

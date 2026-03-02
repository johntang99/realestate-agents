type TrackLeadEventInput = {
  siteId: string;
  locale: string;
  eventName: string;
  source: string;
  pagePath?: string;
  metadata?: Record<string, unknown>;
};

export async function trackLeadEvent(input: TrackLeadEventInput) {
  const payload = {
    siteId: input.siteId,
    locale: input.locale,
    eventName: input.eventName,
    source: input.source,
    pagePath: input.pagePath || '',
    metadata: input.metadata || {},
  };

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const body = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('/api/lead-events', body);
      return;
    }
    await fetch('/api/lead-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Swallow tracking errors to avoid impacting UX.
  }
}

const UPLOADS_PREFIX = '/uploads/';

export function getSupabasePublicBaseUrl() {
  const rawUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_PROD_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_STAGING_URL ||
    process.env.SUPABASE_URL ||
    process.env.SUPABASE_PROD_URL ||
    process.env.SUPABASE_STAGING_URL ||
    '';
  const bucket =
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
    process.env.SUPABASE_STORAGE_BUCKET ||
    '';

  if (!rawUrl || !bucket) return null;

  try {
    const origin = new URL(rawUrl).origin;
    return `${origin}/storage/v1/object/public/${bucket}`;
  } catch {
    return null;
  }
}

export function resolveMediaUrl(src?: string | null): string {
  if (!src) return '';
  if (/^https?:\/\//i.test(src)) return src;
  if (!src.startsWith(UPLOADS_PREFIX)) return src;

  const publicBase = getSupabasePublicBaseUrl();
  if (!publicBase) return src;

  const objectPath = src.slice(UPLOADS_PREFIX.length);
  return `${publicBase}/${objectPath}`;
}

function toSupabaseMediaUrl(
  src: string,
  fallbackSiteId?: string,
  publicBase?: string | null
): string {
  if (/^https?:\/\//i.test(src)) return src;
  if (!src.startsWith(UPLOADS_PREFIX)) return src;
  if (!publicBase) return src;

  const trimmed = src.slice(UPLOADS_PREFIX.length);
  const segments = trimmed.split('/').filter(Boolean);
  if (segments.length === 0) return src;

  const hasSitePrefix = segments.length >= 2;
  const objectPath = hasSitePrefix
    ? trimmed
    : fallbackSiteId
      ? `${fallbackSiteId}/${trimmed}`
      : trimmed;

  return `${publicBase}/${objectPath}`;
}

export function normalizeMediaUrlsInData<T>(value: T, fallbackSiteId?: string): T {
  const publicBase = getSupabasePublicBaseUrl();

  const visit = (input: unknown): unknown => {
    if (typeof input === 'string') {
      return toSupabaseMediaUrl(input, fallbackSiteId, publicBase);
    }
    if (Array.isArray(input)) {
      return input.map((item) => visit(item));
    }
    if (input && typeof input === 'object') {
      const next: Record<string, unknown> = {};
      for (const [key, nested] of Object.entries(input as Record<string, unknown>)) {
        next[key] = visit(nested);
      }
      return next;
    }
    return input;
  };

  return visit(value) as T;
}

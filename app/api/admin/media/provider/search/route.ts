import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { canManageMedia, requireSiteAccess } from '@/lib/admin/permissions';

interface ProviderSearchItem {
  id: string;
  previewUrl: string;
  sourceUrl: string;
  alt: string;
  author?: string;
}

function parsePositiveInt(value: string | null, fallback: number, max: number) {
  const parsed = Number(value || fallback);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(Math.floor(parsed), max);
}

function getUnsplashKey() {
  return process.env.UNSPLASH_ACCESS_KEY || '';
}

function getPexelsKey() {
  return process.env.PEXELS_API_KEY || '';
}

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }
  if (!canManageMedia(session.user)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const provider = String(searchParams.get('provider') || '').toLowerCase();
  const siteId = String(searchParams.get('siteId') || '');
  const query = String(searchParams.get('query') || '').trim();
  const page = parsePositiveInt(searchParams.get('page'), 1, 100);
  const perPage = parsePositiveInt(searchParams.get('perPage'), 24, 30);

  if (!siteId) {
    return NextResponse.json({ message: 'siteId is required' }, { status: 400 });
  }
  try {
    requireSiteAccess(session.user, siteId);
  } catch {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  if (!['unsplash', 'pexels'].includes(provider)) {
    return NextResponse.json({ message: 'Invalid provider' }, { status: 400 });
  }
  if (!query) {
    return NextResponse.json({ items: [], page, totalPages: 0 });
  }

  try {
    if (provider === 'unsplash') {
      const key = getUnsplashKey();
      if (!key) {
        return NextResponse.json(
          { message: 'UNSPLASH_ACCESS_KEY is not configured' },
          { status: 400 }
        );
      }
      const url = new URL('https://api.unsplash.com/search/photos');
      url.searchParams.set('query', query);
      url.searchParams.set('page', String(page));
      url.searchParams.set('per_page', String(perPage));
      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Client-ID ${key}`,
          'Accept-Version': 'v1',
        },
      });
      if (!response.ok) {
        const text = await response.text();
        return NextResponse.json(
          { message: `Unsplash search failed (${response.status})`, detail: text.slice(0, 300) },
          { status: 502 }
        );
      }
      const payload = (await response.json()) as {
        results?: Array<{
          id: string;
          alt_description?: string | null;
          urls?: { small?: string; regular?: string; full?: string };
          user?: { name?: string };
        }>;
        total_pages?: number;
      };
      const items: ProviderSearchItem[] = (payload.results || [])
        .filter((entry) => entry.urls?.small && (entry.urls?.regular || entry.urls?.full))
        .map((entry) => ({
          id: entry.id,
          previewUrl: entry.urls!.small!,
          sourceUrl: entry.urls!.regular || entry.urls!.full || entry.urls!.small!,
          alt: entry.alt_description || 'Unsplash image',
          author: entry.user?.name || undefined,
        }));

      return NextResponse.json({
        items,
        page,
        totalPages: Math.max(0, Number(payload.total_pages || 0)),
      });
    }

    const key = getPexelsKey();
    if (!key) {
      return NextResponse.json(
        { message: 'PEXELS_API_KEY is not configured' },
        { status: 400 }
      );
    }
    const url = new URL('https://api.pexels.com/v1/search');
    url.searchParams.set('query', query);
    url.searchParams.set('page', String(page));
    url.searchParams.set('per_page', String(perPage));
    const response = await fetch(url.toString(), {
      headers: { Authorization: key },
    });
    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { message: `Pexels search failed (${response.status})`, detail: text.slice(0, 300) },
        { status: 502 }
      );
    }
    const payload = (await response.json()) as {
      photos?: Array<{
        id: number;
        alt?: string;
        photographer?: string;
        src?: {
          medium?: string;
          large2x?: string;
          original?: string;
        };
      }>;
      page?: number;
      per_page?: number;
      total_results?: number;
    };
    const items: ProviderSearchItem[] = (payload.photos || [])
      .filter((entry) => entry.src?.medium && (entry.src?.large2x || entry.src?.original))
      .map((entry) => ({
        id: String(entry.id),
        previewUrl: entry.src!.medium!,
        sourceUrl: entry.src!.large2x || entry.src!.original || entry.src!.medium!,
        alt: entry.alt || 'Pexels image',
        author: entry.photographer || undefined,
      }));

    const totalPages = payload.per_page
      ? Math.ceil(Number(payload.total_results || 0) / Number(payload.per_page))
      : 0;

    return NextResponse.json({
      items,
      page: Number(payload.page || page),
      totalPages,
    });
  } catch (error) {
    console.error('Provider search error:', error);
    return NextResponse.json(
      { message: 'Provider search failed due to a server error.' },
      { status: 500 }
    );
  }
}

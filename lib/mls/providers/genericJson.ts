import type {
  MlsProviderAdapter,
  NormalizedPropertyRecord,
  RawMlsRecord,
} from './types';

function toSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const normalized = value.replace(/[^\d.-]/g, '');
    const parsed = Number(normalized);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function toText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function pickFirstText(record: RawMlsRecord, keys: string[]) {
  for (const key of keys) {
    const val = toText(record[key]);
    if (val) return val;
  }
  return '';
}

function pickFirstNumber(record: RawMlsRecord, keys: string[]) {
  for (const key of keys) {
    const val = toNumber(record[key]);
    if (typeof val === 'number') return val;
  }
  return undefined;
}

export const genericJsonMlsAdapter: MlsProviderAdapter = {
  providerId: 'generic-json',
  normalize(record): NormalizedPropertyRecord | null {
    const listingId = pickFirstText(record, ['listingId', 'id', 'mlsNumber', 'mls_id']);
    const address = pickFirstText(record, ['address', 'streetAddress', 'street']);
    const city = pickFirstText(record, ['city']);
    const state = pickFirstText(record, ['state']);
    const zip = pickFirstText(record, ['zip', 'postalCode']);
    const price = pickFirstNumber(record, ['price', 'listPrice']);

    if (!listingId || !address || !city || !state || typeof price !== 'number') {
      return null;
    }

    const statusRaw = pickFirstText(record, ['status', 'listingStatus']).toLowerCase();
    const status =
      statusRaw === 'pending' || statusRaw === 'sold' || statusRaw === 'for-lease'
        ? statusRaw
        : 'active';

    const type = pickFirstText(record, ['type', 'propertyType']).toLowerCase() || 'single-family';
    const image = pickFirstText(record, ['coverImage', 'primaryImage', 'image']);
    const galleryList = Array.isArray(record.gallery) ? record.gallery : [];
    const gallery = galleryList
      .map((entry) => {
        if (typeof entry === 'string') return { image: entry, alt: '' };
        if (entry && typeof entry === 'object') {
          const imageValue = toText((entry as Record<string, unknown>).image);
          if (!imageValue) return null;
          return {
            image: imageValue,
            alt: toText((entry as Record<string, unknown>).alt),
          };
        }
        return null;
      })
      .filter(Boolean) as Array<{ image: string; alt?: string }>;

    const slugFromAddress = toSlug(address);
    const slug = slugFromAddress || toSlug(listingId) || `listing-${Date.now()}`;
    const latitude = pickFirstNumber(record, ['lat', 'latitude']);
    const longitude = pickFirstNumber(record, ['lng', 'longitude', 'lon']);

    return {
      slug,
      address,
      city,
      state,
      zip,
      price,
      priceDisplay: `$${Math.round(price).toLocaleString()}`,
      status,
      type,
      beds: pickFirstNumber(record, ['beds', 'bedrooms']),
      baths: pickFirstNumber(record, ['baths', 'bathrooms']),
      sqft: pickFirstNumber(record, ['sqft', 'squareFeet']),
      lotSize: pickFirstText(record, ['lotSize']),
      yearBuilt: pickFirstNumber(record, ['yearBuilt']),
      description: pickFirstText(record, ['description', 'remarks']),
      coverImage: image || gallery[0]?.image || '',
      gallery,
      mlsNumber: pickFirstText(record, ['mlsNumber', 'listingId', 'mls_id']) || listingId,
      mlsSource: {
        provider: 'generic-json',
        listingId,
        syncedAt: new Date().toISOString(),
        syncStatus: 'active',
      },
      ...(typeof latitude === 'number' && typeof longitude === 'number'
        ? { coordinates: { lat: latitude, lng: longitude } }
        : {}),
    };
  },
};

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

function toText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const n = Number(value.replace(/[^\d.-]/g, ''));
    if (Number.isFinite(n) && !isNaN(n)) return n;
  }
  return undefined;
}

// RESO StandardStatus → internal status
function normalizeStatus(raw: string): string {
  switch (raw.toLowerCase()) {
    case 'active':
      return 'active';
    case 'activeundercontract':
    case 'active under contract':
    case 'pending':
      return 'pending';
    case 'closed':
    case 'sold':
      return 'sold';
    case 'forleaseactive':
    case 'for lease':
    case 'for-lease':
      return 'for-lease';
    default:
      return 'off-market';
  }
}

// RESO PropertySubType / PropertyType → internal type
function normalizeType(subType: string, propType: string): string {
  const s = subType.toLowerCase();
  const p = propType.toLowerCase();
  if (s.includes('condo') || s.includes('co-op') || s.includes('cooperative')) return 'condo';
  if (s.includes('townhouse') || s.includes('townhome')) return 'townhouse';
  if (s.includes('multi') || s.includes('2-4 family') || s.includes('duplex')) return 'multi-family';
  if (s.includes('land') || s.includes('lot')) return 'land';
  if (s.includes('commercial')) return 'commercial';
  if (s.includes('single family') || s.includes('single-family')) return 'single-family';
  if (p.includes('land') || p.includes('lot')) return 'land';
  if (p.includes('commercial')) return 'commercial';
  if (p.includes('multi')) return 'multi-family';
  return 'single-family';
}

export const mlsGridAdapter: MlsProviderAdapter = {
  providerId: 'mlsgrid',

  normalize(record: RawMlsRecord): NormalizedPropertyRecord | null {
    // ListingKey is the unique internal MLS Grid identifier (use as listingId for sync)
    const listingKey = toText(record['ListingKey']);
    // ListingId is the human-readable MLS# shown to consumers
    const listingId = toText(record['ListingId']) || listingKey;
    if (!listingKey) return null;

    // Skip listings the licensee cannot display
    if (record['MlgCanView'] === false) return null;

    // Address — prefer full unparsed address, fall back to component parts
    const unparsed = toText(record['UnparsedAddress']);
    const streetNumber = toText(record['StreetNumber']);
    const streetName = toText(record['StreetName']);
    const streetSuffix = toText(record['StreetSuffix']);
    const address =
      unparsed || [streetNumber, streetName, streetSuffix].filter(Boolean).join(' ');
    const city = toText(record['City']);
    const state = toText(record['StateOrProvince']);
    const zip = toText(record['PostalCode']);

    if (!address || !city || !state) return null;

    const price = toNumber(record['ListPrice']);
    if (typeof price !== 'number' || price <= 0) return null;

    const status = normalizeStatus(toText(record['StandardStatus']));
    const type = normalizeType(
      toText(record['PropertySubType']),
      toText(record['PropertyType'])
    );

    const beds = toNumber(record['BedroomsTotal']);
    const baths =
      toNumber(record['BathroomsTotalInteger']) ?? toNumber(record['BathroomsTotal']);
    const sqft =
      toNumber(record['LivingArea']) ?? toNumber(record['BuildingAreaTotal']);

    const lotAcres = toNumber(record['LotSizeAcres']);
    const lotSqft = toNumber(record['LotSizeSquareFeet']);
    const lotSize = lotAcres
      ? `${lotAcres} acres`
      : lotSqft
        ? `${Math.round(lotSqft).toLocaleString()} sqft`
        : undefined;

    const yearBuilt = toNumber(record['YearBuilt']);
    const description = toText(record['PublicRemarks']);

    // Media — requires $expand=Media in the API request
    const rawMedia = Array.isArray(record['Media']) ? record['Media'] : [];
    const sortedMedia = [...rawMedia].sort((a: unknown, b: unknown) => {
      const aItem = typeof a === 'object' && a !== null ? (a as Record<string, unknown>) : {};
      const bItem = typeof b === 'object' && b !== null ? (b as Record<string, unknown>) : {};
      return (toNumber(aItem['Order']) ?? 999) - (toNumber(bItem['Order']) ?? 999);
    });

    const gallery = sortedMedia
      .map((item: unknown) => {
        if (typeof item !== 'object' || item === null) return null;
        const m = item as Record<string, unknown>;
        const url = toText(m['MediaURL']);
        if (!url) return null;
        return {
          image: url,
          alt: toText(m['ShortDescription']) || toText(m['MediaObjectID']) || '',
        };
      })
      .filter((x): x is { image: string; alt: string } => x !== null);

    const coverImage = gallery[0]?.image ?? '';

    // Coordinates
    const lat = toNumber(record['Latitude']);
    const lng = toNumber(record['Longitude']);

    // Slug: address + city for uniqueness across markets
    const slug = toSlug(`${address} ${city}`) || toSlug(listingKey);

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
      ...(typeof beds === 'number' ? { beds } : {}),
      ...(typeof baths === 'number' ? { baths } : {}),
      ...(typeof sqft === 'number' ? { sqft } : {}),
      ...(lotSize ? { lotSize } : {}),
      ...(typeof yearBuilt === 'number' ? { yearBuilt } : {}),
      ...(description ? { description } : {}),
      coverImage,
      gallery,
      mlsNumber: listingId,
      mlsSource: {
        provider: 'mlsgrid',
        listingId: listingKey,
        syncedAt: new Date().toISOString(),
        syncStatus: 'active',
      },
      ...(typeof lat === 'number' && typeof lng === 'number'
        ? { coordinates: { lat, lng } }
        : {}),
    };
  },
};

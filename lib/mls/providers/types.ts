export type RawMlsRecord = Record<string, unknown>;

export type NormalizedPropertyRecord = {
  slug: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  priceDisplay: string;
  status: string;
  type: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  lotSize?: string;
  yearBuilt?: number;
  description?: string;
  coverImage?: string;
  gallery?: Array<{ image: string; alt?: string }>;
  mlsNumber?: string;
  mlsSource: {
    provider: string;
    listingId: string;
    syncedAt: string;
    syncStatus: 'active' | 'archived';
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
};

export interface MlsProviderAdapter {
  providerId: string;
  normalize(record: RawMlsRecord): NormalizedPropertyRecord | null;
}

export type ProductCategory =
  | 'food'
  | 'treat'
  | 'supplement'
  | 'toy'
  | 'hygiene'
  | 'grooming'
  | 'accessory'
  | 'bed'
  | 'carrier'
  | 'other';

export type ProductSpecies = 'dog' | 'cat' | 'universal';

export type ProductLifeStage =
  | 'puppy_kitten'
  | 'adult'
  | 'senior'
  | 'all';

export type OfferAvailability =
  | 'in_stock'
  | 'low_stock'
  | 'out_of_stock'
  | 'preorder'
  | 'unknown';

export type Money = {
  amount: number;
  currency: 'IRT';
};

export type ProductMedia = {
  id: string;
  type: 'image';
  url: string;
  alt: string;
  sourceShopId?: string;
};

export type CanonicalProduct = {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  category: ProductCategory;
  shortDescription?: string;
  description?: string;
  media: ProductMedia[];
  attributes: Record<string, string>;
  species?: Array<'dog' | 'cat' | 'universal'>;
  lifeStages?: Array<'puppy_kitten' | 'adult' | 'senior' | 'all'>;
  requiresVeterinarianGuidance?: boolean;
  guidanceText?: string;
  gtin?: string;
  ean?: string;
  sku?: string;
  mpn?: string;
  price?: {
    amount: number;
    currency: 'IRT';
    originalAmount?: number;
  };
  availability?: OfferAvailability;
  createdAt: string;
  updatedAt: string;
};

// Aliased as Product for backward compatibility in some components
export type Product = CanonicalProduct;

export type ProductVariant = {
  id: string;
  productId: string;
  label: string;
  attributes: Record<string, string>;
  gtin?: string;
  ean?: string;
  mpn?: string;
};

export type Merchant = {
  id: string;
  name: string;
  logoUrl?: string;
  websiteUrl: string;
  providerId: string;
  isActive: boolean;
  isAffiliatePartner: boolean;
  disclosureText?: string;
};

export type MerchantOffer = {
  id: string;
  merchantId: string;
  productId: string;
  variantId?: string;
  externalProductId: string;
  externalUrl: string;
  affiliateUrl?: string;
  price?: Money;
  originalPrice?: Money;
  availability: OfferAvailability;
  shippingText?: string;
  sellerText?: string;
  rating?: {
    value: number;
    reviewCount: number;
    source: string;
  };
  sourceCurrencyUnit?: 'IRT' | 'IRR';
  fetchedAt: string;
  expiresAt?: string;
};

export type RelatedProductReason =
  | 'same_category'
  | 'same_brand'
  | 'same_species'
  | 'same_life_stage'
  | 'similar_attributes'
  | 'similar_variant'
  | 'frequently_compared';

export type RelatedProductItem = {
  product: CanonicalProduct;
  offers: MerchantOffer[];
  lowestActiveOffer?: MerchantOffer;
  reasons: RelatedProductReason[];
  relevanceScore: number;
};

export type ProductDetailResult = {
  product: CanonicalProduct;
  variants: ProductVariant[];
  offers: MerchantOffer[];
  merchants: Merchant[];
  relatedProducts: RelatedProductItem[];
};

export type ProductMatchStatus =
  | 'compatible'
  | 'partial'
  | 'unknown'
  | 'not_applicable'
  | 'requires_guidance';

export type ProductMatch = {
  status: ProductMatchStatus;
  reasons: string[];
};

export type FavoriteProduct = {
  productId: string;
  createdAt: string;
};

export interface ProductSearchInput {
  query?: string;
  category?: ProductCategory | 'all';
  species?: ProductSpecies | 'all';
  availability?: OfferAvailability[];
  requiresVeterinarianGuidance?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'relevance' | 'newest' | 'price_asc' | 'price_desc' | 'rating';
  onlyFavorites?: boolean;
  favoriteProductIds?: string[];
}

export interface ProductSearchResult {
  products: CanonicalProduct[];
  totalCount: number;
}

// Provider Adapter interfaces
export interface ProviderSearchInput {
  query?: string;
  category?: string;
  limit?: number;
}

export interface ProviderProduct {
  externalProductId: string;
  name: string;
  brand?: string;
  category: ProductCategory;
  description?: string;
  shortDescription?: string;
  media: { url: string; alt: string }[];
  attributes: Record<string, string>;
  gtin?: string;
  mpn?: string;
}

export interface ProviderOffer {
  externalProductId: string;
  externalUrl: string;
  price?: Money;
  originalPrice?: Money;
  availability: OfferAvailability;
  shippingText?: string;
  sellerText?: string;
  sourceCurrencyUnit: 'IRT' | 'IRR';
}

export interface ProviderSearchResult {
  products: ProviderProduct[];
  offers: ProviderOffer[];
}

export interface ShopProviderAdapter {
  readonly id: string;
  readonly merchantId: string;

  searchProducts(
    input: ProviderSearchInput,
    signal?: AbortSignal
  ): Promise<ProviderSearchResult>;

  getProduct(
    externalProductId: string,
    signal?: AbortSignal
  ): Promise<ProviderProduct | null>;

  getOffers(
    externalProductIds: string[],
    signal?: AbortSignal
  ): Promise<ProviderOffer[]>;
}

export interface CatalogService {
  search(input: ProductSearchInput): Promise<ProductSearchResult>;
  getProductBySlug(slug: string): Promise<ProductDetailResult | null>;
  getCategories(): Promise<{ value: ProductCategory | 'all'; label: string }[]>;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  addedAt: string;
  updatedAt: string;
}

export interface CartState {
  items: CartItem[];
  updatedAt: string;
}

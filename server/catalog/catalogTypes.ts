import { ProductCategory, ProductSpecies, ProductLifeStage, OfferAvailability } from '../../src/pages/shop/shopTypes';

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
  gtin?: string; // EAN-13 / UPC
  ean?: string;
  sku?: string;
  mpn?: string;
  createdAt: string;
  updatedAt: string;
};

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

export type ProductMatchEvidence = {
  method: 'gtin' | 'ean' | 'mpn' | 'brand_model' | 'manual';
  confidence: 'high' | 'review_required';
  reasons: string[];
};

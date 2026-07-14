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

export type ProductAvailability =
  | 'in_stock'
  | 'low_stock'
  | 'out_of_stock'
  | 'unknown';

export type ProductPrice = {
  amount: number;
  currency: 'IRT';
  originalAmount?: number;
  updatedAt?: string;
};

export type ProductRating = {
  value: number;
  reviewCount: number;
  source: string;
};

export type ProductMedia = {
  id: string;
  type: 'image';
  url: string;
  alt: string;
};

export type ProductCompatibility = {
  species: ProductSpecies[];
  lifeStages?: ProductLifeStage[];
  sizeClasses?: Array<'small' | 'medium' | 'large' | 'all'>;
  requiresVeterinarianGuidance?: boolean;
  sourceText?: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  category: ProductCategory;
  shortDescription?: string;
  description?: string;
  media: ProductMedia[];
  price?: ProductPrice;
  availability: ProductAvailability;
  sellerName?: string;
  sellerId?: string;
  rating?: ProductRating;
  compatibility?: ProductCompatibility;
  attributes: Record<string, string>;
  sourceName: string;
  sourceUrl?: string;
  lastUpdatedAt?: string;
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

export type CartItem = {
  productId: string;
  variantId?: string;
  quantity: number;
  unitPriceSnapshot?: number;
  currency: 'IRT';
  addedAt: string;
  updatedAt: string;
};

export type CartState = {
  items: CartItem[];
  sellerId?: string;
  updatedAt: string;
};

export type FavoriteProduct = {
  productId: string;
  createdAt: string;
};

export interface ProductSearchInput {
  query?: string;
  category?: ProductCategory | 'all';
  species?: ProductSpecies | 'all';
  availability?: ProductAvailability[];
  requiresVeterinarianGuidance?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'relevance' | 'newest' | 'price_asc' | 'price_desc' | 'rating';
  onlyFavorites?: boolean;
  favoriteProductIds?: string[];
}

export interface ProductSearchResult {
  products: Product[];
  totalCount: number;
}

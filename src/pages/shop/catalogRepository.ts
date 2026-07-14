import { Product, ProductCategory, ProductSearchInput, ProductSearchResult } from './shopTypes';
import { DEMO_PRODUCTS } from './productFixtures';
import { normalizePersianText } from './shopUtils';

export interface CatalogRepository {
  search(input: ProductSearchInput): Promise<ProductSearchResult>;
  getById(id: string): Promise<Product | null>;
  getCategories(): Promise<{ value: ProductCategory | 'all'; label: string }[]>;
}

class DemoCatalogRepository implements CatalogRepository {
  private products: Product[] = DEMO_PRODUCTS;

  async search(input: ProductSearchInput): Promise<ProductSearchResult> {
    // Artificial slight delay to simulate remote request, unless in test / immediate mode
    await new Promise(resolve => setTimeout(resolve, 200));

    let filtered = [...this.products];

    // 1. Category filter
    if (input.category && input.category !== 'all') {
      filtered = filtered.filter(p => p.category === input.category);
    }

    // 2. Query text search (normalized)
    if (input.query) {
      const normalizedQuery = normalizePersianText(input.query);
      filtered = filtered.filter(p => {
        const nameMatch = normalizePersianText(p.name).includes(normalizedQuery);
        const brandMatch = p.brand ? normalizePersianText(p.brand).includes(normalizedQuery) : false;
        const shortDescMatch = p.shortDescription ? normalizePersianText(p.shortDescription).includes(normalizedQuery) : false;
        const descMatch = p.description ? normalizePersianText(p.description).includes(normalizedQuery) : false;
        const categoryMatch = normalizePersianText(p.category).includes(normalizedQuery);
        
        // Attributes matching
        const attributesMatch = Object.entries(p.attributes).some(([key, val]) => 
          normalizePersianText(key).includes(normalizedQuery) || normalizePersianText(val).includes(normalizedQuery)
        );

        return nameMatch || brandMatch || shortDescMatch || descMatch || categoryMatch || attributesMatch;
      });
    }

    // 3. Species filter
    if (input.species && input.species !== 'all') {
      filtered = filtered.filter(p => {
        if (!p.compatibility) return true;
        return p.compatibility.species.includes(input.species as any) || p.compatibility.species.includes('universal');
      });
    }

    // 4. Availability filter
    if (input.availability && input.availability.length > 0) {
      filtered = filtered.filter(p => input.availability!.includes(p.availability));
    }

    // 5. Veterinarian Guidance filter
    if (input.requiresVeterinarianGuidance !== undefined) {
      filtered = filtered.filter(p => p.compatibility?.requiresVeterinarianGuidance === input.requiresVeterinarianGuidance);
    }

    // 6. Price range
    if (input.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price ? p.price.amount >= input.minPrice! : true);
    }
    if (input.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price ? p.price.amount <= input.maxPrice! : true);
    }

    // 7. Favorites only filter
    if (input.onlyFavorites && input.favoriteProductIds) {
      filtered = filtered.filter(p => input.favoriteProductIds!.includes(p.id));
    }

    // 8. Sorting
    if (input.sortBy) {
      switch (input.sortBy) {
        case 'newest':
          filtered.sort((a, b) => {
            const dateA = a.lastUpdatedAt || '';
            const dateB = b.lastUpdatedAt || '';
            return dateB.localeCompare(dateA);
          });
          break;
        case 'price_asc':
          filtered.sort((a, b) => {
            const priceA = a.price ? a.price.amount : Infinity;
            const priceB = b.price ? b.price.amount : Infinity;
            return priceA - priceB;
          });
          break;
        case 'price_desc':
          filtered.sort((a, b) => {
            const priceA = a.price ? a.price.amount : -Infinity;
            const priceB = b.price ? b.price.amount : -Infinity;
            return priceB - priceA;
          });
          break;
        case 'rating':
          filtered.sort((a, b) => {
            const ratingA = a.rating ? a.rating.value : 0;
            const ratingB = b.rating ? b.rating.value : 0;
            return ratingB - ratingA;
          });
          break;
        case 'relevance':
        default:
          // Default sorting: in_stock items first, then by rating
          filtered.sort((a, b) => {
            if (a.availability === 'in_stock' && b.availability !== 'in_stock') return -1;
            if (a.availability !== 'in_stock' && b.availability === 'in_stock') return 1;
            const ratingA = a.rating ? a.rating.value : 0;
            const ratingB = b.rating ? b.rating.value : 0;
            return ratingB - ratingA;
          });
          break;
      }
    }

    return {
      products: filtered,
      totalCount: filtered.length
    };
  }

  async getById(id: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.products.find(p => p.id === id) || null;
  }

  async getCategories(): Promise<{ value: ProductCategory | 'all'; label: string }[]> {
    return [
      { value: 'all', label: 'همه' },
      { value: 'food', label: 'غذا' },
      { value: 'treat', label: 'تشویقی' },
      { value: 'supplement', label: 'مکمل' },
      { value: 'toy', label: 'بازی' },
      { value: 'hygiene', label: 'بهداشت' },
      { value: 'grooming', label: 'آرایش' },
      { value: 'accessory', label: 'لوازم' },
      { value: 'bed', label: 'جای خواب' },
      { value: 'carrier', label: 'باکس و حمل' }
    ];
  }
}

export const catalogRepository: CatalogRepository = new DemoCatalogRepository();
export const isDemoMode = true; // Hardcoded to true for safety as there's no custom server-based payment/orders

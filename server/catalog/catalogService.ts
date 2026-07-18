import { CanonicalProduct, ProductVariant, Merchant, MerchantOffer, ProductDetailResult, ProductSearchInput, ProductSearchResult, ProductMatchEvidence } from './catalogTypes';
import { CANONICAL_PRODUCTS, MERCHANTS, PRODUCT_VARIANTS, MERCHANT_OFFERS } from './productDatabase';
import { getRelatedProductItems } from './relatedProducts';

function normalizePersianText(text: string): string {
  if (!text) return '';
  let normalized = text.toLowerCase();
  normalized = normalized.replace(/ي/g, 'ی');
  normalized = normalized.replace(/ك/g, 'ک');
  normalized = normalized.replace(/[\u064B-\u0652]/g, '');
  normalized = normalized.replace(/\u200C/g, ' ');
  normalized = normalized.replace(/\s+/g, ' ');

  const persianDigits = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  const arabicDigits = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
  for (let i = 0; i < 10; i++) {
    normalized = normalized.replace(persianDigits[i], String(i));
    normalized = normalized.replace(arabicDigits[i], String(i));
  }
  return normalized.trim();
}

export class CatalogService {
  /**
   * Performs deduplication matching on a candidate external product.
   */
  public static matchProduct(
    candidate: { gtin?: string; ean?: string; mpn?: string; brand?: string; name: string },
    canonicals: CanonicalProduct[]
  ): { product: CanonicalProduct; evidence: ProductMatchEvidence } | null {
    // Priority 1: GTIN / EAN match
    if (candidate.gtin || candidate.ean) {
      const gtinVal = candidate.gtin || candidate.ean;
      const match = canonicals.find(c => (c.gtin && c.gtin === gtinVal) || (c.ean && c.ean === gtinVal));
      if (match) {
        return {
          product: match,
          evidence: {
            method: 'gtin',
            confidence: 'high',
            reasons: [`شناسه بین‌المللی کالا (${gtinVal}) مطابقت دارد.`]
          }
        };
      }
    }

    // Priority 2: MPN match
    if (candidate.mpn) {
      const match = canonicals.find(c => c.mpn && normalizePersianText(c.mpn) === normalizePersianText(candidate.mpn!));
      if (match) {
        return {
          product: match,
          evidence: {
            method: 'mpn',
            confidence: 'high',
            reasons: [`پارت‌نامبر سازنده (${candidate.mpn}) مطابقت دارد.`]
          }
        };
      }
    }

    // Priority 3: Brand + exact normalized name matching
    if (candidate.brand) {
      const normalizedBrandCandidate = normalizePersianText(candidate.brand);
      const normalizedNameCandidate = normalizePersianText(candidate.name);

      const match = canonicals.find(c => {
        if (!c.brand) return false;
        const normalizedBrandCanon = normalizePersianText(c.brand);
        const normalizedNameCanon = normalizePersianText(c.name);
        return normalizedBrandCanon === normalizedBrandCandidate && normalizedNameCanon === normalizedNameCandidate;
      });

      if (match) {
        return {
          product: match,
          evidence: {
            method: 'brand_model',
            confidence: 'high',
            reasons: [`برند «${candidate.brand}» و نام دقیق محصول مطابقت دارند.`]
          }
        };
      }
    }

    // Fallback: Check if names are highly similar (exact match after normalization)
    const normalizedCandidateName = normalizePersianText(candidate.name);
    const fallbackMatch = canonicals.find(c => normalizePersianText(c.name) === normalizedCandidateName);
    if (fallbackMatch) {
      return {
        product: fallbackMatch,
        evidence: {
          method: 'manual',
          confidence: 'review_required',
          reasons: ['نام محصول پس از نرمال‌سازی مطابقت کامل دارد.']
        }
      };
    }

    return null;
  }

  /**
   * Search canonical products and return lowest price computed from active merchant offers.
   */
  public async search(input: ProductSearchInput): Promise<ProductSearchResult> {
    let filtered = [...CANONICAL_PRODUCTS];

    // Filter by category
    if (input.category && input.category !== 'all') {
      filtered = filtered.filter(p => p.category === input.category);
    }

    // Filter by species
    if (input.species && input.species !== 'all') {
      filtered = filtered.filter(p => {
        if (!p.species) return true;
        return p.species.includes(input.species as any) || p.species.includes('universal');
      });
    }

    // Query text search
    if (input.query) {
      const queryNorm = normalizePersianText(input.query);
      filtered = filtered.filter(p => {
        const nameMatch = normalizePersianText(p.name).includes(queryNorm);
        const brandMatch = p.brand ? normalizePersianText(p.brand).includes(queryNorm) : false;
        const shortDesc = p.shortDescription ? normalizePersianText(p.shortDescription).includes(queryNorm) : false;
        const desc = p.description ? normalizePersianText(p.description).includes(queryNorm) : false;
        return nameMatch || brandMatch || shortDesc || desc;
      });
    }

    // Veterinarian Guidance filter
    if (input.requiresVeterinarianGuidance !== undefined) {
      filtered = filtered.filter(p => !!p.requiresVeterinarianGuidance === input.requiresVeterinarianGuidance);
    }

    // Only Favorites filter
    if (input.onlyFavorites && input.favoriteProductIds) {
      filtered = filtered.filter(p => input.favoriteProductIds!.includes(p.id));
    }

    // Attach computed prices based on active offers
    const mappedProducts = filtered.map(product => {
      const productOffers = MERCHANT_OFFERS.filter(
        o => o.productId === product.id && o.availability !== 'out_of_stock'
      );
      
      let minPriceAmount = Infinity;
      let originalPriceAmount: number | undefined = undefined;

      productOffers.forEach(o => {
        if (o.price) {
          // Normalize IRR to IRT internally
          const priceAmount = o.sourceCurrencyUnit === 'IRR' ? o.price.amount / 10 : o.price.amount;
          if (priceAmount < minPriceAmount) {
            minPriceAmount = priceAmount;
            if (o.originalPrice) {
              originalPriceAmount = o.sourceCurrencyUnit === 'IRR' ? o.originalPrice.amount / 10 : o.originalPrice.amount;
            } else {
              originalPriceAmount = undefined;
            }
          }
        }
      });

      // Mutate a shallow copy to return computed values for the UI list
      return {
        ...product,
        // UI expects a 'price' field on Product for lists
        price: minPriceAmount !== Infinity ? { amount: minPriceAmount, currency: 'IRT' as const, originalAmount: originalPriceAmount } : undefined,
        // Availability matches the lowest price offer, or fallback
        availability: productOffers.length > 0 ? 'in_stock' as const : 'out_of_stock' as const
      };
    });

    // Min/Max price filter on computed prices
    let finalProducts = mappedProducts;
    if (input.minPrice !== undefined) {
      finalProducts = finalProducts.filter(p => p.price ? p.price.amount >= input.minPrice! : true);
    }
    if (input.maxPrice !== undefined) {
      finalProducts = finalProducts.filter(p => p.price ? p.price.amount <= input.maxPrice! : true);
    }

    // Sorting
    if (input.sortBy) {
      switch (input.sortBy) {
        case 'price_asc':
          finalProducts.sort((a, b) => {
            const pa = a.price ? a.price.amount : Infinity;
            const pb = b.price ? b.price.amount : Infinity;
            return pa - pb;
          });
          break;
        case 'price_desc':
          finalProducts.sort((a, b) => {
            const pa = a.price ? a.price.amount : -Infinity;
            const pb = b.price ? b.price.amount : -Infinity;
            return pb - pa;
          });
          break;
        case 'newest':
          finalProducts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
          break;
        case 'relevance':
        default:
          // In stock items first
          finalProducts.sort((a, b) => {
            if (a.price && !b.price) return -1;
            if (!a.price && b.price) return 1;
            return 0;
          });
          break;
      }
    }

    return {
      products: finalProducts,
      totalCount: finalProducts.length
    };
  }

  /**
   * Retrieves full details including active competing merchant offers.
   */
  public async getProductBySlug(slug: string): Promise<ProductDetailResult | null> {
    const product = CANONICAL_PRODUCTS.find(p => p.slug === slug);
    if (!product) return null;

    const variants = PRODUCT_VARIANTS.filter(v => v.productId === product.id);
    const offers = MERCHANT_OFFERS.filter(o => o.productId === product.id);
    const activeMerchantIds = Array.from(new Set(offers.map(o => o.merchantId)));
    const merchants = MERCHANTS.filter(m => activeMerchantIds.includes(m.id) && m.isActive);

    // Compute prices with safe Rial to Toman conversions
    const normalizedOffers = offers.map(o => {
      let normPrice = o.price;
      let normOrig = o.originalPrice;

      if (o.sourceCurrencyUnit === 'IRR') {
        if (o.price) normPrice = { amount: o.price.amount / 10, currency: 'IRT' };
        if (o.originalPrice) normOrig = { amount: o.originalPrice.amount / 10, currency: 'IRT' };
      }

      return {
        ...o,
        price: normPrice,
        originalPrice: normOrig
      };
    });

    const relatedProducts = getRelatedProductItems(product, CANONICAL_PRODUCTS, MERCHANT_OFFERS);

    return {
      product,
      variants,
      offers: normalizedOffers,
      merchants,
      relatedProducts
    };
  }

  /**
   * Outbound Redirect Helper. Retrieves the offer and validates security.
   */
  public getOfferRedirect(offerId: string): { url: string; merchant: Merchant; isAffiliate: boolean } | null {
    const offer = MERCHANT_OFFERS.find(o => o.id === offerId);
    if (!offer) return null;

    const merchant = MERCHANTS.find(m => m.id === offer.merchantId);
    if (!merchant || !merchant.isActive) return null;

    // Direct url fallback
    let targetUrl = offer.externalUrl;
    let isAffiliate = false;

    // If affiliate is configured and partner is active, use affiliate url
    if (merchant.isAffiliatePartner && offer.affiliateUrl) {
      targetUrl = offer.affiliateUrl;
      isAffiliate = true;
    }

    // Safety checks on destination URL
    try {
      const parsedUrl = new URL(targetUrl);
      // Validate protocol: HTTPS only or secure environments
      if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
        return null;
      }
      // Allowlist domain validation: check that it's to one of our domain stubs
      const allowedDomains = ['marzdaran-pet-demo.ir', 'aria-vet-pharmacy-demo.ir', 'yooz-pet-demo.com'];
      const isAllowed = allowedDomains.some(d => parsedUrl.hostname === d || parsedUrl.hostname.endsWith('.' + d));
      if (!isAllowed) {
        return null;
      }
    } catch {
      return null;
    }

    return {
      url: targetUrl,
      merchant,
      isAffiliate
    };
  }
}

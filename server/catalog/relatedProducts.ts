import { CanonicalProduct, MerchantOffer, RelatedProductItem } from './catalogTypes';
import { getRelatedProductsForProduct } from './relatedProductScoring';

/**
 * Builds the list of RelatedProductItem with full catalog details for a source product.
 */
export function getRelatedProductItems(
  source: CanonicalProduct,
  allProducts: CanonicalProduct[],
  allOffers: MerchantOffer[]
): RelatedProductItem[] {
  // Get ranked and scored products
  const scored = getRelatedProductsForProduct(source, allProducts, allOffers);

  // Return 4–8 products (maximum 8)
  const selected = scored.slice(0, 8);

  return selected.map(item => {
    // Standardize offers currency/format if needed, but they are raw here
    const productOffers = allOffers.filter(o => o.productId === item.product.id);
    
    // Compute normalized price details
    const normalizedOffers = productOffers.map(o => {
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

    const activeOffers = normalizedOffers.filter(o => o.availability !== 'out_of_stock');
    
    // Find lowest active offer
    let lowestActiveOffer: MerchantOffer | undefined;
    if (activeOffers.length > 0) {
      lowestActiveOffer = activeOffers.reduce((lowest, current) => {
        const lowestPrice = lowest.price?.amount || Infinity;
        const currentPrice = current.price?.amount || Infinity;
        return currentPrice < lowestPrice ? current : lowest;
      }, activeOffers[0]);
    }

    return {
      product: item.product,
      offers: normalizedOffers,
      lowestActiveOffer,
      reasons: item.reasons,
      relevanceScore: item.score
    };
  });
}

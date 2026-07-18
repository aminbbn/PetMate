import { CanonicalProduct, MerchantOffer, RelatedProductReason } from './catalogTypes';

export interface ScoredProduct {
  product: CanonicalProduct;
  score: number;
  reasons: RelatedProductReason[];
  offers: MerchantOffer[];
}

/**
 * Calculates the relationship/relevance score between a source product and a candidate product.
 */
export function calculateRelevanceScore(
  source: CanonicalProduct,
  candidate: CanonicalProduct,
  allOffers: MerchantOffer[]
): { score: number; reasons: RelatedProductReason[] } {
  let score = 0;
  const reasons: RelatedProductReason[] = [];

  // Exclude current product (handled at higher level, but penalize severely just in case)
  if (source.id === candidate.id) {
    score -= 100;
  }

  // 1. Same category (+40) / Category mismatch (-40)
  if (source.category === candidate.category) {
    score += 40;
    reasons.push('same_category');
  } else {
    score -= 40;
  }

  // 2. Species compatibility:
  // Source and candidate species lists
  const sourceSpecies = source.species || [];
  const candidateSpecies = candidate.species || [];
  
  const hasUniversalSource = sourceSpecies.includes('universal');
  const hasUniversalCandidate = candidateSpecies.includes('universal');
  
  const speciesIntersection = sourceSpecies.filter(s => s !== 'universal' && candidateSpecies.includes(s));
  
  const isCompatibleSpecies = 
    hasUniversalSource || 
    hasUniversalCandidate || 
    speciesIntersection.length > 0;

  if (isCompatibleSpecies) {
    score += 20;
    reasons.push('same_species');
  } else {
    // Incompatible species penalty (-60)
    score -= 60;
  }

  // 3. Same life stage (+15)
  const sourceLf = source.lifeStages || [];
  const candidateLf = candidate.lifeStages || [];
  const hasAllSource = sourceLf.includes('all');
  const hasAllCandidate = candidateLf.includes('all');
  const lfIntersection = sourceLf.filter(l => l !== 'all' && candidateLf.includes(l));
  
  if (hasAllSource || hasAllCandidate || lfIntersection.length > 0) {
    score += 15;
    reasons.push('same_life_stage');
  }

  // 4. Same brand (+12)
  if (source.brand && candidate.brand && source.brand.toLowerCase() === candidate.brand.toLowerCase()) {
    score += 12;
    reasons.push('same_brand');
  }

  // 5. Similar key attributes (+10)
  // Check if they share any attribute keys or values (e.g. country of origin, flavor, material)
  let sharedAttributesCount = 0;
  if (source.attributes && candidate.attributes) {
    const sourceKeys = Object.keys(source.attributes);
    const candidateKeys = Object.keys(candidate.attributes);
    
    sourceKeys.forEach(k => {
      if (candidateKeys.includes(k)) {
        sharedAttributesCount++;
        // Extra points if values are identical
        if (source.attributes[k] === candidate.attributes[k]) {
          sharedAttributesCount++;
        }
      }
    });
  }
  if (sharedAttributesCount > 0) {
    score += 10;
    reasons.push('similar_attributes');
  }

  // 6. Comparable variant/package type (+8)
  // If they have similar attributes like 'وزن' or similar packaging format
  if (
    source.attributes['وزن'] && 
    candidate.attributes['وزن'] && 
    source.attributes['وزن'] === candidate.attributes['وزن']
  ) {
    score += 8;
    reasons.push('similar_variant');
  }

  // 7. Therapeutic mismatch (-50)
  const sourceTherapeutic = !!source.requiresVeterinarianGuidance;
  const candidateTherapeutic = !!candidate.requiresVeterinarianGuidance;
  if (sourceTherapeutic !== candidateTherapeutic) {
    score -= 50;
  }

  // 8. Offers and price data:
  const candidateOffers = allOffers.filter(o => o.productId === candidate.id);
  const activeOffers = candidateOffers.filter(o => o.availability !== 'out_of_stock');

  if (activeOffers.length > 0) {
    score += 5; // Active offers available (+5)
    
    // Check if we have fresh price data (+3)
    // We consider it fresh if fetchedAt is present and valid
    const hasFreshData = activeOffers.some(o => {
      if (!o.fetchedAt) return false;
      const fetchTime = new Date(o.fetchedAt).getTime();
      const now = new Date('2026-07-15T02:35:47-07:00').getTime(); // Use current local time from metadata
      return (now - fetchTime) < 24 * 60 * 60 * 1000; // Within 24 hours
    });
    
    if (hasFreshData) {
      score += 3;
    }
  } else {
    // No active offer penalty (-25)
    score -= 25;
  }

  // 9. Stale or incomplete catalog data penalty (-20)
  const isStaleOrIncomplete = !candidate.name || !candidate.media || candidate.media.length === 0;
  if (isStaleOrIncomplete) {
    score -= 20;
  }

  return { score, reasons };
}

/**
 * Ranks and returns related products for a given source product.
 */
export function getRelatedProductsForProduct(
  source: CanonicalProduct,
  allProducts: CanonicalProduct[],
  allOffers: MerchantOffer[]
): ScoredProduct[] {
  const candidates = allProducts.filter(p => p.id !== source.id);

  const scored: ScoredProduct[] = [];

  for (const candidate of candidates) {
    const { score, reasons } = calculateRelevanceScore(source, candidate, allOffers);
    
    // Hard rule: Exclude low confidence matching products
    // (A negative score is a good proxy for mismatch/exclusion criteria being met)
    if (score < 0) {
      continue;
    }

    const candidateOffers = allOffers.filter(o => o.productId === candidate.id);
    
    scored.push({
      product: candidate,
      score,
      reasons: reasons as RelatedProductReason[],
      offers: candidateOffers
    });
  }

  // Sort with stable tie-breaking:
  // 1. relevance score (desc)
  // 2. active offer availability (desc)
  // 3. offer freshness (desc)
  // 4. lowest comparable price (asc)
  // 5. product name/id (asc)
  return scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    const aActiveOffers = a.offers.filter(o => o.availability !== 'out_of_stock');
    const bActiveOffers = b.offers.filter(o => o.availability !== 'out_of_stock');
    if (bActiveOffers.length !== aActiveOffers.length) {
      return bActiveOffers.length - aActiveOffers.length;
    }

    const aFresh = aActiveOffers.some(o => o.fetchedAt);
    const bFresh = bActiveOffers.some(o => o.fetchedAt);
    if (aFresh !== bFresh) {
      return bFresh ? 1 : -1;
    }

    const aMinPrice = aActiveOffers.reduce((min, o) => Math.min(min, o.price?.amount || Infinity), Infinity);
    const bMinPrice = bActiveOffers.reduce((min, o) => Math.min(min, o.price?.amount || Infinity), Infinity);
    if (aMinPrice !== bMinPrice) {
      return aMinPrice - bMinPrice;
    }

    return a.product.name.localeCompare(b.product.name);
  });
}

import React, { useEffect, useState } from 'react';
import { RelatedProductItem, CanonicalProduct } from './shopTypes';
import { RelatedProductCard } from './RelatedProductCard';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';

interface RelatedProductsProps {
  relatedProducts: RelatedProductItem[];
  currentProduct: CanonicalProduct;
  isLoading?: boolean;
  hasPartialError?: boolean;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  relatedProducts,
  currentProduct,
  isLoading = false,
  hasPartialError = false
}) => {
  const navigate = useNavigate();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Empty state: if there are no related products and we are not loading, hide the entire section
  if (!isLoading && relatedProducts.length === 0) {
    return null;
  }

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.04, // 30-50ms stagger
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: reducedMotion ? 0 : 8 // max 6-8px movement
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring' as const, 
        stiffness: 100, 
        damping: 15 
      }
    }
  };

  const handleViewAll = () => {
    // Route back to the Shop with a meaningful category filter
    const categoryQuery = currentProduct.category ? `?category=${currentProduct.category}` : '';
    navigate(`/shop${categoryQuery}`);
  };

  const handleCardClick = (slug: string) => {
    navigate(`/shop/products/${slug}`);
    // Scroll the new product page to top
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <section 
      aria-labelledby="related-products-title"
      className="mt-16 pt-10 border-t border-slate-100/80 space-y-8 pb-12 text-right"
      dir="rtl"
    >
      {/* Header Container */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h3 
            id="related-products-title" 
            className="font-black text-slate-800 text-lg md:text-xl tracking-tight"
          >
            محصولات مرتبط
          </h3>
          <p className="text-xs md:text-sm text-slate-400 font-medium">
            محصولات مشابهی که ممکن است برای مقایسه مفید باشند
          </p>
        </div>

        {/* View All button */}
        <button
          onClick={handleViewAll}
          className="flex items-center gap-1.5 text-xs font-black text-coral hover:text-coral-deep transition-colors cursor-pointer self-start sm:self-auto group"
        >
          <span>مشاهده همه</span>
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Partial Error Notification */}
      {hasPartialError && (
        <div className="bg-amber-50/60 border border-amber-200/40 rounded-2xl p-3 text-xs text-amber-700 leading-none">
          نمایش بعضی محصولات مرتبط ممکن نشد.
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading ? (
        <div 
          aria-hidden="true"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {Array.from({ length: 4 }).map((_, idx) => (
            <div 
              key={idx}
              className="bg-white border border-slate-100 rounded-[24px] p-4 space-y-4 animate-pulse"
            >
              <div className="aspect-square bg-slate-100 rounded-2xl w-full" />
              <div className="space-y-2">
                <div className="h-3 bg-slate-100 rounded w-1/3" />
                <div className="h-4 bg-slate-100 rounded w-5/6" />
                <div className="h-4 bg-slate-100 rounded w-2/3" />
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                <div className="h-5 bg-slate-100 rounded w-1/3" />
                <div className="h-7 bg-slate-100 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Products list container with list semantics */
        <motion.ul
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="
            /* Mobile Horizontal Scroll-Snap Container */
            flex overflow-x-auto gap-5 pb-4 px-2 -mx-2 
            snap-x snap-mandatory scroll-smooth scrollbar-thin 
            /* Desktop responsive grid */
            lg:grid lg:grid-cols-4 lg:overflow-x-visible lg:px-0 lg:mx-0 lg:snap-none
          "
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {relatedProducts.slice(0, 8).map((item) => (
            <motion.li
              key={item.product.id}
              variants={cardVariants}
              className="
                /* Card sizing on mobile scroll layout */
                flex-none w-[260px] snap-start
                /* Desktop responsive resets */
                lg:w-auto lg:snap-align-none
              "
            >
              <RelatedProductCard
                item={item}
                onClick={() => handleCardClick(item.product.slug)}
              />
            </motion.li>
          ))}
        </motion.ul>
      )}
    </section>
  );
};

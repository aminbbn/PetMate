import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { Product, ProductSearchInput, ProductCategory } from './shopTypes';
import { ShopHeader } from './ShopHeader';
import { ShopCompatibilityCard } from './ShopCompatibilityCard';
import { ShopToolbar } from './ShopToolbar';
import { ProductGrid } from './ProductGrid';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Info } from 'lucide-react';

interface ToastMessage {
  id: string;
  text: string;
  imgUrl?: string;
}

export const ShopPage: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, cartMigratedNotice, dismissCartMigratedNotice } = useAppStore();

  // Search, sorting, and filtering state
  const [filters, setFilters] = useState<ProductSearchInput>({
    query: '',
    category: 'all',
    species: 'all',
    onlyFavorites: false,
    sortBy: 'relevance'
  });

  // Loaded products list
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<{ value: ProductCategory | 'all'; label: string }[]>([]);

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Show the one-time migration toast notice if applicable
  useEffect(() => {
    if (cartMigratedNotice) {
      const toastId = `migration-toast-${Date.now()}`;
      setToasts(prev => [...prev, {
        id: toastId,
        text: 'اقلام سبد آزمایشی به فهرست ذخیره‌شده منتقل شدند.'
      }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toastId));
      }, 6000);
      dismissCartMigratedNotice();
    }
  }, [cartMigratedNotice, dismissCartMigratedNotice]);

  // Fetch categories initially
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/catalog/categories');
        if (response.ok) {
          const cats = await response.json();
          setCategories(cats);
        } else {
          // Fallback static categories
          setCategories([
            { value: 'all', label: 'همه کالاها' },
            { value: 'food', label: 'غذا' },
            { value: 'treat', label: 'تشویقی' },
            { value: 'supplement', label: 'مکمل تقویتی' },
            { value: 'toy', label: 'بازی و سرگرمی' },
            { value: 'hygiene', label: 'بهداشت پت' },
            { value: 'grooming', label: 'آرایش پت' },
            { value: 'accessory', label: 'لوازم نگهداری' }
          ]);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products upon filter changes
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (filters.query) queryParams.append('query', filters.query);
        if (filters.category && filters.category !== 'all') queryParams.append('category', filters.category);
        if (filters.species && filters.species !== 'all') queryParams.append('species', filters.species);
        if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
        
        // Pass favoriteProductIds if either onlyFavorites is true or we want to reflect favorite status
        const favoriteIds = favorites?.map(f => f.productId) || [];
        if (favoriteIds.length > 0) {
          queryParams.append('favoriteProductIds', favoriteIds.join(','));
        }
        if (filters.onlyFavorites) {
          queryParams.append('onlyFavorites', 'true');
        }

        const response = await fetch(`/api/catalog/products?${queryParams.toString()}`);
        if (response.ok) {
          const result = await response.json();
          setProducts(result.products || []);
          setTotalProducts(result.totalCount || 0);
        } else {
          console.error('Failed to fetch products from catalog API');
        }
      } catch (err) {
        console.error('Error querying products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [filters, favorites]);

  const handleFilterChange = (updates: Partial<ProductSearchInput>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      query: '',
      category: 'all',
      species: 'all',
      onlyFavorites: false,
      sortBy: 'relevance'
    });
  };

  const handleViewDetails = (product: Product) => {
    navigate(`/shop/products/${product.slug}`);
  };

  return (
    <div className="min-h-screen bg-[#FFFDFB] pb-24 text-right" id="shop-page-wrapper" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Block */}
        <ShopHeader />

        {/* Dynamic Transparent Compatibility Card */}
        <ShopCompatibilityCard />

        {/* Search, Categories, Sort Controls Toolbar */}
        <ShopToolbar
          filters={filters}
          onChange={handleFilterChange}
          categories={categories}
          resultCount={totalProducts}
        />

        {/* Main Grid View */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-coral border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-semibold text-slate-500 animate-pulse">در حال فراخوانی ملزومات پت از فروشگاه‌های شریک...</span>
          </div>
        ) : (
          <ProductGrid
            products={products}
            onViewDetails={handleViewDetails}
            onResetFilters={handleResetFilters}
          />
        )}
      </div>

      {/* Modern Floating Toast Notifications (stacked at top right corner) */}
      <div className="fixed top-6 right-6 z-[10000] space-y-3.5 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9, transition: { duration: 0.2 } }}
              className="bg-emerald-500 text-white shadow-xl rounded-2xl p-4 flex items-center gap-3.5 pointer-events-auto border border-emerald-600/20"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 text-right">
                <span className="text-xs font-bold leading-snug block">{toast.text}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

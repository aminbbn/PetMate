import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store';
import { Product, ProductSearchInput, ProductCategory } from './shopTypes';
import { catalogRepository } from './catalogRepository';
import { ShopHeader } from './ShopHeader';
import { ShopCompatibilityCard } from './ShopCompatibilityCard';
import { ShopToolbar } from './ShopToolbar';
import { ProductGrid } from './ProductGrid';
import { ProductDetailDialog } from './ProductDetailDialog';
import { CartButton } from './CartButton';
import { CartDrawer } from './CartDrawer';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShoppingBag, ShieldCheck } from 'lucide-react';

interface FlyingThumbnail {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  imgUrl: string;
}

interface ToastMessage {
  id: string;
  text: string;
  imgUrl?: string;
}

export const ShopPage: React.FC = () => {
  const { cart, addToCart, favorites } = useAppStore();

  // Active UI drawer states
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  // Signature animations state
  const [flyingThumbnails, setFlyingThumbnails] = useState<FlyingThumbnail[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Track which product buttons are currently in "Adding / Added" state
  const [addingIds, setAddingIds] = useState<Record<string, boolean>>({});

  // Fetch categories initially
  useEffect(() => {
    const fetchCategories = async () => {
      const cats = await catalogRepository.getCategories();
      setCategories(cats);
    };
    fetchCategories();
  }, []);

  // Fetch products upon filter changes
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const favoriteIds = favorites?.map(f => f.productId) || [];
      const result = await catalogRepository.search({
        ...filters,
        favoriteProductIds: favoriteIds
      });
      setProducts(result.products);
      setTotalProducts(result.totalCount);
      setIsLoading(false);
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

  // Curved flying flight animation
  const handleAddToCartWithAnimation = (
    e: React.MouseEvent<HTMLButtonElement> | null,
    product: Product
  ) => {
    // 1. Brief added haptic states on the specific card button
    setAddingIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddingIds(prev => ({ ...prev, [product.id]: false }));
    }, 2000);

    // 2. Perform flying flight animation if button event coordinates are available
    if (e) {
      const buttonRect = e.currentTarget.getBoundingClientRect();
      const cartButton = document.getElementById('cart-button');
      
      if (cartButton) {
        const cartRect = cartButton.getBoundingClientRect();
        
        // Coordinates relative to scroll position
        const startX = buttonRect.left + buttonRect.width / 2;
        const startY = buttonRect.top + buttonRect.height / 2;
        const endX = cartRect.left + cartRect.width / 2;
        const endY = cartRect.top + cartRect.height / 2;
        
        const flyId = `${product.id}-${Date.now()}`;
        const newFly: FlyingThumbnail = {
          id: flyId,
          startX,
          startY,
          endX,
          endY,
          imgUrl: product.media[0]?.url || ''
        };
        
        setFlyingThumbnails(prev => [...prev, newFly]);
      }
    }

    // 3. Add to store
    addToCart({ productId: product.id, quantity: 1 });

    // 4. Trigger elegant toast notification
    const toastId = `${product.id}-toast-${Date.now()}`;
    const newToast: ToastMessage = {
      id: toastId,
      text: `«${product.name}» با موفقیت به سبد خرید اضافه شد.`,
      imgUrl: product.media[0]?.url
    };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toastId));
    }, 3500);
  };

  const removeFlyingThumbnail = (id: string) => {
    setFlyingThumbnails(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24" id="shop-page-wrapper">
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
            <span className="text-sm font-semibold text-slate-500 animate-pulse">در حال فراخوانی ملزومات پت...</span>
          </div>
        ) : (
          <ProductGrid
            products={products}
            onViewDetails={setSelectedProduct}
            onAddToCart={(e, prod) => handleAddToCartWithAnimation(e, prod)}
            onResetFilters={handleResetFilters}
          />
        )}
      </div>

      {/* Floating Cart Shopping Button */}
      <CartButton onOpen={() => setCartDrawerOpen(true)} />

      {/* Cart Slider Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
      />

      {/* Product Detail Dialog Modal */}
      <ProductDetailDialog
        product={selectedProduct}
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(prod) => handleAddToCartWithAnimation(null, prod)}
      />

      {/* Signature Add-To-Cart Curved Flying Overlay */}
      <AnimatePresence>
        {flyingThumbnails.map((fly) => {
          // Mid points for the curve bezier calculations
          const midX = fly.startX + (fly.endX - fly.startX) * 0.45;
          const midY = Math.min(fly.startY, fly.endY) - 150; // Arc height

          return (
            <motion.div
              key={fly.id}
              initial={{ 
                position: 'fixed',
                top: 0,
                left: 0,
                x: fly.startX - 24, 
                y: fly.startY - 24, 
                scale: 1, 
                opacity: 1,
                zIndex: 9999,
                pointerEvents: 'none'
              }}
              animate={{
                x: [fly.startX - 24, midX - 16, fly.endX - 8],
                y: [fly.startY - 24, midY - 16, fly.endY - 8],
                scale: [1, 0.7, 0.15],
                opacity: [1, 0.9, 0]
              }}
              transition={{
                duration: 0.8,
                ease: "easeOut"
              }}
              onAnimationComplete={() => removeFlyingThumbnail(fly.id)}
              className="w-12 h-12 rounded-full overflow-hidden border-2 border-coral shadow-lg bg-white shrink-0"
            >
              <img
                src={fly.imgUrl}
                alt="flying thumbnail"
                className="w-full h-full object-cover"
              />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Modern Floating Toast Notifications (stacked at top right corner) */}
      <div className="fixed top-6 right-6 z-[10000] space-y-3.5 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9, transition: { duration: 0.2 } }}
              className="bg-white/95 backdrop-blur-md border border-slate-100 shadow-xl rounded-2xl p-3.5 flex items-center gap-3.5 pointer-events-auto"
            >
              {toast.imgUrl && (
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 shrink-0">
                  <img src={toast.imgUrl} alt="toast thumbnail" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 text-right">
                <span className="text-xs text-slate-400 font-semibold block">سفارش تستی</span>
                <span className="text-xs font-bold text-slate-700 leading-snug mt-0.5 block">{toast.text}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

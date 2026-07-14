import React from 'react';
import { Product, ProductMatch } from './shopTypes';
import { useAppStore } from '../../store';
import { getProductCompatibility } from './compatibilityUtils';
import { toPersianDigits, formatToman } from './shopUtils';
import { X, Heart, ShoppingCart, ShieldCheck, Stethoscope, AlertTriangle, FileText, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/Button';

interface ProductDetailDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductDetailDialog: React.FC<ProductDetailDialogProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart
}) => {
  const { pets, selectedPetId, favorites, toggleFavorite } = useAppStore();

  if (!product) return null;

  const selectedPet = pets?.find(p => p.id === selectedPetId) || null;
  const isFavorite = favorites?.some(fav => fav.productId === product.id) || false;

  // Evaluate deterministic compatibility profile
  const matchResult: ProductMatch = getProductCompatibility(product, selectedPet);

  // Status style configuration
  const getMatchStyles = () => {
    switch (matchResult.status) {
      case 'compatible':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-100',
          title: 'کاملاً سازگار با پت شما',
          icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />
        };
      case 'partial':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200/50',
          title: 'سازگاری نسبی / نیاز به دقت',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600" />
        };
      case 'not_applicable':
        return {
          bg: 'bg-slate-100 text-slate-600 border-slate-200',
          title: 'غیرمرتبط با گونه پت شما',
          icon: <AlertTriangle className="w-5 h-5 text-slate-500" />
        };
      case 'requires_guidance':
        return {
          bg: 'bg-blue-50/80 text-blue-900 border-blue-100',
          title: 'نیازمند هماهنگی و مشورت با دامپزشک',
          icon: <Stethoscope className="w-5 h-5 text-blue-600" />
        };
      case 'unknown':
      default:
        return {
          bg: 'bg-slate-50 text-slate-600 border-slate-100',
          title: 'ارزیابی سازگاری بر اساس پروفایل پت',
          icon: <AlertTriangle className="w-5 h-5 text-slate-400" />
        };
    }
  };

  const matchStyle = getMatchStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            {/* Modal Dialog container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 210 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[32px] w-full max-w-4xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row my-auto max-h-[90vh] md:max-h-none"
            >
              {/* Left Column: Image gallery and actions (flex columns on mobile) */}
              <div className="w-full md:w-[42%] bg-slate-50 p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-l border-slate-100 overflow-y-auto md:overflow-visible shrink-0">
                <div>
                  {/* Close and Favorite header */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-white text-slate-400 hover:text-slate-800 rounded-full transition-colors cursor-pointer shadow-sm border border-slate-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="p-2 bg-white rounded-full shadow-sm text-slate-400 hover:text-pink-600 transition-colors cursor-pointer border border-slate-100"
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-pink-600 text-pink-600' : ''}`} />
                    </button>
                  </div>

                  {/* Product Display Image */}
                  <div className="aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-200/50 mb-4">
                    <img
                      src={product.media[0]?.url}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Rating block */}
                  {product.rating && (
                    <div className="bg-white/80 border border-slate-200/50 rounded-2xl p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-500 font-extrabold text-sm">★ {toPersianDigits(product.rating.value)}</span>
                        <span className="text-slate-400">({toPersianDigits(product.rating.reviewCount)} نظر ثبت شده)</span>
                      </div>
                      <span className="text-slate-500 font-medium">مرجع: {product.rating.source}</span>
                    </div>
                  )}
                </div>

                {/* Seller info */}
                <div className="mt-6 pt-5 border-t border-slate-200/60 text-xs text-slate-400">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span>تامین کننده: <strong className="text-slate-600 font-semibold">{product.sellerName || 'بازارچه پت‌میت'}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>توزیع به سفارش: {product.sourceName}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Descriptions, compatibility, and Add to Cart */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-5">
                  {/* Category chip and Brand */}
                  <div className="flex items-center justify-between">
                    <span className="bg-coral-light/10 text-coral-deep text-xs font-bold px-3 py-1 rounded-full">
                      {product.category === 'food' ? 'غذای پت' : 
                       product.category === 'treat' ? 'تشویقی پت' : 
                       product.category === 'supplement' ? 'مکمل تقویتی مفاصل و رشد' :
                       product.category === 'toy' ? 'اسباب‌بازی فکری' :
                       product.category === 'hygiene' ? 'بهداشت پوست و مو' :
                       product.category === 'grooming' ? 'آرایش پت' : 'ملزومات'}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">برند: {product.brand || 'عمومی'}</span>
                  </div>

                  {/* Name */}
                  <h2 className="font-extrabold text-slate-800 text-lg md:text-xl leading-snug">
                    {product.name}
                  </h2>

                  {/* Description */}
                  <p className="text-xs md:text-sm text-slate-500 leading-relaxed text-justify">
                    {product.description || product.shortDescription}
                  </p>

                  {/* Veterinarian Guidance Caution Alert */}
                  {product.compatibility?.requiresVeterinarianGuidance && (
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3 text-blue-950">
                      <Stethoscope className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-xs md:text-sm font-bold">احتیاط مصرف و گایدلاین دامپزشکی</strong>
                        <span className="block text-xs text-blue-800/90 leading-relaxed mt-1">
                          این فرآورده حاوی دوزهای درمانی بوده و به صورت مکمل دارویی یا رژیم درمانی عرضه شده است. برای حفظ سلامت هر چه بیشتر پت، قویاً توصیه می‌کنیم قبل از شروع مصرف، با دامپزشک متخصص پت خود مشورت نمایید.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Technical Attributes table */}
                  {Object.keys(product.attributes).length > 0 && (
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                      <span className="text-xs font-bold text-slate-500 block mb-2.5">مشخصات و آنالیز محصول</span>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                        {Object.entries(product.attributes).map(([key, val]) => (
                          <div key={key} className="flex justify-between items-center text-xs py-1 border-b border-slate-200/30">
                            <span className="text-slate-400 font-medium">{key}:</span>
                            <span className="text-slate-700 font-bold">{toPersianDigits(val)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Real-time Deterministic Compatibility results */}
                  <div className={`border rounded-2xl p-4 flex flex-col gap-2.5 ${matchStyle.bg}`}>
                    <div className="flex items-center gap-2.5">
                      {matchStyle.icon}
                      <strong className="text-xs md:text-sm font-extrabold">{matchStyle.title}</strong>
                    </div>
                    
                    <ul className="list-disc list-inside space-y-1 text-xs leading-relaxed mr-0.5">
                      {matchResult.reasons.map((reason, idx) => (
                        <li key={idx} className="font-medium">{reason}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Pricing and Action footer */}
                <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {product.price ? (
                    <div className="flex flex-col">
                      {product.price.originalAmount && product.price.originalAmount > product.price.amount && (
                        <span className="text-slate-400 text-xs md:text-sm line-through text-right leading-none mb-1.5">
                          {formatToman(product.price.originalAmount)}
                        </span>
                      )}
                      <span className="font-black text-slate-800 text-lg md:text-xl leading-none">
                        {formatToman(product.price.amount)}{' '}
                        <span className="text-xs font-semibold text-slate-500">تومان</span>
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">قیمت نامشخص</span>
                  )}

                  <div className="flex items-center gap-3">
                    <Button
                      variant="primary"
                      disabled={product.availability === 'out_of_stock'}
                      onClick={() => {
                        onAddToCart(product);
                        onClose();
                      }}
                      className="px-8 font-bold text-sm shrink-0"
                    >
                      <ShoppingCart className="w-4.5 h-4.5 ml-1.5" />
                      {product.availability === 'out_of_stock' ? 'ناموجود در انبار' : 'افزودن به سبد خرید تستی'}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={onClose}
                      className="text-xs font-bold px-5 py-3.5"
                    >
                      بستن کادر
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

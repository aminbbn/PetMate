import React from 'react';
import { Product, ProductMatch } from './shopTypes';
import { Card } from '../../components/Card';
import { useAppStore } from '../../store';
import { getProductCompatibility } from './compatibilityUtils';
import { toPersianDigits, formatToman } from './shopUtils';
import { Heart, ShoppingCart, Eye, Stethoscope, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails
}) => {
  const { pets, selectedPetId, favorites, toggleFavorite } = useAppStore();
  
  const selectedPet = pets?.find(p => p.id === selectedPetId) || null;
  const isFavorite = favorites?.some(fav => fav.productId === product.id) || false;

  // Evaluate deterministic compatibility profile
  const matchResult: ProductMatch = getProductCompatibility(product, selectedPet);

  // Status badges configurations
  const getMatchStyles = () => {
    switch (matchResult.status) {
      case 'compatible':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
          dot: 'bg-emerald-500',
          text: 'کاملاً سازگار',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline ml-1 shrink-0" />
        };
      case 'partial':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200/40',
          dot: 'bg-amber-500',
          text: 'ناسازگاری جزیی',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600 inline ml-1 shrink-0" />
        };
      case 'not_applicable':
        return {
          bg: 'bg-slate-100 text-slate-500 border-slate-200',
          dot: 'bg-slate-400',
          text: 'غیرمرتبط با پت',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-slate-400 inline ml-1 shrink-0" />
        };
      case 'requires_guidance':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200/40',
          dot: 'bg-blue-500',
          text: 'مشورت دامپزشک',
          icon: <Stethoscope className="w-3.5 h-3.5 text-blue-600 inline ml-1 shrink-0" />
        };
      case 'unknown':
      default:
        return {
          bg: 'bg-slate-50 text-slate-600 border-slate-100',
          dot: 'bg-slate-400',
          text: 'نیازمند پروفایل پت',
          icon: null
        };
    }
  };

  const matchStyle = getMatchStyles();

  // Stock status
  const getStockBadge = () => {
    if (product.availability === 'out_of_stock') {
      return (
        <span className="bg-red-50 text-red-600 border border-red-100 px-2.5 py-1 rounded-xl text-xs font-semibold">
          ناموجود
        </span>
      );
    }
    if (product.availability === 'low_stock') {
      return (
        <span className="bg-amber-50 text-amber-600 border border-amber-100 px-2.5 py-1 rounded-xl text-xs font-semibold">
          محدود (کمتر از ۳ عدد)
        </span>
      );
    }
    return null;
  };

  return (
    <Card 
      glow={matchResult.status === 'compatible'} 
      hoverLift={product.availability !== 'out_of_stock'}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col h-full">
        {/* Thumbnail Image and badges layer */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100/60 mb-4 shrink-0">
          <img
            src={product.media[0]?.url || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&q=80'}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            id={`product-img-${product.id}`}
          />

          {/* Favorites Top Absolute corner */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
            className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-md p-2.5 rounded-full shadow-md text-slate-400 hover:text-pink-600 transition-all active:scale-90 cursor-pointer z-20"
          >
            <Heart 
              className={`w-4 h-4 transition-colors ${
                isFavorite ? 'fill-pink-600 text-pink-600' : ''
              }`} 
            />
          </button>

          {/* Quick stock badge bottom corner */}
          <div className="absolute bottom-3.5 left-3.5 z-10 flex gap-2">
            {getStockBadge()}
          </div>
        </div>

        {/* Brand and category */}
        <div className="flex items-center justify-between gap-2 mb-1.5 text-xs text-slate-400 font-medium px-0.5">
          <span>{product.brand || 'برند عمومی'}</span>
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg text-[10px]">
            {product.category === 'food' ? 'غذا' : 
             product.category === 'treat' ? 'تشویقی' : 
             product.category === 'supplement' ? 'مکمل تقویتی' :
             product.category === 'toy' ? 'بازی و سرگرمی' :
             product.category === 'hygiene' ? 'بهداشت' :
             product.category === 'grooming' ? 'آرایش' : 'لوازم'}
          </span>
        </div>

        {/* Product Name */}
        <h3 
          onClick={() => onViewDetails(product)}
          className="font-bold text-slate-800 text-sm md:text-base leading-snug line-clamp-2 hover:text-coral transition-colors cursor-pointer mb-3 h-11"
        >
          {product.name}
        </h3>

        {/* Deterministic Compatibility badge */}
        <div className="mb-4">
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold ${matchStyle.bg}`}>
            {matchStyle.icon}
            <span className="truncate">{matchStyle.text}</span>
            <span className="text-[10px] text-slate-400/90 font-medium mr-auto">
              {selectedPet ? `ویژه ${selectedPet.name}` : 'نیازمند شناسنامه'}
            </span>
          </div>
        </div>

        {/* Price and Add to Cart Section */}
        <div className="mt-auto pt-3 border-t border-slate-50/80 flex items-center justify-between gap-2">
          {product.price ? (
            <div className="flex flex-col">
              {product.price.originalAmount && product.price.originalAmount > product.price.amount && (
                <span className="text-slate-400 text-xs line-through text-right leading-none mb-1">
                  {formatToman(product.price.originalAmount)}
                </span>
              )}
              <span className="font-extrabold text-slate-800 text-sm md:text-base leading-none">
                {formatToman(product.price.amount)}{' '}
                <span className="text-[10px] text-slate-500 font-medium">تومان</span>
              </span>
            </div>
          ) : (
            <span className="text-xs text-slate-400">قیمت نامشخص</span>
          )}

          {/* Interaction action buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onViewDetails(product)}
              className="px-4 py-2 bg-coral hover:bg-coral-deep text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-sm shadow-coral/10 hover:shadow-md"
            >
              <span>مشاهده قیمت‌ها</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

import React from 'react';
import { RelatedProductItem, RelatedProductReason } from './shopTypes';
import { Card } from '../../components/Card';
import { useAppStore } from '../../store';
import { formatToman, toPersianDigits } from './shopUtils';
import { Heart } from 'lucide-react';

interface RelatedProductCardProps {
  item: RelatedProductItem;
  onClick: () => void;
}

const REASON_LABELS: Record<RelatedProductReason, string> = {
  same_category: 'دسته مشابه',
  same_species: 'برای همان گونه',
  same_life_stage: 'مرحله سنی مشابه',
  same_brand: 'برند مشابه',
  similar_attributes: 'مشخصات نزدیک',
  similar_variant: 'قابل مقایسه',
  frequently_compared: 'قابل مقایسه',
};

export const RelatedProductCard: React.FC<RelatedProductCardProps> = ({
  item,
  onClick
}) => {
  const { favorites, toggleFavorite } = useAppStore();
  const { product, offers, lowestActiveOffer, reasons } = item;

  const isFavorite = favorites?.some(fav => fav.productId === product.id) || false;
  const activeOffersCount = offers.filter(o => o.availability !== 'out_of_stock').length;

  // Grab the first relevant reason, or default to generic matching reason
  const primaryReason = reasons.length > 0 ? reasons[0] : null;
  const reasonLabel = primaryReason ? REASON_LABELS[primaryReason] : 'قابل مقایسه';

  return (
    <Card
      glow={false}
      hoverLift={true}
      className="h-full flex flex-col justify-between bg-[#FCFAF7] border border-coral-light/20 shadow-xs hover:shadow-md transition-all duration-300"
      onClick={onClick}
    >
      <div className="flex flex-col h-full cursor-pointer">
        {/* Product Image and Badges */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-slate-100/60 mb-3 shrink-0">
          <img
            src={product.media[0]?.url || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&q=80'}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-1015 transition-transform duration-300"
          />

          {/* Reason Chip - top-left */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="bg-white/90 backdrop-blur-md text-coral-deep border border-coral-light/30 px-2 py-0.5 rounded-lg text-[10px] font-black">
              {reasonLabel}
            </span>
          </div>

          {/* Favorite Button - top-right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
            aria-label={`افزودن ${product.name} به علاقه‌مندی‌ها`}
            className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md p-2 rounded-full shadow-xs text-slate-400 hover:text-pink-600 transition-all active:scale-90 cursor-pointer z-20"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                isFavorite ? 'fill-pink-600 text-pink-600' : ''
              }`}
            />
          </button>
        </div>

        {/* Product Brand and Category */}
        <div className="flex items-center justify-between gap-2 mb-1 text-[10px] text-slate-400 font-medium">
          <span className="truncate max-w-[120px]">{product.brand || 'برند عمومی'}</span>
          <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md shrink-0">
            {product.category === 'food' ? 'غذا' :
             product.category === 'treat' ? 'تشویقی' :
             product.category === 'supplement' ? 'مکمل' :
             product.category === 'toy' ? 'بازی' :
             product.category === 'hygiene' ? 'بهداشت' :
             product.category === 'grooming' ? 'آرایش' : 'لوازم'}
          </span>
        </div>

        {/* Product Name */}
        <h4 className="font-bold text-slate-800 text-xs md:text-sm leading-snug line-clamp-2 hover:text-coral transition-colors mb-3 h-9">
          {product.name}
        </h4>

        {/* Pricing Area */}
        <div className="mt-auto pt-2.5 border-t border-slate-100/50 flex items-center justify-between gap-1">
          {lowestActiveOffer?.price ? (
            <div className="flex flex-col text-right">
              {activeOffersCount > 1 ? (
                <>
                  <span className="text-[10px] text-slate-400 font-medium">
                    از {formatToman(lowestActiveOffer.price.amount)} تومان
                  </span>
                  <span className="text-[10px] text-coral font-black">
                    {toPersianDigits(activeOffersCount)} فروشگاه همکار
                  </span>
                </>
              ) : (
                <>
                  <span className="font-extrabold text-slate-800 text-xs md:text-sm">
                    {formatToman(lowestActiveOffer.price.amount)} تومان
                  </span>
                  {lowestActiveOffer.sellerText && (
                    <span className="text-[9px] text-slate-400 truncate max-w-[110px]">
                      {lowestActiveOffer.sellerText}
                    </span>
                  )}
                </>
              )}
            </div>
          ) : (
            <span className="text-[10px] text-slate-400 font-medium">قیمت فعالی ثبت نشده</span>
          )}

          {/* Action Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="px-2.5 py-1.5 bg-coral hover:bg-coral-deep text-white text-[10px] font-black rounded-lg transition-all cursor-pointer shadow-xs"
          >
            مشاهده قیمت‌ها
          </button>
        </div>
      </div>
    </Card>
  );
};

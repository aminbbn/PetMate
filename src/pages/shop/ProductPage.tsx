import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { ProductDetailResult, MerchantOffer, Merchant } from './shopTypes';
import { getProductCompatibility } from './compatibilityUtils';
import { formatToman, toPersianDigits } from './shopUtils';
import { 
  ArrowRight, 
  Stethoscope, 
  AlertTriangle, 
  ShieldCheck, 
  ExternalLink, 
  Truck, 
  Store, 
  Info,
  Heart
} from 'lucide-react';
import { motion } from 'motion/react';
import { RelatedProducts } from './RelatedProducts';

export const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { pets, selectedPetId, favorites, toggleFavorite } = useAppStore();
  
  const [detail, setDetail] = useState<ProductDetailResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const selectedPet = pets?.find(p => p.id === selectedPetId) || null;

  useEffect(() => {
    setActiveMediaIndex(0);
    const fetchProductDetail = async () => {
      if (!slug) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/catalog/products/${slug}`);
        if (!response.ok) {
          throw new Error('کالا یافت نشد یا مشکلی در دریافت اطلاعات وجود دارد.');
        }
        const data = await response.json();
        setDetail(data);
      } catch (err: any) {
        setError(err.message || 'خطا در بارگذاری اطلاعات محصول');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetail();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-coral border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold text-slate-500 animate-pulse">در حال بررسی انبارها و قیمت‌های رقابتی همکاران...</span>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="py-16 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-extrabold text-slate-800 mb-2">خطا در بارگذاری صفحه محصول</h3>
        <p className="text-slate-500 text-sm mb-6">{error || 'محصول مورد نظر یافت نشد.'}</p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-2.5 bg-coral text-white font-semibold rounded-xl text-sm hover:bg-coral-deep transition-all cursor-pointer"
        >
          بازگشت به فروشگاه
        </button>
      </div>
    );
  }

  const { product, offers, merchants, relatedProducts } = detail;
  const isFavorite = favorites?.some(fav => fav.productId === product.id) || false;

  // Evaluate compatibility
  const compatibilityMatch = getProductCompatibility(product as any, selectedPet);

  // Helper to find merchant info for an offer
  const getMerchantForOffer = (merchantId: string): Merchant | undefined => {
    return merchants.find(m => m.id === merchantId);
  };

  return (
    <div className="min-h-screen bg-[#FFFDFB] pb-24 text-right" dir="rtl">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={() => navigate('/shop')}
          className="flex items-center gap-2 text-slate-500 hover:text-coral transition-colors text-xs md:text-sm font-semibold cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به فروشگاه مقایسه‌ای پت میت</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Right Column: Dynamic Gallery and Specs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm relative">
              {/* Main Image View */}
              <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 mb-4 relative">
                <img
                  src={product.media[activeMediaIndex]?.url || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&q=80'}
                  alt={product.media[activeMediaIndex]?.alt || product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                
                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-full shadow-md text-slate-400 hover:text-pink-600 transition-all active:scale-95 cursor-pointer"
                >
                  <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-pink-600 text-pink-600' : ''}`} />
                </button>
              </div>

              {/* Gallery Thumbnails */}
              {product.media.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {product.media.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveMediaIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        activeMediaIndex === idx ? 'border-coral shadow-sm' : 'border-slate-100 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={item.url} alt={item.alt} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Spec Matrix Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
              <h3 className="font-extrabold text-slate-800 text-base mb-4">مشخصات فنی و ویژگی‌ها</h3>
              <div className="divide-y divide-slate-50">
                {Object.entries(product.attributes).map(([key, val]) => (
                  <div key={key} className="py-3 flex justify-between gap-4 text-xs md:text-sm">
                    <span className="text-slate-400 font-medium shrink-0">{key}</span>
                    <span className="text-slate-700 font-semibold text-left">{toPersianDigits(val)}</span>
                  </div>
                ))}
                {product.brand && (
                  <div className="py-3 flex justify-between gap-4 text-xs md:text-sm">
                    <span className="text-slate-400 font-medium">برند سازنده</span>
                    <span className="text-coral font-bold">{product.brand}</span>
                  </div>
                )}
                {product.gtin && (
                  <div className="py-3 flex justify-between gap-4 text-xs md:text-sm">
                    <span className="text-slate-400 font-medium">کد بین‌المللی کالا (GTIN)</span>
                    <span className="text-slate-600 font-mono text-[11px]">{product.gtin}</span>
                  </div>
                )}
              </div>
            </div>

            {/* General Disclaimer */}
            <div className="bg-amber-50/40 border border-amber-100/50 rounded-2xl p-4 text-xs text-amber-800 leading-relaxed flex gap-3">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <span>این کالا توسط پت شاپ همکار عرضه شده است. قیمت و موجودی ممکن است تغییر کند.</span>
            </div>
          </div>

          {/* Left Column: Product Info & Sticky Comparative Offers */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
              
              {/* Product Badge / Tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full font-bold">
                  {product.category === 'food' ? 'غذای حیوانات' : 
                   product.category === 'treat' ? 'تشویقی کالا' : 
                   product.category === 'supplement' ? 'مکمل تقویتی' :
                   product.category === 'toy' ? 'اسباب‌بازی فکری' :
                   product.category === 'hygiene' ? 'بهداشت پت' :
                   product.category === 'grooming' ? 'آرایش و شستشو' : 'ملزومات نگهداری'}
                </span>
                {product.brand && (
                  <span className="bg-coral/5 text-coral text-xs px-3 py-1 rounded-full font-bold">
                    برند {product.brand}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-xl md:text-2xl font-black text-slate-800 leading-snug">
                {product.name}
              </h1>

              {/* Short description */}
              {product.shortDescription && (
                <p className="text-slate-500 text-sm leading-relaxed">
                  {product.shortDescription}
                </p>
              )}

              {/* Vet guidance blocker */}
              {product.requiresVeterinarianGuidance && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-3.5 items-start">
                  <Stethoscope className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-red-800 text-sm">نیاز به تجویز یا مشورت دامپزشک</h4>
                    <p className="text-red-700 text-xs leading-relaxed">
                      برای مصرف مکمل‌ها و رژیم‌های درمانی، پیش از خرید با دامپزشک مشورت کنید.
                    </p>
                    {product.guidanceText && (
                      <p className="text-red-500 text-xs font-semibold mt-1">توصیه پزشک: {product.guidanceText}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Pet Compatibility Card */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    compatibilityMatch.status === 'compatible' ? 'bg-emerald-100 text-emerald-700' :
                    compatibilityMatch.status === 'requires_guidance' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {compatibilityMatch.status === 'compatible' ? <ShieldCheck className="w-5 h-5" /> : <Stethoscope className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-700 text-sm">
                      {selectedPet ? `ارزیابی سازگاری با «${selectedPet.name}»` : 'شناسنامه پت متصل نیست'}
                    </h4>
                    <p className="text-slate-500 text-xs mt-0.5 leading-snug">
                      {compatibilityMatch.reasons[0]}
                    </p>
                  </div>
                </div>
                {selectedPet && (
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                    compatibilityMatch.status === 'compatible' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {compatibilityMatch.status === 'compatible' ? 'سازگار' : 'بررسی مجدد'}
                  </span>
                )}
              </div>

              {/* Full Description */}
              {product.description && (
                <div className="pt-2 border-t border-slate-50">
                  <h3 className="font-extrabold text-slate-700 text-sm mb-2">توضیحات محصول</h3>
                  <p className="text-slate-500 text-xs md:text-sm leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}
            </div>

            {/* Competing Merchant Offers Bento-Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-black text-slate-800 text-base md:text-lg">پیشنهادهای خرید و مقایسه قیمت همکاران</h2>
                <span className="text-xs text-slate-400 font-semibold">{toPersianDigits(offers.length)} فروشنده فعال</span>
              </div>

              <div className="space-y-3">
                {offers.map((offer) => {
                  const merchant = getMerchantForOffer(offer.merchantId);
                  if (!merchant) return null;

                  return (
                    <div 
                      key={offer.id} 
                      className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-coral-light transition-all duration-300"
                    >
                      {/* Merchant Meta */}
                      <div className="flex items-center gap-3.5 shrink-0">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                          <img src={merchant.logoUrl || 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=80&q=80'} alt={merchant.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-800 text-sm block">{merchant.name}</span>
                          <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                            <Store className="w-3 h-3 text-slate-400 shrink-0" />
                            {offer.sellerText || 'فروشگاه معتبر شریک'}
                          </span>
                        </div>
                      </div>

                      {/* Shipping and availability details */}
                      <div className="text-right space-y-1 shrink-0 md:max-w-xs">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{offer.shippingText || 'ارسال در اولین فرصت کاری'}</span>
                        </div>
                        <span className={`inline-block text-[10px] px-2 py-0.5 rounded-lg font-semibold ${
                          offer.availability === 'in_stock' ? 'bg-emerald-50 text-emerald-700' :
                          offer.availability === 'low_stock' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'
                        }`}>
                          {offer.availability === 'in_stock' ? 'موجود در انبار' :
                           offer.availability === 'low_stock' ? 'موجودی محدود' : 'ناموجود'}
                        </span>
                      </div>

                      {/* Price Comparison and Outbound Call To Action */}
                      <div className="w-full md:w-auto flex md:flex-col justify-between items-center md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-50">
                        {/* Pricing */}
                        {offer.price ? (
                          <div className="text-right space-y-0.5">
                            {offer.originalPrice && offer.originalPrice.amount > offer.price.amount && (
                              <span className="text-slate-400 text-xs line-through block leading-none">
                                {formatToman(offer.originalPrice.amount)}
                              </span>
                            )}
                            <span className="font-black text-slate-800 text-base block leading-none">
                              {formatToman(offer.price.amount)}{' '}
                              <span className="text-[11px] text-slate-500 font-medium">تومان</span>
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">قیمت نامشخص</span>
                        )}

                        {/* Outbound Link Button */}
                        <a
                          href={`/api/outbound/${offer.id}`}
                          target="_blank"
                          rel="sponsored noopener noreferrer"
                          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                            offer.availability === 'out_of_stock'
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-coral text-white hover:bg-coral-deep shadow-sm hover:shadow'
                          }`}
                        >
                          <span>خرید از فروشگاه همکار</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Affiliate Disclosures */}
              {merchants.some(m => m.isAffiliatePartner) && (
                <div className="bg-coral-light/20 border border-coral-light/30 rounded-2xl p-4 text-xs text-coral-deep leading-relaxed flex gap-3">
                  <Info className="w-5 h-5 text-coral shrink-0 mt-0.5" />
                  <span>لینک همکاری فعال است؛ پت میت ممکن است کمیسیون دریافت کند.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Section Addendum */}
        <RelatedProducts
          relatedProducts={relatedProducts}
          currentProduct={product}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

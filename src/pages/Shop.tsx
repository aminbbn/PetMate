import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ShoppingBag, Star, ShoppingCart, Filter, Heart, Sparkles, Check, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toPersian } from '../lib/persian';
import { cn } from '../lib/utils';

interface Product {
  id: string;
  name: string;
  category: 'nutrition' | 'toy' | 'hygiene';
  price: number; // in Tomans
  rating: number;
  image: string; // Emoji representing the item
  isAiRecommended: boolean;
  notes: string;
}

export default function Shop() {
  const profile = useAppStore(state => state.profile);
  const [activeCategory, setActiveCategory] = useState<'all' | 'nutrition' | 'toy' | 'hygiene'>('all');
  const [cartCount, setCartCount] = useState(0);
  const [likedItems, setLikedItems] = useState<string[]>([]);
  const [justAdded, setJustAdded] = useState<string | null>(null);

  if (!profile) return null;

  const products: Product[] = [
    {
      id: 'p-1',
      name: `غذای خشک سوپرپریمیوم مخصوص ${profile.type === 'dog' ? 'سگ نژاد بزرگ' : 'گربه‌های حساس'}`,
      category: 'nutrition',
      price: 380000,
      rating: 4.9,
      image: '🍗',
      isAiRecommended: true,
      notes: `فرمولاسیون اختصاصی متناسب با سن ${toPersian(profile.age)} سال و نژاد ${profile.breed || 'نامشخص'}`
    },
    {
      id: 'p-2',
      name: 'مولتی‌ویتامین و تقویت‌کننده مفاصل خمیری',
      category: 'nutrition',
      price: 195000,
      rating: 4.8,
      image: '🧪',
      isAiRecommended: true,
      notes: 'حاوی گلوکوزامین و کلسیم جهت استحکام استخوان‌ها و تقویت سیستم دفاعی'
    },
    {
      id: 'p-3',
      name: 'اسباب‌بازی فکری تعاملی (چرخ دنده پازلی)',
      category: 'toy',
      price: 125000,
      rating: 4.6,
      image: '🧩',
      isAiRecommended: false,
      notes: 'تقویت‌کننده هوش و تخلیه هیجان، مانع از کلافگی و انزوای حیوان خانگی'
    },
    {
      id: 'p-4',
      name: 'شامپو نرم‌کننده گیاهی با اسانس نارگیل',
      category: 'hygiene',
      price: 160000,
      rating: 4.7,
      image: '🧴',
      isAiRecommended: false,
      notes: 'ضد خارش و ضد حساسیت، براق‌کننده طبیعی و ماندگار موها'
    },
    {
      id: 'p-5',
      name: profile.type === 'dog' ? 'قلاده چرمی دست‌دوز با پلاک اسم برنجی' : 'اسکرچر استوانه‌ای کنفی بزرگ چرخ‌دار',
      category: 'toy',
      price: 450000,
      rating: 4.9,
      image: profile.type === 'dog' ? '🐕' : '🐈',
      isAiRecommended: false,
      notes: 'ساخته شده از متریال با دوام و ایمن بدون آسیب‌رسانی به پوست و مو'
    }
  ];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const handleAddToCart = (id: string) => {
    setCartCount(prev => prev + 1);
    setJustAdded(id);
    setTimeout(() => {
      setJustAdded(null);
    }, 1200);
  };

  const handleLike = (id: string) => {
    if (likedItems.includes(id)) {
      setLikedItems(likedItems.filter(item => item !== id));
    } else {
      setLikedItems([...likedItems, id]);
    }
  };

  return (
    <div className="p-8 lg:p-10 space-y-8 max-w-7xl mx-auto w-full text-right" dir="rtl">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <ShoppingBag className="text-coral animate-swing" size={32} />
            فروشگاه هوشمند پت میت
          </h1>
          <p className="text-gray-400 text-sm font-bold mt-2">
            محصولات تایید شده و تغذیه اختصاصی متناسب با سن، وزن و نژاد {profile.name}
          </p>
        </div>
        
        {/* Animated Cart Status Badge */}
        <div className="relative bg-white p-3 px-5 rounded-2xl border border-coral-light/20 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-coral/10 text-coral flex items-center justify-center relative">
            <ShoppingCart size={20} className={cn(justAdded && "animate-bounce")} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -left-1.5 bg-sunny text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-black animate-scaleIn">
                {toPersian(cartCount)}
              </span>
            )}
          </div>
          <div>
            <span className="block text-[10px] text-gray-400 font-bold">سبد خرید شما</span>
            <span className="text-sm font-black text-gray-800">
              {cartCount > 0 ? `${toPersian(cartCount)} کالا آماده ثبت` : 'سبد خرید خالی است'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Recommended AI Banner + Filters & Products */}
      <div className="space-y-6">
        
        {/* AI Recommendations Highlight Bar */}
        <Card glow glowColor="sunny" className="bg-gradient-to-r from-sunny/10 via-coral-light/10 to-white border-sunny/30 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-right">
            <div className="w-12 h-12 bg-sunny text-white rounded-2xl flex items-center justify-center text-xl shadow-md shadow-sunny/20">
              <Sparkles className="animate-spin" style={{ animationDuration: '4s' }} size={22} />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-gray-800 text-base">پیشنهادات هوشمند منطبق بر آنالیز {profile.name}</h3>
              <p className="text-xs text-gray-500 font-bold">
                تغذیه و مکمل‌های ویتامینه زیر منطبق با شاخص توده بدنی ({toPersian(profile.weight)} کیلوگرم) توسط دامپزشک هوش مصنوعی فیلتر شده‌اند.
              </p>
            </div>
          </div>
          <span className="bg-sunny text-white text-[10px] px-3.5 py-1.5 rounded-full font-black animate-pulse">
            سیستم همگام‌ساز خودکار فعال است
          </span>
        </Card>

        {/* Filters Row */}
        <div className="flex gap-2 bg-white p-2 rounded-2xl border border-coral-light/10 shadow-sm max-w-md">
          <button
            onClick={() => setActiveCategory('all')}
            className={cn(
              "flex-1 py-2 rounded-xl text-xs font-black transition-all text-center",
              activeCategory === 'all' ? "bg-coral text-white shadow-sm shadow-coral/15" : "text-gray-500 hover:bg-peach/30"
            )}
          >
            همه موارد
          </button>
          <button
            onClick={() => setActiveCategory('nutrition')}
            className={cn(
              "flex-1 py-2 rounded-xl text-xs font-black transition-all text-center",
              activeCategory === 'nutrition' ? "bg-coral text-white shadow-sm shadow-coral/15" : "text-gray-500 hover:bg-peach/30"
            )}
          >
            تغذیه اختصاصی
          </button>
          <button
            onClick={() => setActiveCategory('toy')}
            className={cn(
              "flex-1 py-2 rounded-xl text-xs font-black transition-all text-center",
              activeCategory === 'toy' ? "bg-coral text-white shadow-sm shadow-coral/15" : "text-gray-500 hover:bg-peach/30"
            )}
          >
            بازی و تفریح
          </button>
          <button
            onClick={() => setActiveCategory('hygiene')}
            className={cn(
              "flex-1 py-2 rounded-xl text-xs font-black transition-all text-center",
              activeCategory === 'hygiene' ? "bg-coral text-white shadow-sm shadow-coral/15" : "text-gray-500 hover:bg-peach/30"
            )}
          >
            نظافت و بهداشت
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => {
            const isLiked = likedItems.includes(product.id);
            const isJustAdded = justAdded === product.id;

            return (
              <Card 
                key={product.id} 
                className={cn(
                  "bg-white border p-6 flex flex-col justify-between hover:scale-[1.01] hover:shadow-lg transition-all duration-300",
                  product.isAiRecommended ? "border-sunny/30 ring-1 ring-sunny/5" : "border-coral-light/10 shadow-sm"
                )}
              >
                {/* Product Image & badges */}
                <div className="relative bg-peach/20 rounded-2xl h-44 flex items-center justify-center text-6xl shadow-inner mb-4 overflow-hidden">
                  <span className="filter drop-shadow-lg transform hover:scale-110 transition-transform duration-300">{product.image}</span>
                  
                  {/* Like button */}
                  <button 
                    onClick={() => handleLike(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-300 hover:text-red-500 shadow-sm transition-all cursor-pointer"
                  >
                    <Heart size={16} className={cn(isLiked && "text-red-500 fill-current")} />
                  </button>

                  {/* AI badge */}
                  {product.isAiRecommended && (
                    <span className="absolute top-3 left-3 bg-sunny text-white text-[9px] px-2 py-0.5 rounded-md font-black flex items-center gap-1 shadow-sm">
                      <Sparkles size={10} />
                      توصیه پزشک هوشمند
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-2 text-right">
                  <h3 className="font-black text-gray-800 text-base">{product.name}</h3>
                  <p className="text-[11px] text-gray-400 font-bold leading-relaxed">{product.notes}</p>
                </div>

                {/* Price and Add to Cart */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 font-bold block">قیمت ویژه پت میت</span>
                    <span className="text-base font-black text-gray-800">{toPersian(product.price.toLocaleString())} <span className="text-[10px] font-normal text-gray-400">تومان</span></span>
                  </div>

                  <Button 
                    onClick={() => handleAddToCart(product.id)}
                    variant={product.isAiRecommended ? "sunny" : "primary"}
                    className="py-2 px-4 text-xs font-black flex items-center gap-1.5 shadow-md shadow-coral/5"
                  >
                    {isJustAdded ? (
                      <>
                        <Check size={14} className="stroke-[3]" />
                        افزوده شد!
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={14} />
                        خرید فوری
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

      </div>

    </div>
  );
}

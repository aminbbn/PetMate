import React from 'react';
import { CartItem } from './shopTypes';
import { DEMO_PRODUCTS } from './productFixtures';
import { toPersianDigits, formatToman } from './shopUtils';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemove
}) => {
  const product = DEMO_PRODUCTS.find(p => p.id === item.productId);

  if (!product) return null;

  const currentPrice = product.price ? product.price.amount : 0;
  const lineTotal = currentPrice * item.quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex items-center gap-4 py-4 border-b border-slate-100"
    >
      {/* Product Image */}
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
        <img
          src={product.media[0]?.url || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=100&q=80'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details info block */}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-slate-800 text-xs md:text-sm truncate leading-snug">
          {product.name}
        </h4>
        <span className="text-[10px] text-slate-400 block mt-0.5">
          برند: {product.brand || 'عمومی'}
        </span>
        
        {/* Unit Price */}
        <span className="text-xs font-bold text-slate-700 block mt-1.5">
          {formatToman(currentPrice)} <span className="text-[9px] font-medium text-slate-400">تومان</span>
        </span>
      </div>

      {/* Quantity panel and remove */}
      <div className="flex flex-col items-end gap-2.5 shrink-0">
        {/* Quantity selectors */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 border border-slate-200/40 rounded-xl p-1">
          <button
            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
            className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-coral hover:shadow transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          
          <span className="text-xs font-extrabold text-slate-800 min-w-4 text-center select-none">
            {toPersianDigits(item.quantity)}
          </span>

          <button
            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className={`w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-600 transition-all ${
              item.quantity <= 1
                ? 'opacity-30 cursor-not-allowed'
                : 'hover:text-coral hover:shadow cursor-pointer'
            }`}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Remove and line total */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-slate-800">
            {formatToman(lineTotal)} <span className="text-[9px] font-medium text-slate-400">تومان</span>
          </span>
          <button
            onClick={() => onRemove(item.productId)}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
            title="حذف از سبد خرید"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

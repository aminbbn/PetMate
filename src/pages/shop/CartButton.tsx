import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useAppStore } from '../../store';
import { calculateCartTotals } from './cartUtils';
import { toPersianDigits, formatToman } from './shopUtils';
import { motion, useAnimation } from 'motion/react';

interface CartButtonProps {
  onOpen: () => void;
}

export const CartButton: React.FC<CartButtonProps> = ({ onOpen }) => {
  const { cart } = useAppStore();
  const totals = calculateCartTotals(cart?.items || []);
  const controls = useAnimation();

  // Pulse effect when item count changes
  React.useEffect(() => {
    if (totals.itemCount > 0) {
      controls.start({
        scale: [1, 1.15, 0.95, 1.05, 1],
        transition: { duration: 0.4, ease: "easeInOut" }
      });
    }
  }, [totals.itemCount, controls]);

  return (
    <motion.button
      id="cart-button"
      onClick={onOpen}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={`fixed bottom-6 left-6 md:bottom-8 md:left-8 z-40 px-5 py-4 rounded-full shadow-2xl flex items-center gap-3 cursor-pointer select-none transition-colors duration-200 border ${
        totals.itemCount > 0
          ? 'bg-coral border-coral-light text-white shadow-coral/35'
          : 'bg-white border-slate-200 text-slate-600 shadow-slate-100'
      }`}
    >
      <motion.div animate={controls} className="relative">
        <ShoppingBag className="w-5.5 h-5.5" />
        {totals.itemCount > 0 && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2.5 -right-2.5 bg-yellow-400 text-slate-900 text-[10px] font-extrabold w-5.5 h-5.5 rounded-full flex items-center justify-center border-2 border-coral shadow-sm"
          >
            {toPersianDigits(totals.itemCount)}
          </motion.span>
        )}
      </motion.div>

      <span className="text-xs md:text-sm font-bold">
        {totals.itemCount > 0 ? (
          <>
            سبد خرید: <span className="font-extrabold mr-0.5">{formatToman(totals.totalAmount)}</span> <span className="text-[10px]">تومان</span>
          </>
        ) : (
          'سبد خرید شما خالیست'
        )}
      </span>
    </motion.button>
  );
};

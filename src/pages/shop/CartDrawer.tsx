import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { calculateCartTotals } from './cartUtils';
import { toPersianDigits, formatToman } from './shopUtils';
import { CartItemRow } from './CartItemRow';
import { X, Trash2, ShoppingBag, CreditCard, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/Button';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, updateCartQuantity, removeFromCart, clearCart } = useAppStore();
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'confirming' | 'success'>('cart');
  
  const totals = calculateCartTotals(cart?.items || []);

  const handleStartCheckout = () => {
    setCheckoutStep('confirming');
  };

  const handleConfirmCheckout = () => {
    setCheckoutStep('success');
  };

  const handleFinishCheckout = () => {
    clearCart();
    setCheckoutStep('cart');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950 z-50 backdrop-blur-[2px]"
          />

          {/* Slide-out Panel (from left for clean aesthetic alignment) */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="fixed inset-y-0 left-0 w-full sm:max-w-md bg-white shadow-2xl z-50 flex flex-col justify-between"
          >
            {/* Header section */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-coral" />
                <h3 className="font-bold text-slate-800 text-lg">سبد خرید ملزومات پت</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Switcher */}
            <div className="flex-1 overflow-y-auto p-5">
              {checkoutStep === 'cart' && (
                <>
                  {cart?.items && cart.items.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {/* Clear cart option */}
                      <div className="flex justify-end mb-2">
                        <button
                          onClick={clearCart}
                          className="text-xs text-slate-400 hover:text-red-500 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          خالی کردن کل سبد
                        </button>
                      </div>

                      {/* Items Row list */}
                      <AnimatePresence initial={false}>
                        {cart.items.map((item) => (
                          <CartItemRow
                            key={`${item.productId}-${item.variantId || ''}`}
                            item={item}
                            onUpdateQuantity={updateCartQuantity}
                            onRemove={removeFromCart}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center py-16 h-full">
                      <div className="bg-slate-50 p-4 rounded-full text-slate-300 mb-4">
                        <ShoppingBag className="w-10 h-10" />
                      </div>
                      <h4 className="font-bold text-slate-700 text-base">سبد خرید شما فعلاً خالی است</h4>
                      <p className="text-xs text-slate-400 mt-2 max-w-[200px] leading-relaxed">
                        کالاهای موردنظرتان را از بخش فروشگاه انتخاب کرده و به سبد خود اضافه کنید.
                      </p>
                    </div>
                  )}
                </>
              )}

              {checkoutStep === 'confirming' && (
                <div className="flex flex-col gap-5 py-2">
                  <h4 className="font-bold text-slate-800 text-base">تایید سفارش تستی (آزمایشی)</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    این یک پرداخت واقعی یا تجاری نیست. مایلید این سفارش آزمایشی را ثبت و پردازش را تست کنید؟
                  </p>

                  {/* Pricing recap */}
                  <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2.5">
                    <span className="text-xs font-semibold text-slate-400 block pb-1 border-b border-slate-100">فاکتور آزمایشی سفارش</span>
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>تعداد کل اقلام:</span>
                      <span className="font-bold">{toPersianDigits(totals.itemCount)} عدد</span>
                    </div>
                    {totals.savings > 0 && (
                      <div className="flex items-center justify-between text-xs text-pink-600">
                        <span>سود شما از خرید:</span>
                        <span className="font-bold">{formatToman(totals.savings)} تومان</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm font-extrabold text-slate-800 border-t border-slate-100 pt-2.5">
                      <span>مبلغ قابل پرداخت تستی:</span>
                      <span>{formatToman(totals.totalAmount)} تومان</span>
                    </div>
                  </div>

                  {/* Safety Alert block */}
                  <div className="bg-amber-50 border border-amber-200/50 rounded-2xl p-3.5 flex items-start gap-2.5 text-amber-800 text-xs">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block mb-1">هشدار ایمنی پت‌میت</strong>
                      <span className="leading-relaxed text-amber-700/90">
                        این پلتفرم بر سلامت حیوان خانگی شما تمرکز دارد. هیچ تراکنش واقعی و هیچ تحویل کالا یا وجهی صورت نخواهد گرفت. سفارشات به صورت موقت در مرورگر ثبت نمایشی می‌شوند.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {checkoutStep === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-6 h-full"
                >
                  <div className="bg-emerald-50 text-emerald-600 p-4 rounded-full mb-4">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg">ثبت آزمایشی با موفقیت انجام شد!</h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    کد پیگیری آزمایشی: <strong className="text-slate-600 font-bold">{toPersianDigits('PM-' + Math.floor(Math.random() * 900000 + 100000))}</strong>
                  </p>

                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 mt-6 text-emerald-950 text-xs text-right leading-relaxed">
                    <strong className="block mb-1.5 text-emerald-800 text-center font-bold">بازدیدکننده گرامی پت‌میت،</strong>
                    از آنجا که این بخش صرفاً یک بستر شبیه‌سازی شده برای ارزیابی UX فروشگاهی و سازگاری ایمنی دارو و غذای پت تحت استانداردهای دامپزشکی است، هیچ هزینه‌ای کسر نگردید و کالایی ارسال نخواهد شد.
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer action panel */}
            {cart?.items && cart.items.length > 0 && (
              <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-4">
                {checkoutStep === 'cart' && (
                  <>
                    <div className="flex flex-col gap-2.5 text-xs text-slate-500">
                      {totals.savings > 0 && (
                        <div className="flex justify-between items-center text-pink-600 font-medium">
                          <span>سود شما از خرید:</span>
                          <span>{formatToman(totals.savings)} تومان</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-sm font-extrabold text-slate-800">
                        <span>مبلغ نهایی تستی:</span>
                        <span className="text-base font-extrabold text-coral-deep">
                          {formatToman(totals.totalAmount)} <span className="text-xs font-medium text-slate-500">تومان</span>
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      onClick={handleStartCheckout}
                      className="w-full font-bold"
                    >
                      <CreditCard className="w-4 h-4 ml-1.5" />
                      تایید فاکتور و ادامه تستی
                    </Button>
                  </>
                )}

                {checkoutStep === 'confirming' && (
                  <div className="flex items-center gap-3">
                    <Button
                      variant="primary"
                      onClick={handleConfirmCheckout}
                      className="flex-1 font-bold"
                    >
                      ثبت نهایی سفارش تستی
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setCheckoutStep('cart')}
                      className="px-5 py-3.5 rounded-2xl text-xs font-bold"
                    >
                      برگشت به سبد
                    </Button>
                  </div>
                )}

                {checkoutStep === 'success' && (
                  <Button
                    variant="sunny"
                    onClick={handleFinishCheckout}
                    className="w-full font-bold"
                  >
                    بستن و تکمیل فرآیند تستی
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

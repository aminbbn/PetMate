import { CartItem } from './shopTypes';
import { DEMO_PRODUCTS } from './productFixtures';

export interface CartTotals {
  itemCount: number;
  totalAmount: number;
  originalAmount: number;
  savings: number;
}

export function calculateCartTotals(items: CartItem[]): CartTotals {
  if (!items || items.length === 0) {
    return {
      itemCount: 0,
      totalAmount: 0,
      originalAmount: 0,
      savings: 0
    };
  }

  let itemCount = 0;
  let totalAmount = 0;
  let originalAmount = 0;

  items.forEach(item => {
    itemCount += item.quantity;
    const product = DEMO_PRODUCTS.find(p => p.id === item.productId);
    if (product && product.price) {
      const price = product.price.amount;
      const originalPrice = product.price.originalAmount || price;
      
      totalAmount += price * item.quantity;
      originalAmount += originalPrice * item.quantity;
    }
  });

  return {
    itemCount,
    totalAmount,
    originalAmount,
    savings: Math.max(0, originalAmount - totalAmount)
  };
}

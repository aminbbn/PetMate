import React from 'react';
import { Product } from './shopTypes';
import { ProductCard } from './ProductCard';
import { ShopEmptyState } from './ShopEmptyState';
import { motion } from 'motion/react';

interface ProductGridProps {
  products: Product[];
  onViewDetails: (product: Product) => void;
  onResetFilters: () => void;
}

const gridContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04
    }
  }
} as const;

const cardItemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring" as const, 
      stiffness: 110, 
      damping: 18 
    } 
  }
} as const;

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onViewDetails,
  onResetFilters
}) => {
  if (products.length === 0) {
    return (
      <div className="py-12 flex justify-center w-full">
        <ShopEmptyState onReset={onResetFilters} />
      </div>
    );
  }

  return (
    <motion.div
      variants={gridContainerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {products.map((product) => (
        <motion.div 
          key={product.id} 
          variants={cardItemVariants}
          className="h-full"
        >
          <ProductCard
            product={product}
            onViewDetails={onViewDetails}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

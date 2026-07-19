import React from 'react';

interface MetricCardFooterProps {
  children: React.ReactNode;
}

export const MetricCardFooter: React.FC<MetricCardFooterProps> = ({ children }) => {
  return (
    <footer 
      data-slot="metric-card-footer"
      className="w-full mt-2.5 border-t border-gray-100/60 pt-2 text-right text-[11px] md:text-[12px] font-bold text-gray-500"
      dir="rtl"
    >
      {children}
    </footer>
  );
};

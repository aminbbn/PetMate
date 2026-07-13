import React from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { AnimatedCardIcon } from '../../components/AnimatedCardIcon';

interface GrowthEmptyStateProps {
  petName: string;
  onAddFirst: () => void;
}

export const GrowthEmptyState: React.FC<GrowthEmptyStateProps> = ({
  petName,
  onAddFirst,
}) => {
  return (
    <div className="py-12 flex justify-center items-center w-full" dir="rtl">
      <Card
        glow
        glowColor="sunny"
        className="max-w-md w-full bg-gradient-to-b from-white to-sunny/5 border-sunny/10 text-center p-10 flex flex-col items-center justify-center space-y-6"
      >
        <div className="group flex flex-col items-center">
          <AnimatedCardIcon
            variant="weight"
            tone="sunny"
            size="lg"
            className="mb-2 scale-110 shadow-md"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-black text-gray-800">هنوز وزنی ثبت نشده</h3>
          <p className="text-sm text-gray-500 font-medium leading-relaxed px-4">
            اولین وزن {petName} را ثبت کنید تا روند تغییرات نمایش داده شود.
          </p>
        </div>

        <Button
          onClick={onAddFirst}
          variant="primary"
          className="px-8 py-3.5 text-xs font-black shadow-lg shadow-coral/15 hover:shadow-coral/25"
        >
          ثبت اولین وزن
        </Button>
      </Card>
    </div>
  );
};

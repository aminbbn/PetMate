import React from 'react';
import { Button } from '../Button';
import { cn } from '../../lib/utils';

interface DialogActionFooterProps {
  primaryLabel: string;
  primaryType?: 'button' | 'submit';
  onPrimaryClick?: () => void;
  primaryDisabled?: boolean;
  primaryPending?: boolean;

  secondaryLabel?: string;
  onSecondaryClick?: () => void;

  align?: 'start' | 'end';
  className?: string;
}

export default function DialogActionFooter({
  primaryLabel,
  primaryType = 'submit',
  onPrimaryClick,
  primaryDisabled = false,
  primaryPending = false,
  secondaryLabel,
  onSecondaryClick,
  align = 'start',
  className,
}: DialogActionFooterProps) {
  return (
    <footer 
      className={cn(
        "shrink-0 border-t border-gray-100 bg-white/95 px-5 py-4 backdrop-blur-md sm:px-6",
        className
      )}
      dir="rtl"
    >
      <div 
        className={cn(
          "flex items-center gap-3 flex-row",
          align === 'start' ? "justify-start" : "justify-end",
          "max-[350px]:flex-col max-[350px]:items-stretch"
        )}
      >
        {/* Primary Action - submit */}
        <Button
          type={primaryType}
          variant="primary"
          size="sm"
          onClick={onPrimaryClick}
          disabled={primaryDisabled || primaryPending}
          className={cn(
            "h-11 min-w-[148px] max-w-[210px] w-auto rounded-[14px] px-5 text-sm font-black cursor-pointer transition-all",
            "max-[350px]:w-full max-[350px]:min-w-0 max-[350px]:max-w-none",
            primaryPending && "opacity-80 cursor-wait"
          )}
          id="dialog-primary-action"
        >
          {primaryPending ? 'در حال پردازش...' : primaryLabel}
        </Button>

        {/* Secondary Action - cancel */}
        {secondaryLabel && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onSecondaryClick}
            className={cn(
              "h-11 min-w-[96px] max-w-[150px] w-auto rounded-[14px] px-5 text-sm font-bold cursor-pointer transition-all",
              "max-[350px]:w-full max-[350px]:min-w-0 max-[350px]:max-w-none"
            )}
            id="dialog-secondary-action"
          >
            {secondaryLabel}
          </Button>
        )}
      </div>
    </footer>
  );
}

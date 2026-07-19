import React from 'react';
import { Card } from '../Card';
import { CardCornerIcon } from '../card/CardCornerIcon';
import { cn } from '../../lib/utils';
import { MetricCardProps } from './metricCardTypes';

const isNumericValue = (val: React.ReactNode): boolean => {
  if (typeof val === 'number') return true;
  if (typeof val === 'string') {
    const clean = val.replace(/[0-9۰-۹.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
    return clean.length === 0 || val.length <= 5;
  }
  return false;
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  supportingText,
  footer,
  icon,
  iconVariant,
  iconTone = 'neutral',
  density = 'standard',
  state = 'default',
  interactive = false,
  visualHover = true,
  selected = false,
  onClick,
  ariaLabel,
  className,
}) => {
  const isCompact = density === 'compact';
  const isNum = isNumericValue(value);

  // Setup precise value typographic scale
  const valueSizeClass = isCompact
    ? (isNum ? "text-[27px] md:text-[28px]" : "text-[16px] md:text-[18px]")
    : (isNum 
        ? "text-[31px] md:text-[34px]" 
        : (typeof value === 'string' && value.length > 15 
            ? "text-[17px] md:text-[18px] line-clamp-2" 
            : "text-[19px] md:text-[22px]"
          )
      );

  // Shell classes based on density
  const shellClasses = cn(
    isCompact
      ? "md:min-h-[112px] min-h-[108px] p-4 rounded-[20px]"
      : "md:min-h-[148px] sm:min-h-[142px] min-h-[142px] md:p-5 p-[18px] rounded-[24px]",
    state === 'attention' && "border-coral/50 bg-coral/[0.01]",
    state === 'success' && "border-green-300 bg-green-50/[0.01]",
    className
  );

  return (
    <Card
      as={interactive ? 'button' : 'div'}
      type={interactive ? 'button' : undefined}
      onClick={interactive ? onClick : undefined}
      selected={selected || state === 'selected'}
      hoverEffect={visualHover}
      hoverLift={visualHover}
      cursorGlow={visualHover}
      edgeGlow={visualHover}
      contentParallax={false}
      className={shellClasses}
      contentClassName="h-full"
      aria-label={ariaLabel || title}
      aria-pressed={interactive && selected ? true : undefined}
    >
      <article className="relative grid h-full grid-rows-[auto_1fr_auto] text-right" dir="rtl">
        {/* Dynamic Card Corner Icon with correct density sizes */}
        <CardCornerIcon
          icon={icon}
          animationVariant={iconVariant}
          tone={iconTone}
          density={density}
          className="absolute top-0 right-0"
        />

        {/* Header containing title */}
        <header className={cn(
          "min-w-0 flex items-start pr-[56px]",
          isCompact ? "min-h-[34px]" : "min-h-[40px]"
        )}>
          <p className={cn(
            "font-extrabold text-gray-700 tracking-tight text-right line-clamp-2",
            isCompact ? "text-[13px] leading-[18px]" : "text-[13px] md:text-[14px] leading-[20px]"
          )}>
            {title}
          </p>
        </header>

        {/* Value area aligned dynamically */}
        <div className="min-w-0 self-center pt-2 pb-1">
          <div className="flex min-w-0 items-baseline gap-1.5 leading-none justify-start">
            <div className={cn(
              "font-extrabold text-gray-900 tracking-tight text-right",
              valueSizeClass,
              state === 'empty' && "text-gray-400 font-bold"
            )}>
              {value}
            </div>
            {unit && !isCompact && (
              <span className="text-[12px] md:text-[13px] font-semibold text-gray-400 shrink-0 select-none">
                {unit}
              </span>
            )}
          </div>

          {supportingText && (
            <div className="text-[11px] md:text-[12px] font-medium text-gray-400 leading-[18px] mt-1 line-clamp-2 text-right">
              {supportingText}
            </div>
          )}
        </div>

        {/* Footer section */}
        {footer && !isCompact && (
          <footer className="mt-3.5 border-t border-pm-stroke-subtle/60 pt-2.5 min-h-[24px] text-[11px] font-semibold text-gray-500 leading-normal text-right">
            {footer}
          </footer>
        )}
      </article>
    </Card>
  );
};

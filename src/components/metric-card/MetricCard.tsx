import React from 'react';
import { Card } from '../Card';
import { MetricCardProps } from './metricCard.types';
import { METRIC_CARD_STYLES } from './metricCard.styles';
import { MetricCardHeader } from './MetricCardHeader';
import { MetricCardValue } from './MetricCardValue';
import { MetricCardFooter } from './MetricCardFooter';
import { cn } from '../../lib/utils';

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  valueKind,
  unit,
  supportingText,
  footer,
  icon,
  iconVariant,
  iconTone = 'neutral',
  density = 'standard',
  state = 'default',
  interactive = false,
  selected = false,
  onClick,
  ariaLabel,
  className,
}) => {
  const geom = METRIC_CARD_STYLES.geometry[density];
  const stateClass = METRIC_CARD_STYLES.state[state];

  return (
    <Card
      as={interactive ? 'button' : 'div'}
      type={interactive ? 'button' : undefined}
      onClick={interactive ? onClick : undefined}
      selected={selected || state === 'selected'}
      hoverEffect={true}
      cursorGlow={true}
      edgeGlow={true}
      hoverLift={true}
      contentParallax={false}
      aria-label={ariaLabel || title}
      aria-pressed={interactive && selected ? true : undefined}
      className={cn(
        geom.minHeight,
        geom.padding,
        geom.radius,
        stateClass,
        className
      )}
      contentClassName="h-full"
    >
      <article
        data-slot="metric-card"
        className="grid h-full grid-rows-[auto_minmax(0,1fr)_auto] text-right"
        dir="rtl"
      >
        <MetricCardHeader
          title={title}
          icon={icon}
          iconVariant={iconVariant}
          iconTone={iconTone}
          density={density}
        />

        <section
          data-slot="metric-card-body"
          className="flex min-w-0 flex-col justify-center pt-3"
        >
          <MetricCardValue
            value={value}
            valueKind={valueKind}
            unit={unit}
            density={density}
          />

          {supportingText && (
            <div 
              data-slot="metric-card-support"
              className={METRIC_CARD_STYLES.supportingText}
            >
              {supportingText}
            </div>
          )}
        </section>

        {footer && (
          <MetricCardFooter>
            {footer}
          </MetricCardFooter>
        )}
      </article>
    </Card>
  );
};

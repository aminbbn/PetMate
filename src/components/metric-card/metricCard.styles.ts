export const METRIC_CARD_STYLES = {
  // Density-specific layout classes
  geometry: {
    standard: {
      minHeight: 'min-h-[168px]',
      padding: 'p-5', // 20px
      radius: 'rounded-[24px]',
      headerHeight: 'min-h-[44px]',
      iconWrapper: 'w-10 h-10 rounded-2xl',
      gap: 'gap-3',
    },
    compact: {
      minHeight: 'min-h-[126px]',
      padding: 'p-4', // 16px
      radius: 'rounded-[22px]',
      headerHeight: 'min-h-[38px]',
      iconWrapper: 'w-9 h-9 rounded-xl',
      gap: 'gap-2.5',
    },
  },

  // State colors (attention, success, etc.)
  state: {
    default: '',
    selected: 'border-coral bg-coral/[0.03]',
    attention: 'border-coral/50 bg-coral/[0.01]',
    success: 'border-green-300 bg-green-50/[0.01]',
  },

  // Title typography
  title: {
    standard: 'text-[15px] md:text-[16px] font-extrabold text-gray-800 tracking-tight leading-[22px]',
    compact: 'text-[15px] font-extrabold text-gray-800 tracking-tight leading-[20px]',
  },

  // Value typography based on valueKind
  value: {
    number: {
      standard: 'text-[30px] md:text-[34px] font-extrabold leading-none text-gray-900',
      compact: 'text-[26px] md:text-[30px] font-extrabold leading-none text-gray-900',
    },
    text: {
      standard: 'text-[15px] font-extrabold leading-[21px] text-gray-900',
      compact: 'text-[14px] md:text-[15px] font-extrabold leading-[19px] text-gray-900',
    },
    status: {
      standard: 'text-[14px] font-bold leading-[20px] text-gray-700',
      compact: 'text-[13px] md:text-[14px] font-bold leading-[18px] text-gray-700',
    },
    empty: {
      standard: 'text-[14px] font-bold leading-[20px] text-gray-400',
      compact: 'text-[13px] md:text-[14px] font-bold leading-[18px] text-gray-400',
    },
  },

  unit: 'text-[12px] md:text-[13px] font-semibold text-gray-500 mr-1 select-none',
  supportingText: 'text-[11px] md:text-[12px] text-gray-500 font-bold mt-1.5 leading-snug',
} as const;

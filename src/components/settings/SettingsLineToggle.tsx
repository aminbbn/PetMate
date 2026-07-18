import React from 'react';
import { motion } from 'motion/react';

export type SettingsLineToggleProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  disabledReason?: string;
  pending?: boolean;
};

export function SettingsLineToggle({
  checked,
  onCheckedChange,
  label,
  disabled = false,
  disabledReason,
  pending = false,
}: SettingsLineToggleProps) {
  return (
    <div className="flex flex-col items-end gap-1" dir="rtl">
      <motion.button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        aria-disabled={disabled || pending}
        disabled={disabled || pending}
        onClick={() => onCheckedChange(!checked)}
        whileTap={disabled || pending ? undefined : { scale: 0.97 }}
        className="
          relative inline-flex h-11 w-[76px] shrink-0
          items-center justify-center rounded-xl
          outline-none
          focus-visible:ring-2 focus-visible:ring-coral/45
          focus-visible:ring-offset-2
          disabled:cursor-not-allowed
        "
      >
        <motion.span
          aria-hidden="true"
          className="block h-[5px] w-16 rounded-full"
          animate={{
            backgroundColor: checked
              ? '#FF4B4E' // Pet Mate Coral
              : '#D8DDE5', // Light neutral warm gray
            opacity: disabled ? 0.45 : 1,
          }}
          transition={{
            duration: 0.16,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </motion.button>

      {disabled && disabledReason && (
        <p className="text-[10px] text-gray-400 font-bold mt-0.5 text-left" dir="rtl">
          {disabledReason}
        </p>
      )}
    </div>
  );
}

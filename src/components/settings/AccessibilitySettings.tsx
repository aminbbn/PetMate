import React from 'react';
import { useAppStore, DEFAULT_PREFERENCES, TextScale } from '../../store';
import { SettingsRow } from './SettingsRow';
import { SettingsLineToggle } from './SettingsLineToggle';
import { Accessibility, Eye } from 'lucide-react';

export const AccessibilitySettings: React.FC = () => {
  const preferences = useAppStore(state => state.preferences || DEFAULT_PREFERENCES);
  const updatePreferences = useAppStore(state => state.updatePreferences);

  const setTextScale = (textScale: TextScale) => {
    updatePreferences({
      accessibility: {
        ...preferences.accessibility,
        textScale,
      },
    });
  };

  const toggleStrongFocus = () => {
    updatePreferences({
      accessibility: {
        ...preferences.accessibility,
        strongFocusIndicators: !preferences.accessibility?.strongFocusIndicators,
      },
    });
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-xl border border-gray-100 text-gray-400 shrink-0 mt-0.5">
            <Accessibility size={16} />
          </div>
          <div className="space-y-0.5 flex-1 text-right">
            <h4 className="text-sm font-black text-gray-800">اندازه قلم برنامه (Text Scale)</h4>
            <p className="text-xs text-gray-400 font-bold leading-relaxed">بزرگنمایی و اندازه خوانایی متون برنامه را هماهنگ با نیاز چشم خود تنظیم کنید.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {(['normal', 'large'] as const).map((scale) => (
            <button
              key={scale}
              type="button"
              onClick={() => setTextScale(scale)}
              className={`border-2 p-3.5 rounded-xl text-center font-bold text-xs cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-coral/40 outline-none ${
                preferences.accessibility?.textScale === scale
                  ? 'border-coral bg-coral/5 text-coral-deep font-black'
                  : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
              }`}
            >
              {scale === 'normal' && '🔎 معمولی (۱۰۰٪)'}
              {scale === 'large' && '🔎 بزرگ (۱۱۲٪)'}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-5">
        <SettingsRow
          title="نشانگر فوکوس پررنگ (Strong Focus Indicators)"
          description="برجسته‌سازی حاشیه‌ها با رنگ مرجانی پررنگ برای المان‌های فعال جهت هدایت بهتر کیبورد."
          icon={Eye}
        >
          <SettingsLineToggle
            checked={!!preferences.accessibility?.strongFocusIndicators}
            onCheckedChange={toggleStrongFocus}
            label="نشانگر فوکوس پررنگ"
          />
        </SettingsRow>
      </div>
    </div>
  );
};

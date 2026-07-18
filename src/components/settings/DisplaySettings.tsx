import React from 'react';
import { useAppStore, DEFAULT_PREFERENCES, DigitStyle, DateDisplayMode } from '../../store';
import { SettingsRow } from './SettingsRow';
import { SettingsLineToggle } from './SettingsLineToggle';
import { Languages, Calendar, Globe, Clock } from 'lucide-react';

const TIMEZONES = [
  { value: 'Asia/Tehran', label: 'تهران (GMT +3:30)' },
  { value: 'UTC', label: 'هماهنگ جهانی (UTC)' },
  { value: 'Europe/London', label: 'لندن (GMT +0:00)' },
  { value: 'Asia/Dubai', label: 'دبی (GMT +4:00)' },
  { value: 'Europe/Berlin', label: 'برلین (GMT +1:00)' },
  { value: 'America/New_York', label: 'نیویورک (EST/EDT)' },
];

export const DisplaySettings: React.FC = () => {
  const preferences = useAppStore(state => state.preferences || DEFAULT_PREFERENCES);
  const updatePreferences = useAppStore(state => state.updatePreferences);

  const toggleDigitStyle = () => {
    const nextStyle: DigitStyle = preferences.display?.digitStyle === 'persian' ? 'latin' : 'persian';
    updatePreferences({
      display: {
        ...preferences.display,
        digitStyle: nextStyle,
      },
    });
  };

  const toggleDateDisplayMode = () => {
    const nextMode: DateDisplayMode = preferences.display?.dateDisplayMode === 'jalali' ? 'gregorian' : 'jalali';
    updatePreferences({
      display: {
        ...preferences.display,
        dateDisplayMode: nextMode,
      },
    });
  };

  const handleTimeZoneModeChange = (mode: 'auto' | 'manual') => {
    updatePreferences({
      display: {
        ...preferences.display,
        timeZoneMode: mode,
      },
    });
  };

  const handleManualTimeZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updatePreferences({
      display: {
        ...preferences.display,
        manualTimeZone: e.target.value,
      },
    });
  };

  return (
    <div className="space-y-6" dir="rtl">
      <SettingsRow
        title="نمایش اعداد با نویسه فارسی (Persian Digits)"
        description="تبدیل اعداد انگلیسی به ارقام زیبای فارسی در سراسر صفحات برنامه."
        icon={Languages}
      >
        <SettingsLineToggle
          checked={preferences.display?.digitStyle === 'persian'}
          onCheckedChange={toggleDigitStyle}
          label="نمایش اعداد با نویسه فارسی"
        />
      </SettingsRow>

      <SettingsRow
        title="تقویم هجری شمسی (Jalali Calendar)"
        description="نمایش زمان‌ها، تاریخ تولد پت و یادآورها بر اساس گاه‌شماری خورشیدی جلالی."
        icon={Calendar}
      >
        <SettingsLineToggle
          checked={preferences.display?.dateDisplayMode === 'jalali'}
          onCheckedChange={toggleDateDisplayMode}
          label="تقویم هجری شمسی"
        />
      </SettingsRow>

      <div className="border-t border-gray-100 pt-5 space-y-4">
        <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white rounded-xl border border-gray-100 text-gray-400 shrink-0 mt-0.5">
              <Globe size={16} />
            </div>
            <div className="space-y-0.5 flex-1 text-right">
              <h4 className="text-sm font-black text-gray-800">موقعیت زمانی (Timezone Mode)</h4>
              <p className="text-xs text-gray-400 font-bold leading-relaxed">تنظیم منطقه زمانی برای ثبت قرارها، داروها و یادآورها.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleTimeZoneModeChange('auto')}
              className={`border-2 p-3 rounded-xl text-center font-bold text-xs cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-coral/40 outline-none ${
                preferences.display?.timeZoneMode === 'auto'
                  ? 'border-coral bg-coral/5 text-coral-deep font-black'
                  : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
              }`}
            >
              🌐 موقعیت خودکار مرورگر
            </button>
            <button
              type="button"
              onClick={() => handleTimeZoneModeChange('manual')}
              className={`border-2 p-3 rounded-xl text-center font-bold text-xs cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-coral/40 outline-none ${
                preferences.display?.timeZoneMode === 'manual'
                  ? 'border-coral bg-coral/5 text-coral-deep font-black'
                  : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
              }`}
            >
              ⚙️ موقعیت دستی مشخص
            </button>
          </div>

          {preferences.display?.timeZoneMode === 'manual' && (
            <div className="space-y-2 pt-1 animate-in fade-in slide-in-from-top-2 duration-300 text-right">
              <label className="block text-[10px] font-black text-gray-500 mb-1 flex items-center gap-1.5 justify-start">
                <Clock size={12} className="text-coral" />
                <span>انتخاب منطقه زمانی دستی</span>
              </label>
              <select
                value={preferences.display?.manualTimeZone || 'Asia/Tehran'}
                onChange={handleManualTimeZoneChange}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-coral/40 text-xs font-bold text-gray-700 text-right"
              >
                {TIMEZONES.map(tz => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

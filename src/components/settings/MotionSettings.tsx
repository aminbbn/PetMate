import React from 'react';
import { useAppStore, DEFAULT_PREFERENCES, MotionMode } from '../../store';
import { SettingsRow } from './SettingsRow';
import { SettingsLineToggle } from './SettingsLineToggle';
import { Sparkles, Compass, Eye, RefreshCw, Zap } from 'lucide-react';

export const MotionSettings: React.FC = () => {
  const preferences = useAppStore(state => state.preferences || DEFAULT_PREFERENCES);
  const updatePreferences = useAppStore(state => state.updatePreferences);

  const setMotionMode = (mode: MotionMode) => {
    updatePreferences({
      motion: {
        ...preferences.motion,
        mode,
      },
    });
  };

  const toggleSetting = (key: 'cursorGlowEnabled' | 'edgeGlowEnabled' | 'semanticIconAnimationsEnabled' | 'routeTransitionsEnabled') => {
    updatePreferences({
      motion: {
        ...preferences.motion,
        [key]: !preferences.motion[key],
      },
    });
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-xl border border-gray-100 text-gray-400 shrink-0 mt-0.5">
            <Zap size={16} />
          </div>
          <div className="space-y-0.5 flex-1 text-right">
            <h4 className="text-sm font-black text-gray-800">میزان حرکات و انیمیشن‌های کلی (Motion Mode)</h4>
            <p className="text-xs text-gray-400 font-bold leading-relaxed">شدت جلوه‌های پویا را با سطح توانایی دستگاه خود یا ترجیح شخصی تطبیق دهید.</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {(['system', 'full', 'reduced'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setMotionMode(mode)}
              className={`border-2 p-3 rounded-xl text-center font-bold text-xs cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-coral/40 outline-none ${
                preferences.motion?.mode === mode
                  ? 'border-coral bg-coral/5 text-coral-deep font-black'
                  : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
              }`}
            >
              {mode === 'system' && '🖥️ همگام سیستم'}
              {mode === 'full' && '✨ پویانمایی کامل'}
              {mode === 'reduced' && '⏸️ انیمیشن کم'}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-5 space-y-4 text-right">
        <h4 className="text-xs font-black text-gray-700">جلوه‌های بصری کارت‌ها و ویجت‌ها</h4>
        
        <SettingsRow
          title="تعقیب نور با اشاره‌گر موس (Cursor Glow)"
          description="تابش نوری کارت‌ها به دنبال حرکت موس در حالت دسکتاپ."
          icon={Sparkles}
        >
          <SettingsLineToggle
            checked={!!preferences.motion?.cursorGlowEnabled}
            onCheckedChange={() => toggleSetting('cursorGlowEnabled')}
            label="تعقیب نور با اشاره‌گر موس"
          />
        </SettingsRow>

        <SettingsRow
          title="تابش مرزها و گوشه‌ها (Edge Glow)"
          description="جلوه درخشان لبه‌های کارت‌ها جهت تفکیک و افزایش شادابی بصری."
          icon={Compass}
        >
          <SettingsLineToggle
            checked={!!preferences.motion?.edgeGlowEnabled}
            onCheckedChange={() => toggleSetting('edgeGlowEnabled')}
            label="تابش مرزها و گوشه‌ها"
          />
        </SettingsRow>

        <SettingsRow
          title="پویانمایی آیکون‌ها (Semantic Icon Animations)"
          description="چرخش و لرزش نمادهای رفتاری و بهداشتی در هنگام توقف موس روی آن‌ها."
          icon={Eye}
        >
          <SettingsLineToggle
            checked={!!preferences.motion?.semanticIconAnimationsEnabled}
            onCheckedChange={() => toggleSetting('semanticIconAnimationsEnabled')}
            label="پویانمایی آیکون‌ها"
          />
        </SettingsRow>

        <SettingsRow
          title="حرکت نرم بین صفحات (Route Transitions)"
          description="تغییر آرام و انیمیشنی صفحات در هنگام جابجایی بین منوها."
          icon={RefreshCw}
        >
          <SettingsLineToggle
            checked={!!preferences.motion?.routeTransitionsEnabled}
            onCheckedChange={() => toggleSetting('routeTransitionsEnabled')}
            label="حرکت نرم بین صفحات"
          />
        </SettingsRow>
      </div>
    </div>
  );
};

import React from 'react';
import { useAppStore, DEFAULT_PREFERENCES, AIContextMode } from '../../store';
import { SettingsRow } from './SettingsRow';
import { SettingsLineToggle } from './SettingsLineToggle';
import { BrainCircuit, MessageSquare, Image } from 'lucide-react';

export const AiPrivacySettings: React.FC = () => {
  const preferences = useAppStore(state => state.preferences || DEFAULT_PREFERENCES);
  const updatePreferences = useAppStore(state => state.updatePreferences);

  const setContextMode = (mode: AIContextMode) => {
    updatePreferences({
      aiPrivacy: {
        ...preferences.aiPrivacy,
        contextMode: mode,
      },
    });
  };

  const toggleSetting = (key: 'persistConversations' | 'allowMediaAnalysis') => {
    updatePreferences({
      aiPrivacy: {
        ...preferences.aiPrivacy,
        [key]: !preferences.aiPrivacy[key],
      },
    });
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-xl border border-gray-100 text-gray-400 shrink-0 mt-0.5">
            <BrainCircuit size={16} />
          </div>
          <div className="space-y-0.5 flex-1 text-right">
            <h4 className="text-sm font-black text-gray-800">حالت زمینه و داده‌های هوش مصنوعی (Context Mode)</h4>
            <p className="text-xs text-gray-400 font-bold leading-relaxed">میزان دسترسی هوش مصنوعی به مشخصات پرونده و تاریخچه حیوان جهت شخصی‌سازی پاسخ‌ها.</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(['ask_each_time', 'minimal', 'off'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setContextMode(mode)}
              className={`border-2 p-2.5 rounded-xl text-center font-bold text-xs cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-coral/40 outline-none ${
                preferences.aiPrivacy?.contextMode === mode
                  ? 'border-coral bg-coral/5 text-coral-deep font-black'
                  : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
              }`}
            >
              {mode === 'ask_each_time' && '❓ سوال هر بار'}
              {mode === 'minimal' && '🛡️ حداقل زمینه'}
              {mode === 'off' && '❌ عدم ارسال'}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-5 space-y-4 text-right">
        <h4 className="text-xs font-black text-gray-700">حریم خصوصی مکالمه‌ها و پردازش فایل</h4>

        <SettingsRow
          title="ذخیره‌سازی مکالمات مترجم و مربی (Persist Chats)"
          description="آرشیو کردن تاریخچه گفت‌وگوها با هوش مصنوعی در حافظه داخلی برنامه جهت مراجعه بعدی."
          icon={MessageSquare}
        >
          <SettingsLineToggle
            checked={!!preferences.aiPrivacy?.persistConversations}
            onCheckedChange={() => toggleSetting('persistConversations')}
            label="ذخیره‌سازی مکالمات مترجم و مربی"
          />
        </SettingsRow>

        <SettingsRow
          title="اجازه تحلیل مدیا و تصاویر (Media Analysis)"
          description="ارسال تصاویر نسخه پزشک، علائم بیماری یا عکس غذا به مدل هوش مصنوعی جهت استخراج خودکار داده."
          icon={Image}
        >
          <SettingsLineToggle
            checked={!!preferences.aiPrivacy?.allowMediaAnalysis}
            onCheckedChange={() => toggleSetting('allowMediaAnalysis')}
            label="اجازه تحلیل مدیا و تصاویر"
          />
        </SettingsRow>
      </div>
    </div>
  );
};

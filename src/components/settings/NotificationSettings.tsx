import React, { useState, useEffect } from 'react';
import { useAppStore, DEFAULT_PREFERENCES } from '../../store';
import { SettingsRow } from './SettingsRow';
import { SettingsLineToggle } from './SettingsLineToggle';
import { Bell, Eye, Clock, ShieldAlert, Sparkles } from 'lucide-react';
import { useNotificationPreferences } from '../../preferences/usePreferences';

export const NotificationSettings: React.FC = () => {
  const preferences = useAppStore(state => state.preferences || DEFAULT_PREFERENCES);
  const updatePreferences = useAppStore(state => state.updatePreferences);
  const { requestBrowserPermission } = useNotificationPreferences();

  const [notificationStatus, setNotificationStatus] = useState<string>('');
  const [isSupported, setIsSupported] = useState(true);
  const [isSecure, setIsSecure] = useState(true);
  const [permission, setPermission] = useState<NotificationPermission | 'default'>('default');

  useEffect(() => {
    const supported = 'Notification' in window;
    const secure = window.isSecureContext;
    setIsSupported(supported);
    setIsSecure(secure);

    if (!supported) {
      setNotificationStatus('مرورگر شما از نوتیفیکیشن پشتیبانی نمی‌کند.');
    } else if (!secure) {
      setNotificationStatus('نوتیفیکیشن فقط در محیط‌های امن (HTTPS) در دسترس است.');
    } else {
      const perm = Notification.permission;
      setPermission(perm);
      if (perm === 'granted') {
        setNotificationStatus('مجوز نوتیفیکیشن داده شده است.');
      } else if (perm === 'denied') {
        setNotificationStatus('مجوز نوتیفیکیشن مسدود شده است. برای فعال‌سازی باید آن را از تنظیمات مرورگر خود آزاد کنید.');
      } else {
        setNotificationStatus('در انتظار اجازه برای ارسال نوتیفیکیشن...');
      }
    }
  }, [preferences.notifications?.browserEnabled]);

  const toggleSetting = (key: 'inAppEnabled' | 'quietHoursEnabled') => {
    updatePreferences({
      notifications: {
        ...preferences.notifications,
        [key]: !preferences.notifications[key],
      },
    });
  };

  const handleBrowserToggle = async (checked: boolean) => {
    if (checked) {
      if (!isSupported) return;
      const res = await requestBrowserPermission();
      setPermission(res);
    } else {
      updatePreferences({
        notifications: {
          ...preferences.notifications,
          browserEnabled: false,
        },
      });
    }
  };

  const handleOffsetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updatePreferences({
      notifications: {
        ...preferences.notifications,
        defaultReminderOffsetMinutes: Number(e.target.value),
      },
    });
  };

  const handleQuietHoursChange = (key: 'quietHoursStart' | 'quietHoursEnd', val: string) => {
    updatePreferences({
      notifications: {
        ...preferences.notifications,
        [key]: val,
      },
    });
  };

  const handleTestNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('پت میت 🐾', {
          body: 'این یک اعلان آزمایشی از برنامه پت میت است!',
          icon: '/favicon.ico'
        });
      } catch (e) {
        // Fallback for browsers that don't support non-service worker notifications
        console.error(e);
      }
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <SettingsRow
        title="اعلان‌های درون‌برنامه‌ای فعال"
        description="در هنگام کار با برنامه، یادآورها به صورت بنر درون‌برنامه‌ای نمایش داده شوند."
        icon={Bell}
      >
        <SettingsLineToggle
          checked={!!preferences.notifications?.inAppEnabled}
          onCheckedChange={() => toggleSetting('inAppEnabled')}
          label="اعلان‌های درون‌برنامه‌ای فعال"
        />
      </SettingsRow>

      <div className="space-y-2">
        <SettingsRow
          title="نوتیفیکیشن‌های مرورگر"
          description="ارسال نوتیفیکیشن مرورگر در سیستم‌عامل و پس‌زمینه (نیازمند مجوز)."
          icon={ShieldAlert}
        >
          <SettingsLineToggle
            checked={!!preferences.notifications?.browserEnabled && permission === 'granted'}
            onCheckedChange={handleBrowserToggle}
            label="نوتیفیکیشن‌های مرورگر"
            disabled={!isSupported || !isSecure}
            disabledReason={!isSupported ? 'مرورگر شما پشتیبانی نمی‌کند' : !isSecure ? 'نیازمند محیط HTTPS' : undefined}
          />
        </SettingsRow>
        
        <div className="px-4 py-2 bg-gray-50/50 rounded-xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500 font-bold">
            {notificationStatus} <span className="text-coral">اعلان‌های زمان‌بندی‌شده پس‌زمینه هنوز متصل نیستند.</span>
          </p>
          <button
            type="button"
            disabled={permission !== 'granted'}
            onClick={handleTestNotification}
            className="px-4 py-2 text-xs font-black bg-coral/10 text-coral hover:bg-coral/20 disabled:opacity-40 disabled:pointer-events-none rounded-xl transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={14} />
            آزمایش اعلان
          </button>
        </div>
      </div>

      <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-xl border border-gray-100 text-gray-400 shrink-0 mt-0.5">
            <Clock size={16} />
          </div>
          <div className="space-y-1 flex-1 text-right">
            <h4 className="text-sm font-black text-gray-800">زمان هشدار پیش از فرارسیدن موعد یادآور</h4>
            <p className="text-xs text-gray-400 font-bold leading-relaxed">زمان فرستادن هشدار قبل از زمان مقرر.</p>
          </div>
        </div>
        <select
          value={preferences.notifications?.defaultReminderOffsetMinutes ?? 15}
          onChange={handleOffsetChange}
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-coral/40 text-xs font-bold text-gray-700 text-right"
        >
          <option value="0">دقیقاً در زمان موعد</option>
          <option value="5">۵ دقیقه قبل</option>
          <option value="15">۱۵ دقیقه قبل</option>
          <option value="30">۳۰ دقیقه قبل</option>
          <option value="60">۱ ساعت قبل</option>
        </select>
      </div>

      <div className="border-t border-gray-100 pt-5 space-y-4">
        <SettingsRow
          title="حالت خواب و ساعات بی‌صدا (Quiet Hours)"
          description="در ساعات خواب شبانه پت و سرپرست، هیچ اعلانی صادر نشود."
          icon={Eye}
        >
          <SettingsLineToggle
            checked={!!preferences.notifications?.quietHoursEnabled}
            onCheckedChange={() => toggleSetting('quietHoursEnabled')}
            label="حالت خواب و ساعات بی‌صدا"
          />
        </SettingsRow>

        {preferences.notifications?.quietHoursEnabled && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-coral/5 rounded-2xl border border-coral/10 animate-in fade-in slide-in-from-top-2 duration-300">
            <div>
              <label className="block text-[10px] font-black text-gray-500 mb-1.5 text-right">زمان شروع بی‌صدا</label>
              <input
                type="time"
                value={preferences.notifications?.quietHoursStart || '22:00'}
                onChange={e => handleQuietHoursChange('quietHoursStart', e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-coral focus:ring-2 focus:ring-coral/20 rounded-xl px-3 py-2 text-xs font-black text-gray-700 text-center outline-none"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-500 mb-1.5 text-right">زمان پایان بی‌صدا</label>
              <input
                type="time"
                value={preferences.notifications?.quietHoursEnd || '08:00'}
                onChange={e => handleQuietHoursChange('quietHoursEnd', e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-coral focus:ring-2 focus:ring-coral/20 rounded-xl px-3 py-2 text-xs font-black text-gray-700 text-center outline-none"
                dir="ltr"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

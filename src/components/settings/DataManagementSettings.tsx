import React, { useState, useRef } from 'react';
import { useAppStore, DEFAULT_PREFERENCES } from '../../store';
import { Button } from '../Button';
import { Download, Upload, Trash2, AlertTriangle } from 'lucide-react';
import { MotionDialog } from '../../motion/MotionDialog';

interface FeaturePurgeOption {
  key: 'reminders' | 'health' | 'nutrition' | 'behavior' | 'training';
  label: string;
  description: string;
}

const PURGE_OPTIONS: FeaturePurgeOption[] = [
  { key: 'reminders', label: 'یادآورها و داروها', description: 'حذف تمامی وظایف، برنامه‌های زمانی واکسن و هشدارهای ثبت شده.' },
  { key: 'health', label: 'تاریخچه پزشکی و وزن', description: 'پاکسازی کلیه رکوردهای ویزیت دامپزشک، بیماری‌ها، آلرژی‌ها و نمودار وزن.' },
  { key: 'nutrition', label: 'تغذیه و هیدراتاسیون', description: 'حذف کل برندهای غذا، الگوهای تغذیه، گزارش‌های غذا خوردن و مصرف آب.' },
  { key: 'behavior', label: 'مترجم و مشاهدات رفتاری', description: 'پاکسازی یادداشت‌های رفتاری، ارزیابی مترجم زبان پت و تاریخچه‌های ثبت شده.' },
  { key: 'training', label: 'مربی و جلسات تمرینی', description: 'تخلیه کامل اهداف آموزشی، سوابق تلاش‌ها و وضعیت مدال‌های پت.' },
];

export const DataManagementSettings: React.FC<{ onSuccessToast: (msg: string) => void }> = ({ onSuccessToast }) => {
  const store = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Confirmation UI state
  const [purgeTarget, setPurgeTarget] = useState<'reminders' | 'health' | 'nutrition' | 'behavior' | 'training' | null>(null);
  const [showGlobalResetConfirm, setShowGlobalResetConfirm] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const handleExportData = () => {
    try {
      const state = useAppStore.getState();
      const exportObject = {
        app: "PetMate",
        exportVersion: 1,
        exportedAt: new Date().toISOString(),
        data: {
          profile: state.profile,
          reminders: state.reminders,
          healthRecords: state.healthRecords,
          weightHistory: state.weightHistory,
          weightGoals: state.weightGoals,
          vets: state.vets,
          pets: state.pets,
          selectedPetId: state.selectedPetId,
          cart: state.cart,
          favorites: state.favorites,
          foods: state.foods,
          feedingPlans: state.feedingPlans,
          mealLogs: state.mealLogs,
          hydrationLogs: state.hydrationLogs,
          foodSensitivities: state.foodSensitivities,
          nutritionSettings: state.nutritionSettings,
          behaviorObservations: state.behaviorObservations,
          behaviorAssessments: state.behaviorAssessments,
          trainingGoals: state.trainingGoals,
          trainingSessions: state.trainingSessions,
          preferences: state.preferences
        }
      };

      const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `petmate-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      onSuccessToast("پشتیبان‌گیری کامل با موفقیت انجام و فایل دانلود شد.");
    } catch (err) {
      console.error(err);
      onSuccessToast("خطا در پشتیبان‌گیری از داده‌ها.");
    }
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.app !== "PetMate") {
          setImportError("فایل پشتیبان نامعتبر است. لطفاً فایل پت میت معتبر را بارگذاری کنید.");
          return;
        }

        const data = json.data;
        if (!data) {
          setImportError("ساختار داده فایل پشتیبان خالی است.");
          return;
        }

        useAppStore.setState({
          profile: data.profile || null,
          reminders: data.reminders || [],
          healthRecords: data.healthRecords || [],
          weightHistory: data.weightHistory || [],
          weightGoals: data.weightGoals || [],
          vets: data.vets || [],
          pets: data.pets || [],
          selectedPetId: data.selectedPetId || null,
          cart: data.cart || { items: [], updatedAt: new Date().toISOString() },
          favorites: data.favorites || [],
          foods: data.foods || [],
          feedingPlans: data.feedingPlans || [],
          mealLogs: data.mealLogs || [],
          hydrationLogs: data.hydrationLogs || [],
          foodSensitivities: data.foodSensitivities || [],
          nutritionSettings: data.nutritionSettings || [],
          behaviorObservations: data.behaviorObservations || [],
          behaviorAssessments: data.behaviorAssessments || [],
          trainingGoals: data.trainingGoals || [],
          trainingSessions: data.trainingSessions || [],
          preferences: data.preferences || DEFAULT_PREFERENCES
        });

        setImportError(null);
        onSuccessToast("بازیابی داده‌های پشتیبان با موفقیت انجام شد.");
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        console.error(err);
        setImportError("خطا در خواندن فایل پشتیبان. لطفاً مطمئن شوید ساختار فایل کاملاً صحیح است.");
      }
    };
    reader.readAsText(file);
  };

  const handleFeatureResetConfirm = () => {
    if (!purgeTarget) return;

    const set = useAppStore.setState;
    const optionLabel = PURGE_OPTIONS.find(o => o.key === purgeTarget)?.label || '';

    if (purgeTarget === 'reminders') set({ reminders: [] });
    else if (purgeTarget === 'health') set({ healthRecords: [], weightHistory: [], weightGoals: [] });
    else if (purgeTarget === 'nutrition') set({ foods: [], feedingPlans: [], mealLogs: [], hydrationLogs: [] });
    else if (purgeTarget === 'behavior') set({ behaviorObservations: [], behaviorAssessments: [] });
    else if (purgeTarget === 'training') set({ trainingGoals: [], trainingSessions: [] });

    setPurgeTarget(null);
    onSuccessToast(`داده‌های بخش «${optionLabel}» با موفقیت به طور کامل تخلیه شدند.`);
  };

  const handleGlobalResetConfirm = () => {
    store.resetAllData();
    setShowGlobalResetConfirm(false);
    onSuccessToast("برنامه با موفقیت به طور کامل تنظیم مجدد شد.");
    setTimeout(() => window.location.reload(), 1200);
  };

  return (
    <div className="space-y-6">
      {/* 1. Export and Import Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h4 className="text-sm font-black text-gray-800 flex items-center gap-2">
              <Download size={16} className="text-coral" />
              <span>پشتیبان‌گیری کامل (JSON Export)</span>
            </h4>
            <p className="text-xs text-gray-400 font-bold leading-relaxed">دریافت یک نسخه فایل آفلاین از تمام سوابق، پت‌ها، اطلاعات پزشکی و تنظیمات.</p>
          </div>
          <Button onClick={handleExportData} variant="outline" className="w-full text-xs font-black">
            <span>دانلود فایل پشتیبان</span>
          </Button>
        </div>

        <div className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h4 className="text-sm font-black text-gray-800 flex items-center gap-2">
              <Upload size={16} className="text-green-500" />
              <span>بازیابی از فایل پشتیبان (JSON Import)</span>
            </h4>
            <p className="text-xs text-gray-400 font-bold leading-relaxed">بارگذاری فایل بک‌آپ و همگام‌سازی بلافاصله کلیه داده‌های ذخیره‌شده پیشین.</p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportData}
            accept=".json"
            className="hidden"
          />
          <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full text-xs font-black">
            <span>انتخاب و بازیابی فایل</span>
          </Button>
        </div>
      </div>

      {importError && (
        <div className="p-3.5 bg-red-50 text-red-600 font-bold text-xs rounded-xl border border-red-100 flex items-start gap-2">
          <AlertTriangle size={15} className="shrink-0 mt-0.5" />
          <span>{importError}</span>
        </div>
      )}

      {/* 2. Atomic Purging Options */}
      <div className="border-t border-gray-100 pt-5 space-y-4">
        <div>
          <h4 className="text-xs font-black text-gray-700">تخلیه و پاکسازی داده‌های انتخابی</h4>
          <p className="text-[10px] text-gray-400 font-bold mt-1">امکان خالی کردن پایگاه داده به صورت تفکیک‌شده برای هر بخش به صورت مجزا.</p>
        </div>

        <div className="space-y-3">
          {PURGE_OPTIONS.map((option) => (
            <div key={option.key} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-red-50/5 transition-all">
              <div className="space-y-0.5">
                <h5 className="text-xs font-black text-gray-800">{option.label}</h5>
                <p className="text-[10px] text-gray-400 font-bold leading-relaxed">{option.description}</p>
              </div>
              <button
                onClick={() => setPurgeTarget(option.key)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                title="پاکسازی داده‌های این بخش"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Global Full Reset Card */}
      <div className="border-t border-gray-100 pt-5">
        <div className="p-5 border-2 border-red-100 bg-red-50/10 rounded-[20px] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-black text-red-600 flex items-center gap-1.5">
              <AlertTriangle size={18} />
              <span>بازنشانی کامل تنظیمات و کل داده‌ها (Factory Reset)</span>
            </h4>
            <p className="text-xs text-gray-400 font-bold leading-relaxed">انجام بازنشانی کارخانه‌ای؛ پاک کردن تمام فایل‌های پرونده حیوانات، کارهای روزانه و ترجیحات بدون بازگشت.</p>
          </div>
          <button
            onClick={() => setShowGlobalResetConfirm(true)}
            className="w-full md:w-auto bg-red-500 hover:bg-red-600 active:scale-95 text-white font-black text-xs px-4.5 py-3 rounded-xl transition-all shadow-md shadow-red-500/10 cursor-pointer"
          >
            تنظیم مجدد کل برنامه
          </button>
        </div>
      </div>

      {/* Feature Purge Modal */}
      <MotionDialog
        isOpen={!!purgeTarget}
        onClose={() => setPurgeTarget(null)}
        size="sm"
      >
        {purgeTarget && (
          <div className="p-6 space-y-4 text-center">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-black text-gray-800 text-base">آیا واقعاً مطمئن هستید؟</h4>
              <p className="text-xs text-gray-400 font-bold leading-relaxed">
                کل داده‌های مربوط به بخش «{PURGE_OPTIONS.find(o => o.key === purgeTarget)?.label}» برای همیشه حذف خواهد شد. این عمل به هیچ وجه قابل بازیابی نیست.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleFeatureResetConfirm}
                className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-black cursor-pointer shadow-md shadow-red-500/10 active:scale-95 transition-all"
              >
                بله، کاملاً پاک شود
              </button>
              <button
                onClick={() => setPurgeTarget(null)}
                className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl text-xs font-black cursor-pointer active:scale-95 transition-all border border-gray-100"
              >
                خیر، لغو شود
              </button>
            </div>
          </div>
        )}
      </MotionDialog>

      {/* Global Reset Modal */}
      <MotionDialog
        isOpen={showGlobalResetConfirm}
        onClose={() => setShowGlobalResetConfirm(false)}
        size="sm"
      >
        <div className="p-6 space-y-4 text-center">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
            <AlertTriangle size={24} />
          </div>
          <div className="space-y-1.5">
            <h4 className="font-black text-red-600 text-base">🚨 هشدار بسیار حیاتی</h4>
            <p className="text-xs text-gray-500 font-bold leading-relaxed">
              تمام پرونده‌ها، سوابق بهداشتی، تنظیمات، غذاها، نمودار وزن و داروها بدون بازگشت پاک شده و برنامه به حالت خام اولیه برخواهد گشت. آیا مایل به انجام هستید؟
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleGlobalResetConfirm}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black cursor-pointer shadow-md shadow-red-600/10 active:scale-95 transition-all"
            >
              تایید بازنشانی نهایی
            </button>
            <button
              onClick={() => setShowGlobalResetConfirm(false)}
              className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl text-xs font-black cursor-pointer active:scale-95 transition-all border border-gray-100"
            >
              لغو اقدام
            </button>
          </div>
        </div>
      </MotionDialog>
    </div>
  );
};

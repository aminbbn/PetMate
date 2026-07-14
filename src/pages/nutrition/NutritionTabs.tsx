import React from 'react';
import { useAppStore } from '../../store';
import { toPersian } from '../../lib/persian';
import { selectPetMealLogs } from './nutritionSelectors';
import { Calendar, Clock, Database, History, Settings2 } from 'lucide-react';

export type NutritionTab = 'today' | 'weekly' | 'library' | 'history' | 'settings';

interface NutritionTabsProps {
  activeTab: NutritionTab;
  setActiveTab: (tab: NutritionTab) => void;
}

export const NutritionTabs: React.FC<NutritionTabsProps> = ({ activeTab, setActiveTab }) => {
  const store = useAppStore();
  const todayStr = new Date().toISOString().split('T')[0];
  const mealLogs = selectPetMealLogs(store);
  const todayMealLogsCount = mealLogs.filter(log => log.date === todayStr).length;

  const tabs = [
    {
      id: 'today' as const,
      label: 'امروز',
      icon: Clock,
      badge: todayMealLogsCount > 0 ? todayMealLogsCount : undefined,
    },
    {
      id: 'weekly' as const,
      label: 'هفتگی',
      icon: Calendar,
    },
    {
      id: 'library' as const,
      label: 'کتابخانه غذا',
      icon: Database,
    },
    {
      id: 'history' as const,
      label: 'سابقه و آرشیو',
      icon: History,
    },
    {
      id: 'settings' as const,
      label: 'مشخصات و ابزار',
      icon: Settings2,
    },
  ];

  return (
    <div className="border-b border-coral-light/10 pb-1" dir="rtl">
      <nav className="flex flex-wrap gap-1 sm:gap-2 -mb-[1.5px]" aria-label="تب‌های سیستم تغذیه">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-black transition-all border-b-2 outline-none cursor-pointer relative ${
                isActive
                  ? 'border-coral text-coral bg-coral/5 rounded-t-xl'
                  : 'border-transparent text-gray-500 hover:text-coral hover:bg-gray-50 rounded-t-xl'
              }`}
              aria-selected={isActive}
              role="tab"
            >
              <Icon size={14} className={isActive ? 'text-coral' : 'text-gray-400'} />
              <span>{tab.label}</span>
              
              {tab.badge !== undefined && (
                <span className="bg-coral text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                  {toPersian(tab.badge)}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

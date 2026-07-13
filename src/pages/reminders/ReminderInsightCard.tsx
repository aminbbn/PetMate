import React from 'react';
import { useAppStore, ReminderCategory, ReminderRecurrence } from '../../store';
import { Sparkles, ArrowLeft, Heart, FileText, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card';
import { AnimatedCardIcon } from '../../components/AnimatedCardIcon';

interface ReminderInsightCardProps {
  onAddPrefilled: (title: string, category: ReminderCategory, recurrence: ReminderRecurrence, notes: string) => void;
}

export default function ReminderInsightCard({ onAddPrefilled }: ReminderInsightCardProps) {
  const healthRecords = useAppStore(state => state.healthRecords || []);
  const profile = useAppStore(state => state.profile);
  const navigate = useNavigate();

  if (!profile) return null;

  // Let's analyze the medical records for actual user entries
  let foundInsight: {
    type: 'vaccine' | 'surgery' | 'weight' | 'dental';
    title: string;
    description: string;
    prefillTitle: string;
    prefillCategory: ReminderCategory;
    prefillRecurrence: ReminderRecurrence;
    prefillNotes: string;
  } | null = null;

  for (const record of healthRecords) {
    const text = `${record.reason} ${record.notes}`.toLowerCase();
    
    if (text.includes('واکسن') || text.includes('vaccine') || text.includes('تزریق') || text.includes('واکسیناسیون')) {
      foundInsight = {
        type: 'vaccine',
        title: 'پیشنهاد تمدید واکسیناسیون دوره‌ای',
        description: `بر اساس سابقه ثبت‌شده قبلی واکسن برای ${profile.name}، پیشنهاد می‌کنیم یادآور دوره سالانه بعدی را تنظیم کنید تا از بروز بیماری‌های خطرناک پیشگیری شود.`,
        prefillTitle: `واکسیناسیون سالانه دوره‌ای ${profile.name}`,
        prefillCategory: 'appointment',
        prefillRecurrence: { frequency: 'monthly', interval: 12 },
        prefillNotes: 'بررسی تمدید واکسن چندگانه / هاری طبق هماهنگی با دامپزشک.'
      };
      break;
    }
    
    if (text.includes('جراحی') || text.includes('surgery') || text.includes('عمل') || text.includes('بخیه')) {
      foundInsight = {
        type: 'surgery',
        title: 'پایش و مراقبت‌های پس از جراحی',
        description: `با توجه به ثبت سابقه جراحی در پرونده سلامت ${profile.name}، توصیه می‌شود چکاپ منظم هفتگی جهت بررسی روند بهبود زخم فعال شود.`,
        prefillTitle: `بررسی روند بهبودی جراحی ${profile.name}`,
        prefillCategory: 'health',
        prefillRecurrence: { frequency: 'weekly', interval: 1 },
        prefillNotes: 'بررسی پوست، زخم جراحی و ممانعت از لیسیدن موضع.'
      };
      break;
    }

    if (text.includes('وزن') || text.includes('weight') || text.includes('چاقی') || text.includes('رژیم') || text.includes('لاغری')) {
      foundInsight = {
        type: 'weight',
        title: 'کنترل وزن و رژیم غذایی هوشمند',
        description: `به دلیل ثبت دغدغه‌های مربوط به تغییر وزن، توصیه می‌کنیم پایش ماهیانه وزن و تنظیم جیره غذایی را در یادآورها فعال کنید.`,
        prefillTitle: `پایش وزن و بررسی حجم غذا ${profile.name}`,
        prefillCategory: 'nutrition',
        prefillRecurrence: { frequency: 'monthly', interval: 1 },
        prefillNotes: 'اندازه‌گیری دقیق وزن روی ترازوی دیجیتال و یادداشت در پرونده رشد.'
      };
      break;
    }

    if (text.includes('دندان') || text.includes('dental') || text.includes('جرم') || text.includes('مسواک')) {
      foundInsight = {
        type: 'dental',
        title: 'مراقبت‌های بهداشت دهان و دندان',
        description: `بر اساس سوابق بهداشتی ثبت شده، مسواک زدن منظم جهت پیشگیری از پلاک و التهابات لثه توصیه می‌شود.`,
        prefillTitle: `برس دندان و پایش لثه ${profile.name}`,
        prefillCategory: 'grooming',
        prefillRecurrence: { frequency: 'daily' },
        prefillNotes: 'استفاده از خمیردندان مخصوص حیوانات و مسواک انگشتی.'
      };
      break;
    }
  }

  return (
    <Card 
      glow 
      glowColor="sunny" 
      hoverEffect={true}
      ambientCorner="bottom-right"
      className="bg-white border-sunny/20 shadow-warm-md p-5 flex flex-col justify-between group"
    >
      {foundInsight ? (
        <div className="space-y-4 text-right">
          <div className="flex items-start gap-4">
            <AnimatedCardIcon variant="sparkles" tone="sunny" size="sm" />
            <div className="space-y-1">
              <h3 className="font-black text-gray-900 text-sm leading-snug">{foundInsight.title}</h3>
              <p className="text-gray-500 text-[11px] leading-relaxed font-medium">
                {foundInsight.description}
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-start">
            <button
              onClick={() => foundInsight && onAddPrefilled(
                foundInsight.prefillTitle,
                foundInsight.prefillCategory,
                foundInsight.prefillRecurrence,
                foundInsight.prefillNotes
              )}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-coral text-white text-[11px] font-black rounded-xl hover:bg-coral-deep transition-all shadow-md shadow-coral/15 cursor-pointer"
            >
              <PlusIcon size={14} />
              <span>ایجاد سریع یادآور بر اساس این توصیه</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 text-right">
          <div className="flex items-start gap-4">
            <AnimatedCardIcon variant="document" tone="neutral" size="sm" />
            <div className="space-y-1">
              <h3 className="font-black text-gray-800 text-sm leading-snug">شخصی‌سازی توصیه‌های مراقبتی</h3>
              <p className="text-gray-400 text-[11px] leading-relaxed font-normal">
                هیچ سابقه پزشکی خاصی (نظیر واکسیناسیون، جراحی یا وزن) در پرونده پزشکی {profile.name} یافت نشد. با تکمیل پرونده سلامت او، توصیه‌های خودمراقبتی هوشمند بر اساس نیازهای واقعی برای شما نمایان می‌شود.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-start">
            <button
              onClick={() => navigate('/health-record')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-coral text-coral text-[11px] font-black hover:bg-coral/5 transition-all cursor-pointer"
            >
              <span>برو به پرونده پزشکی و EHR</span>
              <ArrowLeft size={12} className="mr-0.5" />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}

function PlusIcon({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

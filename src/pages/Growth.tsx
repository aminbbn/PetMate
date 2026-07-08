import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { LineChart, Sparkles, Scale, History, Plus, FileText, ArrowUpRight, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { toPersian, formatPersianDate } from '../lib/persian';
import { cn } from '../lib/utils';

export default function Growth() {
  const profile = useAppStore(state => state.profile);
  const history = useAppStore(state => state.weightHistory);
  const addWeightEntry = useAppStore(state => state.addWeightEntry);

  const [weight, setWeight] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) return;
    addWeightEntry(Number(weight), new Date().toISOString());
    setWeight('');
  };

  const data = [
    { date: 'شروع', weight: profile?.weight || 0, dateFull: 'شروع اولین ثبت' },
    ...history.map(h => ({
      date: formatPersianDate(h.date).split(' ')[1] || 'ثبت', // Just the month name or simplified
      dateFull: formatPersianDate(h.date),
      weight: h.weight
    }))
  ];

  const currentWeight = data[data.length - 1]?.weight || profile?.weight || 0;
  const initialWeight = profile?.weight || 0;
  const weightChange = currentWeight - initialWeight;

  return (
    <div className="p-10 lg:p-12 space-y-10 max-w-7xl mx-auto w-full" dir="rtl">
      
      {/* Page Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-coral-light/10">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sunny/10 text-sunny rounded-xl flex items-center justify-center">
              <Scale size={22} />
            </div>
            <h1 className="text-3xl font-black text-coral-deep">پیشرفت رشد و ردیاب وزن</h1>
          </div>
          <p className="text-gray-500 font-medium mt-1">نمودارهای تغییرات وزن و کنترل وزن ایده‌آل</p>
        </div>
      </header>

      {/* Grid: Stats & Add Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Span 4: Current weight + Add Weight Form side-by-side or stacked */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Current Weight Bento Stats with Sunny Yellow Glow */}
          <Card glow glowColor="sunny" className="bg-gradient-to-l from-white to-sunny/5 border-sunny/10 p-8" hoverEffect={false}>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-sm text-gray-400 font-bold block mb-2">وزن کنونی {profile?.name}</span>
                <span className="text-5xl font-black text-gray-800 flex items-baseline gap-1.5" dir="ltr">
                  <span className="text-xl font-normal text-gray-400">کیلوگرم</span> {toPersian(currentWeight)}
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-sunny/10 text-sunny flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
            </div>
            
            <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-bold">تغییر نسبت به شروع:</span>
              <span className={`text-sm font-black px-3 py-1 rounded-full ${
                weightChange >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {weightChange >= 0 ? '+' : ''}{toPersian(weightChange.toFixed(1))} کیلوگرم
              </span>
            </div>
          </Card>

          {/* Inline Weight Logger Form */}
          <Card className="border border-coral-light/10 shadow-sm p-8" hoverEffect={false}>
            <h3 className="font-black text-gray-800 text-lg mb-4 flex items-center gap-2">
              <Plus size={18} className="text-sunny" />
              ثبت سریع وزن جدید
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input 
                  type="number" 
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  className="w-full bg-peach/20 border border-coral-light/10 rounded-2xl pr-4 pl-24 py-4 outline-none focus:ring-2 focus:ring-sunny/50 text-xl font-black text-gray-800 text-center transition-all"
                  placeholder="0.0"
                  step="0.1"
                  dir="ltr"
                  required
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs bg-white px-3 py-1.5 rounded-lg border border-coral-light/10">کیلوگرم</span>
              </div>
              
              <Button type="submit" variant="sunny" className="w-full py-4 font-bold text-sm" disabled={!weight}>
                ثبت وزن جدید
              </Button>
            </form>
          </Card>

        </div>

        {/* Right Span 8: Full Width Elegant Weight Chart */}
        <div className="lg:col-span-8">
          <Card className="bg-white border border-coral-light/10 shadow-md p-8" hoverEffect={false}>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
              <h3 className="font-black text-gray-800 text-lg flex items-center gap-2.5">
                <TrendingUp size={20} className="text-sunny" />
                نمودار روند تغییرات وزن
              </h3>
              <span className="text-xs text-gray-400 font-bold">به‌روزرسانی خودکار</span>
            </div>

            {/* Custom Interactive Recharts Chart */}
            <div className="h-80 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#FBBF24" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#9CA3AF" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false}
                    domain={['dataMin - 1', 'dataMax + 1']}
                    tickFormatter={(v) => toPersian(v)}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-4 rounded-2xl shadow-xl border border-coral-light/20 text-right space-y-1.5" dir="rtl">
                            <p className="text-[10px] text-gray-400 font-bold">{payload[0].payload.dateFull}</p>
                            <p className="text-sm font-black text-gray-800 flex items-center gap-1.5">
                              وزن: <span className="text-sunny text-base">{toPersian(String(payload[0].value))}</span> کیلوگرم
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#F59E0B" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorWeight)" 
                    dot={{ stroke: '#F59E0B', strokeWidth: 3, r: 6, fill: '#FFFFFF' }}
                    activeDot={{ r: 8, strokeWidth: 0, fill: '#E85A5D' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

      </div>

      {/* Weight History Table Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-gray-700 mr-2 flex items-center gap-2">
          <History size={18} />
          تاریخچه تمام ثبت‌ها
        </h3>
        
        <div className="bg-white rounded-3xl border border-coral-light/10 shadow-sm overflow-hidden">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-peach/30 text-gray-500 font-bold text-sm border-b border-coral-light/10">
                <th className="px-8 py-5">#</th>
                <th className="px-8 py-5">تاریخ ثبت</th>
                <th className="px-8 py-5">وزن ثبت شده</th>
                <th className="px-8 py-5">وضعیت مقایسه‌ای</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              <tr className="hover:bg-peach/10 transition-colors">
                <td className="px-8 py-4.5 font-bold text-gray-400">{toPersian(1)}</td>
                <td className="px-8 py-4.5 text-gray-600">شروع عضویت</td>
                <td className="px-8 py-4.5 font-black text-gray-800">{toPersian(profile?.weight)} کیلوگرم</td>
                <td className="px-8 py-4.5 text-gray-400">مبنای اندازه‌گیری</td>
              </tr>
              {history.map((item, index) => {
                const prevWeight = index === 0 ? (profile?.weight || 0) : history[index - 1].weight;
                const change = item.weight - prevWeight;
                return (
                  <tr key={item.id} className="hover:bg-peach/10 transition-colors">
                    <td className="px-8 py-4.5 font-bold text-gray-400">{toPersian(index + 2)}</td>
                    <td className="px-8 py-4.5 text-gray-600">{formatPersianDate(item.date)}</td>
                    <td className="px-8 py-4.5 font-black text-gray-800">{toPersian(item.weight)} کیلوگرم</td>
                    <td className="px-8 py-4.5">
                      <span className={cn(
                        "text-xs font-bold px-2.5 py-1 rounded-full",
                        change >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                      )} dir="ltr">
                        {change >= 0 ? '+' : ''}{toPersian(change.toFixed(1))} کیلوگرم
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

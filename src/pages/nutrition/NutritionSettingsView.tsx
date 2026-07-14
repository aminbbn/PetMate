import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { selectPetSensitivities, selectLatestWeight, selectActiveFeedingPlan } from './nutritionSelectors';
import { toPersian } from '../../lib/persian';
import { calculateEducationalEnergyEstimate, EnergyEstimateInput } from './energyEstimate';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { AlertTriangle, Plus, Trash2, ShieldAlert, Sparkles, HeartPulse, Scale, Check } from 'lucide-react';

export const NutritionSettingsView: React.FC = () => {
  const store = useAppStore();
  const sensitivities = selectPetSensitivities(store);
  const latestWeight = selectLatestWeight(store);
  const activePlan = selectActiveFeedingPlan(store);

  const petId = store.selectedPetId || store.profile?.id || '';
  const currentPet = store.pets.find(p => p.id === petId) || store.profile;
  const isCat = currentPet?.type === 'cat';

  // 1. Allergies / Sensitivities form state
  const [newIngredient, setNewIngredient] = useState('');
  const [sensitivityStatus, setSensitivityStatus] = useState<'suspected' | 'veterinarian_confirmed'>('suspected');
  const [reactionNotes, setReactionNotes] = useState('');

  // 2. Educational Energy Estimator state
  const [lifeStage, setLifeStage] = useState<'growing' | 'adult' | 'senior'>('adult');
  const [isNeutered, setIsNeutered] = useState<boolean>(true);
  const [bcs, setBcs] = useState<number>(5); // 5 is ideal
  const [isPregnant, setIsPregnant] = useState(false);
  const [hasChronicDisease, setHasChronicDisease] = useState(false);
  const [isOnTherapeutic, setIsOnTherapeutic] = useState(false);
  const [isActiveWeightLoss, setIsActiveWeightLoss] = useState(false);

  // Result of calculation
  const [calcResult, setCalcResult] = useState<any | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const handleAddSensitivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngredient.trim()) return;

    store.addFoodSensitivity({
      petId,
      ingredient: newIngredient.trim(),
      status: sensitivityStatus,
      reactionNotes: reactionNotes.trim() || undefined,
    });

    setNewIngredient('');
    setReactionNotes('');
  };

  const handleDeleteSensitivity = (id: string) => {
    store.deleteFoodSensitivity(id);
  };

  const handleRunEstimation = () => {
    const weightVal = latestWeight?.weightKg || 0;

    if (!weightVal || weightVal <= 0) {
      setCalcError('خطا: هیچ وزن معتبری در تاریخچه رشد پت ثبت نشده است. برای انجام محاسبات علمی، ابتدا باید وزن پت را در بخش رشد ثبت کنید.');
      setCalcResult(null);
      return;
    }

    const calcInput: EnergyEstimateInput = {
      petType: isCat ? 'cat' : 'dog',
      weightKg: weightVal,
      lifeStage,
      isNeutered,
      bodyConditionScore: bcs,
      isPregnantOrLactating: isPregnant,
      hasChronicDisease,
      isOnTherapeuticDiet: isOnTherapeutic,
      isActiveWeightLoss,
    };

    const res = calculateEducationalEnergyEstimate(calcInput);

    if (res.success) {
      setCalcResult(res);
      setCalcError(null);
    } else {
      setCalcError(res.error || 'خطای نامشخص در محاسبات');
      setCalcResult(null);
    }
  };

  const handleApplyEstimateToPlan = () => {
    if (!activePlan || !calcResult || !calcResult.minKcal || !calcResult.maxKcal) return;

    const midKcal = Math.round((calcResult.minKcal + calcResult.maxKcal) / 2);

    store.updateFeedingPlan(activePlan.id, {
      dailyEnergyTargetKcal: midKcal,
      energyRangeMinKcal: calcResult.minKcal,
      energyRangeMaxKcal: calcResult.maxKcal,
    });

    alert('برآورد انرژی آموزشی با موفقیت به عنوان کالری هدف برنامه غذایی فعال ذخیره شد.');
  };

  const getBcsLabel = (score: number) => {
    if (score <= 3) return 'کم‌وزن شدید (بدن لاغر و تحلیل‌رفته)';
    if (score === 4) return 'کمی لاغر (دنده‌ها کمی نمایان)';
    if (score === 5) return 'وضعیت بدنی ایده‌آل و متناسب';
    if (score === 6) return 'کمی تپل (پوشش خفیف چربی)';
    return 'اضافه وزن بالا / چاق (دنده‌ها لمس نمی‌شوند)';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-right" dir="rtl">
      {/* Right Column: Dynamic Calorie Target Estimator */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <h3 className="text-xl font-black text-coral-deep flex items-center gap-2">
            <HeartPulse className="text-coral" size={20} />
            برآورد علمی نیاز انرژی روزانه (DER)
          </h3>
          <p className="text-gray-500 text-xs font-semibold mt-1">
            بر اساس راهنماهای بالینی انجمن جهانی دامپزشکی دام‌های کوچک (WSAVA) و AAHA
          </p>
        </div>

        <Card className="p-6 space-y-5">
          {/* Latest Weight Notification */}
          <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Scale size={18} className="text-coral-deep" />
              <div>
                <span className="text-[10px] text-gray-400 font-bold block">مبنای آخرین وزن ثبت‌شده:</span>
                <span className="text-xs font-black text-gray-700">
                  {latestWeight
                    ? `${toPersian(latestWeight.weightKg)} کیلوگرم (ثبت در ${toPersian(latestWeight.measuredAt.split('T')[0])})`
                    : 'هیچ وزنی ثبت نشده است'}
                </span>
              </div>
            </div>
            {!latestWeight && (
              <span className="text-[10px] bg-red-50 text-red-600 font-black py-1 px-2 rounded-lg border border-red-100">
                ثبت وزن در بخش رشد الزامی است
              </span>
            )}
          </div>

          {/* Calculator Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Life stage */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">مرحله رشد پت</label>
              <select
                value={lifeStage}
                onChange={(e) => setLifeStage(e.target.value as any)}
                className="w-full bg-gray-50 border border-coral-light/10 text-gray-800 rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none"
              >
                <option value="growing">بچه گربه یا توله سگ (در حال رشد)</option>
                <option value="adult">بالغ (سگ/گربه جوان و میانسال)</option>
                <option value="senior">مسن / پیر (مراحل پایانی عمر)</option>
              </select>
            </div>

            {/* Neutered */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">وضعیت عقیم‌سازی</label>
              <select
                value={isNeutered ? 'yes' : 'no'}
                onChange={(e) => setIsNeutered(e.target.value === 'yes')}
                className="w-full bg-gray-50 border border-coral-light/10 text-gray-800 rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none"
              >
                <option value="yes">عقیم‌شده است</option>
                <option value="no">عقیم‌نشده (سالم / دست‌نخورده)</option>
              </select>
            </div>

            {/* BCS Slider */}
            <div className="sm:col-span-2 space-y-2 border-t border-gray-50 pt-3">
              <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                <label>شاخص وضعیت بدنی (BCS): {toPersian(bcs)} از ۹</label>
                <span className="text-coral-deep font-black text-[11px]">{getBcsLabel(bcs)}</span>
              </div>
              <input
                type="range"
                min="1"
                max="9"
                step="1"
                value={bcs}
                onChange={(e) => setBcs(parseInt(e.target.value))}
                className="w-full accent-coral cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-bold text-gray-400 px-1">
                <span>۱: لاغر مفرط</span>
                <span>۵: ایده‌آل</span>
                <span>۹: چاقی شدید</span>
              </div>
            </div>

            {/* Medical Guards check (disables auto computation if checked) */}
            <div className="sm:col-span-2 border-t border-gray-50 pt-3 space-y-2.5">
              <span className="text-xs font-black text-gray-700 block">بررسی شرایط خاص و ایمنی دامپزشکی:</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2.5 bg-gray-50 p-2.5 rounded-xl border border-gray-100 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isPregnant}
                    onChange={(e) => setIsPregnant(e.target.checked)}
                    className="accent-coral rounded"
                  />
                  <span className="text-xs font-bold text-gray-600">بارداری یا شیردهی فعال</span>
                </label>

                <label className="flex items-center gap-2.5 bg-gray-50 p-2.5 rounded-xl border border-gray-100 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasChronicDisease}
                    onChange={(e) => setHasChronicDisease(e.target.checked)}
                    className="accent-coral rounded"
                  />
                  <span className="text-xs font-bold text-gray-600">وجود بیماری مزمن فعال (مانند دیابت، کلیوی)</span>
                </label>

                <label className="flex items-center gap-2.5 bg-gray-50 p-2.5 rounded-xl border border-gray-100 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isOnTherapeutic}
                    onChange={(e) => setIsOnTherapeutic(e.target.checked)}
                    className="accent-coral rounded"
                  />
                  <span className="text-xs font-bold text-gray-600">تحت درمان با غذای درمانی ویژه</span>
                </label>

                <label className="flex items-center gap-2.5 bg-gray-50 p-2.5 rounded-xl border border-gray-100 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isActiveWeightLoss}
                    onChange={(e) => setIsActiveWeightLoss(e.target.checked)}
                    className="accent-coral rounded"
                  />
                  <span className="text-xs font-bold text-gray-600">در حال رژیم لاغری شدید تحت نظر پزشک</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleRunEstimation}
              variant="primary"
              className="text-xs font-black px-6 py-2.5"
            >
              اجرای برآورد نیاز انرژی
            </Button>
          </div>

          {/* Results panel */}
          {calcResult && (
            <div className="p-4 rounded-xl bg-green-50/50 border border-green-200 space-y-3.5 animate-fade-in">
              <div className="flex items-center gap-2 text-green-800">
                <Sparkles size={16} />
                <h4 className="text-xs font-black">نتایج برآورد بالینی برای {currentPet?.name}:</h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block">متابولیسم پایه (RER):</span>
                  <span className="text-lg font-black text-green-700">{toPersian(calcResult.rer)} ک‌کالری</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block">محدوده انرژی روزانه (DER):</span>
                  <span className="text-lg font-black text-green-700">
                    {toPersian(calcResult.minKcal)} تا {toPersian(calcResult.maxKcal)} ک‌کالری
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-semibold text-gray-500 space-y-1 border-t border-green-100 pt-2">
                <p>• ضریب جیره استفاده شده: {calcResult.factorsUsed}</p>
                <p>• تحلیل BCS: {calcResult.bcsAdjustmentNote}</p>
              </div>

              {activePlan ? (
                <div className="pt-2 border-t border-green-100 flex justify-end">
                  <Button
                    onClick={handleApplyEstimateToPlan}
                    className="text-[11px] font-black bg-green-600 hover:bg-green-700 text-white py-1.5 px-4 rounded-lg flex items-center gap-1.5"
                  >
                    <Check size={12} />
                    اعمال این محدوده به برنامه غذایی فعال
                  </Button>
                </div>
              ) : (
                <p className="text-[10px] text-gray-400 italic">برای ذخیره و پیاده‌سازی این مقادیر، ابتدا باید برنامه غذایی ایجاد کنید.</p>
              )}
            </div>
          )}

          {calcError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 space-y-2 flex gap-3 items-start animate-fade-in">
              <ShieldAlert size={18} className="shrink-0 mt-0.5" />
              <div className="text-xs font-semibold leading-relaxed">
                {calcError}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Left Column: Food Sensitivities & Allergies */}
      <div className="lg:col-span-5 space-y-6">
        <div>
          <h3 className="text-xl font-black text-coral-deep flex items-center gap-2">
            <AlertTriangle className="text-coral" size={18} />
            حساسیت‌ها و آلرژی‌های غذایی
          </h3>
          <p className="text-gray-500 text-xs font-semibold mt-1">
            ردیابی مواد آلرژن و ممنوعه‌ها برای سلامت دستگاه گوارش و پوست پت
          </p>
        </div>

        {/* Sensitivity Add Form */}
        <Card className="p-5">
          <form onSubmit={handleAddSensitivity} className="space-y-4">
            <h4 className="text-xs font-black text-gray-700">ثبت مورد حساسیت جدید</h4>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">ماده آلرژن / عنصر حساسیت‌زا</label>
              <input
                type="text"
                required
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                placeholder="مثال: گوشت مرغ، گلوتن گندم، سویا"
                className="w-full bg-gray-50 border border-coral-light/10 focus:border-coral rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-800 outline-none shadow-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">وضعیت تأیید بالینی</label>
              <select
                value={sensitivityStatus}
                onChange={(e) => setSensitivityStatus(e.target.value as any)}
                className="w-full bg-gray-50 border border-coral-light/10 text-gray-800 rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none cursor-pointer"
              >
                <option value="suspected">مشکوک (بر اساس مشاهدات خانگی)</option>
                <option value="veterinarian_confirmed">تأییدشده توسط دامپزشک (تست آلرژی / رژیم حذفی)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">علائم یا یادداشت‌های واکنشی (اختیاری)</label>
              <textarea
                value={reactionNotes}
                onChange={(e) => setReactionNotes(e.target.value)}
                placeholder="مثال: خارش شدید پوست، اسهال خفیف، ریزش موی مقطعی"
                rows={2}
                className="w-full bg-gray-50 border border-coral-light/10 focus:border-coral rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-800 outline-none shadow-xs resize-none"
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                className="text-xs font-black px-4 py-2"
              >
                <Plus size={14} className="ml-1" />
                ثبت آلرژن
              </Button>
            </div>
          </form>
        </Card>

        {/* Sensitivity list */}
        <Card className="p-5 space-y-4">
          <h4 className="text-xs font-black text-gray-400">لیست آلرژن‌های ردیابی شده</h4>
          
          {sensitivities.length === 0 ? (
            <p className="text-gray-400 text-xs py-4 text-center">هیچ آلرژی یا حساسیتی برای این پت ثبت نشده است.</p>
          ) : (
            <div className="space-y-3">
              {sensitivities.map((s) => (
                <div key={s.id} className="p-3 rounded-xl border border-red-100 bg-red-50/20 flex justify-between items-start">
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <h5 className="text-xs font-black text-gray-800">{s.ingredient}</h5>
                      <span className={`text-[9px] font-black border px-2 py-0.5 rounded ${
                        s.status === 'veterinarian_confirmed'
                          ? 'bg-red-50 text-red-600 border-red-100'
                          : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {s.status === 'veterinarian_confirmed' ? 'تأیید دامپزشک' : 'مشکوک'}
                      </span>
                    </div>
                    {s.reactionNotes && (
                      <p className="text-[10px] text-gray-500 font-medium mr-3.5">
                        علائم: {s.reactionNotes}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteSensitivity(s.id)}
                    className="text-gray-400 hover:text-red-500 p-1"
                    aria-label="حذف مورد حساسیت"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

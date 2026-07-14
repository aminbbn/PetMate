import React, { useState, useRef } from 'react';
import { useAppStore } from '../store';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { 
  Smile, Sparkles, Volume2, ShieldAlert, Heart, Star, 
  CheckCircle2, MessageSquare, Clipboard, Trash2, Plus, 
  Info, AlertTriangle, Play, HelpCircle, Eye, RefreshCw, 
  ArrowLeft, FileText, Camera, Check, AlertCircle, Phone, 
  MapPin, Stethoscope 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toPersian } from '../lib/persian';
import { cn } from '../lib/utils';
import { BEHAVIOR_LIBRARY, CATEGORY_LABELS, CONTEXT_LABELS, MOCK_MEDIA_GALLERY } from './translator/behaviorLibrary';
import { BehaviorSignal, BehaviorObservation, BehaviorContext, BehaviorSignalCategory, BehaviorAssessment } from './translator/behaviorTypes';
import { Link, useNavigate } from 'react-router-dom';

export default function BehaviorGuidePage() {
  const profile = useAppStore(state => state.profile);
  const pets = useAppStore(state => state.pets || []);
  const setProfile = useAppStore(state => state.setProfile);
  
  // Observations from Store
  const behaviorObservations = useAppStore(state => state.behaviorObservations || []);
  const addBehaviorObservation = useAppStore(state => state.addBehaviorObservation);
  const deleteBehaviorObservation = useAppStore(state => state.deleteBehaviorObservation);

  // Assessments from Store
  const behaviorAssessments = useAppStore(state => state.behaviorAssessments || []);
  const addBehaviorAssessment = useAppStore(state => state.addBehaviorAssessment);
  const deleteBehaviorAssessment = useAppStore(state => state.deleteBehaviorAssessment);

  const navigate = useNavigate();

  // Selected Profile state
  const activePetId = profile?.id || '';
  const currentSpecies = profile?.type || 'dog';

  // Directory filter state
  const [selectedCategory, setSelectedCategory] = useState<BehaviorSignalCategory | 'all'>('all');
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null);
  const [activeSpeciesTab, setActiveSpeciesTab] = useState<'dog' | 'cat'>(currentSpecies);

  // New Observation Form state
  const [formContext, setFormContext] = useState<BehaviorContext>('resting');
  const [formSelectedSignals, setFormSelectedSignals] = useState<string[]>([]);
  const [formNotes, setFormNotes] = useState('');
  const [formMediaUrl, setFormMediaUrl] = useState<string | null>(null);
  const [formMediaType, setFormMediaType] = useState<'image' | 'video' | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [showObservationForm, setShowObservationForm] = useState(false);

  // Interactive Assessment Generation state
  const [isAssessing, setIsAssessing] = useState(false);
  const [generatedAssessment, setGeneratedAssessment] = useState<BehaviorAssessment | null>(null);

  // Media simulated file selection reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!profile) return null;

  // Filter signals based on tab selection
  const displayedSignals = BEHAVIOR_LIBRARY.filter(
    sig => sig.species === activeSpeciesTab && (selectedCategory === 'all' || sig.category === selectedCategory)
  );

  const selectedSignal = BEHAVIOR_LIBRARY.find(s => s.id === selectedSignalId);

  // Filter observations and assessments under current pet's ID
  const petObservations = behaviorObservations.filter(o => o.petId === activePetId);
  const petAssessments = behaviorAssessments.filter(a => a.petId === activePetId);

  // Red Flags from Library for current species
  const redFlags = BEHAVIOR_LIBRARY.filter(s => s.species === activeSpeciesTab && s.isRedFlag);

  // Handle Species Tab Switch
  const handleSpeciesTabSwitch = (species: 'dog' | 'cat') => {
    setActiveSpeciesTab(species);
    setSelectedCategory('all');
    setSelectedSignalId(null);
    setFormSelectedSignals([]);
  };

  // Switch Active Pet
  const handlePetSwitch = (petId: string) => {
    const selected = pets.find(p => p.id === petId);
    if (selected) {
      setProfile(selected);
      setActiveSpeciesTab(selected.type);
      setSelectedSignalId(null);
      setFormSelectedSignals([]);
      setGeneratedAssessment(null);
    }
  };

  // Toggle form signal selection
  const handleToggleFormSignal = (sigId: string) => {
    setFormSelectedSignals(prev => 
      prev.includes(sigId) ? prev.filter(id => id !== sigId) : [...prev, sigId]
    );
  };

  // Simulate Media Upload
  const handleSimulateMedia = (type: 'image' | 'video') => {
    setIsUploading(true);
    setTimeout(() => {
      // Pick random mock media from catalog
      const randomMedia = MOCK_MEDIA_GALLERY[Math.floor(Math.random() * MOCK_MEDIA_GALLERY.length)];
      setFormMediaUrl(randomMedia.url);
      setFormMediaType(type);
      setIsUploading(false);
    }, 1000);
  };

  // Clear Uploaded Media
  const handleClearMedia = () => {
    setFormMediaUrl(null);
    setFormMediaType(undefined);
  };

  // Create Observation Action
  const handleSaveObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (formSelectedSignals.length === 0) {
      alert('لطفاً حداقل یک نشانه رفتاری را انتخاب کنید.');
      return;
    }

    addBehaviorObservation({
      petId: activePetId,
      context: formContext,
      signals: formSelectedSignals,
      notes: formNotes,
      mediaUrl: formMediaUrl || undefined,
      mediaType: formMediaType
    });

    // Reset Form
    setFormSelectedSignals([]);
    setFormNotes('');
    setFormMediaUrl(null);
    setFormMediaType(undefined);
    setShowObservationForm(false);
  };

  // Perform Behavior Assessment
  const handleRunAssessment = () => {
    if (petObservations.length === 0) {
      alert('ابتدا باید حداقل یک مشاهده ثبت کنید تا سیستم بتواند ارزیابی دوره‌ای انجام دهد.');
      return;
    }

    setIsAssessing(true);
    setGeneratedAssessment(null);

    setTimeout(() => {
      // Gather all signals from previous observations
      const allObservedSignalIds = Array.from(new Set(petObservations.flatMap(o => o.signals)));
      const activeSignals = BEHAVIOR_LIBRARY.filter(s => allObservedSignalIds.includes(s.id));

      if (activeSignals.length === 0) {
        setIsAssessing(false);
        return;
      }

      // Determine findings based on signals
      const findings: string[] = [];
      const actionPlan: string[] = [];
      let vetReferral = false;
      let referralReason = '';

      // Check for Red Flags
      const activeRedFlags = activeSignals.filter(s => s.isRedFlag);
      if (activeRedFlags.length > 0) {
        vetReferral = true;
        referralReason = `شناسایی علائم بالینی قرمز و بحرانی از جمله (${activeRedFlags.map(rf => rf.name).join('، ')}) که نیازمند معاینه فوری عصبی یا گوارشی است.`;
        findings.push(`⚠️ هشدار قرمز بالینی فعال است! علائم مشاهده شده جزء فوریت‌های دامپزشکی دسته‌بندی می‌شوند.`);
        actionPlan.push('بدون هیچ تاخیری با دامپزشک خود تماس بگیرید یا به نزدیک‌ترین بیمارستان مراجعه کنید.');
      }

      // Build safe findings
      activeSignals.forEach(sig => {
        findings.push(`تحلیل سیگنال "${sig.name}": این رفتار می‌تواند نشانگر ${sig.possibleMeanings.map(m => m.meaning).join(' یا ')} باشد.`);
        actionPlan.push(`توصیه ایمنی برای "${sig.name}": ${sig.safeResponseAdvice}`);
      });

      // Default safe guidelines
      if (actionPlan.length === 0) {
        actionPlan.push('وضعیت کلی، تغذیه، و فعالیت‌های روزانه حیوان خانگی را به دقت در منزل پایش کنید.');
      }

      // Add default non-punitive reassuring environment tips
      actionPlan.push('هرگز حیوان را به دلیل ابراز رفتارهای ناشی از ترس یا عصبانیت (مانند گوش هواپیمایی یا پنهان شدن) تنبیه، دعوا یا سرزنش نکنید.');
      actionPlan.push('محیط زندگی پت را کاملاً امن، ساکت و عاری از تنش‌های حرکتی نگه دارید.');

      const assessmentInput = {
        petId: activePetId,
        signalsAnalyzed: allObservedSignalIds,
        context: petObservations[0].context, // default to latest
        findings,
        actionPlan,
        vetReferralRecommended: vetReferral,
        referralReason: referralReason || undefined
      };

      addBehaviorAssessment(assessmentInput);
      
      // Select the newly added assessment
      setIsAssessing(false);
    }, 1500);
  };

  // Pre-fill triage input and navigate
  const handleGoToTriage = (query: string) => {
    navigate('/triage', { state: { prefilled: query } });
  };

  return (
    <div className="p-4 md:p-8 lg:p-10 space-y-6 max-w-7xl mx-auto w-full flex-1 flex flex-col relative" dir="rtl">
      
      {/* Page Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-coral-light/10 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-sunny/10 text-sunny rounded-xl flex items-center justify-center">
              <Smile size={24} className="stroke-[2.2] text-sunny-deep animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-coral-deep tracking-tight">
                راهنمای رفتار و زبان بدن {profile.name}
              </h1>
              <p className="text-gray-400 font-bold text-xs mt-0.5">
                شناخت علمی نشانه‌ها، بررسی چندوجهی رفتاری و ثبت دقیق مشاهدات فاقد تظاهر یا ترجمه تخیلی
              </p>
            </div>
          </div>
        </div>

        {/* Switch Pet Selector */}
        <div className="flex items-center gap-2 bg-peach/10 p-1.5 rounded-2xl border border-coral-light/10">
          <span className="text-[10px] text-gray-400 font-bold px-2">پروفایل فعال:</span>
          {pets.map((pet) => {
            const isActive = pet.id === activePetId;
            return (
              <button
                key={pet.id}
                onClick={() => handlePetSwitch(pet.id)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-coral text-white border-coral shadow-sm font-black'
                    : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
                }`}
              >
                <span>{pet.type === 'dog' ? '🐶' : '🐱'}</span>
                <span>{pet.name}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Warning Center - Deterministic Medical Red Flags Banner */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <Card 
          glow 
          glowColor="coral" 
          hoverLift={false}
          className="col-span-12 bg-red-50/60 border border-red-200/60 rounded-3xl p-5 md:p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl" />
          <div className="flex flex-col md:flex-row items-start gap-4 justify-between relative z-10">
            <div className="flex gap-3">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center shrink-0">
                <AlertTriangle size={24} className="animate-bounce" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-red-900 text-sm md:text-base">مرکز پایش علائم قرمز بالینی (فوریت‌های جانی)</h3>
                <p className="text-red-700 text-xs font-bold leading-relaxed max-w-4xl">
                  تغییر رفتار حیوان همیشه ریشه عاطفی ندارد. علائمی نظیر <strong className="text-red-900 font-black">فشردن مکرر پیشانی به دیوار (Head Pressing)</strong>، <strong className="text-red-900 font-black">بی‌حالی مطلق و گیجی</strong>، <strong className="text-red-900 font-black">عدم تعادل و تلوتلو خوردن</strong> در سگ‌ها، یا <strong className="text-red-900 font-black">تلاش‌های بی‌نتیجه و با ناله گربه در ظرف خاک</strong> نشان‌دهنده انسداد ادراری، آسیب مغزی یا مسمومیت کبدی بوده و اورژانس صد در صد جانی هستند.
                </p>
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0 shrink-0">
              <button 
                onClick={() => handleGoToTriage('پت من تعادل حرکتی نداره و سرش رو مکرر به دیوار فشار میده')}
                className="flex-1 md:flex-initial py-2.5 px-4 rounded-xl bg-red-600 text-white font-black text-xs hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-red-500/15"
              >
                <Stethoscope size={14} />
                <span>بررسی در تریاژ</span>
              </button>
              <Link to="/vets" className="flex-1 md:flex-initial">
                <button className="w-full py-2.5 px-4 rounded-xl bg-white border border-red-300 text-red-900 font-black text-xs hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                  <Phone size={14} />
                  <span>تماس با دامپزشک</span>
                </button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 items-stretch">
        
        {/* RIGHT SIDE (7 cols): Signals Directory & Details */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Signal Library Directory */}
          <Card className="bg-white border-coral-light/10 p-5 md:p-6 space-y-5 shadow-md flex-1 flex flex-col justify-between">
            
            <div className="space-y-4">
              {/* Filter Tabs for species & category */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Volume2 size={18} className="text-sunny" />
                  <h3 className="font-black text-gray-800 text-base">دایرکتوری تخصصی نشانه‌های رفتاری</h3>
                </div>
                
                {/* Species Toggle inside directory to let comparing dogs/cats */}
                <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl border border-gray-200 shrink-0">
                  <button
                    onClick={() => handleSpeciesTabSwitch('dog')}
                    className={cn(
                      "text-xs font-black px-3 py-1.5 rounded-lg transition-all",
                      activeSpeciesTab === 'dog' ? "bg-white text-gray-800 shadow-sm" : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    🐶 نشانه‌های سگ
                  </button>
                  <button
                    onClick={() => handleSpeciesTabSwitch('cat')}
                    className={cn(
                      "text-xs font-black px-3 py-1.5 rounded-lg transition-all",
                      activeSpeciesTab === 'cat' ? "bg-white text-gray-800 shadow-sm" : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    🐱 نشانه‌های گربه
                  </button>
                </div>
              </div>

              {/* Category buttons list */}
              <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-[11px] font-black border transition-all cursor-pointer",
                    selectedCategory === 'all'
                      ? "bg-sunny/10 text-sunny-deep border-sunny"
                      : "bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100"
                  )}
                >
                  همه دسته‌ها
                </button>
                {Object.entries(CATEGORY_LABELS).map(([cat, info]) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat as BehaviorSignalCategory)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-[11px] font-black border transition-all cursor-pointer flex items-center gap-1",
                      selectedCategory === cat
                        ? "bg-sunny/10 text-sunny-deep border-sunny"
                        : "bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100"
                    )}
                  >
                    <span>{info.icon}</span>
                    <span>{info.label}</span>
                  </button>
                ))}
              </div>

              {/* Signals Grid inside directory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                {displayedSignals.map((sig) => {
                  const isSelected = selectedSignalId === sig.id;
                  const catInfo = CATEGORY_LABELS[sig.category];
                  return (
                    <button
                      key={sig.id}
                      onClick={() => setSelectedSignalId(sig.id)}
                      className={cn(
                        "text-right p-3.5 rounded-2xl border text-xs font-bold transition-all flex flex-col justify-between gap-2 cursor-pointer h-24",
                        isSelected
                          ? "bg-sunny/5 text-sunny-deep border-sunny shadow-sm"
                          : "bg-white border-gray-100 text-gray-600 hover:border-sunny-deep/20 hover:bg-gray-50/50"
                      )}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="text-[9px] text-gray-400 font-bold bg-gray-100 px-2 py-0.5 rounded-lg">
                          {catInfo.icon} {catInfo.label}
                        </span>
                        {sig.isRedFlag && (
                          <span className="bg-red-100 text-red-600 text-[9px] px-2 py-0.5 rounded-lg font-black animate-pulse">
                            ⚠️ خطر پزشکی
                          </span>
                        )}
                      </div>
                      <span className="font-black text-gray-800 line-clamp-2 leading-relaxed">
                        {sig.name}
                      </span>
                    </button>
                  );
                })}

                {displayedSignals.length === 0 && (
                  <div className="col-span-2 text-center py-12 text-gray-400 font-bold text-xs">
                    هیچ نشانه‌ای در این دسته‌بندی یافت نشد.
                  </div>
                )}
              </div>
            </div>

            {/* Hint Box at bottom */}
            <div className="bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100 flex items-start gap-2.5 text-right mt-4">
              <Info size={14} className="text-gray-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-gray-500 leading-relaxed font-bold">
                شناخت صحیح زبان بدن به معنی اتصال مکانیکی یک حرکت به یک حس نیست. هر سیگنال باید در کانتکست (مانند محیط غریب، زمان غذا یا بازی) ارزیابی شود. نشانه‌های قرمز پزشکی هرگز نباید نادیده گرفته شوند.
              </p>
            </div>
          </Card>

          {/* Active Signal Details Container */}
          <AnimatePresence mode="wait">
            {selectedSignal ? (
              <motion.div
                key={selectedSignal.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-4"
              >
                <Card glow glowColor={selectedSignal.isRedFlag ? 'coral' : 'sunny'} className="bg-white border-sunny/10 p-6 space-y-5 shadow-lg">
                  <div className="flex justify-between items-start pb-3 border-b border-gray-100">
                    <div className="space-y-1">
                      <span className="text-[10px] text-sunny-deep font-black uppercase tracking-wider bg-sunny/10 px-2.5 py-1 rounded-full">
                        جزئیات و ارزیابی چندبعدی رفتارشناسی
                      </span>
                      <h4 className="font-black text-base text-gray-800 mt-2">{selectedSignal.name}</h4>
                    </div>
                    {selectedSignal.isRedFlag && (
                      <span className="bg-red-500 text-white text-[9px] px-2.5 py-1 rounded-full font-black tracking-wider animate-pulse uppercase">
                        🚨 اورژانس پزشکی
                      </span>
                    )}
                  </div>

                  {/* Scientific Description */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-gray-400 font-bold block">توصیف دقیق علمی نشانه:</span>
                    <p className="text-xs text-gray-600 leading-relaxed font-medium bg-gray-50 p-3 rounded-xl border border-gray-100">
                      {selectedSignal.description}
                    </p>
                  </div>

                  {/* Multi-Faceted Potential Interpretations */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] text-gray-400 font-bold block">احتمالات و معانی مختلف بر اساس محیط و شرایط:</span>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedSignal.possibleMeanings.map((m, idx) => (
                        <div key={idx} className="bg-sunny/5 p-3.5 rounded-xl border border-sunny/15 flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-xs text-sunny-deep">
                              معنی احتمالی {toPersian(idx + 1)}:
                            </span>
                            <span className={cn(
                              "text-[9px] px-2 py-0.5 rounded-md font-bold",
                              m.probabilityHint === 'high' ? "bg-green-100 text-green-700" :
                              m.probabilityHint === 'medium' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                            )}>
                              احتمال: {m.probabilityHint === 'high' ? 'بالا' : m.probabilityHint === 'medium' ? 'متوسط' : 'نیاز به پایش'}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-gray-700 leading-relaxed">{m.meaning}</p>
                          {m.contextRequired && (
                            <span className="text-[9px] text-gray-400 font-black">
                              📌 کانتکست الزامی: {m.contextRequired}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Red Flag Warning Box */}
                  {selectedSignal.isRedFlag && selectedSignal.redFlagDetails && (
                    <div className="bg-red-50 text-red-900 border border-red-200 rounded-xl p-4 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-black text-xs">
                        <AlertTriangle size={15} className="text-red-600" />
                        <span>منطق و جزئیات بالینی خطر:</span>
                      </div>
                      <p className="text-[11px] leading-relaxed font-bold text-red-800">{selectedSignal.redFlagDetails}</p>
                    </div>
                  )}

                  {/* Safety Advice */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                      <Clipboard size={14} className="text-coral" />
                      توصیه رفتاری و نحوه برخورد ایمن سرپرست (غیرتنبیهی):
                    </span>
                    <p className="text-xs text-coral-deep leading-relaxed font-black bg-coral/5 p-4 rounded-xl border border-coral-light/20">
                      {selectedSignal.safeResponseAdvice}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200 flex flex-col items-center justify-center space-y-4 shadow-inner"
              >
                <div className="w-12 h-12 rounded-full bg-sunny/5 flex items-center justify-center text-sunny">
                  <Eye size={24} className="animate-pulse" />
                </div>
                <div>
                  <p className="text-gray-500 font-black text-sm">آماده ارزیابی نشانه‌ها</p>
                  <p className="text-gray-400 text-xs mt-1">یک نشانه رفتاری را از دایرکتوری بالا انتخاب کنید تا جزئیات و توصیه‌های ایمنی آن نمایش داده شود.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* LEFT SIDE (5 cols): Logs, Observation Form & Assessments */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Observation Logging Card */}
          <Card glow glowColor="sunny" className="bg-white border-sunny/10 p-5 md:p-6 space-y-4 shadow-md">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Plus size={18} className="text-sunny-deep" />
                <h3 className="font-black text-gray-800 text-base">ثبت مشاهدات روزانه رفتاری</h3>
              </div>
              <button
                onClick={() => setShowObservationForm(!showObservationForm)}
                className="text-xs font-black text-sunny-deep hover:underline cursor-pointer"
              >
                {showObservationForm ? 'بستن فرم' : 'باز کردن فرم'}
              </button>
            </div>

            <AnimatePresence>
              {showObservationForm ? (
                <motion.form 
                  onSubmit={handleSaveObservation}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  {/* Select Context */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 font-bold block">محیط یا کانتکست مشاهده رفتاری:</label>
                    <select
                      value={formContext}
                      onChange={(e) => setFormContext(e.target.value as BehaviorContext)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold outline-none text-gray-700 focus:border-sunny"
                    >
                      {Object.entries(CONTEXT_LABELS).map(([ctx, label]) => (
                        <option key={ctx} value={ctx}>{label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Multi-Select Signals */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 font-bold block">نشانه‌های مشاهده شده (یک یا چند مورد):</label>
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto border border-gray-100 p-2.5 rounded-xl bg-gray-50/50">
                      {BEHAVIOR_LIBRARY.filter(s => s.species === activeSpeciesTab).map((sig) => {
                        const isChecked = formSelectedSignals.includes(sig.id);
                        return (
                          <button
                            type="button"
                            key={sig.id}
                            onClick={() => handleToggleFormSignal(sig.id)}
                            className={cn(
                              "w-full text-right p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between",
                              isChecked 
                                ? "bg-sunny/10 border-sunny text-sunny-deep" 
                                : "bg-white border-transparent text-gray-600 hover:bg-gray-100"
                            )}
                          >
                            <span>{sig.name}</span>
                            <div className={cn(
                              "w-4 h-4 rounded-md border flex items-center justify-center shrink-0",
                              isChecked ? "bg-sunny border-sunny text-white" : "border-gray-300 bg-white"
                            )}>
                              {isChecked && <Check size={10} strokeWidth={3} />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Text Notes */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 font-bold block">توضیحات تکمیلی یا یادداشت سرپرست:</label>
                    <textarea
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      placeholder="چه عامل محرک جدیدی وجود داشت؟ (مثلاً اسباب‌کشی، افراد غریبه یا صدای ترقه)"
                      rows={2}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold outline-none text-gray-700 placeholder:text-gray-400 focus:border-sunny resize-none"
                    />
                  </div>

                  {/* Honest Media Upload Component */}
                  <div className="space-y-2 border-t border-gray-100 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-400 font-bold block">ضمیمه کردن تصویر یا ویدیو رفتار:</span>
                      {formMediaUrl && (
                        <button
                          type="button"
                          onClick={handleClearMedia}
                          className="text-[9px] text-red-500 font-black hover:underline"
                        >
                          حذف ضمیمه
                        </button>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 border border-dashed border-gray-200 flex flex-col items-center justify-center gap-2.5 text-center relative overflow-hidden">
                      {formMediaUrl ? (
                        <div className="space-y-2 w-full flex flex-col items-center">
                          {formMediaType === 'image' ? (
                            <img 
                              src={formMediaUrl} 
                              alt="Uploaded behavior" 
                              className="w-32 h-20 object-cover rounded-xl shadow-inner border border-gray-200"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-32 h-20 bg-gray-900 rounded-xl flex items-center justify-center text-white relative">
                              <Play size={20} className="text-white fill-white animate-pulse" />
                              <span className="absolute bottom-1 right-1 text-[8px] bg-black/60 px-1 py-0.5 rounded text-gray-200">ویدیو ضمیمه شد</span>
                            </div>
                          )}
                          <span className="text-[10px] text-green-600 font-black flex items-center gap-1">
                            <CheckCircle2 size={12} />
                            فایل با موفقیت ضمیمه شد
                          </span>
                        </div>
                      ) : (
                        <>
                          <Camera size={24} className="text-gray-400" />
                          <div className="space-y-0.5">
                            <p className="text-[10px] text-gray-500 font-black">
                              برنامه تظاهر به فهم خودکار ویدیو با هوش مصنوعی نمی‌کند.
                            </p>
                            <p className="text-[9px] text-gray-400 font-bold max-w-sm leading-relaxed">
                              فایل ویدیویی یا عکس رفتار حیوان را آپلود کنید تا صرفاً ضمیمه خلاصه برای ارجاع حضوری به مربی یا دامپزشک شود.
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleSimulateMedia('image')}
                              className="py-1.5 px-3 rounded-lg bg-white border border-gray-200 text-[10px] font-black text-gray-600 hover:bg-gray-100 cursor-pointer"
                              disabled={isUploading}
                            >
                              📷 آپلود عکس
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSimulateMedia('video')}
                              className="py-1.5 px-3 rounded-lg bg-white border border-gray-200 text-[10px] font-black text-gray-600 hover:bg-gray-100 cursor-pointer"
                              disabled={isUploading}
                            >
                              🎥 آپلود ویدیو
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2.5 pt-2 border-t border-gray-100">
                    <Button
                      type="submit"
                      variant="sunny"
                      className="flex-1 py-2.5 font-black text-xs flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 size={14} />
                      <span>ثبت مشاهده رفتاری</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowObservationForm(false)}
                      className="py-2.5 px-4 text-xs font-bold"
                    >
                      انصراف
                    </Button>
                  </div>
                </motion.form>
              ) : (
                <div className="text-center py-5 bg-gray-50 rounded-2xl border border-dashed border-gray-200/80">
                  <p className="text-[11px] text-gray-400 font-bold">برای ثبت یک مشاهده رفتاری جدید از {profile.name}، روی دکمه زیر کلیک کنید.</p>
                  <button
                    onClick={() => setShowObservationForm(true)}
                    className="mt-3.5 py-2 px-4 rounded-xl bg-sunny text-white font-black text-xs shadow-md shadow-sunny/15 hover:bg-sunny-deep transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Plus size={14} />
                    <span>شروع ثبت مشاهده جدید</span>
                  </button>
                </div>
              )}
            </AnimatePresence>
          </Card>

          {/* Behavior Assessment Engine Trigger & Result */}
          <Card glow glowColor="coral" className="bg-white border-coral-light/10 p-5 md:p-6 space-y-4 shadow-md">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-coral" />
                <h3 className="font-black text-gray-800 text-base">سنجش ترکیبی و عارضه‌یابی جامع</h3>
              </div>
            </div>

            <div className="space-y-4 text-right">
              <p className="text-[11px] text-gray-500 leading-relaxed font-bold">
                سیستم سنجش هوشمند پت میت تمام مشاهدات ثبت‌شده اخیر را تحلیل کرده، ترکیب کانتکست‌های محیطی با چند نشانه را ارزیابی می‌کند و یک خلاصه بالینی به همراه گام‌های ایمنی غیرتنبیهی صادر می‌کند.
              </p>

              <button
                onClick={handleRunAssessment}
                disabled={petObservations.length === 0 || isAssessing}
                className={cn(
                  "w-full py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer",
                  petObservations.length === 0
                    ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed shadow-none"
                    : "bg-coral text-white hover:bg-coral-deep shadow-coral/15"
                )}
              >
                {isAssessing ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>در حال ارزیابی مشاهدات...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>تحلیل ترکیبی مشاهدات اخیر ({toPersian(petObservations.length)} مشاهده)</span>
                  </>
                )}
              </button>

              {petObservations.length === 0 && (
                <span className="text-[10px] text-red-500 font-bold block text-center mt-1">
                  * برای انجام سنجش دوره‌ای ابتدا باید یک یا چند مشاهده ثبت کنید.
                </span>
              )}
            </div>

            {/* Assessment Result Panel */}
            {petAssessments.length > 0 && (() => {
              const latestAssessment = petAssessments[0];
              return (
                <div className="mt-4 p-4.5 rounded-2xl bg-peach/20 border border-coral-light/15 space-y-4 text-right">
                  <div className="flex justify-between items-center border-b border-coral-light/10 pb-2">
                    <span className="font-black text-xs text-coral-deep flex items-center gap-1">
                      <FileText size={14} />
                      خلاصه نتیجه سنجش رفتاری پت میت
                    </span>
                    <button
                      onClick={() => deleteBehaviorAssessment(latestAssessment.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      title="حذف ارزیابی"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  {/* Findings */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-gray-400 font-bold block">یافته‌های رفتاری شناسایی شده:</span>
                    <ul className="space-y-1.5 text-xs text-gray-700 font-medium">
                      {latestAssessment.findings.map((f, idx) => (
                        <li key={idx} className="flex gap-1.5 items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-coral mt-1.5 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendation/Referral */}
                  {latestAssessment.vetReferralRecommended && (
                    <div className="p-3 bg-red-50 text-red-900 rounded-xl border border-red-200 space-y-1">
                      <span className="font-black text-[11px] block text-red-700">📌 توصیه دامپزشکی فعال شده است:</span>
                      <p className="text-[10px] leading-relaxed font-bold text-red-800">{latestAssessment.referralReason}</p>
                    </div>
                  )}

                  {/* Action Plan */}
                  <div className="space-y-1.5 pt-1 border-t border-coral-light/10">
                    <span className="text-[10px] text-gray-400 font-bold block">برنامه گام‌به‌گام اصلاحی و حمایتی:</span>
                    <ul className="space-y-1.5 text-xs text-gray-700 font-medium">
                      {latestAssessment.actionPlan.map((ap, idx) => (
                        <li key={idx} className="flex gap-1.5 items-start bg-white/70 p-2 rounded-lg border border-gray-100">
                          <CheckCircle2 size={12} className="text-green-600 shrink-0 mt-0.5" />
                          <span className="leading-relaxed text-[11px] font-bold text-gray-800">{ap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })()}
          </Card>

          {/* History Log Panel */}
          <Card className="bg-white border-gray-100 p-5 md:p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="font-black text-gray-800 text-sm">تاریخچه مشاهدات ثبت‌شده</span>
              <span className="bg-sunny/20 text-sunny-deep text-[10px] px-2 py-0.5 rounded-full font-black">
                {toPersian(petObservations.length)} مورد
              </span>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {petObservations.map((obs) => {
                const signalsInfo = BEHAVIOR_LIBRARY.filter(s => obs.signals.includes(s.id));
                const ctxLabel = CONTEXT_LABELS[obs.context];
                return (
                  <div key={obs.id} className="p-3.5 bg-gray-50/50 rounded-2xl border border-gray-100 text-right space-y-2 relative overflow-hidden group">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] text-gray-400 font-bold">
                        {toPersian(new Date(obs.observedAt).toLocaleDateString('fa-IR'))}
                      </span>
                      <button
                        onClick={() => deleteBehaviorObservation(obs.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="حذف مشاهده"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <div className="text-[10px] text-sunny-deep font-black">
                      📍 کانتکست: {ctxLabel}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {signalsInfo.map(sig => (
                        <span key={sig.id} className="text-[10px] bg-white border border-gray-100 text-gray-700 px-2 py-1 rounded-xl font-bold">
                          {sig.isRedFlag ? '⚠️ ' : ''}{sig.name}
                        </span>
                      ))}
                    </div>

                    {obs.notes && (
                      <p className="text-[10px] text-gray-500 font-bold bg-white p-2 rounded-lg border border-gray-100 leading-relaxed">
                        {obs.notes}
                      </p>
                    )}

                    {obs.mediaUrl && (
                      <div className="flex items-center gap-1.5 mt-2 bg-white/80 p-2 rounded-xl border border-gray-100/60 w-fit">
                        {obs.mediaType === 'image' ? (
                          <img 
                            src={obs.mediaUrl} 
                            alt="Observation attachment" 
                            className="w-12 h-10 object-cover rounded-lg border border-gray-100"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-12 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white">
                            <Play size={10} className="fill-white" />
                          </div>
                        )}
                        <span className="text-[9px] text-gray-400 font-black">فایل ضمیمه رفتاری</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {petObservations.length === 0 && (
                <div className="text-center py-12 text-gray-400 font-bold text-xs">
                  هیچ مشاهده رفتاری برای {profile.name} ثبت نشده است.
                </div>
              )}
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
}

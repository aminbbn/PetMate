import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  BrainCircuit, 
  HeartPulse, 
  Apple, 
  Compass, 
  MessageSquareCode,
  Radio
} from 'lucide-react';

type ToolId = 'triage' | 'nutrition' | 'behavior' | 'training';

interface ToolDetails {
  id: ToolId;
  label: string;
  shortLabel: string;
  title: string;
  desc: string;
  icon: React.ComponentType<any>;
  userQuery: string;
  aiResponse: string;
  diagnosticMetric: string;
  diagnosticValue: string;
  diagnosticColor: string;
}

export const AIFeaturesSection: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<ToolId>('triage');

  const tools: ToolDetails[] = [
    {
      id: 'triage',
      label: 'تریاژ فوریت‌های پزشکی',
      shortLabel: 'تریاژ',
      title: 'سیستم تریاژ بالینی و عارضه‌یاب آنی',
      desc: 'با شرح علائمی چون امتناع از غذا، لرزش یا تغییر ریتم تنفس پت، سیستم هوشمند فوری پت میت درصد خطر را بر اساس الگوهای اورژانسی سنجیده و کارهای حیاتی تا رسیدن به دامپزشکی را ارائه می‌دهد.',
      icon: HeartPulse,
      userQuery: 'پت من از صبح لرزش داره، غذا نخورده و گوشه‌گیر شده. آیا اورژانسیه؟',
      aiResponse: 'تحلیل تریاژ متوسط متمایل به زرد (مراقبت خانگی دقیق با حساسیت بالا):\n۱. دمای لثه‌ها را پایش کنید؛ لثه‌های صورتی کم‌رنگ یا مایل به سفید یعنی کاهش اکسیژن خون.\n۲. آب را در حجم‌های بسیار کم در اختیارش بگذارید.\n۳. از وارد کردن هرگونه استرس صوتی یا سرمایی خودداری کنید.\nدر صورت افزایش دفعات تشنج یا ناتوانی در حرکت، فوراً به اورژانس مراجعه کنید.',
      diagnosticMetric: 'Clinical Urgency Index',
      diagnosticValue: 'LVL 3 / MODERATE',
      diagnosticColor: 'text-amber-500'
    },
    {
      id: 'nutrition',
      label: 'برنامه‌ریز و مهندس تغذیه',
      shortLabel: 'تغذیه',
      title: 'مهندسی جیره غذایی و بهداشت پوستی',
      desc: 'بسته به نژاد، سن، وضعیت عقیم‌سازی و میزان فعالیت روزانه پت، سیستم حجم دقیق کالری، پروتئین، فیبر و جایگزین‌های ضد حساسیت غذایی را طراحی می‌کند.',
      icon: Apple,
      userQuery: 'گربه من پرشین ۵ ساله عقیم شده است و موهایش کدر شده و ریزش شدیدی دارد.',
      aiResponse: 'تحلیل تخصصی بهداشت تغذیه پوست:\n۱. جیره غذایی را به پروتئین خالص حیوانی با آلرژی‌پذیری پایین (مانند گوشت اردک یا بوقلمون) تغییر دهید.\n۲. از مکمل‌های اختصاصی حاوی اسیدهای چرب امگا ۳ و امگا ۶ به میزان روزانه ۲ قطره استفاده کنید.\n۳. به طور جدی حجم کربوهیدرات‌های غذای فله‌ای را کاهش دهید.\n۴. روزانه حداقل ۳۰ میلی‌لیتر آب تازه در ظروف سرامیکی تمیز برای او فراهم کنید تا کلیه‌ها شاداب بمانند.',
      diagnosticMetric: 'Omega Acid Ratio Recommendation',
      diagnosticValue: '8.4:1 ENHANCED',
      diagnosticColor: 'text-emerald-500'
    },
    {
      id: 'behavior',
      label: 'آنالیز زبان بدن و روان',
      shortLabel: 'رفتار',
      title: 'رمزگشای عواطف و نشانه‌های بیولوژیک',
      desc: 'حرکات دم، کشیدگی گوش‌ها، زوزه‌ها یا میو‌های مقطع پت را شرح دهید تا متوجه پیام عاطفی پنهانی او (مانند تحریک عصبی، ترس، شادی عمیق یا نیاز به تعامل) شوید.',
      icon: MessageSquareCode,
      userQuery: 'وقتی سگم رو نوازش می‌کنم، دمش رو به صورت افقی تکان میده اما چشم‌هاش گشاد میشه و سرش رو متمایل به عقب می‌کنه.',
      aiResponse: 'تفسیر روان‌شناختی رفتار پت:\nخلاف تصور عموم، تکان دادن دم همیشه نشانه شادی نیست. تکان دادن افقی دم همراه با سفتی مفاصل گردن و گشاد شدن مردمک چشم، نشانه تحریک عصبی بیش از حد (Overstimulation) یا هشدار ملایم است. \nتوصیه: برای چند دقیقه نوازش را متوقف کرده و به او اجازه دهید در فضای دنج خود ریلکس کند.',
      diagnosticMetric: 'Autonomic Stimulation Index',
      diagnosticValue: '72% HYPER-ACTIVE',
      diagnosticColor: 'text-orange-500'
    },
    {
      id: 'training',
      label: 'مربی شخصی و اصلاح ناهنجاری',
      shortLabel: 'تمرین',
      title: 'رفع اضطراب تنهایی و تکنیک‌های تربیت',
      desc: 'تربیت علمی با تکنیک‌های تشویقی معتبر. برطرف کردن مشکلات همه‌گیر مثل کشیدن قلاده، پارس ممتد پشت در، یا اضطراب شدید خروج سرپرست از خانه.',
      icon: Compass,
      userQuery: 'وقتی خانه را ترک می‌کنم، همسایه‌ها می‌گویند سگم مدام ناله و زوزه می‌کشد و درب خانه را زخمی می‌کند.',
      aiResponse: 'پروتکل رفع اضطراب تنهایی (Separation Anxiety):\n۱. خروج‌های صوری بدون خداحافظی سوزناک یا برانگیختن هیجان پت را آغاز کنید (مثلاً کفش بپوشید اما بیرون نروید).\n۲. خروج‌های واقعی را از دفعات بسیار کوتاه (۳۰ ثانیه) شروع کرده و تدریجی افزایش دهید.\n۳. یک اسباب‌بازی جویدنی پلاستیکی مقاوم حاوی تشویقی یا ماست منجمد بگذارید تا زمان ترک، ذهن او را آرام کند.',
      diagnosticMetric: 'Stress Threshold Metric',
      diagnosticValue: 'MIN OVERLAP / 15 MIN',
      diagnosticColor: 'text-cyan-500'
    }
  ];

  const activeTool = tools.find(t => t.id === selectedTool) || tools[0];
  const IconComponent = activeTool.icon;

  return (
    <section id="ai" className="relative py-32 bg-[#0B0F19] text-white overflow-hidden" dir="rtl">
      
      {/* Deep Luxury Atmosphere Glowing Backdrops */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-coral/15 rounded-full blur-[140px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[55vw] h-[55vw] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-blue/5 rounded-full blur-[180px] pointer-events-none mix-blend-screen" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-dot-grid opacity-[0.06] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-16">
        
        {/* HEADER: Large Editorial Title */}
        <div className="max-w-4xl text-right space-y-5">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-coral font-bold text-xs">
            <BrainCircuit className="w-4 h-4 text-coral" />
            <span>فناوری بر لبه صمیمیت و سلامت</span>
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            هوش مصنوعی مجهز به <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-coral via-coral-light to-sunny">بینش و تخصص بالینی</span>
          </h2>

          <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl font-normal">
            با پردازش هم‌زمان هزاران رفرنس دامپزشکی و بیولوژی، پت میت مربی و دستیار درمانی آنلاین شماست تا هر دگرگونی پنهان در سلامت او را فوراً شناسایی کنید.
          </p>
        </div>

        {/* LARGE IMMERSIVE STAGE CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* COMPACT VERTICAL TOOL SELECTOR (Takes 3 cols on desktop) */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-none">
            {tools.map((tool) => {
              const ToolIcon = tool.icon;
              const isSelected = selectedTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className={`flex items-center gap-4 px-5 py-4.5 rounded-[22px] font-black text-xs md:text-sm text-right transition-all duration-300 cursor-pointer border shrink-0 lg:shrink w-auto lg:w-full ${
                    isSelected
                      ? 'bg-white/[0.07] border-coral/30 text-coral shadow-lg shadow-coral/5 -translate-x-1 lg:-translate-x-2'
                      : 'bg-white/[0.02] border-transparent text-gray-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className={`p-2 rounded-xl transition-all duration-300 ${
                    isSelected ? 'bg-coral text-white scale-110 shadow-md shadow-coral/20' : 'bg-white/[0.05] text-gray-500'
                  }`}>
                    <ToolIcon size={18} />
                  </div>
                  <div className="text-right">
                    <span className="block font-black leading-none">{tool.label}</span>
                    <span className="hidden lg:block text-[9px] text-gray-500 font-bold mt-1.5">انتخاب ابزار هوشمند</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* DYNAMIC AI PLAYGROUND STAGE (Takes 9 cols on desktop) */}
          <div className="lg:col-span-9 bg-white/[0.01] border border-white/[0.07] backdrop-blur-xl p-6 md:p-10 rounded-[36px] shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[460px]">
            
            {/* Waveform Diagnostic subtle visual pattern */}
            <div className="absolute top-4 left-6 hidden md:flex items-center gap-2.5 bg-white/[0.03] border border-white/[0.05] py-2 px-3.5 rounded-xl z-20">
              <span className="text-[9px] font-mono font-black text-coral uppercase tracking-wider">Computational Core</span>
              <div className="flex items-end gap-0.5 h-4 w-12">
                <span className="w-0.5 h-2.5 bg-coral rounded-full" />
                <span className="w-0.5 h-4 bg-coral rounded-full" />
                <span className="w-0.5 h-1 bg-coral rounded-full" />
                <span className="w-0.5 h-3.5 bg-coral rounded-full" />
                <span className="w-0.5 h-2 bg-coral rounded-full" />
              </div>
            </div>

            {/* Dynamic Status / Signal Indicator */}
            <div className="flex items-center gap-2 border-b border-white/[0.06] pb-5 mb-6">
              <div className="relative">
                <span className="absolute -inset-1 rounded-full bg-emerald-500/40 animate-ping pointer-events-none" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative z-10" />
              </div>
              <span className="text-[10px] font-bold text-gray-400">تراکنش ایمن • همگام با دیتابیس بالینی دانشگاه مونیخ</span>
            </div>

            {/* Animated Content Scene Area using AnimatePresence */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedTool}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start text-right"
                >
                  
                  {/* Tool Metadata Explainer (5 cols) */}
                  <div className="md:col-span-5 space-y-4">
                    <span className="text-[10px] font-black tracking-widest text-coral uppercase bg-coral/10 px-3.5 py-1 rounded-lg">
                      دستیار هوشمند: {activeTool.shortLabel}
                    </span>
                    <h3 className="text-2xl font-black text-white leading-tight">
                      {activeTool.title}
                    </h3>
                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed font-normal">
                      {activeTool.desc}
                    </p>

                    {/* Technical Diagnostic details */}
                    <div className="pt-4 space-y-2">
                      <div className="text-[9px] font-black text-gray-500 uppercase tracking-wider">سنسور کالیبراسیون</div>
                      <div className="bg-white/[0.03] border border-white/[0.05] p-3 rounded-xl flex items-center justify-between text-xs">
                        <span className="text-gray-400 font-bold">{activeTool.diagnosticMetric}</span>
                        <span className={`font-mono font-black ${activeTool.diagnosticColor}`}>
                          {activeTool.diagnosticValue}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* High-Fidelity Conversation Window Simulation (7 cols) */}
                  <div className="md:col-span-7 bg-[#101625] border border-white/[0.05] p-5 rounded-3xl space-y-4 flex flex-col justify-between shadow-inner relative">
                    
                    {/* Chat Bubble user */}
                    <div className="space-y-1.5 self-start w-full max-w-[90%]">
                      <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">پرسش سرپرست حیوان</div>
                      <div className="p-3.5 rounded-[22px] rounded-tr-none bg-white/[0.04] text-gray-200 text-xs leading-relaxed font-medium">
                        {activeTool.userQuery}
                      </div>
                    </div>

                    {/* Divider dotted style */}
                    <div className="border-t border-dashed border-white/[0.06] my-2" />

                    {/* Chat Bubble AI */}
                    <div className="space-y-1.5 self-end w-full max-w-[95%]">
                      <div className="text-[9px] font-black text-coral uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-coral" />
                        <span>پاسخ تشخیصی پت میت هوشمند</span>
                      </div>
                      <div className="p-4 rounded-[22px] rounded-tl-none bg-gradient-to-b from-coral/15 to-coral/[0.02] border border-coral-light/10 text-white text-xs leading-relaxed font-medium whitespace-pre-line">
                        {activeTool.aiResponse}
                      </div>
                    </div>

                    {/* Glowing background inside chat */}
                    <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 bg-coral/10 rounded-full blur-[40px] pointer-events-none" />
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>

            {/* SAFETY STATEMENT: Non-negotiable medical disclaimer */}
            <div className="mt-8 pt-5 border-t border-white/[0.06] flex flex-col sm:flex-row items-center gap-4 text-right">
              <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.05] text-coral flex items-center justify-center shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div className="flex-1">
                <span className="block text-[10px] font-black text-coral">سلب مسئولیت مهم و خط‌مشی بهداشتی:</span>
                <p className="text-[10px] text-gray-400 leading-relaxed font-normal mt-0.5">
                  پاسخ‌های تحلیلی هوش مصنوعی صرفاً نقش تریاژ اولیه، بررسی‌های تشخیصی زمانی و آموزش رفتارشناسی را دارند. این خروجی‌ها تحت هیچ عنوان نباید مبنای درمان‌های کلینیکی یا دارویی خودسرانه قرار بگیرند و مراجعه به دامپزشکان معتبر متخصص در زمان‌های بحرانی همواره الزامی است.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default AIFeaturesSection;

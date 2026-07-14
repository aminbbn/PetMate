import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useAppStore } from './store';
import { AnimatePresence } from 'motion/react';
import { Sidebar } from './components/sidebar';

// Pages
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import HealthRecord from './pages/HealthRecord';
import Triage from './pages/Triage';
import Growth from './pages/Growth';
import Reminders from './pages/Reminders';
import Coach from './pages/Coach';
import Navigator from './pages/Navigator';
import Vets from './pages/Vets';
import Shop from './pages/Shop';
import Nutrition from './pages/Nutrition';
import Translator from './pages/Translator';
import SettingsPage from './pages/Settings';

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFFDFB] flex font-sans text-gray-800" dir="rtl">
      {/* Sidebar on Right side in RTL (using border-l) */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen bg-gradient-to-b from-[#FFFDFB] via-[#FFFBF9] to-[#FFF7F4] flex flex-col relative overflow-x-hidden">
        {/* Warm ambient background glows */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-coral-light rounded-full blur-[120px] pointer-events-none" style={{ opacity: 0.03 }} />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-sunny rounded-full blur-[100px] pointer-events-none" style={{ opacity: 0.03 }} />
        
        <div className="flex-1 flex flex-col relative z-10 p-4 md:p-8 pt-18 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function AppContent() {
  const profile = useAppStore(state => state.profile);
  const location = useLocation();

  if (!profile) {
    return <Onboarding />;
  }

  return (
    <MainLayout>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/health" element={<HealthRecord />} />
          <Route path="/growth" element={<Growth />} />
          <Route path="/triage" element={<Triage />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/coach" element={<Coach />} />
          <Route path="/navigator" element={<Navigator />} />
          <Route path="/vets" element={<Vets />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/translator" element={<Translator />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AnimatePresence>
    </MainLayout>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

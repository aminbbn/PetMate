import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Heart, Sparkles, LogIn } from 'lucide-react';
import { Button } from '../Button';

interface LandingNavbarProps {
  onGetStarted: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onGetStarted }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'امکانات رفاهی', href: '#capabilities' },
    { label: 'هوش مصنوعی', href: '#ai' },
    { label: 'مراقبت روزانه', href: '#workflow' },
    { label: 'خدمات شهری', href: '#services' },
    { label: 'درباره پتمیت', href: '#trust' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#FFFDFB]/80 backdrop-blur-md border-b border-coral-light/10 shadow-warm-sm py-3'
            : 'bg-transparent py-5'
        }`}
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-coral rounded-xl flex items-center justify-center text-white shadow-md shadow-coral/20 relative group hover:rotate-6 transition-all duration-300">
              <Heart className="w-5 h-5 fill-current" />
              <div className="absolute -top-1 -left-1 bg-sunny text-white p-0.5 rounded-md text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">
                <Sparkles className="w-2.5 h-2.5" />
              </div>
            </div>
            <span className="font-black text-2xl tracking-tight text-gray-900 font-sans">
              پت<span className="text-coral">میت</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-sm font-bold text-gray-600 hover:text-coral transition-colors duration-200 relative group py-2"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-coral origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </a>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onGetStarted}
              className="border-coral/15 text-coral hover:bg-coral/5 font-bold text-xs h-10 px-5 flex items-center gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span>ورود</span>
            </Button>
            <Button
              size="sm"
              onClick={onGetStarted}
              className="bg-coral hover:bg-coral-deep shadow-md hover:shadow-lg hover:shadow-coral/10 font-bold text-xs h-10 px-6"
            >
              شروع رایگان
            </Button>
          </div>

          {/* Mobile Hamburguer Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-coral/5 text-gray-700 hover:bg-coral/10 transition-colors focus:outline-none"
              aria-label="منوی موبایل"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </motion.nav>

      {/* Mobile Menu Backdrop & Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed top-0 bottom-0 left-0 right-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
            />

            {/* Menu drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 bottom-0 right-0 w-4/5 max-w-sm bg-[#FFFDFB] shadow-2xl z-50 p-8 flex flex-col justify-between border-l border-coral-light/10 lg:hidden"
              dir="rtl"
            >
              <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-coral rounded-lg flex items-center justify-center text-white">
                      <Heart className="w-4 h-4 fill-current" />
                    </div>
                    <span className="font-bold text-xl text-gray-900">پتمیت</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Links */}
                <div className="flex flex-col gap-4">
                  {menuItems.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-base font-bold text-gray-700 hover:text-coral transition-colors py-3 border-b border-gray-100"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-6 border-t border-gray-100">
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onGetStarted();
                  }}
                  className="w-full py-4 bg-coral hover:bg-coral-deep font-bold"
                >
                  شروع رایگان
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onGetStarted();
                  }}
                  className="w-full py-4 border-coral/15 text-coral hover:bg-coral/5 font-bold"
                >
                  ورود به حساب کاربری
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

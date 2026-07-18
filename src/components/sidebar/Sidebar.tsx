import React, { useEffect, useState, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAppStore } from '../../store';
import { useSidebarState } from './useSidebarState';
import { DIRECT_ITEMS, SIDEBAR_CATEGORIES } from './sidebarConfig';
import { SidebarNavItem } from './SidebarNavItem';
import { SidebarHeader } from './SidebarHeader';
import { SidebarPetSelector } from './SidebarPetSelector';
import { SidebarCategory } from './SidebarCategory';
import { SidebarFooterCollapse } from './SidebarFooterCollapse';
import { SidebarCategoryId, SidebarMode } from './sidebarTypes';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Menu } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    isCollapsed,
    isMobileOpen,
    isMobile,
    toggleCollapse,
    toggleMobileOpen,
    closeMobile
  } = useSidebarState();

  const location = useLocation();
  const profile = useAppStore(state => state.profile);

  // Accordion open category state
  const [openCategoryId, setOpenCategoryId] = useState<SidebarCategoryId | null>(() => {
    const currentPath = location.pathname;
    for (const cat of SIDEBAR_CATEGORIES) {
      if (cat.items.some(item => item.path === currentPath)) {
        return cat.id;
      }
    }
    try {
      const saved = sessionStorage.getItem('petmate-active-category');
      if (saved) return saved as SidebarCategoryId;
    } catch {}
    return null;
  });

  // Centralized flyout open state for collapsed mode
  const [openFlyoutCategoryId, setOpenFlyoutCategoryId] = useState<SidebarCategoryId | null>(null);

  // Close open flyout on location changes or collapse state toggles
  useEffect(() => {
    setOpenFlyoutCategoryId(null);
  }, [location.pathname, isCollapsed]);

  // Automatically expand category when route changes to one of its children
  useEffect(() => {
    const currentPath = location.pathname;
    let foundCategory: SidebarCategoryId | null = null;
    for (const cat of SIDEBAR_CATEGORIES) {
      if (cat.items.some(item => item.path === currentPath)) {
        foundCategory = cat.id;
        break;
      }
    }
    if (foundCategory) {
      setOpenCategoryId(foundCategory);
      try {
        sessionStorage.setItem('petmate-active-category', foundCategory);
      } catch {}
    }
  }, [location.pathname]);

  // Handle ESC key to close mobile drawer
  useEffect(() => {
    if (!isMobileOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMobile();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, closeMobile]);

  // Focus trap for mobile drawer (accessibility)
  const drawerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isMobileOpen && drawerRef.current) {
      const focusableElements = drawerRef.current.querySelectorAll(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [isMobileOpen]);

  const handleToggleCategory = (catId: SidebarCategoryId) => {
    setOpenCategoryId(prev => {
      const next = prev === catId ? null : catId;
      try {
        if (next) {
          sessionStorage.setItem('petmate-active-category', next);
        } else {
          sessionStorage.removeItem('petmate-active-category');
        }
      } catch {}
      return next;
    });
  };

  const getSidebarMode = (isDrawer = false): SidebarMode => {
    if (isMobile || isDrawer) return 'mobile';
    return isCollapsed ? 'collapsed' : 'expanded';
  };

  // Main Sidebar Content (shared between Desktop and Mobile)
  const renderSidebarContent = (isDrawer = false) => {
    const currentMode = getSidebarMode(isDrawer);
    const isActuallyCollapsed = currentMode === 'collapsed';

    return (
      <div className="flex flex-col h-full justify-between select-none">
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <SidebarHeader
            isCollapsed={isActuallyCollapsed}
            isMobile={isDrawer}
            onCloseMobile={closeMobile}
          />

          {/* Pet switcher profile card */}
          {profile && (
            <div className="mb-4">
              <SidebarPetSelector
                isCollapsed={isActuallyCollapsed}
                onNavigate={isDrawer ? closeMobile : undefined}
              />
            </div>
          )}

          {/* Main Navigation Scroll Area */}
          <nav 
            aria-label="ناوبری اصلی" 
            className="flex-1 overflow-y-auto pr-0.5 pl-0.5 py-2 space-y-4 scrollbar-thin"
          >
            {/* Direct items (like Home / "خانه") - always visible, never grouped */}
            <div className="space-y-1">
              {DIRECT_ITEMS.map(item => (
                <SidebarNavItem
                  key={item.path}
                  icon={item.icon}
                  path={item.path}
                  label={item.label}
                  isCollapsed={isActuallyCollapsed}
                  onClick={isDrawer ? closeMobile : undefined}
                />
              ))}
            </div>

            {/* Expandable Categories Accordion */}
            <div className="space-y-2">
              {SIDEBAR_CATEGORIES.map(category => {
                const containsActive = category.items.some(item => location.pathname === item.path);
                
                return (
                  <SidebarCategory
                    key={category.id}
                    id={category.id}
                    label={category.label}
                    icon={category.icon}
                    items={category.items}
                    isOpen={openCategoryId === category.id}
                    containsActiveRoute={containsActive}
                    onToggle={currentMode === 'mobile' ? (isDrawer ? closeMobile : undefined) as any : handleToggleCategory}
                    sidebarMode={currentMode}
                    isFlyoutOpen={openFlyoutCategoryId === category.id}
                    onFlyoutOpen={(id) => setOpenFlyoutCategoryId(id)}
                    onFlyoutClose={(id) => {
                      if (openFlyoutCategoryId === id) {
                        setOpenFlyoutCategoryId(null);
                      }
                    }}
                  />
                );
              })}
            </div>
          </nav>
        </div>

        {/* Footer Sidebar Collapse - ONLY visible on persistent desktop sidebar */}
        {!isDrawer && !isMobile && (
          <div className="pt-3 border-t border-gray-100 shrink-0">
            <SidebarFooterCollapse
              isCollapsed={isCollapsed}
              onToggle={toggleCollapse}
            />
          </div>
        )}
      </div>
    );
  };

  // --- MOBILE LAYOUT ---
  if (isMobile) {
    return (
      <>
        {/* Mobile Top Header Navigation */}
        <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-md border-b border-coral-light/10 flex items-center justify-between px-4 z-30 shadow-sm" dir="rtl">
          <div className="flex items-center gap-3">
            {/* Hamburger button */}
            <button
              onClick={toggleMobileOpen}
              className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-coral hover:bg-peach/10 rounded-xl transition-all cursor-pointer outline-none"
              aria-expanded={isMobileOpen}
              aria-label="منوی ناوبری"
            >
              <Menu size={22} strokeWidth={2.5} />
            </button>
            
            <Link to="/" className="text-base font-black text-coral-deep select-none">
              پت میت
            </Link>
          </div>

          {/* Active Pet shortcut */}
          {profile && (
            <Link to="/settings" className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-peach/5 active:scale-[0.98] transition-all">
              <span className="text-xs font-black text-gray-700 select-none">
                {profile.name}
              </span>
              <div className="w-8 h-8 bg-gradient-to-br from-sunny/10 to-coral/10 rounded-lg flex items-center justify-center text-base shadow-inner">
                {profile.type === 'dog' ? '🐶' : '🐱'}
              </div>
            </Link>
          )}
        </header>

        {/* Off-canvas mobile drawer */}
        <AnimatePresence>
          {isMobileOpen && (
            <>
              {/* Backing scrim */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={closeMobile}
                className="fixed inset-0 bg-black/40 backdrop-blur-[1.5px] z-40 cursor-pointer"
                aria-hidden="true"
              />

              {/* Drawer panel */}
              <motion.div
                ref={drawerRef}
                role="dialog"
                aria-modal="true"
                aria-label="منوی برنامه"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 26, stiffness: 220 }}
                className="fixed top-0 bottom-0 right-0 w-[290px] bg-white shadow-2xl z-50 flex flex-col p-5"
                dir="rtl"
              >
                <div className="h-full pt-2">
                  {renderSidebarContent(true)}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // --- DESKTOP LAYOUT ---
  return (
    <aside 
      className={cn(
        "h-screen bg-white border-l border-coral-light/20 flex flex-col justify-between shrink-0 z-40 sticky top-0 shadow-[4px_0_24px_rgba(232,90,93,0.01)] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]",
        isCollapsed ? "w-20 px-3 py-5" : "w-80 p-5"
      )} 
      dir="rtl"
    >
      {renderSidebarContent(false)}
    </aside>
  );
};

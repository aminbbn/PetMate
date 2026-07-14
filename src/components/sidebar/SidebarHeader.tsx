import React from 'react';
import { Heart, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { useMotionPreferences } from '../../motion/useMotionPreferences';
import { SidebarSettingsButton } from './SidebarSettingsButton';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  isMobile = false,
  onCloseMobile
}) => {
  const { reducedMotion } = useMotionPreferences();

  // Mobile Drawer Header
  if (isMobile) {
    return (
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4 shrink-0 relative" dir="rtl">
        {/* Right side: Brand Logo & Text */}
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 bg-coral rounded-xl flex items-center justify-center text-white shadow-md shadow-coral/20 shrink-0">
            <Heart size={20} className="text-white animate-[pulse_2s_infinite]" fill="currentColor" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col text-right select-none whitespace-nowrap">
            <h1 className="text-sm font-black text-coral-deep tracking-tight">پت میت</h1>
            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">همراه هوشمند حیوان خانگی</p>
          </div>
        </div>

        {/* Left side: Settings & Dedicated Close button */}
        <div className="flex items-center gap-2">
          <SidebarSettingsButton isCollapsed={false} onClick={onCloseMobile} />
          <button
            onClick={onCloseMobile}
            className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-coral hover:bg-peach/10 transition-all cursor-pointer outline-none"
            aria-label="بستن منو"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    );
  }

  // Desktop Header
  return (
    <div className={cn(
      "border-b border-gray-100 pb-4 mb-4 shrink-0 transition-all duration-300 relative",
      isCollapsed ? "flex flex-col items-center gap-3" : "flex items-center justify-between"
    )}>
      {/* Brand logo tile */}
      <div className="flex items-center gap-3 overflow-hidden">
        <motion.div 
          whileHover={!reducedMotion ? { scale: 1.05 } : undefined}
          whileTap={!reducedMotion ? { scale: 0.95 } : undefined}
          className="w-10 h-10 bg-coral rounded-xl flex items-center justify-center text-white shadow-md shadow-coral/20 shrink-0 cursor-default"
        >
          <Heart size={20} className={cn("text-white", !reducedMotion && "animate-[pulse_2s_infinite]")} fill="currentColor" strokeWidth={2.5} />
        </motion.div>

        {/* Brand labels */}
        {!isCollapsed && (
          <div className="flex flex-col text-right select-none whitespace-nowrap">
            <h1 className="text-base font-black text-coral-deep tracking-tight flex items-center gap-1">
              پت میت
            </h1>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">همراه هوشمند حیوان خانگی</p>
          </div>
        )}
      </div>

      {/* Settings Button replaces old collapse button in header */}
      <SidebarSettingsButton isCollapsed={isCollapsed} />
    </div>
  );
};

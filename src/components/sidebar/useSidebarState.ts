import { useState, useEffect } from 'react';

export function useSidebarState() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('petmate-sidebar-collapsed');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768; // 'md' breakpoint
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileOpen(false); // Close drawer if resizing to desktop
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('petmate-sidebar-collapsed', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save sidebar collapse state', e);
      }
      return next;
    });
  };

  const toggleMobileOpen = () => {
    setIsMobileOpen(prev => !prev);
  };

  const closeMobile = () => {
    setIsMobileOpen(false);
  };

  return {
    isCollapsed,
    isMobileOpen,
    isMobile,
    toggleCollapse,
    toggleMobileOpen,
    closeMobile
  };
}

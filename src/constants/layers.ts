// Centralized z-index layering architecture for Pet Mate

export const APP_LAYERS = {
  base: 0,
  stickyHeader: 10,
  navigation: 20,
  sidebar: 40,
  mobileDrawerBackdrop: 40,
  mobileDrawerContent: 50,
  
  // Modals & Dialogs (Must render over absolutely everything, including sidebars and navigation)
  modalBackdrop: 1000,
  modalContent: 1010,
  
  // Toast notifications (Render above modals)
  toast: 2000,
};

import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface SidebarItem {
  icon: LucideIcon;
  path: string;
  label: string;
  isAi?: boolean;
}

export type SidebarCategoryId = 'daily-care' | 'services' | 'smart-guides';

export interface SidebarCategoryConfig {
  id: SidebarCategoryId;
  label: string;
  icon: LucideIcon;
  isAi?: boolean;
  items: SidebarItem[];
}

export type SidebarMode = 'expanded' | 'collapsed' | 'mobile';

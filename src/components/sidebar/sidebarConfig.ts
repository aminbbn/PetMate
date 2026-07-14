import { 
  Home, 
  Calendar, 
  Stethoscope, 
  LineChart, 
  Map, 
  Phone, 
  ShoppingBag, 
  Bot, 
  Utensils, 
  Smile, 
  Award,
  CalendarDays,
  Compass,
  Sparkles
} from 'lucide-react';
import { SidebarItem, SidebarCategoryConfig } from './sidebarTypes';

export const DIRECT_ITEMS: SidebarItem[] = [
  { icon: Home, path: '/', label: 'خانه' }
];

export const SIDEBAR_CATEGORIES: SidebarCategoryConfig[] = [
  {
    id: 'daily-care',
    label: 'مراقبت روزانه',
    icon: CalendarDays,
    items: [
      { icon: Calendar, path: '/reminders', label: 'یادآورها و برنامه‌ها' },
      { icon: Stethoscope, path: '/health', label: 'پرونده سلامت' },
      { icon: LineChart, path: '/growth', label: 'روند وزن / رشد حیوان' }
    ]
  },
  {
    id: 'services',
    label: 'خدمات و ارتباط',
    icon: Compass,
    items: [
      { icon: Map, path: '/navigator', label: 'مسیریاب خدمات' },
      { icon: Phone, path: '/vets', label: 'دامپزشکان من' },
      { icon: ShoppingBag, path: '/shop', label: 'فروشگاه پت میت' }
    ]
  },
  {
    id: 'smart-guides',
    label: 'راهنماهای هوشمند',
    icon: Sparkles,
    isAi: true,
    items: [
      { icon: Bot, path: '/triage', label: 'دستیار سلامت', isAi: true },
      { icon: Utensils, path: '/nutrition', label: 'تغذیه و برنامه غذا', isAi: true },
      { icon: Smile, path: '/translator', label: 'راهنمای رفتار', isAi: true },
      { icon: Award, path: '/coach', label: 'تمرین و آموزش', isAi: true }
    ]
  }
];

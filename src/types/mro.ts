export type Category = 
  | 'ALL WIP COMP'
  | 'MECHANICAL'
  | 'SAFETY COMPONENTS'
  | 'AVIONICS MAIN'
  | 'Avionics Shop'  
  | 'PLANT AND EQUIPMENTS'
  | 'BATTERY'
  | 'Battery Shop'
  | 'CALIBRATION'
  | 'Cal lab'
  | 'UPH Shop'
  | 'Structures Shop';

export type SubCategory = 'MAIN' | 'SHOP' | 'LAB';

export type Progress = 'PENDING' | 'WIP' | 'ON PROGRESS' | 'CLOSED';

export interface MROItem {
  id?: string;
  customer: string;
  part_number: string;
  description: string;
  serial_number: string;
  date_delivered: string;
  work_requested: string;
  progress: Progress;
  location: string;
  expected_release_date: string;
  remarks: string;
  category: Category;
  subcategory?: SubCategory;
  sheet_name?: string;
  created_at?: string;
  updated_at?: string;
}

export const CATEGORIES: Category[] = [
  "ALL WIP COMP",
  "MECHANICAL",
  "SAFETY COMPONENTS",
  "AVIONICS MAIN",
  "Avionics Shop",
  "PLANT AND EQUIPMENTS", 
  "BATTERY",
  "Battery Shop",
  "CALIBRATION",
  "Cal lab",
  "UPH Shop",
  "Structures Shop"
];

export const PROGRESS_STATUSES: Progress[] = [
  "PENDING",
  "WIP",
  "ON PROGRESS",
  "CLOSED"
];

export const getCategoryColor = (category: Category) => {
  switch (category) {
    case 'ALL WIP COMP':
      return 'text-gray-400';
    case 'MECHANICAL':
      return 'text-blue-400';
    case 'SAFETY COMPONENTS':
      return 'text-red-400';
    case 'AVIONICS MAIN':
    case 'Avionics Shop':
      return 'text-indigo-400';
    case 'PLANT AND EQUIPMENTS':
      return 'text-green-400';
    case 'BATTERY':
    case 'Battery Shop':
      return 'text-yellow-400';
    case 'CALIBRATION':
    case 'Cal lab':
      return 'text-orange-400';
    case 'UPH Shop':
      return 'text-pink-400';
    case 'Structures Shop':
      return 'text-purple-400';
    default:
      return 'text-gray-400';
  }
};

export const getSubCategoryFromSheet = (sheetName: string): SubCategory | undefined => {
  const lower = sheetName.toLowerCase();
  if (lower.includes('main')) return 'MAIN';
  if (lower.includes('shop')) return 'SHOP';
  if (lower.includes('lab')) return 'LAB';
  return undefined;
};

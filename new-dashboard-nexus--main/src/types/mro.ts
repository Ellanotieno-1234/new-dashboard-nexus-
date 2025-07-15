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

export type SubCategory = 'MAIN' | 'SHOP' | 'LAB' | null;

export type Progress = 'PENDING' | 'WIP' | 'ON PROGRESS' | 'CLOSED';

export interface MROItem {
  id: string;
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
  "Structures Shop",
];

export const getCategoryColor = (category: Category) => {
  switch (category) {
    case 'ALL WIP COMP':
      return 'text-gray-600';
    case 'MECHANICAL':
      return 'text-blue-600';
    case 'SAFETY COMPONENTS':
      return 'text-red-600';
    case 'AVIONICS MAIN':
    case 'Avionics Shop':
      return 'text-indigo-600';
    case 'PLANT AND EQUIPMENTS':
      return 'text-green-600';
    case 'BATTERY':
    case 'Battery Shop':
      return 'text-yellow-600';
    case 'CALIBRATION':
    case 'Cal lab':
      return 'text-orange-600';
    case 'UPH Shop':
      return 'text-pink-600';
    case 'Structures Shop':
      return 'text-purple-600';
    default:
      return 'text-gray-600';
  }
};

export const getSubCategoryFromSheet = (sheetName: string): SubCategory | undefined => {
  if (/main/i.test(sheetName)) return 'MAIN';
  if (/shop/i.test(sheetName)) return 'SHOP';
  if (/lab/i.test(sheetName)) return 'LAB';
  return undefined;
};

export const PROGRESS_STATUSES: Progress[] = [
  'PENDING',
  'WIP',
  'ON PROGRESS',
  'CLOSED',
];

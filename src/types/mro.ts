export type Category = 'MECHANICAL' | 'SAFETY COMPONENTS' | 'PLANT AND EQUIPMENTS' | 'CALIBRATION' | 'STRUCTURAL';
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
  created_at?: string;
  updated_at?: string;
}

export const CATEGORIES: Category[] = [
  "MECHANICAL",
  "SAFETY COMPONENTS",
  "PLANT AND EQUIPMENTS",
  "CALIBRATION",
  "STRUCTURAL"
];

export const PROGRESS_STATUSES: Progress[] = [
  "PENDING",
  "WIP",
  "ON PROGRESS",
  "CLOSED"
];

export const getCategoryColor = (category: Category) => {
  switch (category) {
    case 'MECHANICAL':
      return 'text-blue-400';
    case 'SAFETY COMPONENTS':
      return 'text-red-400';
    case 'PLANT AND EQUIPMENTS':
      return 'text-green-400';
    case 'CALIBRATION':
      return 'text-yellow-400';
    case 'STRUCTURAL':
      return 'text-purple-400';
    default:
      return '';
  }
};

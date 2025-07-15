declare module 'lucide-react' {
  import type { ForwardRefExoticComponent, SVGProps, RefAttributes } from 'react';

  export interface IconProps extends SVGProps<SVGElement> {
    size?: string | number;
    absoluteStrokeWidth?: boolean;
    color?: string;
    strokeWidth?: string | number;
  }

  export type LucideIcon = ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
  export type Icon = LucideIcon;

  // Declare all icons we use
  export const Activity: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const Clock: LucideIcon;
  export const Cpu: LucideIcon;
  export const Database: LucideIcon;
  export const Download: LucideIcon;
  export const Eye: LucideIcon;
  export const FileText: LucideIcon;
  export const Globe: LucideIcon;
  export const HardDrive: LucideIcon;
  export const MessageSquare: LucideIcon;
  export const Network: LucideIcon;
  export const Package: LucideIcon;
  export const Play: LucideIcon;
  export const Plane: LucideIcon;
  export const RotateCcw: LucideIcon;
  export const Settings: LucideIcon;
  export const Shield: LucideIcon;
  export const Terminal: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const Wifi: LucideIcon;
  export const Wrench: LucideIcon;
  export const Check: LucideIcon;
  export const ChevronDown: LucideIcon;
}

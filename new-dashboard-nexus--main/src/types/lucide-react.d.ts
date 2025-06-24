import { ComponentType } from 'react';
import { LucideIcon } from 'lucide-react';

declare module 'lucide-react' {
  interface LucideProps {
    size?: number;
    className?: string;
  }

  type IconComponent = ComponentType<{ size?: number; className?: string }>;
  
  export const Activity: IconComponent;
  export const AlertTriangle: IconComponent;
  export const CheckCircle: IconComponent;
  export const Clock: IconComponent;
  export const Cpu: IconComponent;
  export const Database: IconComponent;
  export const Download: IconComponent;
  export const Eye: IconComponent;
  export const FileText: IconComponent;
  export const Globe: IconComponent;
  export const HardDrive: IconComponent;
  export const MessageSquare: IconComponent;
  export const Network: IconComponent;
  export const Package: IconComponent;
  export const Play: IconComponent;
  export const Plane: IconComponent;
  export const RotateCcw: IconComponent;
  export const Settings: IconComponent;
  export const Shield: IconComponent;
  export const Terminal: IconComponent;
  export const TrendingUp: IconComponent;
  export const Wifi: IconComponent;
}

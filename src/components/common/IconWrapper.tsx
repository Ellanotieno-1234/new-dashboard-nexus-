'use client';

import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface IconWrapperProps {
  icon: LucideIcon;
  size?: number | string;
  className?: string;
}

export const IconWrapper = ({ icon: Icon, size = 24, className = '' }: IconWrapperProps) => {
  return React.createElement(Icon, {size, className});
};

IconWrapper.displayName = 'IconWrapper';

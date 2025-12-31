'use client';

import { ReactNode } from 'react';
import { usePWA } from '@/hooks/usePWA';

export function PWAProvider({ children }: { children: ReactNode }) {
  usePWA();
  return <>{children}</>;
}

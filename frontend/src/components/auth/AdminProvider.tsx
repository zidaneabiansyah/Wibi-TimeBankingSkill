'use client';

import { useEffect } from 'react';
import { useAdminStore } from '@/stores/admin.store';

interface AdminProviderProps {
  children: React.ReactNode;
}

export function AdminProvider({ children }: AdminProviderProps) {
  const { loadAdmin } = useAdminStore();

  useEffect(() => {
    loadAdmin();
  }, []);

  return <>{children}</>;
}

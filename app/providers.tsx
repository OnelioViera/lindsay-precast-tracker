'use client';

import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from '@/lib/toast-context';
import { ToastContainer } from '@/components/ui/toast-container';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <SessionProvider>
        <ToastContainer />
        {children}
      </SessionProvider>
    </ToastProvider>
  );
}



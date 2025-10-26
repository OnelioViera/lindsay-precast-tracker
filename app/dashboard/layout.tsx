'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Providers } from '../providers';
import { SidebarProvider, useSidebar } from '@/lib/sidebar-context';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { isCollapsed } = useSidebar();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className={cn(
        'flex-1 transition-all duration-300',
        isCollapsed ? 'ml-20' : 'ml-64'
      )}>
        <Header />
        <main className="mt-20 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <SidebarProvider>
        <DashboardContent>{children}</DashboardContent>
      </SidebarProvider>
    </Providers>
  );
}



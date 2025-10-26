'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ProfileModal } from '@/components/layout/profile-modal';
import { useSidebar } from '@/lib/sidebar-context';

const roleDisplayNames: { [key: string]: string } = {
  designer: 'CAD Designer',
  manager: 'Project Manager',
  production: 'Production Specialist',
  other: 'Other',
};

function formatRole(role: string): string {
  return roleDisplayNames[role] || role;
}

export function Header() {
  const { data: session } = useSession();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { isCollapsed } = useSidebar();

  return (
    <>
      <header className={cn(
        'bg-white shadow-sm border-b px-8 py-4 fixed top-0 z-30 transition-all duration-300',
        isCollapsed ? 'right-0 left-20' : 'right-0 left-64'
      )}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, {session?.user?.name || 'User'}!
            </h1>
            <p className="text-sm text-gray-600">
              Here&apos;s what&apos;s happening with your projects today.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="default" className="relative px-3 py-2 text-sm">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </Button>

            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-3 pl-4 border-l hover:bg-gray-50 px-3 py-2 rounded-lg transition cursor-pointer"
            >
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">{session?.user?.name}</p>
                <p className="text-xs text-gray-600">{formatRole((session?.user as any)?.role || '')}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
                <User className="h-5 w-5" />
              </div>
            </button>
          </div>
        </div>
      </header>

      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </>
  );
}



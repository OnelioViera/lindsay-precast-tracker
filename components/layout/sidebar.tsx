'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  BookOpen, 
  Factory,
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useSidebar } from '@/lib/sidebar-context';

const menuItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/projects', icon: FolderKanban, label: 'Projects' },
  { href: '/dashboard/customers', icon: Users, label: 'Customers' },
  { href: '/dashboard/library', icon: BookOpen, label: 'Library' },
  { href: '/dashboard/production', icon: Factory, label: 'Production' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapse } = useSidebar();

  return (
    <div className={cn(
      'bg-white shadow-lg h-screen fixed left-0 top-0 flex flex-col transition-all duration-300 z-40',
      isCollapsed ? 'w-20' : 'w-64'
    )}>
      <div className={cn(
        'border-b',
        isCollapsed ? 'p-3' : 'p-6'
      )}>
        {!isCollapsed && (
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Lindsay Precast
            </h2>
            <p className="text-sm text-gray-600 mt-1">Design Management</p>
          </div>
        )}
      </div>

      {/* Collapse button on the right edge */}
      <button
        onClick={toggleCollapse}
        className="absolute top-1/2 -right-3 transform -tranpurple-y-1/2 bg-white border border-gray-200 rounded-full p-2 text-gray-400 hover:text-indigo-600 hover:border-indigo-600 transition-colors shadow-lg z-50"
        title={isCollapsed ? 'Expand' : 'Collapse'}
      >
        <ChevronLeft className={cn(
          'h-4 w-4 transition-transform duration-300',
          isCollapsed && 'rotate-180'
        )} />
      </button>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative group',
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100',
                    isCollapsed && 'justify-center px-3'
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                  
                  {/* Tooltip for collapsed sidebar */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 font-medium">
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-lg w-full text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 relative group',
            isCollapsed && 'justify-center px-3'
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
          
          {/* Tooltip for collapsed sidebar */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 font-medium">
              Logout
            </div>
          )}
        </button>
      </div>
    </div>
  );
}



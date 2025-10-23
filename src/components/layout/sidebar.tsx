'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  Library, 
  Settings,
  LogOut,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Library', href: '/library', icon: Library },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Production', href: '/production', icon: Settings },
]

export default function Sidebar() {
  const { data: session } = useSession()

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 shadow-sm">
        <div className="flex h-16 shrink-0 items-center">
          <h1 className="text-xl font-bold text-gray-900">Lindsay Precast</h1>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                      <item.icon className="h-6 w-6 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="mt-auto">
              <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-gray-900">
                <div className="flex items-center gap-x-3">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{session?.user?.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{session?.user?.role}</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Handle logout
                  }}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

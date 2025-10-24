'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  Library, 
  Settings,
  LogOut,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'
import { ProfileModal } from '@/components/profile-modal'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Library', href: '/library', icon: Library },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Production', href: '/production', icon: Settings },
]

interface SidebarProps {
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

export default function Sidebar({ mobileMenuOpen, setMobileMenuOpen, collapsed, setCollapsed }: SidebarProps) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [profileModalOpen, setProfileModalOpen] = useState(false)

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' })
  }

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4 shadow-lg">
          <div className="flex h-16 shrink-0 items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Lindsay Precast</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                          active
                            ? 'bg-primary text-white'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <item.icon className="h-6 w-6 shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
              </li>
                <li className="mt-auto">
                  <div className="flex flex-col gap-y-2 px-2 py-3">
                    <button
                      onClick={() => setProfileModalOpen(true)}
                      className="flex items-center gap-x-3 hover:bg-gray-50 rounded-md p-2 transition-colors"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900">{session?.user?.name}</div>
                        <div className="text-xs text-gray-500 capitalize">{session?.user?.role}</div>
                      </div>
                    </button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="w-full justify-start gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                  </div>
                </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:z-[60] lg:flex lg:flex-col transition-all duration-300 ${
        collapsed ? 'lg:w-20' : 'lg:w-64'
      }`}>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-4 pb-4 shadow-sm relative">
          <div className="flex h-16 shrink-0 items-center">
            {!collapsed && <h1 className="text-xl font-bold text-gray-900">Lindsay Precast</h1>}
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const active = isActive(item.href)
                    return (
                      <li key={item.name}>
                        {collapsed ? (
                          <Tooltip content={item.name} side="right">
                            <Link
                              href={item.href}
                              className={`group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold justify-center ${
                                active
                                  ? 'bg-primary text-white'
                                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                              }`}
                            >
                              <item.icon className="h-6 w-6 shrink-0" />
                            </Link>
                          </Tooltip>
                        ) : (
                          <Link
                            href={item.href}
                            className={`group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                              active
                                ? 'bg-primary text-white'
                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                          >
                            <item.icon className="h-6 w-6 shrink-0" />
                            <span>{item.name}</span>
                          </Link>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </li>
              <li className="mt-auto">
                {collapsed ? (
                  <div className="flex flex-col items-center gap-y-2 py-3">
                    <Tooltip content="Profile" side="right">
                      <button
                        onClick={() => setProfileModalOpen(true)}
                        className="h-8 w-8 rounded-full bg-primary flex items-center justify-center hover:opacity-80 transition-opacity"
                      >
                        <User className="h-4 w-4 text-white" />
                      </button>
                    </Tooltip>
                    <Tooltip content="Logout" side="right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </Tooltip>
                  </div>
                ) : (
                  <div className="flex flex-col gap-y-2 px-2 py-3">
                    <Tooltip content="Edit Profile" side="right">
                      <button
                        onClick={() => setProfileModalOpen(true)}
                        className="flex items-center gap-x-3 hover:bg-gray-50 rounded-md p-2 transition-colors"
                      >
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-medium text-gray-900">{session?.user?.name}</div>
                          <div className="text-xs text-gray-500 capitalize">{session?.user?.role}</div>
                        </div>
                      </button>
                    </Tooltip>
                    <Tooltip content="Logout" side="right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLogout}
                        className="w-full justify-start gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </Button>
                    </Tooltip>
                  </div>
                )}
              </li>
            </ul>
          </nav>
        </div>
        
        {/* Collapse/Expand Button - Middle of Sidebar */}
        <div className="absolute top-1/2 -translate-y-1/2 -right-2.5 z-10">
          {collapsed ? (
            <Tooltip content="Expand sidebar" side="right">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="h-10 w-6 rounded-md shadow-lg bg-white hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-1 border border-gray-200"
              >
                <div className="w-3 h-0.5 bg-gray-600 rounded-full"></div>
                <div className="w-3 h-0.5 bg-gray-600 rounded-full"></div>
                <div className="w-3 h-0.5 bg-gray-600 rounded-full"></div>
              </button>
            </Tooltip>
          ) : (
            <Tooltip content="Collapse sidebar" side="right">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="h-10 w-6 rounded-md shadow-lg bg-white hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-1 border border-gray-200"
              >
                <div className="w-3 h-0.5 bg-gray-600 rounded-full"></div>
                <div className="w-3 h-0.5 bg-gray-600 rounded-full"></div>
                <div className="w-3 h-0.5 bg-gray-600 rounded-full"></div>
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal open={profileModalOpen} onOpenChange={setProfileModalOpen} />
    </>
  )
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  Settings,
  LogOut,
  ChevronLeft
} from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  displayName: string | null;
  fullName: string | null;
  role: string;
}

interface AdminSidebarProps {
  user: AdminUser;
}

const navItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    label: 'Hot Leads',
    href: '/admin/leads',
    icon: TrendingUp,
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-32 h-[calc(100vh-8rem)] w-64 bg-neutral-900 text-white flex flex-col rounded-tr-2xl">
      {/* Header */}
      <div className="p-6 border-b border-neutral-800">
        <Link href="/" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm mb-4">
          <ChevronLeft className="h-4 w-4" />
          Back to site
        </Link>
        <h1 className="font-hvmuse text-xl text-white">Lowther Admin</h1>
        <p className="text-xs text-neutral-500 mt-1">Analytics Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-amber-600 text-white' 
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-sarabun text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-neutral-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-full bg-amber-600 flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {(user.displayName || user.email).charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user.displayName || user.fullName || 'Admin'}
            </p>
            <p className="text-xs text-neutral-500 truncate">{user.email}</p>
          </div>
        </div>
        <Link
          href="/api/auth/logout"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors text-sm w-full"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Link>
      </div>
    </aside>
  );
}

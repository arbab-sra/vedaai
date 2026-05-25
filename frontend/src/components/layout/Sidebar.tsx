"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, Wrench, BookOpen, Settings, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: LayoutDashboard },
    { name: 'My Groups', href: '/groups', icon: Users },
    { name: 'Assignments', href: '/assignments', icon: FileText },
    { name: 'AI Teacher\'s Toolkit', href: '/toolkit', icon: Wrench },
    { name: 'My Library', href: '/library', icon: BookOpen },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-orange-600 rounded-md flex items-center justify-center text-white font-bold text-xl">V</div>
          <span className="text-xl font-bold">VedaAI</span>
        </div>
        
        <Link href="/create" className="inline-flex items-center w-full bg-slate-900 hover:bg-slate-800 text-white rounded-full mb-8 shadow-sm justify-start pl-4 py-2.5 text-sm font-medium transition-colors">
          <Sparkles className="w-4 h-4 mr-2" />
          Create Assignment
        </Link>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === '/assignments' && pathname === '/'); // making assignments default for now
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-gray-900' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-gray-200">
        <Link href="/settings" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-4">
          <Settings className="mr-3 h-5 w-5 text-gray-400" />
          Settings
        </Link>
        
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
            DP
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">Delhi Public School</span>
            <span className="text-xs text-gray-500">Bokaro Steel City</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

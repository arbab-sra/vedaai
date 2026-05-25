"use client";

import { Bell, ArrowLeft } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  
  let title = 'Assignments';
  if (pathname.includes('/create')) title = 'Create Assignment';
  else if (pathname.includes('/assignment/')) title = 'Assignment';

  const showBackButton = pathname !== '/' && pathname !== '/assignments';

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10 rounded-2xl m-2 border">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-gray-500 hover:text-gray-900">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="User Avatar" className="w-full h-full object-cover" />
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">John Doe</span>
        </div>
      </div>
    </header>
  );
}

'use client';

import { useState, ReactNode } from 'react';
import Navbar from '@/components/layout/Navbar';
import SideNav from '@/components/layout/SideNav';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { cn } from '@/lib/utils';

export default function Shell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50">
        <Navbar onMenuToggle={toggleSidebar} />
      </header>

      <div className="flex flex-1">
        {/* Sidebar - hidden on mobile by default, shown when sidebarOpen is true */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 w-64 border-r bg-white transition-transform duration-300 ease-in-out md:static md:z-auto md:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <SideNav />
        </aside>

        {/* Mobile overlay - shown when sidebar is open on mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Main content */}
        <main className="flex-1">
          <Breadcrumbs />
          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

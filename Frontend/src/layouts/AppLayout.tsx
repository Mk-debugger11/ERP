import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BreadcrumbNav } from '@/components/shared/BreadcrumbNav';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-background font-sans antialiased text-foreground">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic Content Container */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="mb-4">
            <BreadcrumbNav />
          </div>

          {/* Route Page Outlet */}
          <div className="animate-in fade-in duration-200">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

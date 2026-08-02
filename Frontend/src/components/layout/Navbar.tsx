import React, { useState } from 'react';
import { Search, Bell, Command, CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from '@/components/shared/ThemeToggle';

export const Navbar: React.FC = () => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'New Employee Joined', desc: 'Rahul Sharma joined Engineering team.', time: '10m ago' },
    { id: 2, title: 'Department Updated', desc: 'DevOps team expanded under IT.', time: '1h ago' },
    { id: 3, title: 'System Backup', desc: 'Daily PostgreSQL database backup completed.', time: '3h ago' },
  ];

  return (
    <header className="h-16 bg-card/90 backdrop-blur-md border-b border-border px-6 flex items-center justify-between sticky top-0 z-30 shadow-subtle transition-colors">
      {/* Global Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search employees, departments, teams..."
            className="w-full pl-9 pr-12 py-1.5 bg-secondary/40 border border-border/70 rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-card transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground bg-muted border border-border rounded">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </div>
      </div>

      {/* Right Navbar Controls */}
      <div className="flex items-center gap-3">

        {/* Theme Switcher */}
        <ThemeToggle />

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-secondary-foreground hover:bg-muted/80 rounded-lg transition-colors relative border border-border/50"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-card animate-pulse" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-popover border border-border rounded-xl shadow-dropdown py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-border flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Notifications</span>
                <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">3 New</span>
              </div>
              <div className="divide-y divide-border/40 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-muted/40 transition-colors cursor-pointer">
                    <p className="text-xs font-semibold text-foreground">{n.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{n.desc}</p>
                    <span className="text-[10px] text-muted-foreground mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-5 w-px bg-border/80 mx-1" />

        {/* User Profile Menu */}
        <div className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-muted/60 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center shadow-subtle ring-2 ring-primary/20">
            HR
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-foreground leading-tight">Mukul Admin</span>
            <span className="text-[10px] text-muted-foreground">HR Director</span>
          </div>
        </div>
      </div>
    </header>
  );
};

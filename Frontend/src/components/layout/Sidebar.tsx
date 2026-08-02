import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  UserCheck,
  MapPin,
  FileBadge,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Building,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavGroup {
  title?: string;
  items: {
    name: string;
    to: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

const navGroups: NavGroup[] = [
  {
    title: 'CORE MANAGEMENT',
    items: [
      { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
      { name: 'Employees', to: '/employees', icon: Users, badge: '148' },
    ],
  },
  {
    title: 'ORGANIZATION STRUCTURE',
    items: [
      { name: 'Departments', to: '/departments', icon: Building2, badge: '8' },
      { name: 'Designations', to: '/designations', icon: Briefcase },
      { name: 'Teams', to: '/teams', icon: UserCheck },
      { name: 'Branches', to: '/branches', icon: MapPin },
    ],
  },
  {
    title: 'SYSTEM CONFIG',
    items: [
      { name: 'Employment Types', to: '/employment-types', icon: FileBadge },
      { name: 'Settings', to: '/settings', icon: Settings },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'relative h-screen sticky top-0 bg-sidebar-bg border-r border-sidebar-border flex flex-col transition-all duration-300 z-20 select-none shadow-subtle shrink-0 transition-colors',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blueberry-700 via-blueberry-600 to-blueberry-500 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0 ring-2 ring-blueberry-400/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-base text-foreground tracking-tight leading-none flex items-center gap-1.5">
                ApexERP <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold">HR</span>
              </span>
              <span className="text-[11px] text-muted-foreground font-medium tracking-wide mt-1">Enterprise Suite</span>
            </div>
          )}
        </div>
      </div>

      {/* Workspace Switcher */}
      {!collapsed && (
        <div className="px-3 pt-3">
          <button className="w-full flex items-center justify-between p-2.5 rounded-xl bg-secondary/50 border border-border/60 hover:bg-secondary/80 transition-colors text-left group">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Building className="w-4 h-4" />
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-foreground truncate">Acme Global Tech</p>
                <p className="text-[10px] text-muted-foreground truncate">Enterprise License</p>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
          </button>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {!collapsed && group.title && (
              <h4 className="px-3 text-[10px] font-bold text-muted-foreground tracking-wider uppercase mb-2">
                {group.title}
              </h4>
            )}
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative',
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold shadow-subtle border border-primary/20'
                      : 'text-secondary-foreground hover:bg-secondary hover:text-foreground'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3 min-w-0">
                      <item.icon
                        className={cn(
                          'w-5 h-5 shrink-0 transition-colors',
                          isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                        )}
                      />
                      {!collapsed && <span className="truncate">{item.name}</span>}
                    </div>

                    {!collapsed && item.badge && (
                      <span
                        className={cn(
                          'text-[11px] font-bold px-2 py-0.5 rounded-full',
                          isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}

                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-sidebar-border flex items-center justify-between bg-card/40">
        {!collapsed && <span className="text-[11px] text-muted-foreground font-medium px-2">Production v1.0</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors ml-auto"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};

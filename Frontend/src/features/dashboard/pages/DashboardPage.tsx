import React, { useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Building2,
  MapPin,
  UserPlus,
  Cake,
  Activity,
  ChevronRight,
  Clock,
  CalendarClock,
  FileSignature,
  AlertOctagon,
  ArrowRight,
  MoreVertical,
  Laptop,
  Coffee,
  Megaphone,
  Building
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { useEmployees } from '@/features/employee/api';
import { useDepartments } from '@/features/department/api';
import { useDesignations } from '@/features/designation/api';

export const DashboardPage: React.FC = () => {
  const { data: employees, isLoading } = useEmployees();
  const { data: departments } = useDepartments();
  const { data: designations } = useDesignations();

  // Action Center Data (Mocked as no API exists for these yet)
  const pendingActions = [
    {
      id: 1,
      title: 'Leave Approvals',
      count: 4,
      desc: 'Requires manager review',
      icon: CalendarClock,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400',
      actionText: 'Review Requests',
    },
    {
      id: 2,
      title: 'Probation Reviews',
      count: employees?.filter(e => e.employment_status === 'PROBATION').length || 0,
      desc: 'Employees on probation',
      icon: FileSignature,
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-400',
      actionText: 'Schedule Review',
    },
    {
      id: 3,
      title: 'Document Compliance',
      count: 2,
      desc: 'Missing KYC & Tax forms',
      icon: AlertOctagon,
      color: 'text-blueberry-600 bg-blueberry-50 dark:bg-blueberry-900/30 dark:text-blueberry-400',
      actionText: 'Send Reminders',
    },
  ];

  // Daily Availability Roster (Derived from real employees)
  const todaysRoster = useMemo(() => {
    if (!employees) return [];
    // Show a mix of statuses for the first 5 employees
    return employees.slice(0, 5).map((emp, i) => {
      let type = 'Present (Office)';
      let icon = Building2;
      let color = 'text-emerald-500';

      if (i % 3 === 1) {
        type = 'Remote (WFH)';
        icon = Laptop;
        color = 'text-blueberry-500';
      } else if (emp.employment_status === 'NOTICE_PERIOD') {
        type = 'Half Day';
        icon = Coffee;
        color = 'text-amber-500';
      }

      return {
        id: emp.id,
        name: `${emp.first_name} ${emp.last_name}`,
        type,
        icon,
        color,
      };
    });
  }, [employees]);

  // Employee Lifecycle Tracker
  const lifecycleEvents = useMemo(() => {
    if (!employees || !designations) return [];
    
    const events: any[] = [];
    
    // Add people on probation (Onboarding)
    const onboarding = employees.filter(e => e.employment_status === 'PROBATION').slice(0, 2);
    onboarding.forEach(emp => {
      events.push({
        id: `on-${emp.id}`,
        type: 'ONBOARDING',
        name: `${emp.first_name} ${emp.last_name}`,
        role: designations.find(d => d.id === emp.designation)?.title || 'Employee',
        progress: 60,
        status: 'Probation Review Pending',
      });
    });

    // Add people on notice period (Offboarding)
    const offboarding = employees.filter(e => e.employment_status === 'NOTICE_PERIOD' || e.employment_status === 'RESIGNED').slice(0, 2);
    offboarding.forEach(emp => {
      events.push({
        id: `off-${emp.id}`,
        type: 'OFFBOARDING',
        name: `${emp.first_name} ${emp.last_name}`,
        role: designations.find(d => d.id === emp.designation)?.title || 'Employee',
        progress: 80,
        status: 'Exit Interview Pending',
      });
    });

    return events.length > 0 ? events : [
      { id: 'mock-1', type: 'ONBOARDING', name: 'Awaiting New Hires', role: '-', progress: 0, status: 'No active workflows' }
    ];
  }, [employees, designations]);

  // Upcoming Celebrations
  const upcomingEvents = useMemo(() => {
    if (!employees || !designations) return [];
    const events: any[] = [];
    
    // Find upcoming birthdays based on date_of_birth
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    
    employees.forEach(emp => {
      if (emp.date_of_birth) {
        const [year, month, day] = emp.date_of_birth.split('-').map(Number);
        if (month === currentMonth || month === (currentMonth % 12) + 1) {
          events.push({
            name: `${emp.first_name} ${emp.last_name}`,
            type: 'Birthday',
            date: `${month}/${day}`,
            designation: designations.find(d => d.id === emp.designation)?.title || 'Employee',
            rawDate: new Date(year, month - 1, day),
          });
        }
      }
      if (emp.joining_date) {
        const [year, month, day] = emp.joining_date.split('-').map(Number);
        if (month === currentMonth && (today.getFullYear() - year) > 0) {
          events.push({
            name: `${emp.first_name} ${emp.last_name}`,
            type: `Work Anniv (${today.getFullYear() - year} Yrs)`,
            date: `${month}/${day}`,
            designation: designations.find(d => d.id === emp.designation)?.title || 'Employee',
            rawDate: new Date(year, month - 1, day),
          });
        }
      }
    });

    return events.slice(0, 4); // Show max 4
  }, [employees, designations]);

  // System Audit Feed (Mocked since we don't have an audit log table)
  const recentActivities = [
    { id: 1, text: `HR Data synced successfully. Total Headcount: ${employees?.length || 0}`, time: 'Just now', icon: Activity, color: 'text-emerald-500 bg-status-success-bg dark:bg-emerald-900/30 dark:text-emerald-400' },
    { id: 2, text: `Active Departments: ${departments?.length || 0}`, time: '1 hour ago', icon: Building2, color: 'text-primary bg-primary/10 dark:bg-primary/20 dark:text-primary-foreground' },
    { id: 3, text: 'Payroll processing window opens next week', time: '1 day ago', icon: AlertOctagon, color: 'text-status-warning bg-status-warning-bg dark:bg-status-warning/20 dark:text-status-warning' },
  ];

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="HR Workspace"
        description="Daily operational command center for approvals, lifecycle management, and employee pulse."
      />

      {/* 1. Action Center (Top Priority) */}
      <div>
        <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-primary" />
          Pending Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pendingActions.map((action) => (
            <Card key={action.id} className="border border-border/70 shadow-sm hover:border-border transition-colors opacity-50 grayscale pointer-events-none select-none">
              <CardContent className="p-4 flex flex-col h-full">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${action.color}`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground leading-none">{action.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-1">{action.desc}</p>
                    </div>
                  </div>
                  <span className="text-xl font-black text-foreground bg-secondary/50 px-2.5 py-1 rounded-lg border border-border/50">
                    {action.count}
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-border/50 flex-1 flex items-end">
                  <button className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors">
                    {action.actionText} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 2. Today's Workspace (Asymmetric Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Column (2/3 width): Daily Roster & Lifecycle */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Daily Roster */}
          <Card>
            <CardHeader className="pb-2 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" /> Today's Availability
                  </CardTitle>
                  <CardDescription>Real-time view of out-of-office and remote workers</CardDescription>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="flex flex-col text-right">
                    <span className="text-foreground">{employees?.length || 0}</span>
                    <span className="text-[10px] text-muted-foreground">Total Staff</span>
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {todaysRoster.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/40">
                  {todaysRoster.map((person, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground font-bold flex items-center justify-center text-xs shrink-0 border border-border uppercase">
                        {person.name.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{person.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <person.icon className={`w-3 h-3 ${person.color}`} /> {person.type}
                        </p>
                      </div>
                      <button className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-secondary">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No employees found. Onboard some employees to see the roster!
                </div>
              )}
            </CardContent>
            <div className="bg-secondary/20 p-3 text-center border-t border-border/40">
              <Link to="/employees" className="text-xs font-semibold text-primary hover:underline flex items-center justify-center gap-1">
                View Full Roster <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>

          {/* Lifecycle Events */}
          <Card>
            <CardHeader className="pb-2 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500" /> Employee Lifecycle
                  </CardTitle>
                  <CardDescription>Track active onboarding and offboarding workflows</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/40">
                {lifecycleEvents.map((evt) => (
                  <div key={evt.id} className="p-4 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {evt.type === 'ONBOARDING' ? (
                          <Badge variant="active" className="text-[10px] px-1.5 py-0 border-emerald-200">ONBOARDING</Badge>
                        ) : (
                          <Badge variant="warning" className="text-[10px] px-1.5 py-0 border-amber-200">OFFBOARDING</Badge>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{evt.name}</p>
                        <p className="text-xs text-muted-foreground">{evt.role}</p>
                      </div>
                    </div>
                    <div className="flex-1 max-w-xs w-full">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-medium text-foreground">{evt.status}</span>
                        <span className="text-[11px] font-bold text-muted-foreground">{evt.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${evt.progress === 100 ? 'bg-status-success' : 'bg-primary'}`} 
                          style={{ width: `${evt.progress}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
        </div>

        {/* Side Column (1/3 width): Culture & Quick Links */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Operations Menu */}
          <Card>
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base flex items-center gap-2">
                <Building className="w-4 h-4 text-primary" /> Quick Operations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col divide-y divide-border/40">
                <Link to="/employees/new" className="px-5 py-3.5 hover:bg-muted/40 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shadow-sm">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Onboard Employee</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
                <button className="px-5 py-3.5 flex items-center justify-between group opacity-50 grayscale pointer-events-none select-none">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center justify-center shadow-sm">
                      <FileSignature className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-foreground transition-colors">Process Payroll</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground transition-colors" />
                </button>
                <button className="px-5 py-3.5 flex items-center justify-between group opacity-50 grayscale pointer-events-none select-none">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 flex items-center justify-center shadow-sm">
                      <Megaphone className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-foreground transition-colors">Post Announcement</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground transition-colors" />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Celebrations */}
          <Card>
            <CardHeader className="pb-3 border-b border-border/40">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Cake className="w-4 h-4 text-rose-500" /> Culture & Events
                </CardTitle>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {upcomingEvents.length > 0 ? `${upcomingEvents.length} This Month` : 'No events'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {upcomingEvents.length > 0 ? upcomingEvents.map((evt, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center flex-col shrink-0">
                    <span className="text-[10px] font-bold text-muted-foreground leading-none">{evt.date.split('/')[0]}/{evt.date.split('/')[1]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground leading-none mt-0.5">{evt.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{evt.type} • {evt.designation}</p>
                  </div>
                </div>
              )) : (
                <p className="text-xs text-muted-foreground text-center py-4">No upcoming birthdays or anniversaries this month.</p>
              )}
            </CardContent>
          </Card>

          {/* Org Pulse / Live Audit Log */}
          <Card>
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> System Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-lg ${act.color} flex items-center justify-center shrink-0`}>
                    <act.icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground font-medium leading-tight">{act.text}</p>
                    <span className="text-[10px] text-muted-foreground mt-1 block">{act.time}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
        </div>
      </div>
    </div>
  );
};


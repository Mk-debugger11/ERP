import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { EmployeeListPage } from '@/features/employee/pages/EmployeeListPage';
import { DepartmentListPage } from '@/features/department/pages/DepartmentListPage';
import { DesignationListPage } from '@/features/designation/pages/DesignationListPage';
import { TeamListPage } from '@/features/team/pages/TeamListPage';
import { BranchListPage } from '@/features/branch/pages/BranchListPage';
import { EmploymentTypeListPage } from '@/features/employment-type/pages/EmploymentTypeListPage';
import { SettingsPage } from '@/features/settings/pages/SettingsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Redirect root to dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Dashboard */}
        <Route path="dashboard" element={<DashboardPage />} />

        {/* Employee Module */}
        <Route path="employees" element={<EmployeeListPage />} />
        <Route path="employees/new" element={<EmployeeListPage />} />
        <Route path="employees/:id" element={<EmployeeListPage />} />
        <Route path="employees/:id/edit" element={<EmployeeListPage />} />

        {/* Master Data Modules */}
        <Route path="departments" element={<DepartmentListPage />} />
        <Route path="designations" element={<DesignationListPage />} />
        <Route path="teams" element={<TeamListPage />} />
        <Route path="branches" element={<BranchListPage />} />
        <Route path="employment-types" element={<EmploymentTypeListPage />} />
        <Route path="settings" element={<SettingsPage />} />

        {/* Fallback 404 Route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

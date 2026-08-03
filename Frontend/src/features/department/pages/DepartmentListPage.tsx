import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Plus, Edit2, Trash2 } from 'lucide-react';
import { useDepartments, useDeleteDepartment } from '../api';
import { Department } from '../types';
import { DepartmentForm } from '../components/DepartmentForm';

export const DepartmentListPage: React.FC = () => {
  const { data: departments, isLoading, isError } = useDepartments();
  const deleteMutation = useDeleteDepartment();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | undefined>(undefined);

  const handleCreateNew = () => {
    setEditingDepartment(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (dept: Department) => {
    setEditingDepartment(dept);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
  };

  if (isFormOpen) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <DepartmentForm
          initialData={editingDepartment}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsFormOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Departments"
        description="Manage company organizational departments and units."
        actions={
          <Button onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-1.5" /> Add Department
          </Button>
        }
      />
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <svg className="animate-spin h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : isError ? (
            <div className="py-12 text-center text-status-danger font-medium text-sm">
              Failed to load departments. Please try again.
            </div>
          ) : !departments || departments.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center justify-center mb-3">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No Departments Found</h3>
              <p className="text-sm text-muted-foreground max-w-md mt-1 mb-4">
                Get started by creating the first department in the organization.
              </p>
              <Button onClick={handleCreateNew} variant="outline">
                <Plus className="w-4 h-4 mr-1.5" /> Create Department
              </Button>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-secondary/40 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3 px-6">Department Name</th>
                  <th className="py-3 px-6">Code</th>
                  <th className="py-3 px-6 hidden md:table-cell">Description</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-medium text-foreground">
                {departments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="py-3 px-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                        {dept.name.substring(0, 2).toUpperCase()}
                      </div>
                      {dept.name}
                    </td>
                    <td className="py-3 px-6">{dept.code}</td>
                    <td className="py-3 px-6 text-muted-foreground hidden md:table-cell max-w-xs truncate">
                      {dept.description || '-'}
                    </td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(dept)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(dept.id)} className="h-8 w-8 text-muted-foreground hover:text-status-danger">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

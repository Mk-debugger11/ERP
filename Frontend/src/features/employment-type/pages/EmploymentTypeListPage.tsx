import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Network, Plus, Edit2, Trash2 } from 'lucide-react';
import { useEmploymentTypes, useDeleteEmploymentType } from '../api';
import { EmploymentType } from '../types';
import { EmploymentTypeForm } from '../components/EmploymentTypeForm';

export const EmploymentTypeListPage: React.FC = () => {
  const { data: employmentTypes, isLoading, isError } = useEmploymentTypes();
  const deleteMutation = useDeleteEmploymentType();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingType, setEditingType] = useState<EmploymentType | undefined>(undefined);

  const handleCreateNew = () => {
    setEditingType(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (type: EmploymentType) => {
    setEditingType(type);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this employment type?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
  };

  if (isFormOpen) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <EmploymentTypeForm
          initialData={editingType}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsFormOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employment Types"
        description="Manage employment classifications (Full-time, Part-time, Contract, etc)."
        actions={
          <Button onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-1.5" /> Add Type
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
              Failed to load employment types. Please try again.
            </div>
          ) : !employmentTypes || employmentTypes.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400 flex items-center justify-center mb-3">
                <Network className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No Employment Types Found</h3>
              <p className="text-sm text-muted-foreground max-w-md mt-1 mb-4">
                Get started by creating the first employment classification.
              </p>
              <Button onClick={handleCreateNew} variant="outline">
                <Plus className="w-4 h-4 mr-1.5" /> Create Type
              </Button>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-secondary/40 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3 px-6">Type Name</th>
                  <th className="py-3 px-6">Code</th>
                  <th className="py-3 px-6 hidden md:table-cell">Description</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-medium text-foreground">
                {employmentTypes.map((type) => (
                  <tr key={type.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="py-3 px-6 font-semibold">{type.name}</td>
                    <td className="py-3 px-6">{type.code}</td>
                    <td className="py-3 px-6 text-muted-foreground hidden md:table-cell max-w-xs truncate">
                      {type.description || '-'}
                    </td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(type)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(type.id)} className="h-8 w-8 text-muted-foreground hover:text-status-danger">
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

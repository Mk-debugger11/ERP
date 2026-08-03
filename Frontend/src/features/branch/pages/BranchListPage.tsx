import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Plus, Edit2, Trash2 } from 'lucide-react';
import { useBranches, useDeleteBranch } from '../api';
import { Branch } from '../types';
import { BranchForm } from '../components/BranchForm';
import { StatusBadge } from '@/components/shared/StatusBadge';

export const BranchListPage: React.FC = () => {
  const { data: branches, isLoading, isError } = useBranches();
  const deleteMutation = useDeleteBranch();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | undefined>(undefined);

  const handleCreateNew = () => {
    setEditingBranch(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
  };

  if (isFormOpen) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <BranchForm
          initialData={editingBranch}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsFormOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Branches"
        description="Manage physical office locations and branches."
        actions={
          <Button onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-1.5" /> Add Branch
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
              Failed to load branches. Please try again.
            </div>
          ) : !branches || branches.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 flex items-center justify-center mb-3">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No Branches Found</h3>
              <p className="text-sm text-muted-foreground max-w-md mt-1 mb-4">
                Get started by creating the first physical office location.
              </p>
              <Button onClick={handleCreateNew} variant="outline">
                <Plus className="w-4 h-4 mr-1.5" /> Create Branch
              </Button>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-secondary/40 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3 px-6">Branch Name</th>
                  <th className="py-3 px-6">Location</th>
                  <th className="py-3 px-6">Contact</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-medium text-foreground">
                {branches.map((branch) => (
                  <tr key={branch.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="py-3 px-6">
                      <div className="flex flex-col">
                        <span className="font-semibold">{branch.name}</span>
                        <span className="text-xs text-muted-foreground">{branch.code}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex flex-col">
                        <span>{branch.city}, {branch.state}</span>
                        <span className="text-xs text-muted-foreground">{branch.country}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-muted-foreground text-xs">
                      {branch.email && <div>{branch.email}</div>}
                      {branch.phone && <div>{branch.phone}</div>}
                      {!branch.email && !branch.phone && '-'}
                    </td>
                    <td className="py-3 px-6">
                      {branch.is_head_office ? (
                        <StatusBadge status="ACTIVE" label="Head Office" />
                      ) : (
                        <StatusBadge status="PROBATION" label="Branch" />
                      )}
                    </td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(branch)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(branch.id)} className="h-8 w-8 text-muted-foreground hover:text-status-danger">
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

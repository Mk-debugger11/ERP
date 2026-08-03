import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Briefcase, Plus, Edit2, Trash2, LayoutList, Layers } from 'lucide-react';
import { useDesignations, useDeleteDesignation } from '../api';
import { Designation } from '../types';
import { DesignationForm } from '../components/DesignationForm';
import { useDepartments } from '@/features/department/api';
import { cn } from '@/lib/utils';

export const DesignationListPage: React.FC = () => {
  const { data: designations, isLoading, isError } = useDesignations();
  const { data: departments } = useDepartments();
  const deleteMutation = useDeleteDesignation();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDesignation, setEditingDesignation] = useState<Designation | undefined>(undefined);
  
  // Filter and Group state
  const [filterDepartmentId, setFilterDepartmentId] = useState<number | 'all'>('all');
  const [isGrouped, setIsGrouped] = useState(true);

  const handleCreateNew = () => {
    setEditingDesignation(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (desig: Designation) => {
    setEditingDesignation(desig);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this designation?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
  };

  if (isFormOpen) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <DesignationForm
          initialData={editingDesignation}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsFormOpen(false)}
        />
      </div>
    );
  }

  // Helper to get department name
  const getDepartmentName = (id: number) => {
    const dept = departments?.find((d) => d.id === id);
    return dept ? dept.name : 'Unknown';
  };

  // 1. Filter Designations
  const filteredDesignations = designations?.filter(d => 
    filterDepartmentId === 'all' || d.department === filterDepartmentId
  ) || [];

  // 2. Group Designations (if enabled)
  const groupedDesignations = useMemo(() => {
    const groups: Record<number, Designation[]> = {};
    filteredDesignations.forEach(desig => {
      if (!groups[desig.department]) {
        groups[desig.department] = [];
      }
      groups[desig.department].push(desig);
    });
    return groups;
  }, [filteredDesignations]);

  // Row Renderer
  const renderRow = (desig: Designation, hideDepartmentCol: boolean = false) => (
    <tr key={desig.id} className="hover:bg-muted/30 transition-colors group">
      <td className={cn("py-3 px-6 font-semibold text-foreground", hideDepartmentCol && "pl-10")}>{desig.title}</td>
      <td className="py-3 px-6">{desig.code}</td>
      {!hideDepartmentCol && <td className="py-3 px-6 text-muted-foreground">{getDepartmentName(desig.department)}</td>}
      <td className="py-3 px-6">
        <span className="px-2 py-1 bg-secondary rounded-md text-xs font-medium border border-border/60 text-secondary-foreground">
          Level {desig.level}
        </span>
      </td>
      <td className="py-3 px-6 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(desig)} className="h-8 w-8 text-muted-foreground hover:text-primary">
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(desig.id)} className="h-8 w-8 text-muted-foreground hover:text-status-danger">
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Designations"
        description="Manage job titles, levels, and reporting structures."
        actions={
          <Button onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-1.5" /> Add Designation
          </Button>
        }
      />
      
      {/* Filters and Grouping Bar */}
      {(!isLoading && !isError && designations && designations.length > 0) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-3 rounded-xl border border-border/70 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider text-[11px] px-1">Filters:</span>
            <Select 
              value={filterDepartmentId} 
              onChange={(e) => setFilterDepartmentId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-48 h-8 text-xs"
            >
              <option value="all">All Departments</option>
              {departments?.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant={!isGrouped ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setIsGrouped(false)}
            >
              <LayoutList className="w-4 h-4 mr-1.5" /> Flat List
            </Button>
            <Button 
              variant={isGrouped ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setIsGrouped(true)}
            >
              <Layers className="w-4 h-4 mr-1.5" /> Group by Department
            </Button>
          </div>
        </div>
      )}

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
              Failed to load designations. Please try again.
            </div>
          ) : !designations || designations.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center mb-3">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No Designations Found</h3>
              <p className="text-sm text-muted-foreground max-w-md mt-1 mb-4">
                Get started by creating the first job title in the organization.
              </p>
              <Button onClick={handleCreateNew} variant="outline">
                <Plus className="w-4 h-4 mr-1.5" /> Create Designation
              </Button>
            </div>
          ) : filteredDesignations.length === 0 ? (
             <div className="py-12 text-center text-muted-foreground font-medium text-sm">
                No designations match the selected department filter.
             </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-secondary/40 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3 px-6">Job Title</th>
                  <th className="py-3 px-6">Code</th>
                  {!isGrouped && <th className="py-3 px-6">Department</th>}
                  <th className="py-3 px-6">Level</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-medium text-foreground">
                
                {!isGrouped ? (
                  // Flat List
                  filteredDesignations.map((desig) => renderRow(desig, false))
                ) : (
                  // Grouped List
                  Object.keys(groupedDesignations).map((deptIdStr) => {
                    const deptId = parseInt(deptIdStr, 10);
                    const desigs = groupedDesignations[deptId];
                    return (
                      <React.Fragment key={deptId}>
                        <tr className="bg-muted/50 border-y border-border/40">
                          <td colSpan={4} className="py-2.5 px-6 font-bold text-sm text-foreground text-primary">
                            {getDepartmentName(deptId)} 
                            <span className="ml-2 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{desigs.length}</span>
                          </td>
                        </tr>
                        {desigs.map((desig) => renderRow(desig, true))}
                      </React.Fragment>
                    );
                  })
                )}
                
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

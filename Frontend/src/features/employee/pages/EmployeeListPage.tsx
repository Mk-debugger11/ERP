import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Users2, Plus, Edit2, Trash2, LayoutList, Layers } from 'lucide-react';
import { useEmployees, useDeleteEmployee } from '../api';
import { Employee } from '../types';
import { EmployeeForm } from '../components/EmployeeForm';
import { useDepartments } from '@/features/department/api';
import { useDesignations } from '@/features/designation/api';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { cn } from '@/lib/utils';

export const EmployeeListPage: React.FC = () => {
  const { data: employees, isLoading, isError } = useEmployees();
  const { data: departments } = useDepartments();
  const { data: designations } = useDesignations();
  const deleteMutation = useDeleteEmployee();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>(undefined);
  
  // Filter and Group state
  const [filterDepartmentId, setFilterDepartmentId] = useState<number | 'all'>('all');
  const [filterDesignationId, setFilterDesignationId] = useState<number | 'all'>('all');
  const [isGrouped, setIsGrouped] = useState(true);

  const handleCreateNew = () => {
    setEditingEmployee(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to offboard/delete this employee?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
  };

  // Helpers
  const getDepartmentName = (id: number) => {
    const dept = departments?.find((d) => d.id === id);
    return dept ? dept.name : 'Unknown';
  };

  const getDesignationName = (id: number) => {
    const desig = designations?.find((d) => d.id === id);
    return desig ? desig.title : 'Unknown';
  };

  if (isFormOpen) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <EmployeeForm
          initialData={editingEmployee}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsFormOpen(false)}
        />
      </div>
    );
  }

  // 1. Filter Employees
  const filteredEmployees = employees?.filter(emp => {
    const matchDept = filterDepartmentId === 'all' || emp.department === filterDepartmentId;
    const matchDesig = filterDesignationId === 'all' || emp.designation === filterDesignationId;
    return matchDept && matchDesig;
  }) || [];

  // 2. Group Employees (if enabled)
  const groupedEmployees = useMemo(() => {
    const groups: Record<number, Employee[]> = {};
    filteredEmployees.forEach(emp => {
      if (!groups[emp.department]) {
        groups[emp.department] = [];
      }
      groups[emp.department].push(emp);
    });
    return groups;
  }, [filteredEmployees]);

  // Row Renderer
  const renderRow = (emp: Employee, hideDepartmentCol: boolean = false) => (
    <tr key={emp.id} className="hover:bg-muted/30 transition-colors group">
      <td className={cn("py-3 px-6 flex items-center gap-3", hideDepartmentCol && "pl-10")}>
        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0 border border-primary/20">
          {emp.first_name[0]}{emp.last_name[0]}
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{emp.first_name} {emp.last_name}</span>
          <span className="text-[11px] text-muted-foreground">{emp.employee_id}</span>
        </div>
      </td>
      <td className="py-3 px-6">
        <div className="flex flex-col">
          <span className="text-foreground">{getDesignationName(emp.designation)}</span>
          {!hideDepartmentCol && <span className="text-[11px] text-muted-foreground">{getDepartmentName(emp.department)}</span>}
        </div>
      </td>
      <td className="py-3 px-6 text-muted-foreground text-[11px]">
        <div>{emp.company_email}</div>
        <div>{emp.phone}</div>
      </td>
      <td className="py-3 px-6">
        <StatusBadge status={emp.employment_status} />
      </td>
      <td className="py-3 px-6 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(emp)} className="h-8 w-8 text-muted-foreground hover:text-primary">
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(emp.id)} className="h-8 w-8 text-muted-foreground hover:text-status-danger">
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Directory"
        description="Manage personnel records, onboarding, and organizational placement."
        actions={
          <Button onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-1.5" /> Onboard Employee
          </Button>
        }
      />

      {/* Filters and Grouping Bar */}
      {(!isLoading && !isError && employees && employees.length > 0) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-3 rounded-xl border border-border/70 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider text-[11px] px-1">Filters:</span>
            <Select 
              value={filterDepartmentId} 
              onChange={(e) => {
                setFilterDepartmentId(e.target.value === 'all' ? 'all' : Number(e.target.value));
                setFilterDesignationId('all'); // Reset designation when department changes
              }}
              className="w-48 h-8 text-xs"
            >
              <option value="all">All Departments</option>
              {departments?.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </Select>
            <Select 
              value={filterDesignationId} 
              onChange={(e) => setFilterDesignationId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-48 h-8 text-xs"
            >
              <option value="all">All Designations</option>
              {designations?.filter(d => filterDepartmentId === 'all' || d.department === filterDepartmentId).map(d => (
                <option key={d.id} value={d.id}>
                  {getDepartmentName(d.department)} - {d.title}
                </option>
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
              Failed to load employee directory. Please try again.
            </div>
          ) : !employees || employees.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center mb-3">
                <Users2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No Employees Found</h3>
              <p className="text-sm text-muted-foreground max-w-md mt-1 mb-4">
                Get started by onboarding the first employee into the system.
              </p>
              <Button onClick={handleCreateNew} variant="outline">
                <Plus className="w-4 h-4 mr-1.5" /> Onboard Employee
              </Button>
            </div>
          ) : filteredEmployees.length === 0 ? (
             <div className="py-12 text-center text-muted-foreground font-medium text-sm">
                No employees match the selected department filter.
             </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-secondary/40 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3 px-6">Employee</th>
                  <th className="py-3 px-6">Role {!isGrouped && "& Department"}</th>
                  <th className="py-3 px-6">Contact</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-medium text-foreground">
                
                {!isGrouped ? (
                  // Flat List
                  filteredEmployees.map((emp) => renderRow(emp, false))
                ) : (
                  // Grouped List
                  Object.keys(groupedEmployees).map((deptIdStr) => {
                    const deptId = parseInt(deptIdStr, 10);
                    const empList = groupedEmployees[deptId];
                    return (
                      <React.Fragment key={deptId}>
                        <tr className="bg-muted/50 border-y border-border/40">
                          <td colSpan={5} className="py-2.5 px-6 font-bold text-sm text-foreground text-primary">
                            {getDepartmentName(deptId)} 
                            <span className="ml-2 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{empList.length}</span>
                          </td>
                        </tr>
                        {empList.map((emp) => renderRow(emp, true))}
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

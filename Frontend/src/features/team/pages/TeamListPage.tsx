import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Users, Plus, Edit2, Trash2, LayoutList, Layers } from 'lucide-react';
import { useTeams, useDeleteTeam } from '../api';
import { Team } from '../types';
import { TeamForm } from '../components/TeamForm';
import { useDepartments } from '@/features/department/api';
import { useEmployees } from '@/features/employee/api';
import { cn } from '@/lib/utils';

export const TeamListPage: React.FC = () => {
  const { data: teams, isLoading, isError } = useTeams();
  const { data: departments } = useDepartments();
  const { data: employees } = useEmployees();
  const deleteMutation = useDeleteTeam();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | undefined>(undefined);
  
  // Filter and Group state
  const [filterDepartmentId, setFilterDepartmentId] = useState<number | 'all'>('all');
  const [isGrouped, setIsGrouped] = useState(true);

  const handleCreateNew = () => {
    setEditingTeam(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
  };

  if (isFormOpen) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <TeamForm
          initialData={editingTeam}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsFormOpen(false)}
        />
      </div>
    );
  }

  // Helpers
  const getDepartmentName = (id: number) => {
    const dept = departments?.find((d) => d.id === id);
    return dept ? dept.name : 'Unknown';
  };

  const getTeamLeadName = (id: number | null) => {
    if (!id) return 'Unassigned';
    const emp = employees?.find((e) => e.id === id);
    return emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown';
  };

  // 1. Filter Teams
  const filteredTeams = teams?.filter(t => 
    filterDepartmentId === 'all' || t.department === filterDepartmentId
  ) || [];

  // 2. Group Teams (if enabled)
  const groupedTeams = useMemo(() => {
    const groups: Record<number, Team[]> = {};
    filteredTeams.forEach(team => {
      if (!groups[team.department]) {
        groups[team.department] = [];
      }
      groups[team.department].push(team);
    });
    return groups;
  }, [filteredTeams]);

  // Row Renderer
  const renderRow = (team: Team, hideDepartmentCol: boolean = false) => (
    <tr key={team.id} className="hover:bg-muted/30 transition-colors group">
      <td className={cn("py-3 px-6", hideDepartmentCol && "pl-10")}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground shrink-0 border border-border/50">
            <Users className="w-4 h-4" />
          </div>
          <span className="font-semibold text-foreground">{team.name}</span>
        </div>
      </td>
      <td className="py-3 px-6">{team.code}</td>
      {!hideDepartmentCol && <td className="py-3 px-6 text-muted-foreground">{getDepartmentName(team.department)}</td>}
      <td className="py-3 px-6 text-muted-foreground">
        {getTeamLeadName(team.team_lead)}
      </td>
      <td className="py-3 px-6 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(team)} className="h-8 w-8 text-muted-foreground hover:text-primary">
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(team.id)} className="h-8 w-8 text-muted-foreground hover:text-status-danger">
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teams"
        description="Manage cross-functional units and departmental teams."
        actions={
          <Button onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-1.5" /> Add Team
          </Button>
        }
      />
      
      {/* Filters and Grouping Bar */}
      {(!isLoading && !isError && teams && teams.length > 0) && (
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
              Failed to load teams. Please try again.
            </div>
          ) : !teams || teams.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 flex items-center justify-center mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No Teams Found</h3>
              <p className="text-sm text-muted-foreground max-w-md mt-1 mb-4">
                Get started by creating the first team in your organization.
              </p>
              <Button onClick={handleCreateNew} variant="outline">
                <Plus className="w-4 h-4 mr-1.5" /> Create Team
              </Button>
            </div>
          ) : filteredTeams.length === 0 ? (
             <div className="py-12 text-center text-muted-foreground font-medium text-sm">
                No teams match the selected department filter.
             </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-secondary/40 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3 px-6">Team Name</th>
                  <th className="py-3 px-6">Code</th>
                  {!isGrouped && <th className="py-3 px-6">Department</th>}
                  <th className="py-3 px-6">Team Lead</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-medium text-foreground">
                
                {!isGrouped ? (
                  // Flat List
                  filteredTeams.map((team) => renderRow(team, false))
                ) : (
                  // Grouped List
                  Object.keys(groupedTeams).map((deptIdStr) => {
                    const deptId = parseInt(deptIdStr, 10);
                    const tmList = groupedTeams[deptId];
                    return (
                      <React.Fragment key={deptId}>
                        <tr className="bg-muted/50 border-y border-border/40">
                          <td colSpan={4} className="py-2.5 px-6 font-bold text-sm text-foreground text-primary">
                            {getDepartmentName(deptId)} 
                            <span className="ml-2 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{tmList.length}</span>
                          </td>
                        </tr>
                        {tmList.map((team) => renderRow(team, true))}
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

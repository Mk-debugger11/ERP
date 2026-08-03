import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { teamSchema, TeamFormData } from '../schemas';
import { Team } from '../types';
import { useCreateTeam, useUpdateTeam } from '../api';
import { useDepartments } from '@/features/department/api';
import { useEmployees } from '@/features/employee/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface TeamFormProps {
  initialData?: Team;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const TeamForm: React.FC<TeamFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const isEditing = !!initialData;
  const createMutation = useCreateTeam();
  const updateMutation = useUpdateTeam();
  
  const { data: departments } = useDepartments();
  const { data: employees } = useEmployees();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: initialData?.name || '',
      code: initialData?.code || '',
      description: initialData?.description || '',
      department: initialData?.department || (departments?.[0]?.id ?? 0),
      team_lead: initialData?.team_lead || null,
    },
  });

  const onSubmit = (data: TeamFormData) => {
    // If team_lead is empty string or 0, set to null for backend
    const submissionData = {
      ...data,
      team_lead: data.team_lead ? data.team_lead : null,
    };
    
    if (isEditing) {
      updateMutation.mutate(
        { id: initialData.id, data: submissionData },
        { onSuccess }
      );
    } else {
      createMutation.mutate(submissionData, { onSuccess });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Card className="border border-border/70 shadow-sm max-w-lg w-full">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Team' : 'Create Team'}</CardTitle>
        <CardDescription>
          {isEditing ? 'Update the details of the team.' : 'Add a new team to a department.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Team Name <span className="text-status-danger">*</span></Label>
              <Input id="name" placeholder="e.g. Frontend Squad" {...register('name')} />
              {errors.name && <p className="text-[11px] text-status-danger font-medium">{errors.name.message}</p>}
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="code">Team Code <span className="text-status-danger">*</span></Label>
              <Input id="code" placeholder="e.g. T-FE" {...register('code')} />
              {errors.code && <p className="text-[11px] text-status-danger font-medium">{errors.code.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="department">Department <span className="text-status-danger">*</span></Label>
            <Select id="department" {...register('department', { valueAsNumber: true })}>
              <option value="">Select a department...</option>
              {departments?.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </Select>
            {errors.department && <p className="text-[11px] text-status-danger font-medium">{errors.department.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="team_lead">Team Lead (Optional)</Label>
            <Select id="team_lead" {...register('team_lead', { 
              setValueAs: v => v === "" || v === "0" ? null : parseInt(v, 10) 
            })}>
              <option value="">None / Unassigned</option>
              {employees?.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
              ))}
            </Select>
            {errors.team_lead && <p className="text-[11px] text-status-danger font-medium">{errors.team_lead.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Optional details about this team"
              {...register('description')}
            />
            {errors.description && <p className="text-[11px] text-status-danger font-medium">{errors.description.message}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40 mt-6">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
                Cancel
              </Button>
            )}
            <Button type="submit" isLoading={isPending}>
              {isEditing ? 'Save Changes' : 'Create Team'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

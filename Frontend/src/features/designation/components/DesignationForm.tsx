import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { designationSchema, DesignationFormData } from '../schemas';
import { Designation } from '../types';
import { useCreateDesignation, useUpdateDesignation } from '../api';
import { useDepartments } from '@/features/department/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface DesignationFormProps {
  initialData?: Designation;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const DesignationForm: React.FC<DesignationFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const isEditing = !!initialData;
  const createMutation = useCreateDesignation();
  const updateMutation = useUpdateDesignation();
  const { data: departments } = useDepartments();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DesignationFormData>({
    resolver: zodResolver(designationSchema),
    defaultValues: {
      title: initialData?.title || '',
      code: initialData?.code || '',
      description: initialData?.description || '',
      department: initialData?.department || (departments?.[0]?.id ?? 0),
      level: initialData?.level || 1,
    },
  });

  const onSubmit = (data: DesignationFormData) => {
    if (isEditing) {
      updateMutation.mutate(
        { id: initialData.id, data },
        { onSuccess }
      );
    } else {
      createMutation.mutate(data, { onSuccess });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Card className="border border-border/70 shadow-sm max-w-lg w-full">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Designation' : 'Create Designation'}</CardTitle>
        <CardDescription>
          {isEditing ? 'Update the details of the designation.' : 'Add a new job title/designation to the organization.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Job Title <span className="text-status-danger">*</span></Label>
            <Input
              id="title"
              placeholder="e.g. Senior Software Engineer"
              {...register('title')}
            />
            {errors.title && <p className="text-[11px] text-status-danger font-medium">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="code">Code <span className="text-status-danger">*</span></Label>
              <Input
                id="code"
                placeholder="e.g. SSE"
                {...register('code')}
              />
              {errors.code && <p className="text-[11px] text-status-danger font-medium">{errors.code.message}</p>}
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="level">Level <span className="text-status-danger">*</span></Label>
              <Input
                id="level"
                type="number"
                min="1"
                max="10"
                {...register('level', { valueAsNumber: true })}
              />
              {errors.level && <p className="text-[11px] text-status-danger font-medium">{errors.level.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="department">Department <span className="text-status-danger">*</span></Label>
            <Select id="department" {...register('department', { valueAsNumber: true })}>
              <option value="">Select a department...</option>
              {departments?.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name} ({dept.code})</option>
              ))}
            </Select>
            {errors.department && <p className="text-[11px] text-status-danger font-medium">{errors.department.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Optional details about this designation"
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
              {isEditing ? 'Save Changes' : 'Create Designation'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

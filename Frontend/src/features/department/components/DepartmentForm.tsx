import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { departmentSchema, DepartmentFormData } from '../schemas';
import { Department } from '../types';
import { useCreateDepartment, useUpdateDepartment } from '../api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface DepartmentFormProps {
  initialData?: Department;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const DepartmentForm: React.FC<DepartmentFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const isEditing = !!initialData;
  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: initialData?.name || '',
      code: initialData?.code || '',
      description: initialData?.description || '',
    },
  });

  const onSubmit = (data: DepartmentFormData) => {
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
        <CardTitle>{isEditing ? 'Edit Department' : 'Create Department'}</CardTitle>
        <CardDescription>
          {isEditing ? 'Update the details of the department.' : 'Add a new department to the organization.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Department Name <span className="text-status-danger">*</span></Label>
            <Input
              id="name"
              placeholder="e.g. Human Resources"
              {...register('name')}
            />
            {errors.name && <p className="text-[11px] text-status-danger font-medium">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="code">Department Code <span className="text-status-danger">*</span></Label>
            <Input
              id="code"
              placeholder="e.g. HR"
              {...register('code')}
            />
            {errors.code && <p className="text-[11px] text-status-danger font-medium">{errors.code.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Optional details about this department"
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
              {isEditing ? 'Save Changes' : 'Create Department'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

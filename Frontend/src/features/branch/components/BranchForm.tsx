import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { branchSchema, BranchFormData } from '../schemas';
import { Branch } from '../types';
import { useCreateBranch, useUpdateBranch } from '../api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface BranchFormProps {
  initialData?: Branch;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const BranchForm: React.FC<BranchFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const isEditing = !!initialData;
  const createMutation = useCreateBranch();
  const updateMutation = useUpdateBranch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: initialData?.name || '',
      code: initialData?.code || '',
      address: initialData?.address || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      country: initialData?.country || 'India',
      postal_code: initialData?.postal_code || '',
      phone: initialData?.phone || '',
      email: initialData?.email || '',
      is_head_office: initialData?.is_head_office || false,
    },
  });

  const onSubmit = (data: BranchFormData) => {
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
    <Card className="border border-border/70 shadow-sm max-w-2xl w-full">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Branch' : 'Create Branch'}</CardTitle>
        <CardDescription>
          {isEditing ? 'Update the details of the branch location.' : 'Add a new physical branch or office.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Branch Name <span className="text-status-danger">*</span></Label>
              <Input id="name" placeholder="e.g. Headquarters" {...register('name')} />
              {errors.name && <p className="text-[11px] text-status-danger font-medium">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="code">Branch Code <span className="text-status-danger">*</span></Label>
              <Input id="code" placeholder="e.g. HQ-01" {...register('code')} />
              {errors.code && <p className="text-[11px] text-status-danger font-medium">{errors.code.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address">Address <span className="text-status-danger">*</span></Label>
            <Textarea id="address" placeholder="Full street address" {...register('address')} />
            {errors.address && <p className="text-[11px] text-status-danger font-medium">{errors.address.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="city">City <span className="text-status-danger">*</span></Label>
              <Input id="city" {...register('city')} />
              {errors.city && <p className="text-[11px] text-status-danger font-medium">{errors.city.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="state">State/Province <span className="text-status-danger">*</span></Label>
              <Input id="state" {...register('state')} />
              {errors.state && <p className="text-[11px] text-status-danger font-medium">{errors.state.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="postal_code">Postal Code <span className="text-status-danger">*</span></Label>
              <Input id="postal_code" {...register('postal_code')} />
              {errors.postal_code && <p className="text-[11px] text-status-danger font-medium">{errors.postal_code.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...register('country')} />
              {errors.country && <p className="text-[11px] text-status-danger font-medium">{errors.country.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" {...register('phone')} />
              {errors.phone && <p className="text-[11px] text-status-danger font-medium">{errors.phone.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-[11px] text-status-danger font-medium">{errors.email.message}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="is_head_office" {...register('is_head_office')} className="rounded border-input text-primary focus:ring-primary" />
            <Label htmlFor="is_head_office" className="cursor-pointer">This is the Head Office</Label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40 mt-6">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
                Cancel
              </Button>
            )}
            <Button type="submit" isLoading={isPending}>
              {isEditing ? 'Save Changes' : 'Create Branch'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

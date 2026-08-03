import React, { useMemo, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeSchema, EmployeeFormData } from '../schemas';
import { Employee } from '../types';
import { useCreateEmployee, useUpdateEmployee, useEmployees } from '../api';
import { useDepartments } from '@/features/department/api';
import { useDesignations } from '@/features/designation/api';
import { useEmploymentTypes } from '@/features/employment-type/api';
import { useBranches } from '@/features/branch/api';
import { useTeams } from '@/features/team/api';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Mail, Building2, Briefcase, Check, ChevronRight, ChevronLeft } from 'lucide-react';

// ---------------------------------------------------------------------------
// Step definitions
// ---------------------------------------------------------------------------

const STEPS = [
  { id: 0, label: 'Personal', icon: User, description: 'Basic identity details' },
  { id: 1, label: 'Contact', icon: Mail, description: 'Email & phone' },
  { id: 2, label: 'Organization', icon: Building2, description: 'Department & team' },
  { id: 3, label: 'Employment', icon: Briefcase, description: 'Role & status' },
] as const;

// Fields validated on each step – allows partial validation before moving forward
const STEP_FIELDS: Record<number, (keyof EmployeeFormData)[]> = {
  0: ['employee_id', 'first_name', 'last_name', 'gender'],
  1: ['company_email', 'phone'],
  2: ['department', 'designation'],
  3: ['branch', 'employment_type', 'joining_date', 'employment_status'],
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface EmployeeFormProps {
  initialData?: Employee;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const isEditing = !!initialData;
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();

  // Reference Data
  const { data: departments } = useDepartments();
  const { data: designations } = useDesignations();
  const { data: employmentTypes } = useEmploymentTypes();
  const { data: branches } = useBranches();
  const { data: teams } = useTeams();
  const { data: employees } = useEmployees();

  const [currentStep, setCurrentStep] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    mode: 'onTouched',
    defaultValues: {
      employee_id: initialData?.employee_id || '',
      first_name: initialData?.first_name || '',
      last_name: initialData?.last_name || '',
      company_email: initialData?.company_email || '',
      personal_email: initialData?.personal_email || '',
      phone: initialData?.phone || '',
      joining_date: initialData?.joining_date || new Date().toISOString().split('T')[0],
      date_of_birth: initialData?.date_of_birth || '',
      gender: initialData?.gender || 'PREFER_NOT_TO_SAY',
      employment_status: initialData?.employment_status || 'PROBATION',
      department: initialData?.department || 0,
      designation: initialData?.designation || 0,
      employment_type: initialData?.employment_type || 0,
      branch: initialData?.branch || 0,
      team: initialData?.team || null,
      manager: initialData?.manager || null,
    },
  });

  const selectedDepartmentId = watch('department');

  const filteredDesignations = useMemo(() => {
    if (!designations) return [];
    return designations.filter(d => d.department === selectedDepartmentId);
  }, [designations, selectedDepartmentId]);

  const filteredTeams = useMemo(() => {
    if (!teams) return [];
    return teams.filter(t => t.department === selectedDepartmentId);
  }, [teams, selectedDepartmentId]);

  // ------ Navigation helpers ------

  const goNext = useCallback(async () => {
    const fieldsToValidate = STEP_FIELDS[currentStep];
    const valid = await trigger(fieldsToValidate);
    if (valid) setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  }, [currentStep, trigger]);

  const goBack = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  // ------ Submission ------

  const onSubmit = (data: EmployeeFormData) => {
    const submissionData = {
      ...data,
      team: data.team ? data.team : null,
      manager: data.manager ? data.manager : null,
      personal_email: data.personal_email || null,
      date_of_birth: data.date_of_birth || null,
    };

    if (isEditing) {
      updateMutation.mutate({ id: initialData.id, data: submissionData }, { onSuccess });
    } else {
      createMutation.mutate(submissionData, { onSuccess });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  // ------ Helpers for review ------

  const getDepartmentName = (id: number) => departments?.find(d => d.id === id)?.name ?? '—';
  const getDesignationName = (id: number) => designations?.find(d => d.id === id)?.title ?? '—';
  const getBranchName = (id: number) => branches?.find(b => b.id === id)?.name ?? '—';
  const getEmploymentTypeName = (id: number) => employmentTypes?.find(e => e.id === id)?.name ?? '—';
  const getTeamName = (id: number | null | undefined) => {
    if (!id) return 'Unassigned';
    return teams?.find(t => t.id === id)?.name ?? '—';
  };
  const getManagerName = (id: number | null | undefined) => {
    if (!id) return 'None';
    const emp = employees?.find(e => e.id === id);
    return emp ? `${emp.first_name} ${emp.last_name}` : '—';
  };

  // ===================================================================
  // RENDER
  // ===================================================================

  return (
    <Card className="border border-border/70 shadow-sm max-w-3xl w-full">
      <CardHeader className="pb-4">
        <CardTitle>{isEditing ? 'Edit Employee Profile' : 'Onboard New Employee'}</CardTitle>
        <CardDescription>
          {isEditing
            ? 'Update employee personal and organizational details.'
            : 'Complete all steps to onboard a new employee.'}
        </CardDescription>

        {/* ─── Stepper ─── */}
        <div className="flex items-center justify-between mt-6 relative">
          {/* Connecting line behind the circles */}
          <div className="absolute top-5 left-0 right-0 h-[2px] bg-border/50" />
          <div
            className="absolute top-5 left-0 h-[2px] bg-primary transition-all duration-500 ease-in-out"
            style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
          />

          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;

            return (
              <button
                key={step.id}
                type="button"
                onClick={async () => {
                  // Allow clicking completed steps to go back
                  if (step.id < currentStep) {
                    setCurrentStep(step.id);
                  }
                  // Allow clicking next step only if current validates
                  if (step.id === currentStep + 1) {
                    await goNext();
                  }
                }}
                className="relative z-10 flex flex-col items-center gap-1.5 group"
              >
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${isCompleted
                      ? 'bg-primary border-primary text-primary-foreground scale-95'
                      : isActive
                        ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/25 scale-110'
                        : 'bg-card border-border text-muted-foreground'
                    }
                  `}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span
                  className={`
                    text-[11px] font-semibold transition-colors
                    ${isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}
                  `}
                >
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step description */}
          <p className="text-xs text-muted-foreground mb-5">
            Step {currentStep + 1} of {STEPS.length} — <span className="font-medium text-foreground">{STEPS[currentStep].description}</span>
          </p>

          {/* ─────────────────── STEP 0: Personal Info ─────────────────── */}
          <div className={currentStep === 0 ? 'block transition-opacity duration-300 ease-in-out opacity-100' : 'hidden'}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="employee_id">Employee ID <span className="text-status-danger">*</span></Label>
                  <Input id="employee_id" {...register('employee_id')} placeholder="e.g. EMP-101" />
                  {errors.employee_id && <p className="text-[11px] text-status-danger font-medium">{errors.employee_id.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="first_name">First Name <span className="text-status-danger">*</span></Label>
                  <Input id="first_name" {...register('first_name')} />
                  {errors.first_name && <p className="text-[11px] text-status-danger font-medium">{errors.first_name.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="last_name">Last Name <span className="text-status-danger">*</span></Label>
                  <Input id="last_name" {...register('last_name')} />
                  {errors.last_name && <p className="text-[11px] text-status-danger font-medium">{errors.last_name.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input id="date_of_birth" type="date" {...register('date_of_birth')} />
                  {errors.date_of_birth && <p className="text-[11px] text-status-danger font-medium">{errors.date_of_birth.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="gender">Gender <span className="text-status-danger">*</span></Label>
                  <Select id="gender" {...register('gender')}>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                    <option value="PREFER_NOT_TO_SAY">Prefer Not to Say</option>
                  </Select>
                  {errors.gender && <p className="text-[11px] text-status-danger font-medium">{errors.gender.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────── STEP 1: Contact Info ─────────────────── */}
          <div className={currentStep === 1 ? 'block transition-opacity duration-300 ease-in-out opacity-100' : 'hidden'}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="company_email">Company Email <span className="text-status-danger">*</span></Label>
                  <Input id="company_email" type="email" {...register('company_email')} />
                  {errors.company_email && <p className="text-[11px] text-status-danger font-medium">{errors.company_email.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="personal_email">Personal Email</Label>
                  <Input id="personal_email" type="email" {...register('personal_email')} />
                  {errors.personal_email && <p className="text-[11px] text-status-danger font-medium">{errors.personal_email.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone Number <span className="text-status-danger">*</span></Label>
                  <Input id="phone" {...register('phone')} />
                  {errors.phone && <p className="text-[11px] text-status-danger font-medium">{errors.phone.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────── STEP 2: Organization ─────────────────── */}
          <div className={currentStep === 2 ? 'block transition-opacity duration-300 ease-in-out opacity-100' : 'hidden'}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="department">Department <span className="text-status-danger">*</span></Label>
                  <Select id="department" {...register('department', { valueAsNumber: true })}>
                    <option value="">Select Department…</option>
                    {departments?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </Select>
                  {errors.department && <p className="text-[11px] text-status-danger font-medium">{errors.department.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="designation">Designation <span className="text-status-danger">*</span></Label>
                  <Select id="designation" {...register('designation', { valueAsNumber: true })} disabled={!selectedDepartmentId}>
                    <option value="">Select Designation…</option>
                    {filteredDesignations.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
                  </Select>
                  {errors.designation && <p className="text-[11px] text-status-danger font-medium">{errors.designation.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="team">Team (Optional)</Label>
                  <Select id="team" {...register('team', { setValueAs: v => v === '' || v === '0' ? null : parseInt(v, 10) })} disabled={!selectedDepartmentId}>
                    <option value="">Unassigned</option>
                    {filteredTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </Select>
                  {errors.team && <p className="text-[11px] text-status-danger font-medium">{errors.team.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="manager">Reporting Manager (Optional)</Label>
                  <Select id="manager" {...register('manager', { setValueAs: v => v === '' || v === '0' ? null : parseInt(v, 10) })}>
                    <option value="">None</option>
                    {employees?.map(e => (
                      (!isEditing || e.id !== initialData.id) && (
                        <option key={e.id} value={e.id}>{e.first_name} {e.last_name} ({e.employee_id})</option>
                      )
                    ))}
                  </Select>
                  {errors.manager && <p className="text-[11px] text-status-danger font-medium">{errors.manager.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────── STEP 3: Employment Details + Review ─────────────────── */}
          <div className={currentStep === 3 ? 'block transition-opacity duration-300 ease-in-out opacity-100' : 'hidden'}>
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="branch">Branch <span className="text-status-danger">*</span></Label>
                  <Select id="branch" {...register('branch', { valueAsNumber: true })}>
                    <option value="">Select Branch…</option>
                    {branches?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </Select>
                  {errors.branch && <p className="text-[11px] text-status-danger font-medium">{errors.branch.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="employment_type">Employment Type <span className="text-status-danger">*</span></Label>
                  <Select id="employment_type" {...register('employment_type', { valueAsNumber: true })}>
                    <option value="">Select Type…</option>
                    {employmentTypes?.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </Select>
                  {errors.employment_type && <p className="text-[11px] text-status-danger font-medium">{errors.employment_type.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="joining_date">Joining Date <span className="text-status-danger">*</span></Label>
                  <Input id="joining_date" type="date" {...register('joining_date')} />
                  {errors.joining_date && <p className="text-[11px] text-status-danger font-medium">{errors.joining_date.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="employment_status">Status <span className="text-status-danger">*</span></Label>
                  <Select id="employment_status" {...register('employment_status')}>
                    <option value="PROBATION">Probation</option>
                    <option value="ACTIVE">Active</option>
                    <option value="NOTICE_PERIOD">Notice Period</option>
                    <option value="RESIGNED">Resigned</option>
                    <option value="TERMINATED">Terminated</option>
                  </Select>
                  {errors.employment_status && <p className="text-[11px] text-status-danger font-medium">{errors.employment_status.message}</p>}
                </div>
              </div>

              {/* ── Inline Review Summary ── */}
              <div className="mt-4 rounded-xl border border-border/60 bg-secondary/30 p-4 space-y-3">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-primary" /> Review Summary
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-[12px]">
                  <ReviewItem label="Employee ID" value={getValues('employee_id')} />
                  <ReviewItem label="Name" value={`${getValues('first_name')} ${getValues('last_name')}`} />
                  <ReviewItem label="Gender" value={getValues('gender')?.replace(/_/g, ' ')} />
                  <ReviewItem label="Company Email" value={getValues('company_email')} />
                  <ReviewItem label="Phone" value={getValues('phone')} />
                  <ReviewItem label="Department" value={getDepartmentName(getValues('department'))} />
                  <ReviewItem label="Designation" value={getDesignationName(getValues('designation'))} />
                  <ReviewItem label="Team" value={getTeamName(getValues('team'))} />
                  <ReviewItem label="Manager" value={getManagerName(getValues('manager'))} />
                  <ReviewItem label="Branch" value={getBranchName(getValues('branch'))} />
                  <ReviewItem label="Type" value={getEmploymentTypeName(getValues('employment_type'))} />
                  <ReviewItem label="Joining" value={getValues('joining_date')} />
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────── Navigation Footer ─────────────────── */}
          <div className="flex items-center justify-between pt-5 border-t border-border/40 mt-6">
            <div>
              {onCancel && currentStep === 0 && (
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isPending}>
                  Cancel
                </Button>
              )}
              {currentStep > 0 && (
                <Button type="button" variant="outline" onClick={goBack} disabled={isPending}>
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {currentStep < STEPS.length - 1 ? (
                <Button type="button" onClick={goNext}>
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button type="submit" isLoading={isPending}>
                  {isEditing ? 'Save Changes' : 'Onboard Employee'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// ---------------------------------------------------------------------------
// Tiny helper for the review grid
// ---------------------------------------------------------------------------

const ReviewItem: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => (
  <div>
    <span className="text-muted-foreground">{label}</span>
    <p className="font-medium text-foreground truncate">{value || '—'}</p>
  </div>
);

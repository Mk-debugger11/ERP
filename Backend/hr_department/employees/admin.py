from django.contrib import admin

from .models import Branch, Department, Designation, Employee, EmploymentType, Team


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'code', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('name', 'code')
    ordering = ('name',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Designation)
class DesignationAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'code', 'department', 'level', 'is_active', 'created_at')
    list_filter = ('department', 'level', 'is_active')
    search_fields = ('title', 'code', 'department__name')
    ordering = ('department', 'level', 'title')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(EmploymentType)
class EmploymentTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'code', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('name', 'code')
    ordering = ('name',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'code', 'city', 'state', 'country', 'is_head_office', 'is_active')
    list_filter = ('is_head_office', 'is_active', 'country', 'state')
    search_fields = ('name', 'code', 'city', 'state', 'email')
    ordering = ('name',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'code', 'department', 'team_lead', 'is_active', 'created_at')
    list_filter = ('department', 'is_active')
    search_fields = ('name', 'code', 'department__name')
    ordering = ('department', 'name')
    raw_id_fields = ('team_lead',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = (
        'employee_id', 
        'first_name', 
        'last_name', 
        'company_email', 
        'department', 
        'designation', 
        'branch', 
        'employment_status', 
        'is_active'
    )
    list_filter = (
        'department', 
        'designation', 
        'employment_type', 
        'branch', 
        'team', 
        'employment_status', 
        'gender', 
        'is_active'
    )
    search_fields = (
        'employee_id', 
        'first_name', 
        'last_name', 
        'company_email', 
        'personal_email', 
        'phone'
    )
    ordering = ('employee_id',)
    raw_id_fields = ('manager',)
    readonly_fields = ('created_at', 'updated_at')

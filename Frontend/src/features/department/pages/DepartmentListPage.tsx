import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Plus } from 'lucide-react';

export const DepartmentListPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Departments"
        description="Manage company organizational departments and units."
        actions={
          <Button>
            <Plus className="w-4 h-4 mr-1.5" /> Add Department
          </Button>
        }
      />
      <Card>
        <CardContent className="py-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center justify-center mb-3">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Departments Master Data</h3>
          <p className="text-sm text-muted-foreground max-w-md mt-1">
            Endpoint `/api/hr/departments/` ready for CRUD operations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

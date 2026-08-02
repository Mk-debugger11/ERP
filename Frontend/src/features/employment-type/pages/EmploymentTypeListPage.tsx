import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileBadge, Plus } from 'lucide-react';

export const EmploymentTypeListPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Employment Types"
        description="Manage employment categories (Full-Time, Part-Time, Contract, Internship)."
        actions={
          <Button>
            <Plus className="w-4 h-4 mr-1.5" /> Add Employment Type
          </Button>
        }
      />
      <Card>
        <CardContent className="py-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 flex items-center justify-center mb-3">
            <FileBadge className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Employment Types Master Data</h3>
          <p className="text-sm text-muted-foreground max-w-md mt-1">
            Endpoint `/api/hr/employment-types/` ready for CRUD operations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

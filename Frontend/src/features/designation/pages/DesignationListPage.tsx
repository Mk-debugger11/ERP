import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Plus } from 'lucide-react';

export const DesignationListPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Designations"
        description="Manage organizational job titles, codes, and seniority levels."
        actions={
          <Button>
            <Plus className="w-4 h-4 mr-1.5" /> Add Designation
          </Button>
        }
      />
      <Card>
        <CardContent className="py-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 flex items-center justify-center mb-3">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Designations Master Data</h3>
          <p className="text-sm text-muted-foreground max-w-md mt-1">
            Endpoint `/api/hr/designations/` ready for CRUD operations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

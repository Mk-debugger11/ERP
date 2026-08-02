import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserCheck, Plus } from 'lucide-react';

export const TeamListPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Teams"
        description="Manage sub-teams within departments and assign team leads."
        actions={
          <Button>
            <Plus className="w-4 h-4 mr-1.5" /> Add Team
          </Button>
        }
      />
      <Card>
        <CardContent className="py-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center mb-3">
            <UserCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Teams Master Data</h3>
          <p className="text-sm text-muted-foreground max-w-md mt-1">
            Endpoint `/api/hr/teams/` ready for CRUD operations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

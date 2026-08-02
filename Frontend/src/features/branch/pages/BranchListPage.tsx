import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Plus } from 'lucide-react';

export const BranchListPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Branches"
        description="Manage company physical office locations and remote hubs."
        actions={
          <Button>
            <Plus className="w-4 h-4 mr-1.5" /> Add Branch
          </Button>
        }
      />
      <Card>
        <CardContent className="py-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 flex items-center justify-center mb-3">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Branches Master Data</h3>
          <p className="text-sm text-muted-foreground max-w-md mt-1">
            Endpoint `/api/hr/branches/` ready for CRUD operations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

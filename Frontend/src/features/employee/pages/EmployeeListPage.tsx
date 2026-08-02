import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmployeeListPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Employee Directory"
        description="Central single source of truth for all enterprise employee records."
        actions={
          <Link to="/employees/new">
            <Button>
              <Plus className="w-4 h-4 mr-1.5" /> Add Employee
            </Button>
          </Link>
        }
      />

      <Card>
        <CardContent className="py-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-blueberry-50 text-blueberry-600 dark:bg-blueberry-900/30 dark:text-blueberry-400 flex items-center justify-center mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Phase 1 Foundation Ready</h3>
          <p className="text-sm text-muted-foreground max-w-md mt-1 mb-4">
            Employee management list, filters, search, pagination, detail profile, and multi-section forms ready for Phase 2 implementation.
          </p>
          <Link to="/employees/new">
            <Button variant="secondary">
              <Plus className="w-4 h-4 mr-1.5" /> Test Add Employee Route
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

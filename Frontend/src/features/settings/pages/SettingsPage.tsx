import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="System preferences, API integration, and general HR module settings."
      />
      <Card>
        <CardContent className="py-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400 flex items-center justify-center mb-3">
            <Settings className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">ERP Settings</h3>
          <p className="text-sm text-muted-foreground max-w-md mt-1">
            System configuration and role-based permissions settings.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

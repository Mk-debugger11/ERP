import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-4 px-6 border-t border-border bg-card text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2 transition-colors">
      <div className="flex items-center gap-2">
        <span className="font-bold text-foreground">ApexERP</span>
        <span>© {new Date().getFullYear()} Enterprise Systems Inc. All rights reserved.</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-muted-foreground">Version 1.0.0 (Enterprise)</span>
      </div>
    </footer>
  );
};

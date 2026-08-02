import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNameMap: Record<string, string> = {
  dashboard: 'Dashboard',
  employees: 'Employees',
  new: 'Add Employee',
  edit: 'Edit',
  departments: 'Departments',
  designations: 'Designations',
  teams: 'Teams',
  branches: 'Branches',
  'employment-types': 'Employment Types',
  settings: 'Settings',
};

export const BreadcrumbNav: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex items-center text-xs font-medium text-muted-foreground py-1" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <Home className="w-3.5 h-3.5 mr-1.5" />
            <span>Home</span>
          </Link>
        </li>

        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const displayName = routeNameMap[value] || (isNaN(Number(value)) ? value : `#${value}`);

          return (
            <li key={to}>
              <div className="flex items-center">
                <ChevronRight className="w-3.5 h-3.5 text-muted mx-1" />
                {isLast ? (
                  <span className="font-semibold text-foreground">{displayName}</span>
                ) : (
                  <Link to={to} className="text-muted-foreground hover:text-primary transition-colors">
                    {displayName}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

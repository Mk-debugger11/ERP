import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: 'ACTIVE' | 'PROBATION' | 'NOTICE_PERIOD' | 'RESIGNED' | 'TERMINATED' | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const normalizedStatus = status?.toUpperCase() || 'PROBATION';

  switch (normalizedStatus) {
    case 'ACTIVE':
      return <Badge variant="active" className={className}>Active</Badge>;
    case 'PROBATION':
      return <Badge variant="probation" className={className}>Probation</Badge>;
    case 'NOTICE_PERIOD':
      return <Badge variant="warning" className={className}>Notice Period</Badge>;
    case 'RESIGNED':
      return <Badge variant="neutral" className={className}>Resigned</Badge>;
    case 'TERMINATED':
      return <Badge variant="danger" className={className}>Terminated</Badge>;
    default:
      return <Badge variant="neutral" className={className}>{status}</Badge>;
  }
};

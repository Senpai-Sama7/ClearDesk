import { classNames } from '../../utils/formatters';
import type { DocumentPriority, DocumentStatus } from '../../types/document';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  className 
}: BadgeProps) {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-purple-100 text-purple-800',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={classNames(
        'inline-flex items-center font-medium rounded-full',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}

interface PriorityBadgeProps {
  priority: DocumentPriority;
  size?: 'sm' | 'md' | 'lg';
}

export function PriorityBadge({ priority, size = 'sm' }: PriorityBadgeProps) {
  const variantMap: Record<DocumentPriority, BadgeProps['variant']> = {
    critical: 'danger',
    high: 'warning',
    medium: 'info',
    low: 'success',
  };

  const labelMap: Record<DocumentPriority, string> = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };

  return (
    <Badge variant={variantMap[priority]} size={size}>
      {labelMap[priority]}
    </Badge>
  );
}

interface StatusBadgeProps {
  status: DocumentStatus;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const variantMap: Record<DocumentStatus, BadgeProps['variant']> = {
    pending: 'default',
    processing: 'primary',
    review: 'info',
    completed: 'success',
    escalated: 'danger',
  };

  const labelMap: Record<DocumentStatus, string> = {
    pending: 'Pending',
    processing: 'Processing',
    review: 'In Review',
    completed: 'Completed',
    escalated: 'Escalated',
  };

  return (
    <Badge variant={variantMap[status]} size={size}>
      {labelMap[status]}
    </Badge>
  );
}

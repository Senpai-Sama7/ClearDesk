import { format, formatDistanceToNow, parseISO } from 'date-fns';
import type { DocumentPriority, DocumentStatus, DocumentType } from '../types/document';

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'N/A';
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string | undefined): string {
  if (!dateString) return 'N/A';
  try {
    return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
  } catch {
    return dateString;
  }
}

export function formatRelativeTime(dateString: string | undefined): string {
  if (!dateString) return 'N/A';
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  } catch {
    return dateString;
  }
}

export function formatCurrency(amount: number | undefined, currency: string = 'USD'): string {
  if (amount === undefined || amount === null) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getPriorityColor(priority: DocumentPriority): string {
  const colors: Record<DocumentPriority, string> = {
    critical: 'bg-red-500 text-white',
    high: 'bg-orange-500 text-white',
    medium: 'bg-yellow-500 text-gray-900',
    low: 'bg-green-500 text-white',
  };
  return colors[priority] || 'bg-gray-500 text-white';
}

export function getStatusColor(status: DocumentStatus): string {
  const colors: Record<DocumentStatus, string> = {
    pending: 'bg-gray-500 text-white',
    processing: 'bg-blue-500 text-white',
    review: 'bg-purple-500 text-white',
    completed: 'bg-green-500 text-white',
    escalated: 'bg-red-600 text-white',
  };
  return colors[status] || 'bg-gray-500 text-white';
}

export function getStatusIcon(status: DocumentStatus): string {
  const icons: Record<DocumentStatus, string> = {
    pending: 'clock',
    processing: 'loader',
    review: 'eye',
    completed: 'check-circle',
    escalated: 'alert-triangle',
  };
  return icons[status] || 'file';
}

export function getDocumentTypeIcon(type: DocumentType): string {
  const icons: Record<DocumentType, string> = {
    invoice: 'file-text',
    statement: 'file-spreadsheet',
    payment_confirmation: 'credit-card',
    dispute: 'alert-circle',
    credit_note: 'minus-circle',
    other: 'file',
  };
  return icons[type] || 'file';
}

export function getDocumentTypeLabel(type: DocumentType): string {
  const labels: Record<DocumentType, string> = {
    invoice: 'Invoice',
    statement: 'Statement',
    payment_confirmation: 'Payment Confirmation',
    dispute: 'Dispute',
    credit_note: 'Credit Note',
    other: 'Other',
  };
  return labels[type] || 'Document';
}

export function getPriorityLabel(priority: DocumentPriority): string {
  const labels: Record<DocumentPriority, string> = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };
  return labels[priority] || priority;
}

export function getStatusLabel(status: DocumentStatus): string {
  const labels: Record<DocumentStatus, string> = {
    pending: 'Pending',
    processing: 'Processing',
    review: 'In Review',
    completed: 'Completed',
    escalated: 'Escalated',
  };
  return labels[status] || status;
}

export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

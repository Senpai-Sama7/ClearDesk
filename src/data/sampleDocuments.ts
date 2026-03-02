import type { Document } from '../types/document';

export const sampleDocuments: Document[] = [
  {
    id: 'doc-001',
    filename: 'invoice_acme_47592.pdf',
    originalName: 'Invoice_ACME_Corp_47592.pdf',
    type: 'invoice',
    status: 'completed',
    priority: 'high',
    extractedData: {
      customerName: 'Acme Corporation',
      customerId: 'ACM-2024-001',
      invoiceNumber: 'INV-47592',
      invoiceDate: '2024-02-15',
      dueDate: '2024-03-15',
      amount: 15750.00,
      currency: 'USD',
      accountNumber: 'AC-88475632',
      paymentTerms: 'Net 30',
      notes: 'Software licensing renewal - Q1 2024',
      confidence: 0.96,
    },
    isEscalated: false,
    assignee: 'Sarah Chen',
    createdAt: '2024-02-15T09:23:00Z',
    updatedAt: '2024-02-15T14:45:00Z',
    processedAt: '2024-02-15T14:45:00Z',
    notes: 'Customer has confirmed receipt. Payment expected by due date.',
    tags: ['enterprise', 'licensing', 'renewal'],
  },
  {
    id: 'doc-002',
    filename: 'payment_confirmation_globex.txt',
    originalName: 'Payment_Confirmation_Globex_Industries.txt',
    type: 'payment_confirmation',
    status: 'review',
    priority: 'critical',
    extractedData: {
      customerName: 'Globex Industries',
      customerId: 'GLB-789456',
      invoiceNumber: 'INV-47123',
      invoiceDate: '2024-01-20',
      amount: 45230.50,
      currency: 'USD',
      accountNumber: 'GL-44556677',
      notes: 'Wire transfer received - Reference #WT-9988776655',
      confidence: 0.72,
    },
    escalationReasons: [
      {
        type: 'high_value',
        description: 'Payment amount exceeds $40,000 threshold requiring verification',
      },
      {
        type: 'missing_data',
        description: 'Unable to confirm invoice date from document',
        field: 'invoiceDate',
      },
    ],
    isEscalated: true,
    assignee: 'Mike Rodriguez',
    createdAt: '2024-02-14T16:45:00Z',
    updatedAt: '2024-02-14T18:30:00Z',
    notes: 'Large payment received. Verify against invoice #INV-47123.',
    tags: ['high-value', 'wire-transfer', 'verification-needed'],
  },
  {
    id: 'doc-003',
    filename: 'dispute_techcorp_letter.pdf',
    originalName: 'Billing_Dispute_TechCorp_Solutions.pdf',
    type: 'dispute',
    status: 'escalated',
    priority: 'critical',
    extractedData: {
      customerName: 'TechCorp Solutions',
      customerId: 'TCS-456789',
      invoiceNumber: 'INV-46890',
      invoiceDate: '2024-01-10',
      dueDate: '2024-02-10',
      amount: 8950.00,
      currency: 'USD',
      accountNumber: 'TC-11223344',
      notes: 'Customer disputes charge for implementation services',
      confidence: 0.88,
    },
    escalationReasons: [
      {
        type: 'manual_review',
        description: 'Billing dispute requires account manager intervention',
      },
      {
        type: 'ambiguous',
        description: 'Customer mentions multiple invoices in dispute',
      },
    ],
    isEscalated: true,
    assignee: 'Jennifer Park',
    createdAt: '2024-02-13T11:20:00Z',
    updatedAt: '2024-02-14T09:15:00Z',
    notes: 'Customer claims services were not delivered as specified. Escalated to account management team.',
    tags: ['dispute', 'implementation', 'urgent'],
  },
  {
    id: 'doc-004',
    filename: 'statement_stark_enterprises.pdf',
    originalName: 'Monthly_Statement_Stark_Enterprises_Feb2024.pdf',
    type: 'statement',
    status: 'pending',
    priority: 'medium',
    isEscalated: false,
    createdAt: '2024-02-16T08:00:00Z',
    updatedAt: '2024-02-16T08:00:00Z',
    notes: 'Monthly statement for February 2024. Awaiting processing.',
    tags: ['statement', 'monthly', 'batch-processing'],
  },
];

export const teamMembers = [
  { id: 'user-001', name: 'Sarah Chen', role: 'Senior AR Specialist', active: true },
  { id: 'user-002', name: 'Mike Rodriguez', role: 'AR Analyst', active: true },
  { id: 'user-003', name: 'Jennifer Park', role: 'Account Manager', active: true },
  { id: 'user-004', name: 'David Thompson', role: 'Collections Specialist', active: true },
  { id: 'user-005', name: 'Lisa Wong', role: 'AR Specialist', active: false },
];

export const documentTypeLabels: Record<string, string> = {
  invoice: 'Invoice',
  statement: 'Statement',
  payment_confirmation: 'Payment Confirmation',
  dispute: 'Dispute',
  credit_note: 'Credit Note',
  other: 'Other',
};

export const statusLabels: Record<string, string> = {
  pending: 'Pending',
  processing: 'Processing',
  review: 'In Review',
  completed: 'Completed',
  escalated: 'Escalated',
};

export const priorityLabels: Record<string, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

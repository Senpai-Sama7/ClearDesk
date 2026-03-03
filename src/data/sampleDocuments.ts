import type { Document } from '../types/document';

const ago = (h: number) => new Date(Date.now() - h * 3600000).toISOString();

export const sampleDocuments: Document[] = [
  {
    id: 'demo-001', filename: 'INV-2024-1847.txt', originalName: 'INV-2024-1847.txt',
    type: 'invoice', status: 'completed', priority: 'medium', isEscalated: false,
    assignee: 'Sarah Chen', tags: ['auto-processed'],
    createdAt: ago(4), updatedAt: ago(3.5), processedAt: ago(3.5),
    fileContent: 'INVOICE #INV-2024-1847\nDate: 2024-11-15\nDue: 2024-12-15\n\nBill To: Meridian Supply Co.\nAccount: ACC-4420\nCustomer ID: CUST-7831\n\nDescription: Q4 consulting services — process optimization\nAmount: $8,450.00 USD\nPayment Terms: Net 30\n\nPlease remit payment to account on file.',
    extractedData: {
      customerName: 'Meridian Supply Co.', customerId: 'CUST-7831',
      invoiceNumber: 'INV-2024-1847', invoiceDate: '2024-11-15', dueDate: '2024-12-15',
      amount: 8450, currency: 'USD', accountNumber: 'ACC-4420',
      paymentTerms: 'Net 30', notes: 'Q4 consulting services — process optimization', confidence: 0.96,
    },
    escalationReasons: [],
    notes: 'Standard invoice. All fields extracted with high confidence. Amount within normal range for this customer.',
  },
  {
    id: 'demo-002', filename: 'collections-notice-9402.txt', originalName: 'collections-notice-9402.txt',
    type: 'statement', status: 'review', priority: 'high', isEscalated: false,
    assignee: 'David Thompson', tags: ['missing-fields', 'needs-review'],
    createdAt: ago(2), updatedAt: ago(1.5), processedAt: ago(1.5),
    fileContent: 'PAST DUE NOTICE\n\nTo: Apex Industrial\nRe: Outstanding balance\n\nThis is a reminder that your account is 47 days past due.\nOutstanding amount: $14,200\n\nPlease contact our collections department immediately.\nFailure to respond within 10 business days may result in further action.\n\nCollections Dept.',
    extractedData: {
      customerName: 'Apex Industrial', customerId: null,
      invoiceNumber: null, invoiceDate: null, dueDate: null,
      amount: 14200, currency: 'USD', accountNumber: null,
      paymentTerms: null, notes: '47 days past due. 10 business day response window.', confidence: 0.72,
    },
    escalationReasons: [
      { type: 'missing_data', description: 'No invoice number, customer ID, or account number found in document', field: 'invoiceNumber' },
      { type: 'low_confidence', description: 'Overall extraction confidence below 0.8 threshold due to missing fields', field: 'confidence' },
    ],
    notes: 'Collections notice with limited structured data. Customer name and amount extracted but no invoice reference, account number, or due date. Requires manual lookup to match against open receivables.',
  },
  {
    id: 'demo-003', filename: 'dispute-BRX-2024-088.txt', originalName: 'dispute-BRX-2024-088.txt',
    type: 'dispute', status: 'escalated', priority: 'critical', isEscalated: true,
    assignee: 'Jennifer Park', tags: ['dispute', 'high-value', 'escalated'],
    createdAt: ago(1), updatedAt: ago(0.5), processedAt: ago(0.5),
    fileContent: 'FORMAL DISPUTE NOTICE\n\nFrom: Borex Manufacturing Ltd.\nCustomer ID: CUST-2190\nAccount: ACC-8815\nDate: 2024-12-02\n\nRe: Invoice #INV-2024-2203 — $67,500.00\n\nWe are formally disputing the above invoice. The delivered goods did not match the purchase order specifications (PO-BRX-4417). Specifically:\n- 3 of 12 units arrived damaged\n- Serial numbers do not match shipping manifest\n- Delivery was 11 days late per contract terms\n\nWe request a full credit note or replacement shipment within 15 business days.\nPending resolution, we are withholding payment on this and all related invoices.\n\nRegards,\nMaria Vasquez\nHead of Procurement\nBorex Manufacturing Ltd.',
    extractedData: {
      customerName: 'Borex Manufacturing Ltd.', customerId: 'CUST-2190',
      invoiceNumber: 'INV-2024-2203', invoiceDate: null, dueDate: null,
      amount: 67500, currency: 'USD', accountNumber: 'ACC-8815',
      paymentTerms: null, notes: 'Formal dispute — damaged goods, serial number mismatch, late delivery. Customer withholding all payments.', confidence: 0.94,
    },
    escalationReasons: [
      { type: 'high_value', description: 'Invoice amount $67,500 exceeds $50,000 critical threshold', field: 'amount' },
      { type: 'manual_review', description: 'Formal dispute requires immediate human review — customer threatening payment hold on all invoices', field: 'documentType' },
    ],
    notes: 'Critical escalation. Borex Manufacturing disputing $67,500 invoice citing damaged goods, serial number discrepancies, and late delivery. Customer withholding payment on all related invoices. Requires immediate account manager review and response within 15 business days.',
  },
];

export const teamMembers = [
  { id: 'user-001', name: 'Sarah Chen', role: 'Senior AR Specialist', active: true },
  { id: 'user-002', name: 'Mike Rodriguez', role: 'AR Analyst', active: true },
  { id: 'user-003', name: 'Jennifer Park', role: 'Account Manager', active: true },
  { id: 'user-004', name: 'David Thompson', role: 'Collections Specialist', active: true },
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

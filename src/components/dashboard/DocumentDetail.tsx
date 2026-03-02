import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { PriorityBadge, StatusBadge } from '../ui/Badge';
import { useDocuments } from '../../contexts/DocumentContext';
import { teamMembers } from '../../data/sampleDocuments';
import { 
  formatDate, 
  formatDateTime, 
  formatCurrency, 
  classNames 
} from '../../utils/formatters';
import { 
  FileText, 
  User, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Tag,
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface DocumentDetailProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentDetail({ isOpen, onClose }: DocumentDetailProps) {
  const { selectedDocument, updateDocument, selectDocument, filteredDocuments } = useDocuments();

  if (!selectedDocument) return null;

  const currentIndex = filteredDocuments.findIndex(d => d.id === selectedDocument.id);
  const hasNext = currentIndex < filteredDocuments.length - 1;
  const hasPrev = currentIndex > 0;

  const goToNext = () => {
    if (hasNext) {
      selectDocument(filteredDocuments[currentIndex + 1].id);
    }
  };

  const goToPrev = () => {
    if (hasPrev) {
      selectDocument(filteredDocuments[currentIndex - 1].id);
    }
  };

  const handleAssign = (assignee: string) => {
    updateDocument(selectedDocument.id, { assignee });
  };

  const handleStatusChange = (status: typeof selectedDocument.status) => {
    updateDocument(selectedDocument.id, { status });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      showCloseButton={false}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </Button>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedDocument.originalName}
              </h2>
              <p className="text-sm text-gray-500">
                Uploaded {formatDateTime(selectedDocument.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrev}
              disabled={!hasPrev}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-500">
              {currentIndex + 1} of {filteredDocuments.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNext}
              disabled={!hasNext}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">
          {/* Left Column - Document Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Section */}
            <section className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Status & Priority</h3>
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={selectedDocument.status} size="md" />
                <PriorityBadge priority={selectedDocument.priority} size="md" />
                {selectedDocument.isEscalated && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Escalated
                  </span>
                )}
              </div>
            </section>

            {/* Extracted Data */}
            {selectedDocument.extractedData && (
              <section>
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Extracted Information
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
                  {selectedDocument.extractedData.customerName && (
                    <div className="px-4 py-3 flex justify-between">
                      <span className="text-sm text-gray-500">Customer</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedDocument.extractedData.customerName}
                      </span>
                    </div>
                  )}
                  {selectedDocument.extractedData.invoiceNumber && (
                    <div className="px-4 py-3 flex justify-between">
                      <span className="text-sm text-gray-500">Invoice Number</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedDocument.extractedData.invoiceNumber}
                      </span>
                    </div>
                  )}
                  {selectedDocument.extractedData.amount && (
                    <div className="px-4 py-3 flex justify-between">
                      <span className="text-sm text-gray-500">Amount</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(selectedDocument.extractedData.amount, selectedDocument.extractedData.currency || undefined)}
                      </span>
                    </div>
                  )}
                  {selectedDocument.extractedData.invoiceDate && (
                    <div className="px-4 py-3 flex justify-between">
                      <span className="text-sm text-gray-500">Invoice Date</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(selectedDocument.extractedData.invoiceDate)}
                      </span>
                    </div>
                  )}
                  {selectedDocument.extractedData.dueDate && (
                    <div className="px-4 py-3 flex justify-between">
                      <span className="text-sm text-gray-500">Due Date</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(selectedDocument.extractedData.dueDate)}
                      </span>
                    </div>
                  )}
                  {selectedDocument.extractedData.accountNumber && (
                    <div className="px-4 py-3 flex justify-between">
                      <span className="text-sm text-gray-500">Account Number</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedDocument.extractedData.accountNumber}
                      </span>
                    </div>
                  )}
                  <div className="px-4 py-3 flex justify-between">
                    <span className="text-sm text-gray-500">Confidence</span>
                    <span className={classNames(
                      'text-sm font-medium',
                      (selectedDocument.extractedData.confidence || 0) > 0.8 ? 'text-green-600' : 'text-yellow-600'
                    )}>
                      {Math.round((selectedDocument.extractedData.confidence || 0) * 100)}%
                    </span>
                  </div>
                </div>
              </section>
            )}

            {/* Escalation Reasons */}
            {selectedDocument.escalationReasons && selectedDocument.escalationReasons.length > 0 && (
              <section>
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center text-red-600">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Escalation Reasons
                </h3>
                <div className="bg-red-50 border border-red-200 rounded-lg divide-y divide-red-200">
                  {selectedDocument.escalationReasons.map((reason, idx) => (
                    <div key={idx} className="px-4 py-3">
                      <p className="text-sm font-medium text-red-800 capitalize">
                        {reason.type.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-red-600 mt-1">
                        {reason.description}
                      </p>
                      {reason.field && (
                        <p className="text-xs text-red-500 mt-1">
                          Field: {reason.field}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Notes */}
            {selectedDocument.notes && (
              <section>
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Notes
                </h3>
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
                  {selectedDocument.notes}
                </p>
              </section>
            )}

            {/* Tags */}
            {selectedDocument.tags.length > 0 && (
              <section>
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDocument.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Assignee */}
            <section className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Assigned To
              </h3>
              <select
                value={selectedDocument.assignee || ''}
                onChange={(e) => handleAssign(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Unassigned</option>
                {teamMembers.filter(m => m.active).map((member) => (
                  <option key={member.id} value={member.name}>
                    {member.name}
                  </option>
                ))}
              </select>
            </section>

            {/* Status Actions */}
            <section className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Update Status</h3>
              <div className="space-y-2">
                {(['pending', 'processing', 'review', 'completed', 'escalated'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={classNames(
                      'w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      selectedDocument.status === status
                        ? 'bg-blue-100 text-blue-800'
                        : 'hover:bg-gray-100 text-gray-700'
                    )}
                  >
                    {status === 'pending' && <Clock className="w-4 h-4 inline mr-2" />}
                    {status === 'processing' && <Clock className="w-4 h-4 inline mr-2" />}
                    {status === 'review' && <FileText className="w-4 h-4 inline mr-2" />}
                    {status === 'completed' && <CheckCircle className="w-4 h-4 inline mr-2" />}
                    {status === 'escalated' && <AlertTriangle className="w-4 h-4 inline mr-2" />}
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </section>

            {/* Timeline */}
            <section className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Timeline
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Created</span>
                  <span className="text-gray-900">{formatDateTime(selectedDocument.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Updated</span>
                  <span className="text-gray-900">{formatDateTime(selectedDocument.updatedAt)}</span>
                </div>
                {selectedDocument.processedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Processed</span>
                    <span className="text-gray-900">{formatDateTime(selectedDocument.processedAt)}</span>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </Modal>
  );
}

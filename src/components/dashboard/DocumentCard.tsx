import { 
  FileText, 
  Calendar, 
  User, 
  AlertTriangle, 
  MoreVertical,
  CheckCircle,
  Clock,
  Eye,
  Loader2
} from 'lucide-react';
import type { Document } from '../../types/document';
import { PriorityBadge, StatusBadge } from '../ui/Badge';
import { formatDate, formatCurrency, truncateText, classNames } from '../../utils/formatters';

interface DocumentCardProps {
  document: Document;
  onClick?: () => void;
  onAction?: (action: string) => void;
  isSelected?: boolean;
}

export function DocumentCard({ document, onClick, onAction, isSelected }: DocumentCardProps) {
  const hasEscalation = document.isEscalated && document.escalationReasons && document.escalationReasons.length > 0;

  return (
    <div
      onClick={onClick}
      className={classNames(
        'bg-white rounded-lg border shadow-sm transition-all cursor-pointer hover:shadow-md',
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
      )}
    >
      {/* Card Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-start justify-between">
        <div className="flex items-center space-x-3 min-w-0">
          <div className={classNames(
            'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
            document.type === 'invoice' ? 'bg-blue-100 text-blue-600' :
            document.type === 'payment_confirmation' ? 'bg-green-100 text-green-600' :
            document.type === 'dispute' ? 'bg-red-100 text-red-600' :
            document.type === 'statement' ? 'bg-purple-100 text-purple-600' :
            'bg-gray-100 text-gray-600'
          )}>
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 truncate">
              {truncateText(document.originalName, 35)}
            </h4>
            <p className="text-xs text-gray-500 capitalize">
              {document.type.replace('_', ' ')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 flex-shrink-0">
          {hasEscalation && (
            <span title="Escalated">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </span>
          )}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAction?.('menu');
            }}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-4 py-3 space-y-3">
        {/* Status and Priority */}
        <div className="flex items-center justify-between">
          <StatusBadge status={document.status} />
          <PriorityBadge priority={document.priority} />
        </div>

        {/* Customer Info */}
        {document.extractedData?.customerName && (
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-2 text-gray-400" />
            <span className="truncate">{document.extractedData.customerName}</span>
          </div>
        )}

        {/* Amount */}
        {document.extractedData?.amount && (
          <div className="flex items-center text-sm">
            <span className="text-gray-500 mr-2">Amount:</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(document.extractedData.amount, document.extractedData.currency || undefined)}
            </span>
          </div>
        )}

        {/* Invoice Number */}
        {document.extractedData?.invoiceNumber && (
          <div className="text-sm text-gray-600">
            <span className="text-gray-400">Invoice:</span>{' '}
            <span className="font-medium">{document.extractedData.invoiceNumber}</span>
          </div>
        )}

        {/* Dates */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(document.createdAt)}
          </div>
          {document.assignee && (
            <div className="flex items-center">
              <User className="w-3 h-3 mr-1" />
              {document.assignee}
            </div>
          )}
        </div>

        {/* Escalation Reasons */}
        {hasEscalation && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-red-600 space-y-1">
                {document.escalationReasons?.slice(0, 2).map((reason, idx) => (
                  <p key={idx} className="line-clamp-1">{reason.description}</p>
                ))}
                {(document.escalationReasons?.length || 0) > 2 && (
                  <p className="text-red-400">
                    +{document.escalationReasons!.length - 2} more
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-4 py-2 bg-gray-50 rounded-b-lg border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {document.status === 'processing' ? (
              <span className="flex items-center">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Processing...
              </span>
            ) : document.status === 'completed' ? (
              <span className="flex items-center text-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Completed
              </span>
            ) : (
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {document.status === 'escalated' ? 'Needs attention' : 'Pending'}
              </span>
            )}
          </span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAction?.('view');
            }}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            <Eye className="w-3 h-3 mr-1" />
            View
          </button>
        </div>
      </div>
    </div>
  );
}

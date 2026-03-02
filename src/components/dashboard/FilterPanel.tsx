import { Search, Filter, X, Download } from 'lucide-react';
import { useDocuments } from '../../contexts/DocumentContext';
import { Button } from '../ui/Button';
import { teamMembers } from '../../data/sampleDocuments';

interface FilterPanelProps {
  onExport?: () => void;
}

export function FilterPanel({ onExport }: FilterPanelProps) {
  const { state, setFilters, clearFilters } = useDocuments();
  const { filters } = state;

  const hasActiveFilters = 
    filters.status !== 'all' || 
    filters.type !== 'all' || 
    filters.priority !== 'all' || 
    filters.assignee !== 'all' ||
    filters.searchQuery;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={filters.searchQuery || ''}
            onChange={(e) => setFilters({ searchQuery: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filters.status}
              onChange={(e) => setFilters({ status: e.target.value as typeof filters.status })}
              className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="review">In Review</option>
              <option value="completed">Completed</option>
              <option value="escalated">Escalated</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="relative">
            <select
              value={filters.type}
              onChange={(e) => setFilters({ type: e.target.value as typeof filters.type })}
              className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm appearance-none bg-white"
            >
              <option value="all">All Types</option>
              <option value="invoice">Invoice</option>
              <option value="statement">Statement</option>
              <option value="payment_confirmation">Payment Confirmation</option>
              <option value="dispute">Dispute</option>
              <option value="credit_note">Credit Note</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ priority: e.target.value as typeof filters.priority })}
              className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm appearance-none bg-white"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Assignee Filter */}
          <div className="relative">
            <select
              value={filters.assignee}
              onChange={(e) => setFilters({ assignee: e.target.value })}
              className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm appearance-none bg-white"
            >
              <option value="all">All Assignees</option>
              {teamMembers.filter(m => m.active).map((member) => (
                <option key={member.id} value={member.name}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              leftIcon={<X className="w-4 h-4" />}
            >
              Clear
            </Button>
          )}

          {/* Export Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={onExport}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">Active filters:</span>
          {filters.searchQuery && (
            <FilterTag 
              label={`Search: "${filters.searchQuery}"`} 
              onRemove={() => setFilters({ searchQuery: '' })}
            />
          )}
          {filters.status !== 'all' && (
            <FilterTag 
              label={`Status: ${filters.status}`} 
              onRemove={() => setFilters({ status: 'all' })}
            />
          )}
          {filters.type !== 'all' && (
            <FilterTag 
              label={`Type: ${filters.type}`} 
              onRemove={() => setFilters({ type: 'all' })}
            />
          )}
          {filters.priority !== 'all' && (
            <FilterTag 
              label={`Priority: ${filters.priority}`} 
              onRemove={() => setFilters({ priority: 'all' })}
            />
          )}
          {filters.assignee !== 'all' && (
            <FilterTag 
              label={`Assignee: ${filters.assignee}`} 
              onRemove={() => setFilters({ assignee: 'all' })}
            />
          )}
        </div>
      )}
    </div>
  );
}

interface FilterTagProps {
  label: string;
  onRemove: () => void;
}

function FilterTag({ label, onRemove }: FilterTagProps) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
      {label}
      <button
        onClick={onRemove}
        className="ml-1.5 text-blue-600 hover:text-blue-800"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

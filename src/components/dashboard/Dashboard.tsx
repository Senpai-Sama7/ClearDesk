import { useState } from 'react';
import { Layout } from './Layout';
import { StatsOverview } from './StatsOverview';
import { FilterPanel } from './FilterPanel';
import { DocumentCard } from './DocumentCard';
import { DocumentDetail } from './DocumentDetail';
import { ExportPanel } from './ExportPanel';
import { FileUpload } from '../upload/FileUpload';
import { useDocuments } from '../../contexts/DocumentContext';
import { Button } from '../ui/Button';
import { Plus, Grid, List } from 'lucide-react';

export function Dashboard() {
  const { filteredDocuments, selectDocument, selectedDocument } = useDocuments();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUpload, setShowUpload] = useState(false);

  const handleCardClick = (id: string) => {
    selectDocument(id);
    setIsDetailOpen(true);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Document Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Manage and process AR documents with AI assistance
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <Button
              variant="primary"
              onClick={() => setShowUpload(!showUpload)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Upload Document
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview />

        {/* Upload Section */}
        {showUpload && (
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Upload Documents</h2>
                <button
                  onClick={() => setShowUpload(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <FileUpload />
            </div>
          </div>
        )}

        {/* Filters */}
        <FilterPanel onExport={() => setIsExportOpen(true)} />

        {/* View Toggle & Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            Showing {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document Grid */}
        {filteredDocuments.length > 0 ? (
          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onClick={() => handleCardClick(doc.id)}
                isSelected={selectedDocument?.id === doc.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500 text-lg">No documents found</p>
            <p className="text-gray-400 text-sm mt-1">
              Try adjusting your filters or upload a new document
            </p>
          </div>
        )}
      </div>

      {/* Document Detail Modal */}
      <DocumentDetail
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          selectDocument(null);
        }}
      />

      {/* Export Panel Modal */}
      <ExportPanel
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </Layout>
  );
}

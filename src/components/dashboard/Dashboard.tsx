import { useState } from 'react';
import { Layout } from './Layout';
import { StatsOverview } from './StatsOverview';
import { FilterPanel } from './FilterPanel';
import { DocumentCard } from './DocumentCard';
import { DocumentDetail } from './DocumentDetail';
import { ExportPanel } from './ExportPanel';
import { FileUpload } from '../upload/FileUpload';
import { SampleDocuments } from './SampleDocuments';
import { SettingsPanel } from './SettingsPanel';
import { Tour } from '../tour/Tour';
import { useDocuments } from '../../contexts/DocumentContext';
import { Button } from '../ui/Button';
import { Plus, Upload } from 'lucide-react';

export function Dashboard() {
  const { filteredDocuments, selectDocument } = useDocuments();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [showUpload, setShowUpload] = useState(false);
  const [tourActive, setTourActive] = useState(() => !localStorage.getItem('cleardesk_tour_completed'));

  const handleCardClick = (id: string) => {
    selectDocument(id);
    setIsDetailOpen(true);
  };

  const handleNavigate = (view: string) => {
    setActiveView(view);
    if (view === 'upload') setShowUpload(true);
    else setShowUpload(false);
  };

  return (
    <Layout onNavigate={handleNavigate} activeView={activeView}>
      {activeView === 'settings' ? (
        <SettingsPanel onStartTour={() => setTourActive(true)} />
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-2xl font-bold text-text-primary">Documents</h1>
              <p className="text-sm text-text-secondary mt-1">
                {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button data-tour="upload-btn" variant="primary" size="md" onClick={() => setShowUpload(!showUpload)} leftIcon={<Plus className="w-4 h-4" />}>
              Upload
            </Button>
          </div>

          <StatsOverview />

          {showUpload && (
            <div className="mb-8 bg-surface border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-text-primary">Upload Documents</h2>
                <button onClick={() => setShowUpload(false)} className="text-text-secondary hover:text-text-primary text-sm">Close</button>
              </div>
              <FileUpload />
              <SampleDocuments />
            </div>
          )}

          <FilterPanel onExport={() => setIsExportOpen(true)} />

          {filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((doc, i) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onClick={() => handleCardClick(doc.id)}
                  style={{ animationDelay: `${i * 60}ms` }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <Upload className="w-8 h-8 text-text-secondary mb-4" />
              <p className="text-text-secondary text-sm">No documents yet</p>
              <Button variant="secondary" size="sm" className="mt-4" onClick={() => setShowUpload(true)}>
                Upload your first document
              </Button>
            </div>
          )}
        </div>
      )}

      <DocumentDetail isOpen={isDetailOpen} onClose={() => { setIsDetailOpen(false); selectDocument(null); }} />
      <ExportPanel isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
      {tourActive && <Tour onComplete={() => { setTourActive(false); localStorage.setItem('cleardesk_tour_completed', '1'); }} />}
    </Layout>
  );
}

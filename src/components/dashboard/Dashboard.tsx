import { useState, useRef } from 'react';
import { Layout } from './Layout';
import { StatsOverview } from './StatsOverview';
import { FilterPanel } from './FilterPanel';
import { DocumentCard } from './DocumentCard';
import { DocumentDetail } from './DocumentDetail';
import { ExportPanel } from './ExportPanel';
import { FileUpload } from '../upload/FileUpload';
import { SampleDocuments } from './SampleDocuments';
import { SettingsPanel } from './SettingsPanel';
import { HelpPanel } from './HelpPanel';
import { AboutPanel } from './AboutPanel';
import { ChatPanel } from './ChatPanel';
import { useDocuments } from '../../contexts/DocumentContext';
import { Button } from '../ui/Button';
import { Plus, Upload, X, AlertTriangle, Clock, ArrowRight, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export function Dashboard() {
  const { filteredDocuments, selectDocument } = useDocuments();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [showUpload, setShowUpload] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(() => !!localStorage.getItem('cleardesk_banner_dismissed'));
  const handleFilesRef = useRef<((files: File[]) => void) | null>(null);

  const dismissBanner = () => { setBannerDismissed(true); localStorage.setItem('cleardesk_banner_dismissed', '1'); };

  const handleCardClick = (id: string) => {
    selectDocument(id);
    setIsDetailOpen(true);
  };

  const handleNavigate = (view: string) => {
    if (view === 'upload') {
      setActiveView('documents');
      setShowUpload(true);
    } else {
      setActiveView(view);
      setShowUpload(false);
    }
  };

  return (
    <Layout onNavigate={handleNavigate} activeView={activeView}>
      {activeView === 'settings' ? (
        <SettingsPanel />
      ) : activeView === 'help' ? (
        <HelpPanel />
      ) : activeView === 'about' ? (
        <AboutPanel />
      ) : activeView === 'documents' ? (
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-2xl font-bold text-text-primary">Documents</h1>
              <p className="text-sm text-text-secondary mt-1">
                {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button variant="primary" size="md" onClick={() => setShowUpload(!showUpload)} leftIcon={<Plus className="w-4 h-4" />}>
              Upload
            </Button>
          </div>

          <div className="mb-8 bg-surface border border-border rounded-lg p-6">
            {showUpload && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-text-primary">Upload Documents</h2>
                  <button onClick={() => setShowUpload(false)} className="text-text-secondary hover:text-text-primary text-sm">Close</button>
                </div>
                <FileUpload onHandleFiles={(h) => { handleFilesRef.current = h; }} />
              </>
            )}
            <SampleDocuments onProcessFile={(file) => handleFilesRef.current?.([file])} />
          </div>

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
      ) : (
        <DashboardHome
          onNavigate={handleNavigate}
          onCardClick={handleCardClick}
          bannerDismissed={bannerDismissed}
          dismissBanner={dismissBanner}
        />
      )}

      <DocumentDetail isOpen={isDetailOpen} onClose={() => { setIsDetailOpen(false); selectDocument(null); }} />
      <ExportPanel isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
      <ChatPanel />
    </Layout>
  );
}

function DashboardHome({ onNavigate, onCardClick, bannerDismissed, dismissBanner }: {
  onNavigate: (v: string) => void; onCardClick: (id: string) => void;
  bannerDismissed: boolean; dismissBanner: () => void;
}) {
  const { state } = useDocuments();
  const docs = state.documents;

  const escalated = docs.filter(d => d.isEscalated || d.status === 'escalated');
  const upcoming = docs
    .filter(d => d.actionDeadline && d.status !== 'completed')
    .sort((a, b) => new Date(a.actionDeadline!).getTime() - new Date(b.actionDeadline!).getTime())
    .slice(0, 5);
  const recent = [...docs].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);
  const totalAR = docs.reduce((s, d) => s + (d.extractedData?.amount ?? 0), 0);
  const criticalCount = docs.filter(d => d.priority === 'critical').length;
  const highCount = docs.filter(d => d.priority === 'high').length;

  if (docs.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-2xl font-bold text-text-primary">Dashboard</h1>
            <p className="text-sm text-text-secondary mt-1">Command center</p>
          </div>
          <Button variant="primary" size="md" onClick={() => onNavigate('upload')} leftIcon={<Plus className="w-4 h-4" />}>Upload</Button>
        </div>
        {!bannerDismissed && (
          <div className="mb-6 flex items-center justify-between bg-accent/5 border border-accent/20 rounded-lg px-4 py-3">
            <p className="text-sm text-text-secondary">Upload any AR document to get started — invoices, PDFs, images, Excel files, and more are all supported.</p>
            <button onClick={dismissBanner} className="text-text-secondary hover:text-text-primary ml-4 flex-shrink-0" aria-label="Dismiss"><X className="w-4 h-4" /></button>
          </div>
        )}
        <StatsOverview />
        <div className="flex flex-col items-center justify-center py-20">
          <Upload className="w-8 h-8 text-text-secondary mb-4" />
          <p className="text-text-secondary text-sm">No documents yet</p>
          <Button variant="secondary" size="sm" className="mt-4" onClick={() => onNavigate('upload')}>Upload your first document</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-secondary mt-1">Command center</p>
        </div>
        <Button variant="primary" size="md" onClick={() => onNavigate('upload')} leftIcon={<Plus className="w-4 h-4" />}>Upload</Button>
      </div>

      <StatsOverview />

      {/* Summary row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-accent" />
            <span className="text-[11px] uppercase tracking-wider text-text-secondary">Total AR Value</span>
          </div>
          <p className="font-mono text-xl font-semibold text-text-primary">{formatCurrency(totalAR)}</p>
        </div>
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-[11px] uppercase tracking-wider text-text-secondary">Needs Attention</span>
          </div>
          <p className="font-mono text-xl font-semibold text-text-primary">{criticalCount + highCount}</p>
          <p className="text-[11px] text-text-secondary">{criticalCount} critical · {highCount} high</p>
        </div>
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <span className="text-[11px] uppercase tracking-wider text-text-secondary">Escalated</span>
          </div>
          <p className="font-mono text-xl font-semibold text-text-primary">{escalated.length}</p>
        </div>
      </div>

      {/* Two-column: Escalations + Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-text-primary flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" /> Escalations
            </h2>
            {escalated.length > 0 && (
              <button onClick={() => onNavigate('documents')} className="text-xs text-accent hover:text-accent/80 flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
          {escalated.length === 0 ? (
            <p className="text-sm text-text-secondary py-4 text-center">No escalations — all clear</p>
          ) : (
            <div className="space-y-2">
              {escalated.slice(0, 5).map(d => (
                <button key={d.id} onClick={() => onCardClick(d.id)}
                  className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-bg transition-colors">
                  <div className="w-2 h-2 rounded-full flex-shrink-0 bg-red-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary truncate">{d.originalName}</p>
                    <p className="text-[11px] text-text-secondary truncate">
                      {d.escalationReasons?.[0]?.description ?? 'Escalated'}
                    </p>
                  </div>
                  {d.extractedData?.amount != null && (
                    <span className="font-mono text-xs text-text-secondary flex-shrink-0">
                      {formatCurrency(d.extractedData.amount, d.extractedData.currency ?? 'USD')}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-text-primary flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-400" /> Upcoming Deadlines
            </h2>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-sm text-text-secondary py-4 text-center">No upcoming deadlines</p>
          ) : (
            <div className="space-y-2">
              {upcoming.map(d => {
                const days = Math.ceil((new Date(d.actionDeadline!).getTime() - Date.now()) / 86400000);
                const urgent = days <= 3;
                return (
                  <button key={d.id} onClick={() => onCardClick(d.id)}
                    className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-bg transition-colors">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${urgent ? 'bg-red-400' : 'bg-yellow-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary truncate">{d.originalName}</p>
                      <p className="text-[11px] text-text-secondary">{d.extractedData?.customerName ?? 'Unknown'}</p>
                    </div>
                    <span className={`text-xs font-mono flex-shrink-0 ${urgent ? 'text-red-400' : 'text-text-secondary'}`}>
                      {days <= 0 ? 'Overdue' : `${days}d`}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-surface border border-border rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-text-primary">Recent Activity</h2>
          <button onClick={() => onNavigate('documents')} className="text-xs text-accent hover:text-accent/80 flex items-center gap-1">
            All documents <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-2">
          {recent.map(d => (
            <button key={d.id} onClick={() => onCardClick(d.id)}
              className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-bg transition-colors">
              <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${
                d.priority === 'critical' ? 'bg-red-500/10 text-red-400' :
                d.priority === 'high' ? 'bg-orange-500/10 text-orange-400' :
                d.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                'bg-surface text-text-secondary'
              }`}>{d.priority}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary truncate">{d.originalName}</p>
              </div>
              <span className="text-[11px] text-text-secondary flex-shrink-0 capitalize">{d.status}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

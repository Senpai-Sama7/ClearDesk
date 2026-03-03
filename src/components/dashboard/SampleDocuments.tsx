import { useState } from 'react';
import { FileText, Play, Eye, X } from 'lucide-react';
import { Button } from '../ui/Button';

const samples = [
  { name: 'Swift Haul Invoice', file: 'Swift Haul Invoice.pdf', desc: 'Freight invoice — $12,450 with net-30 terms' },
  { name: 'AR Statement', file: 'AR Statement Swift Haul.pdf', desc: 'Multi-line receivable statement with aging buckets' },
  { name: 'Collections Notice', file: 'Collections Notice.pdf', desc: 'Final notice — should trigger escalation flags' },
];

interface Props { onProcessFile: (file: File) => void; }

export function SampleDocuments({ onProcessFile }: Props) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const processNow = async (s: typeof samples[0]) => {
    setLoading(s.file);
    try {
      const r = await fetch(`/samples/${s.file}`);
      const blob = await r.blob();
      onProcessFile(new File([blob], s.file, { type: 'application/pdf' }));
      setOpen(false);
      setPreview(null);
    } finally { setLoading(null); }
  };

  if (!open) {
    return (
      <div className="mt-4 pt-4 border-t border-border">
        <button onClick={() => setOpen(true)}
          className="text-xs text-accent hover:text-accent/80 transition-colors cursor-pointer">
          No documents handy? Use sample documents →
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 pt-4 border-t border-border space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-secondary">Click a sample to preview, then process it directly — no download needed.</p>
        <button onClick={() => { setOpen(false); setPreview(null); }} className="text-text-secondary hover:text-text-primary">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid gap-2">
        {samples.map(s => (
          <div key={s.file} className={`flex items-center gap-3 bg-bg border rounded-lg px-4 py-2.5 transition-colors ${preview === s.file ? 'border-accent' : 'border-border hover:border-border-hover'}`}>
            <FileText className="w-4 h-4 text-text-secondary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary">{s.name}</p>
              <p className="text-[11px] text-text-secondary">{s.desc}</p>
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
              <button onClick={() => setPreview(preview === s.file ? null : s.file)}
                className="p-1.5 rounded text-text-secondary hover:text-text-primary hover:bg-surface transition-colors" title="Preview">
                <Eye className="w-3.5 h-3.5" />
              </button>
              <Button variant="primary" size="sm" onClick={() => processNow(s)} disabled={loading === s.file}
                leftIcon={<Play className="w-3 h-3" />}>
                {loading === s.file ? 'Loading…' : 'Process'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {preview && (
        <div className="border border-border rounded-lg overflow-hidden bg-bg">
          <iframe src={`/samples/${preview}`} className="w-full h-96" title="Sample preview" />
        </div>
      )}
    </div>
  );
}

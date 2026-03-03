import { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/Button';

const steps = [
  { target: 'sidebar', title: 'Navigation', description: 'Switch between Dashboard, Documents, Upload, and Settings from the sidebar.' },
  { target: 'search', title: 'Search', description: 'Search documents by name, customer, invoice number, or notes.' },
  { target: 'upload-btn', title: 'Upload', description: 'Upload documents here. AI will automatically analyze and extract key data.' },
  { target: 'settings-nav', title: 'Settings', description: 'Manage your data and replay this tour anytime from Settings.' },
];

export function Tour({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const updateRect = useCallback(() => {
    const el = document.querySelector(`[data-tour="${steps[step].target}"]`);
    setRect(el ? el.getBoundingClientRect() : null);
  }, [step]);

  useEffect(() => {
    updateRect();
    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  }, [updateRect]);

  const next = () => step < steps.length - 1 ? setStep(step + 1) : onComplete();
  const current = steps[step];

  const tooltipPos: React.CSSProperties = rect
    ? { top: rect.bottom + 12, left: Math.max(16, Math.min(rect.left, window.innerWidth - 340)) }
    : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

  return (
    <>
      {/* Dark overlay with spotlight cutout — visual only */}
      <div className="fixed inset-0 z-[10000] pointer-events-none overflow-hidden">
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <mask id="tour-mask">
              <rect width="100%" height="100%" fill="white" />
              {rect && <rect x={rect.left - 6} y={rect.top - 6} width={rect.width + 12} height={rect.height + 12} rx="8" fill="black" />}
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="rgba(0,0,0,0.6)" mask="url(#tour-mask)" />
        </svg>
      </div>

      {/* Spotlight border — visual only */}
      {rect && (
        <div className="fixed z-[10000] border-2 border-accent rounded-lg pointer-events-none"
          style={{ top: rect.top - 6, left: rect.left - 6, width: rect.width + 12, height: rect.height + 12 }} />
      )}

      {/* Interactive layer: full-screen blocker + tooltip */}
      <div className="fixed inset-0 z-[10001]">
        {/* Tooltip */}
        <div className="fixed bg-surface border border-border rounded-lg p-5 w-80" style={tooltipPos}>
          <p className="text-[11px] uppercase tracking-wider text-text-secondary mb-1">Step {step + 1} of {steps.length}</p>
          <h3 className="text-sm font-semibold text-text-primary mb-2 font-heading">{current.title}</h3>
          <p className="text-xs text-text-secondary leading-relaxed mb-4">{current.description}</p>
          <div className="flex items-center justify-between">
            <button onClick={onComplete} className="text-xs text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
              Skip tour
            </button>
            <Button variant="primary" size="sm" onClick={next}>
              {step < steps.length - 1 ? 'Next' : 'Get Started'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

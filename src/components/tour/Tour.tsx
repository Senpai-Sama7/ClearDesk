import { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/Button';

interface TourStep {
  target: string;       // data-tour attribute value
  title: string;
  description: string;
}

const steps: TourStep[] = [
  { target: 'sidebar', title: 'Navigation', description: 'Switch between Dashboard, Documents, Upload, and Settings from the sidebar.' },
  { target: 'search', title: 'Search', description: 'Search documents by name, customer, invoice number, or notes.' },
  { target: 'upload-btn', title: 'Upload', description: 'Upload documents here. AI will automatically analyze and extract key data.' },
  { target: 'settings-nav', title: 'Settings', description: 'Manage your data and replay this tour anytime from Settings.' },
];

interface TourProps {
  onComplete: () => void;
}

export function Tour({ onComplete }: TourProps) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const updateRect = useCallback(() => {
    const el = document.querySelector(`[data-tour="${steps[step].target}"]`);
    if (el) setRect(el.getBoundingClientRect());
    else setRect(null);
  }, [step]);

  useEffect(() => {
    updateRect();
    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  }, [updateRect]);

  const next = () => step < steps.length - 1 ? setStep(step + 1) : onComplete();
  const current = steps[step];

  // Position tooltip near target
  const tooltipStyle: React.CSSProperties = rect ? {
    position: 'fixed',
    top: rect.bottom + 12,
    left: Math.max(16, Math.min(rect.left, window.innerWidth - 340)),
    zIndex: 10001,
  } : {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10001,
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[10000] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <mask id="tour-mask">
              <rect width="100%" height="100%" fill="white" />
              {rect && (
                <rect
                  x={rect.left - 6} y={rect.top - 6}
                  width={rect.width + 12} height={rect.height + 12}
                  rx="8" fill="black"
                />
              )}
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="rgba(0,0,0,0.6)" mask="url(#tour-mask)" />
        </svg>
      </div>

      {/* Spotlight border */}
      {rect && (
        <div
          className="fixed z-[10000] border-2 border-accent rounded-lg pointer-events-none"
          style={{ top: rect.top - 6, left: rect.left - 6, width: rect.width + 12, height: rect.height + 12 }}
        />
      )}

      {/* Click blocker — prevents interacting with app during tour */}
      <div className="fixed inset-0 z-[10000]" />

      {/* Tooltip */}
      <div style={tooltipStyle} className="bg-surface border border-border rounded-lg p-5 w-80 shadow-none pointer-events-auto" onClick={(e) => e.stopPropagation()}>
        <p className="text-[11px] uppercase tracking-wider text-text-secondary mb-1">Step {step + 1} of {steps.length}</p>
        <h3 className="text-sm font-semibold text-text-primary mb-2 font-heading">{current.title}</h3>
        <p className="text-xs text-text-secondary leading-relaxed mb-4">{current.description}</p>
        <div className="flex items-center justify-between">
          <button onClick={onComplete} className="text-xs text-text-secondary hover:text-text-primary transition-colors">
            Skip tour
          </button>
          <Button variant="primary" size="sm" onClick={next}>
            {step < steps.length - 1 ? 'Next' : 'Get Started'}
          </Button>
        </div>
      </div>
    </>
  );
}

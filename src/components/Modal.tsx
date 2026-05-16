import { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalState {
  show: boolean;
  title: string;
  message: string;
  type: 'confirm' | 'alert';
  onConfirm?: () => void;
}

interface Props {
  show: boolean;
  title: string;
  message: string;
  type: 'confirm' | 'alert';
  onClose: () => void;
  onConfirm: () => void;
}

export function ActionModal({ show, title, message, type, onClose, onConfirm }: Props) {
  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter' && type === 'confirm') onConfirm();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [show, type, onClose, onConfirm]);

  if (!show) return null;

  return (
    <div className="modal-root">
      <div className="modal-scrim" onClick={onClose} />
      <div className="modal-card" role="dialog" aria-modal="true">
        <div className="modal-head">
          <span className="eyebrow accent">v1King · {type === 'confirm' ? 'Confirmar' : 'Aviso'}</span>
          <button className="ibtn" onClick={onClose} aria-label="Close"><X size={16} strokeWidth={1.75} /></button>
        </div>
        <div className="modal-body">
          <h3 className="modal-title">{title}</h3>
          <p className="modal-msg">{message}</p>
        </div>
        <div className="modal-foot">
          {type === 'confirm' ? (
            <>
              <button className="btn" onClick={onClose}>Cancelar</button>
              <button className="btn primary" onClick={onConfirm}>Confirmar acción</button>
            </>
          ) : (
            <button className="btn primary" onClick={onClose}>Entendido</button>
          )}
        </div>
      </div>
      <style>{`
        .modal-root { position: fixed; inset: 0; z-index: 90; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .modal-scrim { position: absolute; inset: 0; background: color-mix(in srgb, var(--ink) 70%, transparent); backdrop-filter: blur(4px); }
        .modal-card { position: relative; width: min(520px, 100%); background: var(--surface); border: 1px solid var(--hairline-2); border-radius: var(--r-2); box-shadow: 0 30px 80px rgba(0,0,0,.5); overflow: hidden; animation: modalIn .18s ease-out both; }
        @keyframes modalIn { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: none; } }
        .modal-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid var(--hairline); }
        .modal-body { padding: 24px 22px 8px; }
        .modal-title { font-family: var(--f-display); font-weight: 600; font-size: 22px; letter-spacing: -0.01em; margin: 0 0 10px; color: var(--fg); }
        .modal-msg { margin: 0; color: var(--fg-3); font-size: 14px; line-height: 1.55; }
        .modal-foot { display: flex; gap: 10px; justify-content: flex-end; padding: 18px 22px 22px; }
      `}</style>
    </div>
  );
}

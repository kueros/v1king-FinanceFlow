import type { ReactNode } from 'react';

export function fmtMoney(n: number | string) {
  return (Number(n) || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 });
}

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  deck?: string;
  right?: ReactNode;
}
export function PageHeader({ eyebrow, title, deck, right }: PageHeaderProps) {
  return (
    <div className="ph">
      <div className="ph-left">
        <span className="eyebrow accent">{eyebrow}</span>
        <h1 className="ph-title">{title}</h1>
        {deck ? <p className="ph-deck">{deck}</p> : null}
      </div>
      {right ? <div className="ph-right">{right}</div> : null}
      <style>{`
        .ph { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; padding: 28px 0 22px; border-bottom: 1px solid var(--hairline); margin-bottom: 28px; }
        .ph-title { font-family: var(--f-display); font-weight: 600; font-size: clamp(36px, 4vw, 56px); letter-spacing: -0.025em; line-height: 1; margin: 8px 0 0; color: var(--fg); }
        .ph-deck { margin: 12px 0 0; color: var(--fg-3); max-width: 60ch; line-height: 1.55; }
        .ph-right { display: flex; align-items: center; gap: 16px; }
      `}</style>
    </div>
  );
}

interface KpiProps {
  eyebrow: string;
  title: string;
  value: number;
  deck?: string;
  tone?: 'neutral' | 'gilt' | 'accent';
  icon?: ReactNode;
}
export function Kpi({ eyebrow, title, value, deck, tone = 'neutral', icon }: KpiProps) {
  return (
    <div className={'kpi tone-' + tone}>
      <div className="kpi-head">
        <span className="eyebrow">{eyebrow}</span>
        <span className="kpi-ico">{icon}</span>
      </div>
      <h3 className="kpi-title">{title}</h3>
      <div className="kpi-num">${fmtMoney(value)}<span className="ccy">ARS</span></div>
      {deck ? <p className="kpi-deck">{deck}</p> : null}
      <style>{`
        .kpi { background: var(--surface); border: 1px solid var(--hairline); border-radius: var(--r-2); padding: 22px 22px 24px; display: flex; flex-direction: column; min-height: 220px; position: relative; overflow: hidden; }
        .kpi.tone-gilt   { background: color-mix(in srgb, var(--positive) 8%, var(--surface)); border-color: color-mix(in srgb, var(--positive) 30%, var(--hairline-2)); }
        .kpi.tone-accent { background: color-mix(in srgb, var(--accent) 7%, var(--surface));  border-color: color-mix(in srgb, var(--accent) 35%, var(--hairline-2)); }
        .kpi-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .kpi-ico { width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid var(--hairline-2); border-radius: var(--r-1); color: var(--fg-3); }
        .kpi.tone-gilt   .kpi-ico { color: var(--positive); border-color: color-mix(in srgb, var(--positive) 50%, transparent); }
        .kpi.tone-accent .kpi-ico { color: var(--accent);   border-color: color-mix(in srgb, var(--accent)   50%, transparent); }
        .kpi-title { font-family: var(--f-display); font-weight: 500; font-size: 16px; letter-spacing: -0.005em; color: var(--fg-2); margin: 24px 0 14px; line-height: 1.25; max-width: 18ch; }
        .kpi-deck  { color: var(--fg-4); font-size: 12px; margin: 10px 0 0; line-height: 1.5; max-width: 28ch; }
        .kpi.tone-gilt   .kpi-num { color: var(--positive); }
        .kpi.tone-accent .kpi-num { color: var(--accent); }
      `}</style>
    </div>
  );
}

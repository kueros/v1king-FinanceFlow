import { useEffect, useState } from 'react';
import { TrendingUp, Upload, Download, CalendarDays } from 'lucide-react';

const TABS = [
  { id: 'dashboard', label: 'Arqueo',   sub: 'Finanzas' },
  { id: 'config',    label: 'Config',   sub: 'Categorías' },
] as const;

export type TabId = typeof TABS[number]['id'];

function Brandmark() {
  return (
    <div className="brand">
      <div className="brand-mark">
        <span className="v">v</span>
        <span className="one">1</span>
        <span className="rest">King</span>
      </div>
      <div className="brand-rule" />
      <div className="brand-product">
        <div className="brand-title">FinanceFlow</div>
        <div className="brand-sub">
          <span className="live-dot" />
          Núcleo · Finanzas Personales
        </div>
      </div>
      <style>{`
        .brand { display: flex; align-items: center; gap: 18px; }
        .brand-mark { font-family: var(--f-display); font-weight: 700; font-size: 22px; letter-spacing: -0.02em; line-height: 1; color: var(--fg); display: inline-flex; align-items: baseline; }
        .brand-mark .one { color: var(--accent); font-style: italic; padding: 0 1px; }
        .brand-mark .rest { color: var(--fg-2); font-weight: 500; }
        .brand-rule { width: 1px; height: 28px; background: var(--hairline-2); }
        .brand-title { font-family: var(--f-display); font-size: 14px; font-weight: 600; color: var(--fg); letter-spacing: -0.005em; line-height: 1; }
        .brand-sub { margin-top: 4px; display: inline-flex; align-items: center; gap: 8px; font-family: var(--f-display); font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-4); font-weight: 600; }
      `}</style>
    </div>
  );
}

function NavTabs({ active, onChange }: { active: TabId; onChange: (id: TabId) => void }) {
  return (
    <nav className="nav-tabs" role="tablist">
      {TABS.map((t) => {
        const on = t.id === active;
        return (
          <button key={t.id} className={'nav-tab' + (on ? ' on' : '')} onClick={() => onChange(t.id)} role="tab" aria-selected={on}>
            <span className="lbl">{t.label}</span>
            <span className="sub">{t.sub}</span>
            <span className="bar" />
          </button>
        );
      })}
      <style>{`
        .nav-tabs { display: inline-flex; }
        .nav-tab { position: relative; padding: 14px 22px 12px; color: var(--fg-4); text-align: left; border-right: 1px solid var(--hairline); }
        .nav-tab:first-child { border-left: 1px solid var(--hairline); }
        .nav-tab .lbl { display: block; font-family: var(--f-display); font-weight: 600; font-size: 14px; letter-spacing: -0.005em; line-height: 1; }
        .nav-tab .sub { display: block; margin-top: 5px; font-family: var(--f-display); font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-5); font-weight: 600; }
        .nav-tab .bar { position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; background: transparent; transition: background .15s; }
        .nav-tab:hover { color: var(--fg-2); }
        .nav-tab.on { color: var(--fg); }
        .nav-tab.on .sub { color: var(--accent); }
        .nav-tab.on .bar { background: var(--accent); }
      `}</style>
    </nav>
  );
}

function UsdQuote({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="quote">
      <div className="quote-label">
        <span className="eyebrow">USD/ARS</span>
        <TrendingUp size={11} strokeWidth={2} style={{ color: 'var(--positive)' }} />
      </div>
      <div className="quote-val">
        <span className="prefix figure">$</span>
        <input className="figure" type="number" value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
      <style>{`
        .quote { display: flex; flex-direction: column; padding: 10px 16px; border-left: 1px solid var(--hairline); border-right: 1px solid var(--hairline); min-width: 130px; }
        .quote-label { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .quote-val { display: flex; align-items: baseline; gap: 4px; margin-top: 2px; }
        .quote .prefix { color: var(--fg-5); font-size: 12px; }
        .quote input { font-family: var(--f-mono); font-weight: 600; font-size: 18px; color: var(--fg); width: 90px; padding: 0; letter-spacing: -0.01em; }
      `}</style>
    </div>
  );
}

interface UtilityProps {
  onImport: () => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
  onMonthChange: () => void;
}
function Utility({ onImport, onExportJSON, onExportCSV, onMonthChange }: UtilityProps) {
  return (
    <div className="util">
      <button className="util-btn" onClick={onImport} title="Importar resguardo">
        <Upload size={14} strokeWidth={1.75} /><span>Importar</span>
      </button>
      <div className="util-group">
        <button className="util-btn slim" onClick={onExportJSON} title="Resguardo JSON">
          <Download size={14} strokeWidth={1.75} /><span>JSON</span>
        </button>
        <div className="vrule" />
        <button className="util-btn slim" onClick={onExportCSV} title="Exportar CSV/Excel">
          <span>CSV</span>
        </button>
      </div>
      <button className="util-btn cta" onClick={onMonthChange} title="Cambio de mes">
        <CalendarDays size={14} strokeWidth={1.75} /><span>Cambio de Mes</span>
      </button>
      <style>{`
        .util { display: inline-flex; align-items: stretch; gap: 8px; padding: 0 16px; }
        .util-btn { display: inline-flex; align-items: center; gap: 8px; padding: 0 14px; height: 36px; font-family: var(--f-display); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 600; color: var(--fg-2); border: 1px solid var(--hairline); border-radius: var(--r-1); transition: border-color .15s, color .15s, background .15s; white-space: nowrap; }
        .util-btn:hover { color: var(--fg); border-color: var(--hairline-2); }
        .util-btn.slim { border: 0; padding: 0 12px; }
        .util-btn.cta { color: var(--accent); border-color: color-mix(in srgb, var(--accent) 50%, transparent); }
        .util-btn.cta:hover { background: var(--accent); color: #fff; border-color: var(--accent); }
        .util-group { display: inline-flex; align-items: stretch; border: 1px solid var(--hairline); border-radius: var(--r-1); }
        .util-group .vrule { width: 1px; background: var(--hairline); }
      `}</style>
    </div>
  );
}

interface HeaderProps {
  activeTab: TabId;
  onTab: (id: TabId) => void;
  exchangeRate: string;
  onRate: (v: string) => void;
  onImport: () => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
  onMonthChange: () => void;
}
export function Header({ activeTab, onTab, exchangeRate, onRate, ...util }: HeaderProps) {
  return (
    <header className="masthead">
      <div className="shell mast-row">
        <Brandmark />
        <NavTabs active={activeTab} onChange={onTab} />
        <div className="mast-right">
          <UsdQuote value={exchangeRate} onChange={onRate} />
          <Utility {...util} />
        </div>
      </div>
      <style>{`
        .masthead { border-bottom: 1px solid var(--hairline); background: color-mix(in srgb, var(--ink-1) 70%, var(--bg)); position: sticky; top: 0; z-index: 30; backdrop-filter: blur(10px); }
        body[data-theme="light"] .masthead { background: color-mix(in srgb, var(--surface-2) 80%, var(--bg)); }
        .mast-row { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 32px; padding: 18px 0 0; }
        .mast-right { display: flex; align-items: stretch; }
        @media (max-width: 1200px) {
          .mast-row { grid-template-columns: 1fr; gap: 12px; padding-bottom: 12px; }
          .mast-right { flex-wrap: wrap; }
        }
      `}</style>
    </header>
  );
}

interface StatusStripProps {
  rate: string;
  toCollect: number;
  paid: number;
  pending: number;
  period: string;
}
export function StatusStrip({ rate, toCollect, paid, pending, period }: StatusStripProps) {
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const fmt = (n: number) => (n || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 });
  const date = now.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
  const time = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="status-strip">
      <div className="shell">
        <div className="row">
          <div className="item"><span className="label">Período</span><span className="value">{period}</span></div>
          <div className="item"><span className="label">USD</span><span className="value">ARS {fmt(parseFloat(rate))}</span><span className="value gilt">▲</span></div>
          <div className="item"><span className="label">Por cobrar</span><span className="value gilt">${fmt(toCollect)}</span></div>
          <div className="item"><span className="label">Pagado</span><span className="value">${fmt(paid)}</span></div>
          <div className="item"><span className="label">Por pagar</span><span className="value accent">${fmt(pending)}</span></div>
          <div className="item"><span className="label">{date}</span><span className="value">{time}</span></div>
        </div>
      </div>
    </div>
  );
}

import {
  TrendingUp, Plus, Trash2, Check, Clock, Layers,
  Wallet, Landmark, Smartphone, ShieldCheck, ArrowUpRight,
  CreditCard as CardIcon, Receipt, Coins, ArrowDownRight,
} from 'lucide-react';
import type { ReactNode } from 'react';
import type {
  IncomeRow, FixedExpense, AccountBalances, Category,
} from '../types';
import { PageHeader, Kpi, fmtMoney } from './Shared';

/* ── Income table ────────────────────────────────────────── */
interface IncomeProps {
  rows: IncomeRow[];
  categories: Category[];
  onChange: (id: string, field: keyof IncomeRow, value: string) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
}
function IncomeTable({ rows, categories, onChange, onToggle, onRemove, onAdd }: IncomeProps) {
  const total = rows.reduce((a, r) => a + (parseFloat(r.ars) || 0), 0);
  const totalUsd = rows.reduce((a, r) => a + (parseFloat(r.usd) || 0), 0);
  const confirmed = rows.filter(r => r.isConfirmed).reduce((a, r) => a + (parseFloat(r.ars) || 0), 0);
  const cols = '44px 1.6fr 1fr .8fr 60px';

  return (
    <section className="panel">
      <div className="panel-head">
        <div className="hd-left">
          <span className="eyebrow">§ 01</span>
          <h2 className="section-title">Flujo de Ingresos</h2>
          <span className="pill"><TrendingUp size={11} strokeWidth={1.75} /> ARS / USD</span>
        </div>
        <div className="hd-right">
          <span className="muted small">{rows.filter(r => r.isConfirmed).length} / {rows.length} confirmados</span>
          <button className="btn sm" onClick={onAdd}><Plus size={12} strokeWidth={1.75} /> Añadir</button>
        </div>
      </div>

      <div className="ledger-head" style={{ gridTemplateColumns: cols }}>
        <div></div>
        <div>Concepto</div>
        <div className="t-right">Monto ARS</div>
        <div className="t-right">USD</div>
        <div className="t-right">Estado</div>
      </div>
      <div>
        {rows.map((r, i) => (
          <div key={r.id} className={'ledger-row' + (r.isConfirmed ? ' confirmed' : '')} style={{ gridTemplateColumns: cols }}>
            <div className="row-idx figure">{String(i + 1).padStart(2, '0')}</div>
            <div>
              <input className="cell-input" value={r.description}
                onChange={(e) => onChange(r.id, 'description', e.target.value)}
                placeholder="Salario / Cliente / Honorarios…" />
            </div>
            <div className="t-right">
              <input className="cell-input mono" type="number" value={r.ars}
                onChange={(e) => onChange(r.id, 'ars', e.target.value)} placeholder="0" />
            </div>
            <div className="t-right">
              <input className="cell-input mono dim" type="number" value={r.usd}
                onChange={(e) => onChange(r.id, 'usd', e.target.value)} placeholder="0" />
            </div>
            <div className="t-right" style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, alignItems: 'center' }}>
              <button className={'pill ' + (r.isConfirmed ? 'confirmed' : 'pending')}
                onClick={() => onToggle(r.id)}
                title={r.isConfirmed ? 'Confirmado' : 'Pendiente'}
                style={{ padding: '4px 8px' }}>
                {r.isConfirmed ? <Check size={11} strokeWidth={2} /> : <Clock size={11} strokeWidth={1.75} />}
              </button>
              <button className="ibtn danger" onClick={() => onRemove(r.id)} title="Eliminar">
                <Trash2 size={14} strokeWidth={1.75} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="panel-foot">
        <span className="eyebrow">Subtotal ingresos</span>
        <div className="totals">
          <span className="muted small">cobrado&nbsp;</span>
          <span className="figure gilt">${fmtMoney(confirmed)}</span>
          <span className="vrule" />
          <span className="muted small">USD&nbsp;</span>
          <span className="figure dim">${fmtMoney(totalUsd)}</span>
          <span className="vrule" />
          <span className="eyebrow">Total ARS</span>
          <span className="figure huge">${fmtMoney(total)}</span>
        </div>
      </div>

      <style>{`
        .hd-left { display: flex; align-items: center; gap: 14px; }
        .hd-right { display: flex; align-items: center; gap: 12px; }
        .small { font-size: 11px; }
        .row-idx { color: var(--fg-5); font-size: 11px; }
        .gilt { color: var(--positive); }
        .totals { display: flex; align-items: center; gap: 10px; }
        .totals .vrule { width: 1px; height: 16px; background: var(--hairline-2); }
        .figure.huge { font-family: var(--f-display); font-weight: 600; font-size: 22px; letter-spacing: -0.01em; color: var(--fg); }
      `}</style>
    </section>
  );
}

/* ── Fixed expenses ──────────────────────────────────────── */
interface FixedProps {
  rows: FixedExpense[];
  categories: Category[];
  onChange: (id: string, field: keyof FixedExpense, value: string | boolean) => void;
  onTogglePaid: (id: string) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
}
function FixedExpenses({ rows, categories, onChange, onTogglePaid, onRemove, onAdd }: FixedProps) {
  const totalToPay = rows.reduce((a, r) => a + (parseFloat(r.toPay) || 0), 0);
  const totalPaid = rows.reduce((a, r) => a + (parseFloat(r.paid) || 0), 0);
  const sorted = [...rows].sort((a, b) => (parseInt(a.dueDay) || 99) - (parseInt(b.dueDay) || 99));
  const catColor = (name: string) => categories.find(c => c.nombre === name)?.color || '#888';
  const cols = '44px 1.6fr .9fr 60px 1fr 1fr 80px';

  return (
    <section className="panel">
      <div className="panel-head">
        <div className="hd-left">
          <span className="eyebrow">§ 02</span>
          <h2 className="section-title">Gastos Fijos</h2>
          <span className="pill"><Layers size={11} strokeWidth={1.75} /> Vencimientos</span>
        </div>
        <div className="hd-right">
          <span className="muted small">{rows.filter(r => r.isFullyPaid).length} / {rows.length} saldados</span>
          <button className="btn sm" onClick={onAdd}><Plus size={12} strokeWidth={1.75} /> Añadir</button>
        </div>
      </div>

      <div className="ledger-head" style={{ gridTemplateColumns: cols }}>
        <div>Día</div>
        <div>Descripción</div>
        <div>Categoría</div>
        <div className="t-center">Estado</div>
        <div className="t-right">A pagar</div>
        <div className="t-right">Pagado</div>
        <div className="t-right"></div>
      </div>

      <div>
        {sorted.map((r) => (
          <div key={r.id} className={'ledger-row' + (r.isFullyPaid ? ' confirmed' : '')} style={{ gridTemplateColumns: cols }}>
            <div>
              <input className="cell-input figure" style={{ textAlign: 'center', color: 'var(--fg-3)' }}
                value={r.dueDay} onChange={(e) => onChange(r.id, 'dueDay', e.target.value)} placeholder="—" />
            </div>
            <div>
              <input className="cell-input" value={r.description}
                onChange={(e) => onChange(r.id, 'description', e.target.value)}
                placeholder="Servicio / Alquiler / Plan…" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="cat-swatch" style={{ background: catColor(r.category) }} />
              <select className="cell-input" value={r.category}
                onChange={(e) => onChange(r.id, 'category', e.target.value)}>
                {categories.map(c => <option key={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div className="t-center">
              <span className={'check accent ' + (r.isFullyPaid ? 'on' : '')}
                onClick={() => onTogglePaid(r.id)}
                title={r.isFullyPaid ? 'Saldado' : 'Pendiente'}>
                {r.isFullyPaid ? <Check size={11} strokeWidth={2.5} /> : null}
              </span>
            </div>
            <div className="t-right">
              <input className="cell-input mono" type="number" value={r.toPay}
                onChange={(e) => onChange(r.id, 'toPay', e.target.value)} placeholder="0" />
            </div>
            <div className="t-right">
              <input className={'cell-input mono ' + (r.isFullyPaid ? 'gilt' : 'dim')}
                type="number" value={r.paid}
                onChange={(e) => onChange(r.id, 'paid', e.target.value)} placeholder="0" />
            </div>
            <div className="t-right">
              <button className="ibtn danger" onClick={() => onRemove(r.id)} title="Eliminar">
                <Trash2 size={14} strokeWidth={1.75} />
              </button>
            </div>
          </div>
        ))}
        {sorted.length === 0 && (
          <div className="ledger-row" style={{ gridTemplateColumns: '1fr', padding: '24px 18px' }}>
            <span className="muted small">— Sin gastos fijos cargados —</span>
          </div>
        )}
      </div>

      <div className="panel-foot">
        <span className="eyebrow">Subtotal gastos fijos</span>
        <div className="totals">
          <span className="muted small">restante&nbsp;</span>
          <span className="figure" style={{ color: 'var(--accent)' }}>${fmtMoney(totalToPay - totalPaid)}</span>
          <span className="vrule" />
          <span className="muted small">pagado&nbsp;</span>
          <span className="figure gilt">${fmtMoney(totalPaid)}</span>
          <span className="vrule" />
          <span className="eyebrow">Total</span>
          <span className="figure huge">${fmtMoney(totalToPay)}</span>
        </div>
      </div>

      <style>{`
        .cat-swatch { width: 8px; height: 8px; border-radius: var(--r-1); display: inline-block; flex: none; box-shadow: 0 0 0 1px var(--hairline); }
        .totals { display: flex; align-items: center; gap: 10px; }
        .totals .vrule { width: 1px; height: 16px; background: var(--hairline-2); }
      `}</style>
    </section>
  );
}

/* ── Treasury nodes ──────────────────────────────────────── */
interface TreasuryProps {
  balances: AccountBalances;
  prevMonthBalance: string;
  toCollect: number;
  onBalance: (key: keyof AccountBalances, v: string) => void;
  onPrev: (v: string) => void;
}
function TreasuryNodes({ balances, prevMonthBalance, toCollect, onBalance, onPrev }: TreasuryProps) {
  const nodes: { key: keyof AccountBalances; label: string; sub: string; icon: ReactNode }[] = [
    { key: 'cash',               label: 'Efectivo',  sub: 'Cash on hand',  icon: <Wallet size={16} strokeWidth={1.5} /> },
    { key: 'galicia',            label: 'Galicia',   sub: 'Caja de ahorro', icon: <Landmark size={16} strokeWidth={1.5} /> },
    { key: 'mercadoPago',        label: 'M. Pago',   sub: 'Disponible',     icon: <Smartphone size={16} strokeWidth={1.5} /> },
    { key: 'mercadoPagoReserve', label: 'Reserva',   sub: 'Rendimiento',    icon: <ShieldCheck size={16} strokeWidth={1.5} /> },
    { key: 'astroPay',           label: 'AstroPay',  sub: 'USD wallet',     icon: <ArrowUpRight size={16} strokeWidth={1.5} /> },
    { key: 'lemon',              label: 'Lemon',     sub: 'Crypto · USD',   icon: <CardIcon size={16} strokeWidth={1.5} /> },
  ];
  const total = nodes.reduce((a, n) => a + (parseFloat(balances[n.key]) || 0), 0);

  return (
    <aside className="treasury">
      <div className="panel-head">
        <div className="hd-left">
          <span className="eyebrow">§ 03</span>
          <h2 className="section-title">Nodos de Arqueo</h2>
        </div>
        <span className="pill"><span className="dot" style={{ background: 'var(--positive)' }} /> Líquido</span>
      </div>

      <div className="nodes">
        {nodes.map((n, i) => (
          <div className="node" key={n.key}>
            <div className="node-mark">{String(i + 1).padStart(2, '0')}</div>
            <div className="node-icon">{n.icon}</div>
            <div className="node-meta">
              <div className="node-label">{n.label}</div>
              <div className="node-sub">{n.sub}</div>
            </div>
            <div className="node-input">
              <span className="prefix">$</span>
              <input type="number" className="figure" value={balances[n.key]}
                onChange={(e) => onBalance(n.key, e.target.value)} placeholder="0" />
            </div>
          </div>
        ))}
      </div>

      <div className="extras">
        <div className="extra gilt-row">
          <div className="extra-icon"><Clock size={14} strokeWidth={1.75} /></div>
          <div className="extra-meta">
            <div className="extra-label">Por cobrar</div>
            <div className="extra-sub">Pendiente de confirmación</div>
          </div>
          <div className="extra-value figure">${fmtMoney(toCollect)}</div>
        </div>
        <div className="extra">
          <div className="extra-icon"><Receipt size={14} strokeWidth={1.75} /></div>
          <div className="extra-meta">
            <div className="extra-label">Mes anterior</div>
            <div className="extra-sub">Saldo de cierre</div>
          </div>
          <div className="extra-value">
            <span className="prefix">$</span>
            <input type="number" className="figure" value={prevMonthBalance}
              onChange={(e) => onPrev(e.target.value)} placeholder="0" />
          </div>
        </div>
      </div>

      <div className="treasury-foot">
        <span className="eyebrow">Subtotal nodos</span>
        <span className="figure huge">${fmtMoney(total)}</span>
      </div>

      <style>{`
        .treasury { background: var(--surface); border: 1px solid var(--hairline); border-radius: var(--r-2); display: flex; flex-direction: column; }
        .nodes { display: flex; flex-direction: column; }
        .node { display: grid; grid-template-columns: 30px 28px 1fr auto; align-items: center; gap: 12px; padding: 0 18px; min-height: 56px; border-bottom: 1px solid var(--hairline); transition: background .12s; }
        .node:hover { background: color-mix(in srgb, var(--surface-2) 30%, transparent); }
        .node-mark { font-family: var(--f-mono); font-size: 10px; color: var(--fg-5); }
        .node-icon { width: 28px; height: 28px; border: 1px solid var(--hairline-2); border-radius: var(--r-1); display: inline-flex; align-items: center; justify-content: center; color: var(--fg-3); }
        .node:hover .node-icon { color: var(--accent); border-color: color-mix(in srgb, var(--accent) 40%, transparent); }
        .node-label { font-family: var(--f-display); font-weight: 600; font-size: 13px; color: var(--fg); letter-spacing: -0.005em; }
        .node-sub { font-family: var(--f-display); font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--fg-5); font-weight: 600; margin-top: 2px; }
        .node-input { display: inline-flex; align-items: baseline; gap: 4px; }
        .node-input .prefix { color: var(--fg-5); font-family: var(--f-mono); font-size: 12px; }
        .node-input input { font-family: var(--f-mono); font-weight: 600; font-size: 16px; color: var(--fg); text-align: right; width: 110px; }
        .extras { display: flex; flex-direction: column; }
        .extra { display: grid; grid-template-columns: 28px 1fr auto; align-items: center; gap: 12px; padding: 14px 18px; border-top: 1px solid var(--hairline); }
        .extra-icon { width: 28px; height: 28px; border-radius: var(--r-1); background: color-mix(in srgb, var(--fg) 5%, transparent); display: inline-flex; align-items: center; justify-content: center; color: var(--fg-3); }
        .gilt-row .extra-icon { background: var(--positive-wash); color: var(--positive); }
        .gilt-row .extra-label, .gilt-row .extra-value { color: var(--positive); }
        .extra-label { font-family: var(--f-display); font-weight: 600; font-size: 13px; color: var(--fg); }
        .extra-sub { font-family: var(--f-display); font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--fg-5); font-weight: 600; margin-top: 2px; }
        .extra-value { font-family: var(--f-mono); font-weight: 600; font-size: 16px; display: inline-flex; align-items: baseline; gap: 4px; }
        .extra-value .prefix { color: var(--fg-5); font-size: 12px; }
        .extra-value input { font-family: var(--f-mono); font-weight: 600; font-size: 16px; color: var(--fg); text-align: right; width: 110px; }
        .treasury-foot { display: flex; align-items: center; justify-content: space-between; padding: 18px; border-top: 1px solid var(--hairline-2); background: color-mix(in srgb, var(--surface-2) 40%, transparent); }
        .figure.huge { font-family: var(--f-display); font-weight: 700; font-size: 26px; letter-spacing: -0.02em; color: var(--fg); }
      `}</style>
    </aside>
  );
}

/* ── Dashboard wrapper ───────────────────────────────────── */
export interface DashboardProps extends IncomeProps {
  fixed: FixedProps;
  treasury: TreasuryProps;
  period: string;
  subtotalBalances: number;
  totals: { paid: number; pending: number };
}
export function Dashboard(props: DashboardProps) {
  const { fixed, treasury, period, subtotalBalances, totals, ...income } = props;

  return (
    <div className="dashboard">
      <PageHeader
        eyebrow="Capítulo I · Liquidez"
        title="Arqueo del período"
        deck="Estado consolidado de ingresos confirmados, gastos fijos y nodos de tesorería personal. Todos los montos en ARS salvo indicación."
        right={
          <div className="period-block">
            <span className="eyebrow">Período</span>
            <div className="period-val">{period}</div>
          </div>
        }
      />

      <div className="grid">
        <div className="col-main">
          <IncomeTable {...income} />
          <FixedExpenses {...fixed} />
        </div>
        <div className="col-aside">
          <TreasuryNodes {...treasury} />
        </div>
      </div>

      <div className="kpis">
        <Kpi eyebrow="01 · Activos" title="Arqueo General" value={subtotalBalances}
          deck="Suma líquida de nodos más cuentas por cobrar confirmadas."
          tone="gilt" icon={<Coins size={16} strokeWidth={1.75} />} />
        <Kpi eyebrow="02 · Ejecutado" title="Total Pagado" value={totals.paid}
          deck="Movimientos saldados en el período corriente."
          tone="neutral" icon={<Check size={16} strokeWidth={1.75} />} />
        <Kpi eyebrow="03 · Exposición" title="Riesgo · Por Pagar" value={totals.pending}
          deck="Carga restante entre gastos fijos y tarjetas pendientes."
          tone="accent" icon={<ArrowDownRight size={16} strokeWidth={1.75} />} />
      </div>

      <style>{`
        .period-block { text-align: right; padding: 8px 14px; border-left: 1px solid var(--hairline); }
        .period-val { font-family: var(--f-display); font-weight: 600; font-size: 22px; letter-spacing: -0.01em; margin-top: 4px; color: var(--fg); }
        .grid { display: grid; grid-template-columns: 1fr 380px; gap: 24px; align-items: start; }
        .col-main { display: flex; flex-direction: column; gap: 24px; min-width: 0; }
        @media (max-width: 1100px) { .grid { grid-template-columns: 1fr; } }
        .kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 28px; }
        @media (max-width: 900px) { .kpis { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

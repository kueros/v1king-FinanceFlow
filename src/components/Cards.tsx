import {
  CreditCard as CardIcon, Plus, Trash2, Check, Pencil, TrendingUp,
} from 'lucide-react';
import type { CreditCard, CreditCardCharge, Category, CardStats } from '../types';
import { PageHeader, Kpi, fmtMoney } from './Shared';

interface CardSectionProps {
  card: CreditCard;
  categories: Category[];
  idx: number;
  total: number;
  onName: (cardId: string, name: string) => void;
  onAdd: (cardId: string) => void;
  onUpdate: (cardId: string, expenseId: string, field: keyof CreditCardCharge, value: string | boolean) => void;
  onRemove: (cardId: string, expenseId: string) => void;
}
function CardSection({ card, categories, idx, total, onName, onAdd, onUpdate, onRemove }: CardSectionProps) {
  const current = card.expenses.reduce((a, e) => a + (parseFloat(e.amount) || 0), 0);
  const forecast = card.expenses.reduce((a, e) =>
    a + (parseInt(e.currentInstallment) < parseInt(e.totalInstallments) ? (parseFloat(e.amount) || 0) : 0), 0);
  const confirmed = card.expenses.filter(e => e.isConfirmed).reduce((a, e) => a + (parseFloat(e.amount) || 0), 0);
  const catColor = (n: string) => categories.find(c => c.nombre === n)?.color || '#888';
  const cols = '44px 70px 1.8fr 1.1fr 60px 60px 1.2fr 90px';

  return (
    <section className="cardx">
      <div className="cardx-head">
        <div className="cardx-meta">
          <span className="eyebrow accent">Plástico · {String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
          <div className="cardx-name">
            <CardIcon size={18} strokeWidth={1.5} />
            <input className="cell-input" value={card.name}
              onChange={(e) => onName(card.id, e.target.value)}
              style={{ fontFamily: 'var(--f-display)', fontSize: 26, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--fg)' }} />
            <Pencil size={12} strokeWidth={1.5} style={{ color: 'var(--fg-5)' }} />
          </div>
        </div>
        <div className="cardx-stats">
          <div className="stat">
            <span className="eyebrow">Cierre actual</span>
            <span className="figure stat-val">${fmtMoney(current)}</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="eyebrow gilt">Confirmado</span>
            <span className="figure stat-val gilt">${fmtMoney(confirmed)}</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="eyebrow accent">Próximo período</span>
            <span className="figure stat-val accent">${fmtMoney(forecast)}</span>
          </div>
          <button className="btn primary" onClick={() => onAdd(card.id)}>
            <Plus size={12} strokeWidth={1.75} /> Cargo
          </button>
        </div>
      </div>

      <div className="cardx-table panel">
        <div className="ledger-head" style={{ gridTemplateColumns: cols }}>
          <div></div>
          <div>Fecha</div>
          <div>Concepto</div>
          <div>Categoría</div>
          <div className="t-center">Cuota</div>
          <div className="t-center">De</div>
          <div className="t-right">Monto ARS</div>
          <div className="t-right">Estado</div>
        </div>

        {card.expenses.length === 0 ? (
          <div className="empty">
            <span className="muted small">— Sin cargos cargados —</span>
            <button className="btn sm" onClick={() => onAdd(card.id)}>
              <Plus size={12} strokeWidth={1.75} /> Añadir primero
            </button>
          </div>
        ) : card.expenses.map((exp, i) => {
          const isLast = parseInt(exp.currentInstallment) === parseInt(exp.totalInstallments) || exp.totalInstallments === '1';
          return (
            <div key={exp.id} className={'ledger-row' + (exp.isConfirmed ? ' confirmed' : '')}
              style={{ gridTemplateColumns: cols }}>
              <div className="row-idx figure">{String(i + 1).padStart(2, '0')}</div>
              <div>
                <input className="cell-input figure" value={exp.date}
                  onChange={(e) => onUpdate(card.id, exp.id, 'date', e.target.value)}
                  placeholder="DD/MM" style={{ color: 'var(--fg-3)' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input className="cell-input" value={exp.description}
                  onChange={(e) => onUpdate(card.id, exp.id, 'description', e.target.value)}
                  placeholder="Concepto / comercio…"
                  style={isLast ? { color: 'var(--positive)', fontWeight: 600 } : undefined} />
                {isLast ? <span className="pill confirmed" style={{ height: 20, padding: '0 6px' }}>Última cuota</span> : null}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="cat-swatch" style={{ background: catColor(exp.category) }} />
                <select className="cell-input" value={exp.category}
                  onChange={(e) => onUpdate(card.id, exp.id, 'category', e.target.value)}>
                  <option>Compras</option>
                  {categories.map(c => <option key={c.id}>{c.nombre}</option>)}
                </select>
              </div>
              <div className="t-center">
                <input className="cell-input figure" type="number" value={exp.currentInstallment}
                  onChange={(e) => onUpdate(card.id, exp.id, 'currentInstallment', e.target.value)}
                  style={{ textAlign: 'center' }} />
              </div>
              <div className="t-center">
                <input className="cell-input figure" type="number" value={exp.totalInstallments}
                  onChange={(e) => onUpdate(card.id, exp.id, 'totalInstallments', e.target.value)}
                  style={{ textAlign: 'center' }} />
              </div>
              <div className="t-right">
                <input className="cell-input mono" type="number" value={exp.amount}
                  onChange={(e) => onUpdate(card.id, exp.id, 'amount', e.target.value)}
                  placeholder="0"
                  style={isLast ? { color: 'var(--positive)' } : undefined} />
              </div>
              <div className="t-right" style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, alignItems: 'center' }}>
                <span className={'check ' + (exp.isConfirmed ? 'on' : '')}
                  onClick={() => onUpdate(card.id, exp.id, 'isConfirmed', !exp.isConfirmed)}
                  title={exp.isConfirmed ? 'Confirmado' : 'Pendiente'}>
                  {exp.isConfirmed ? <Check size={11} strokeWidth={2.5} /> : null}
                </span>
                <button className="ibtn danger" onClick={() => onRemove(card.id, exp.id)}>
                  <Trash2 size={14} strokeWidth={1.75} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .cardx { display: flex; flex-direction: column; gap: 14px; }
        .cardx-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; flex-wrap: wrap; padding: 0 0 4px; }
        .cardx-meta { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .cardx-name { display: flex; align-items: center; gap: 12px; color: var(--fg-4); }
        .cardx-name input { width: 260px; padding: 4px 0; }
        .cardx-stats { display: flex; align-items: center; gap: 18px; }
        .stat { display: flex; flex-direction: column; gap: 2px; align-items: flex-end; }
        .stat-val { font-family: var(--f-display); font-weight: 600; font-size: 18px; letter-spacing: -0.01em; color: var(--fg); }
        .stat-val.gilt { color: var(--positive); }
        .stat-val.accent { color: var(--accent); }
        .stat-divider { width: 1px; height: 28px; background: var(--hairline-2); }
        .row-idx { color: var(--fg-5); font-size: 11px; text-align: center; }
        .cat-swatch { width: 8px; height: 8px; border-radius: var(--r-1); display: inline-block; flex: none; box-shadow: 0 0 0 1px var(--hairline); }
        .empty { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 24px 18px; }
        .small { font-size: 11px; }
      `}</style>
    </section>
  );
}

interface CardsProps {
  creditCards: CreditCard[];
  categories: Category[];
  cardStats: CardStats;
  updateCardName: (cardId: string, name: string) => void;
  addCardExpense: (cardId: string) => void;
  updateCardExpense: (cardId: string, expenseId: string, field: keyof CreditCardCharge, value: string | boolean) => void;
  removeCardExpense: (cardId: string, expenseId: string) => void;
}
export function Cards({ creditCards, categories, cardStats, updateCardName, addCardExpense, updateCardExpense, removeCardExpense }: CardsProps) {
  return (
    <div className="cards-screen">
      <PageHeader
        eyebrow="Capítulo II · Crédito"
        title="Plásticos y cuotas"
        deck="Cargos por tarjeta, cuotas en curso y previsión del próximo cierre. Confirmá los movimientos al verlos impactados en el resumen."
      />

      <div className="cards-list">
        {creditCards.map((card, i) => (
          <CardSection key={card.id} card={card} idx={i} total={creditCards.length} categories={categories}
            onName={updateCardName} onAdd={addCardExpense} onUpdate={updateCardExpense} onRemove={removeCardExpense} />
        ))}
      </div>

      <div className="cards-kpis">
        <Kpi eyebrow="Σ · Mes corriente" title="Consolidado Tarjetas" value={cardStats.currentTotal}
          deck="Suma de todos los cargos del período en las cuatro tarjetas."
          tone="neutral" icon={<CardIcon size={16} strokeWidth={1.75} />} />
        <Kpi eyebrow="Σ · Confirmado" title="Movimientos saldados" value={cardStats.confirmedTotal}
          deck="Cargos ya conciliados con el extracto." tone="gilt"
          icon={<Check size={16} strokeWidth={1.75} />} />
        <Kpi eyebrow="Σ · Próximo período" title="Carga prevista" value={cardStats.forecastTotal}
          deck="Cuotas que continúan más allá del cierre actual." tone="accent"
          icon={<TrendingUp size={16} strokeWidth={1.75} />} />
      </div>

      <style>{`
        .cards-list { display: flex; flex-direction: column; gap: 36px; }
        .cards-kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 40px; }
        @media (max-width: 900px) { .cards-kpis { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

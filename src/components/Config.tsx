import { useState } from 'react';
import { Plus, Trash2, Hash } from 'lucide-react';
import type { Category } from '../types';
import { PageHeader } from './Shared';

const PRESETS = [
  '#C41E3A', '#D4AF37', '#1F5BD4', '#1E6B43',
  '#B0871E', '#9333EA', '#EA580C', '#0EA5E9',
  '#94A3B8', '#F5F1E8',
];

interface Props {
  categories: Category[];
  onAdd: (nombre: string, color: string) => void;
  onDelete: (id: string) => void;
  expenseCounts: Record<string, number>;
}
export function Config({ categories, onAdd, onDelete, expenseCounts }: Props) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESETS[0]);

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name.trim(), color);
      setName('');
    }
  };

  return (
    <div className="cfg">
      <PageHeader
        eyebrow="Capítulo III · Taxonomía"
        title="Categorías"
        deck="El vocabulario con el que clasificás cada ingreso, gasto fijo y movimiento de tarjeta. Cambios se reflejan en todas las pantallas."
      />

      <section className="cfg-add panel">
        <div className="panel-head">
          <div className="hd-left">
            <span className="eyebrow accent">Nueva categoría</span>
            <h2 className="section-title">Definir etiqueta</h2>
          </div>
          <span className="muted small">{categories.length} categorías activas</span>
        </div>

        <div className="cfg-form">
          <div className="form-field" style={{ gridColumn: 'span 6' }}>
            <label className="field-label">Nombre</label>
            <input className="input" value={name}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Supermercado, Gimnasio, Educación…" autoFocus />
          </div>
          <div className="form-field" style={{ gridColumn: 'span 5' }}>
            <label className="field-label">Color identificador</label>
            <div className="swatches">
              {PRESETS.map((c) => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className={'swatch' + (color === c ? ' on' : '')}
                  style={{ background: c }} aria-label={c} />
              ))}
            </div>
          </div>
          <div className="form-field" style={{ gridColumn: 'span 1' }}>
            <label className="field-label">&nbsp;</label>
            <button className="btn primary" style={{ width: '100%', height: 40 }}
              disabled={!name.trim()} onClick={handleAdd}>
              <Plus size={14} strokeWidth={1.75} /> Crear
            </button>
          </div>
        </div>
      </section>

      <section className="cfg-list">
        <div className="cfg-list-head">
          <span className="eyebrow">Catálogo · {categories.length}</span>
          <span className="muted small">Hover para acciones · Eliminar reasigna a “Varios”</span>
        </div>
        <div className="cat-grid">
          {categories.map((cat) => {
            const count = expenseCounts[cat.nombre] || 0;
            return (
              <div className="cat-row" key={cat.id}>
                <div className="cat-mark" style={{ background: cat.color }} />
                <div className="cat-body">
                  <div className="cat-name">{cat.nombre}</div>
                  <div className="cat-sub">
                    {count > 0 ? `${count} movimiento${count === 1 ? '' : 's'}` : 'Sin movimientos'} · <span className="figure" style={{ color: 'var(--fg-5)' }}>{cat.color.toUpperCase()}</span>
                  </div>
                </div>
                {categories.length > 1 && (
                  <button className="ibtn danger del" onClick={() => onDelete(cat.id)} title="Eliminar">
                    <Trash2 size={14} strokeWidth={1.75} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <footer className="cfg-foot">
        <Hash size={14} strokeWidth={1.75} />
        <span>Las categorías aparecen en los selectores de Ingresos, Gastos Fijos y Tarjetas. Eliminar una categoría reasigna sus movimientos a <strong>Varios</strong>.</span>
      </footer>

      <style>{`
        .cfg { max-width: 1100px; margin: 0 auto; }
        .cfg-add { margin-bottom: 36px; }
        .cfg-form { display: grid; grid-template-columns: repeat(12, 1fr); gap: 18px; padding: 24px 22px; }
        .form-field { display: flex; flex-direction: column; }
        .swatches { display: flex; flex-wrap: wrap; gap: 6px; padding: 6px; border: 1px solid var(--hairline); border-radius: var(--r-1); background: var(--surface-2); }
        .swatch { width: 26px; height: 26px; border-radius: var(--r-1); border: 1px solid var(--hairline-2); transition: transform .12s, box-shadow .12s; cursor: pointer; }
        .swatch:hover { transform: scale(1.06); }
        .swatch.on { box-shadow: inset 0 0 0 2px var(--fg); }
        .cfg-list-head { display: flex; align-items: baseline; justify-content: space-between; padding: 10px 4px 18px; }
        .small { font-size: 11px; }
        .cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0; border: 1px solid var(--hairline); border-radius: var(--r-2); background: var(--surface); overflow: hidden; }
        .cat-row { display: grid; grid-template-columns: 8px 1fr auto; gap: 16px; align-items: center; padding: 16px 18px; border-right: 1px solid var(--hairline); border-bottom: 1px solid var(--hairline); transition: background .12s; min-height: 72px; }
        .cat-row:hover { background: color-mix(in srgb, var(--surface-2) 50%, transparent); }
        .cat-row:hover .del { opacity: 1; }
        .cat-mark { width: 4px; align-self: stretch; border-radius: var(--r-1); }
        .cat-name { font-family: var(--f-display); font-weight: 600; font-size: 15px; color: var(--fg); letter-spacing: -0.005em; }
        .cat-sub { font-family: var(--f-display); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--fg-5); font-weight: 600; margin-top: 4px; }
        .del { opacity: 0; transition: opacity .12s; }
        .cfg-foot { display: flex; align-items: center; gap: 10px; margin-top: 28px; padding: 14px 18px; background: color-mix(in srgb, var(--accent) 7%, var(--surface)); border: 1px solid color-mix(in srgb, var(--accent) 30%, var(--hairline-2)); border-radius: var(--r-2); color: var(--fg-3); font-size: 13px; }
        .cfg-foot svg { color: var(--accent); flex: none; }
        .cfg-foot strong { color: var(--fg); font-weight: 600; }
      `}</style>
    </div>
  );
}

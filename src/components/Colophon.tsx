export function Colophon() {
  return (
    <footer className="colophon">
      <div className="shell row">
        <div className="col">
          <div className="logo">
            <span>v</span><span className="one">1</span><span>King</span>
          </div>
          <div className="tag">Personal Treasury · Núcleo estable v3.0</div>
        </div>
        <div className="col t-right">
          <div className="meta">
            <span>© {new Date().getFullYear()} v1King Studio</span>
            <span className="sep">·</span>
            <span>Datos locales · cifrado en dispositivo</span>
          </div>
          <div className="meta dim">Próxima conciliación: cierre de mes natural</div>
        </div>
      </div>
      <style>{`
        .colophon { border-top: 1px solid var(--hairline); padding: 28px 0 36px; margin-top: 40px; color: var(--fg-4); }
        .colophon .row { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; }
        .colophon .logo { font-family: var(--f-display); font-weight: 600; font-size: 16px; letter-spacing: -0.01em; color: var(--fg-2); }
        .colophon .logo .one { color: var(--accent); font-style: italic; }
        .colophon .tag { font-family: var(--f-display); font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 600; margin-top: 6px; color: var(--fg-5); }
        .colophon .meta { font-family: var(--f-mono); font-size: 11px; }
        .colophon .meta .sep { margin: 0 8px; color: var(--fg-5); }
        .colophon .dim { color: var(--fg-5); margin-top: 4px; }
      `}</style>
    </footer>
  );
}

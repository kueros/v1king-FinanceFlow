# v1King · FinanceFlow

Centro de control de tesorería personal — arqueo de cuentas, gastos fijos, tarjetas de crédito y categorías.

**Stack:** Vite + React 19 + TypeScript · Tailwind disponible · Lucide · Datos en `localStorage`.

---

## Marca

| Token        | Valor       | Uso                                |
| ------------ | ----------- | ---------------------------------- |
| `--ink-2`    | `#1A1A1A`   | Primario / fondos en dark          |
| `--parchment`| `#F5F1E8`   | Texto sobre dark / fondo en light  |
| `--crimson`  | `#C41E3A`   | Acento, acciones, riesgo           |
| `--gilt`     | `#D4AF37`   | Confirmado, "cobrado", positivo    |

Tipografías: **Space Grotesk** (display) · **Inter** (cuerpo) · **JetBrains Mono** (cifras).
Radii máximo: `4px`. Dark-mode first.

---

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # bundle a dist/
npm run preview    # servir dist/
```

> En desarrollo local, si querés evitar el `base` de Pages, ejecutá:
> `VITE_BASE=/ npm run dev`

---

## Despliegue en GitHub Pages

El workflow `.github/workflows/deploy.yml` se dispara con cada push a `main`:

1. En el repo, **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Hacé push a `main`. El workflow corre `npm run build` con `VITE_BASE=/v1king-FinanceFlow/` y publica `dist/`.
3. La app queda en `https://kueros.github.io/v1king-FinanceFlow/`.

Para un dominio custom: setear el CNAME en `public/CNAME` y cambiar `VITE_BASE` a `/` en el workflow.

---

## Datos

Todo se guarda local en `localStorage` bajo la key `financeflow_v3`. El botón **Cambio de Mes** genera un resguardo JSON automático antes de reciclar el período.

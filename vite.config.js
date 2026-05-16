import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Repo: github.com/kueros/v1king-FinanceFlow → served at
// https://kueros.github.io/v1king-FinanceFlow/
// Override with VITE_BASE=/ for a custom domain.
const base = process.env.VITE_BASE ?? '/v1king-FinanceFlow/';

export default defineConfig({
  plugins: [react()],
  base,
});

// Dev: BASE_URL is '/' → API_BASE is '' → proxied by Vite to localhost:8003
// Prod: BASE_URL is '/peerlingo/' → API_BASE is '/peerlingo'
export const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

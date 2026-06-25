// Dev: BASE_URL is '/' → API_BASE is '' → proxied by Vite to localhost:8003
// Prod: BASE_URL is '/virtual-peers/' → API_BASE is '/virtual-peers'
export const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

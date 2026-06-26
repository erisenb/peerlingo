// Dev: VITE_API_BASE unset → empty string → proxied by Vite to localhost:8003
// Prod: VITE_API_BASE=https://your-backend.onrender.com
export const API_BASE = import.meta.env.VITE_API_BASE || ''

// Vitest global setup
// Loads .env variables so tests can access VITE_SUPABASE_URL etc.
import { loadEnv } from 'vite'

const env = loadEnv('test', process.cwd(), '')
Object.assign(process.env, env)

// Expose as import.meta.env for Supabase client
if (!globalThis.importMeta) {
  globalThis.importMeta = { env: {} }
}
Object.assign(globalThis.importMeta?.env ?? {}, {
  VITE_SUPABASE_URL: env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: env.VITE_SUPABASE_ANON_KEY,
})

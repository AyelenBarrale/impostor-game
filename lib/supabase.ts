import { createClient } from '@supabase/supabase-js'

// Función para obtener la configuración de Supabase de forma segura
function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL environment variable. ' +
      'Please check your .env.local file.'
    )
  }

  if (!anonKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. ' +
      'Please check your .env.local file.'
    )
  }

  return { url, anonKey }
}

// Obtener configuración y crear cliente
const config = getSupabaseConfig()
export const supabase = createClient(config.url, config.anonKey)

// For server-side operations
export const supabaseAdmin = createClient(
  config.url,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

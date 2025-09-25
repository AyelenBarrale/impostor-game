import { createClient } from '@supabase/supabase-js'

// Función para obtener la configuración de Supabase de forma segura
function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL environment variable. ' +
      'Please check your .env.local file or Vercel environment variables.'
    )
  }

  if (!anonKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. ' +
      'Please check your .env.local file or Vercel environment variables.'
    )
  }

  return { url, anonKey }
}

// Lazy initialization para evitar errores durante el build
let _supabase: ReturnType<typeof createClient> | null = null

export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    if (!_supabase) {
      const config = getSupabaseConfig()
      _supabase = createClient(config.url, config.anonKey)
    }
    return (_supabase as unknown as ReturnType<typeof createClient>)[prop as keyof ReturnType<typeof createClient>]
  }
})

// For server-side operations (lazy initialization)
let _supabaseAdmin: ReturnType<typeof createClient> | null = null

export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    if (!_supabaseAdmin) {
      const config = getSupabaseConfig()
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
      
      if (!serviceRoleKey) {
        throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
      }
      
      _supabaseAdmin = createClient(config.url, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })
    }
    return (_supabaseAdmin as unknown as ReturnType<typeof createClient>)[prop as keyof ReturnType<typeof createClient>]
  }
})

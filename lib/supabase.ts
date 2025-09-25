import { createClient } from '@supabase/supabase-js'

// Función para verificar si la configuración de Supabase está disponible
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || url === 'undefined' || url === '' || url === 'your-project-ref.supabase.co') {
    return false
  }

  if (!anonKey || anonKey === 'undefined' || anonKey === '' || anonKey === 'your-anon-key-here') {
    return false
  }

  // Validar que la URL tenga el formato correcto
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'https:' && urlObj.hostname.includes('supabase')
  } catch {
    return false
  }
}

// Función para obtener la configuración de Supabase de forma segura
function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!isSupabaseConfigured()) {
    throw new Error('SUPABASE_NOT_CONFIGURED')
  }

  return { url: url!, anonKey: anonKey! }
}

// Exportar función de verificación
export { isSupabaseConfigured }

// Lazy initialization para evitar errores durante el build
let _supabase: ReturnType<typeof createClient> | null = null

export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    if (!_supabase) {
      if (!isSupabaseConfigured()) {
        throw new Error('SUPABASE_NOT_CONFIGURED')
      }
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

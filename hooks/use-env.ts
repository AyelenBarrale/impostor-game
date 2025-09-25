import { useMemo } from 'react'

interface SupabaseConfig {
  url: string
  anonKey: string
}

/**
 * Custom hook para obtener y validar las variables de entorno de Supabase
 * Proporciona validación en tiempo de ejecución y mejor manejo de errores
 */
export function useSupabaseConfig(): SupabaseConfig {
  return useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Validación detallada
    if (!url) {
      throw new Error(
        'Missing NEXT_PUBLIC_SUPABASE_URL environment variable. ' +
        'Please check your .env.local file and ensure it contains the Supabase project URL.'
      )
    }

    if (!anonKey) {
      throw new Error(
        'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. ' +
        'Please check your .env.local file and ensure it contains the Supabase anonymous key.'
      )
    }

    // Validación básica del formato
    if (!url.startsWith('https://') || !url.includes('.supabase.co')) {
      throw new Error(
        'Invalid NEXT_PUBLIC_SUPABASE_URL format. ' +
        'Expected format: https://your-project-id.supabase.co'
      )
    }

    if (anonKey.length < 100) {
      throw new Error(
        'Invalid NEXT_PUBLIC_SUPABASE_ANON_KEY format. ' +
        'The anonymous key should be a long JWT token.'
      )
    }

    return { url, anonKey }
  }, [])
}

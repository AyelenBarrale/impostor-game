import { useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useSupabaseConfig } from './use-env'

/**
 * Hook para crear un cliente de Supabase con configuración validada
 * Útil para componentes que necesitan crear su propia instancia del cliente
 */
export function useSupabaseClient() {
  const config = useSupabaseConfig()
  
  return useMemo(() => {
    return createClient(config.url, config.anonKey)
  }, [config.url, config.anonKey])
}

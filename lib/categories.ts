import { supabase, isSupabaseConfigured } from './supabase'
import type { CategoryWithWords } from './types'
import type { Database } from './database.types'

type Category = Database['public']['Tables']['categories']['Row']
type Word = Database['public']['Tables']['words']['Row']

// Categorías de fallback en caso de que Supabase no esté disponible
const FALLBACK_CATEGORIES: CategoryWithWords[] = [
  {
    id: 1,
    name: 'Animales',
    words: ['Perro', 'Gato', 'Elefante', 'León', 'Tigre', 'Oso', 'Lobo', 'Águila', 'Delfín', 'Pingüino']
  },
  {
    id: 2,
    name: 'Comida',
    words: ['Pizza', 'Hamburguesa', 'Pasta', 'Sushi', 'Tacos', 'Helado', 'Chocolate', 'Manzana', 'Pan', 'Queso']
  },
  {
    id: 3,
    name: 'Deportes',
    words: ['Fútbol', 'Baloncesto', 'Tenis', 'Natación', 'Ciclismo', 'Boxeo', 'Golf', 'Voleibol', 'Béisbol', 'Hockey']
  },
  {
    id: 4,
    name: 'Profesiones',
    words: ['Médico', 'Profesor', 'Ingeniero', 'Chef', 'Artista', 'Policía', 'Bombero', 'Piloto', 'Abogado', 'Músico']
  },
  {
    id: 5,
    name: 'Países',
    words: ['España', 'Francia', 'Italia', 'Alemania', 'Brasil', 'Japón', 'Australia', 'Canadá', 'México', 'Argentina']
  }
]

/**
 * Obtiene todas las categorías con sus palabras desde Supabase
 * Si hay error o no está configurado, devuelve categorías de fallback
 */
export async function getCategories(): Promise<CategoryWithWords[]> {
  // Verificar si Supabase está configurado antes de intentar conectar
  if (!isSupabaseConfigured()) {
    console.info('Supabase not configured, using fallback categories')
    return FALLBACK_CATEGORIES
  }

  try {
    console.log('🔍 Attempting to fetch categories from Supabase...')
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    console.log('🔍 Supabase response:', { 
      categoriesCount: categories?.length || 0, 
      error: categoriesError,
      hasData: !!categories 
    })

    if (categoriesError) {
      console.warn('❌ Error fetching categories from Supabase:', categoriesError)
      return FALLBACK_CATEGORIES
    }

    if (!categories || categories.length === 0) {
      console.warn('No categories found in Supabase, using fallback')
      return FALLBACK_CATEGORIES
    }

    // Obtener las palabras para cada categoría
    const categoriesWithWords: CategoryWithWords[] = []
    
    for (const category of categories) {
      const { data: words, error: wordsError } = await supabase
        .from('words')
        .select('word')
        .eq('category_id', (category as Category).id)

      if (wordsError) {
        console.warn(`Error fetching words for category ${(category as Category).name}, skipping:`, wordsError)
        continue
      }

      categoriesWithWords.push({
        id: (category as Category).id,
        name: (category as Category).name,
        words: words?.map(w => (w as Word).word) || []
      })
    }

    // Si no se pudieron cargar categorías con palabras, usar fallback
    if (categoriesWithWords.length === 0) {
      console.warn('No categories with words found, using fallback')
      return FALLBACK_CATEGORIES
    }

    return categoriesWithWords
  } catch (error) {
    // Verificar si es el error específico de configuración
    if (error instanceof Error && error.message === 'SUPABASE_NOT_CONFIGURED') {
      console.info('Supabase not configured, using fallback categories')
      return FALLBACK_CATEGORIES
    }
    console.warn('Error connecting to Supabase, using fallback categories:', error)
    return FALLBACK_CATEGORIES
  }
}

/**
 * Obtiene las palabras de una categoría específica
 * Si hay error o no está configurado, busca en las categorías de fallback
 */
export async function getCategoryWords(categoryId: number): Promise<string[]> {
  // Verificar si Supabase está configurado antes de intentar conectar
  if (!isSupabaseConfigured()) {
    console.info('Supabase not configured, using fallback category words')
    const fallbackCategory = FALLBACK_CATEGORIES.find(cat => cat.id === categoryId)
    return fallbackCategory?.words || []
  }

  try {
    const { data: words, error } = await supabase
      .from('words')
      .select('word')
      .eq('category_id', categoryId)

    if (error) {
      console.warn('Error fetching category words from Supabase, checking fallback:', error)
      // Buscar en categorías de fallback
      const fallbackCategory = FALLBACK_CATEGORIES.find(cat => cat.id === categoryId)
      return fallbackCategory?.words || []
    }

    if (words && words.length > 0) {
      return words.map(w => (w as Word).word)
    }

    // Si no hay palabras en Supabase, buscar en fallback
    const fallbackCategory = FALLBACK_CATEGORIES.find(cat => cat.id === categoryId)
    return fallbackCategory?.words || []
  } catch (error) {
    // Verificar si es el error específico de configuración
    if (error instanceof Error && error.message === 'SUPABASE_NOT_CONFIGURED') {
      console.info('Supabase not configured, using fallback category words')
      const fallbackCategory = FALLBACK_CATEGORIES.find(cat => cat.id === categoryId)
      return fallbackCategory?.words || []
    }
    console.warn('Error connecting to Supabase for category words, using fallback:', error)
    const fallbackCategory = FALLBACK_CATEGORIES.find(cat => cat.id === categoryId)
    return fallbackCategory?.words || []
  }
}

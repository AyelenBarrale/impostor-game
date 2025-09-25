import { supabase } from './supabase'
import type { CategoryWithWords } from './types'

/**
 * Obtiene todas las categorías con sus palabras desde Supabase
 */
export async function getCategories(): Promise<CategoryWithWords[]> {
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (categoriesError) {
    console.error('Error fetching categories:', categoriesError)
    return []
  }

  if (!categories) return []

  // Obtener las palabras para cada categoría
  const categoriesWithWords: CategoryWithWords[] = []
  
  for (const category of categories) {
    const { data: words, error: wordsError } = await supabase
      .from('words')
      .select('word')
      .eq('category_id', category.id)

    if (wordsError) {
      console.error(`Error fetching words for category ${category.name}:`, wordsError)
      continue
    }

    categoriesWithWords.push({
      id: category.id,
      name: category.name,
      words: words?.map(w => w.word) || []
    })
  }

  return categoriesWithWords
}

/**
 * Obtiene las palabras de una categoría específica
 */
export async function getCategoryWords(categoryId: number): Promise<string[]> {
  const { data: words, error } = await supabase
    .from('words')
    .select('word')
    .eq('category_id', categoryId)

  if (error) {
    console.error('Error fetching category words:', error)
    return []
  }

  return words?.map(w => w.word) || []
}

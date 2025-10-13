"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { GameComponentProps, Player, CategoryWithWords } from "@/lib/types"
import { getCategories, getCategoryWords } from "@/lib/categories"

export function GameSetup({ gameState, updateGameState }: GameComponentProps) {
  const [playerCount, setPlayerCount] = useState(4)
  const [currentPhase, setCurrentPhase] = useState<"players" | "category" | "cards">("players")
  const [cardsRevealed, setCardsRevealed] = useState<boolean[]>([])
  const [cardTimers, setCardTimers] = useState<{ [key: number]: NodeJS.Timeout | null }>({})
  const [cardsUsed, setCardsUsed] = useState<boolean[]>([])
  const [categories, setCategories] = useState<CategoryWithWords[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  // Cargar categorías desde Supabase al montar el componente
  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setLoading(true)
    setError(null)
    setUsingFallback(false)
    
    try {
      const categoriesData = await getCategories()
      setCategories(categoriesData)
      
      if (categoriesData.length === 0) {
        setError('No se encontraron categorías.')
      } else {
        // Verificar si estamos usando categorías de fallback
        const fallbackNames = ['Animales', 'Comida', 'Deportes', 'Profesiones', 'Países']
        const isUsingFallback = categoriesData.length === 5 && 
          categoriesData.every(cat => fallbackNames.includes(cat.name))
        
        setUsingFallback(isUsingFallback)
      }
    } catch (error) {
      console.error('Error loading categories:', error)
      
      // Siempre intentar obtener categorías de fallback
      try {
        const fallbackCategories = await getCategories()
        if (fallbackCategories.length > 0) {
          setCategories(fallbackCategories)
          setUsingFallback(true)
        } else {
          setError('No se pudieron cargar las categorías.')
        }
      } catch {
        setError('Error crítico: No se pudieron cargar las categorías.')
      }
    } finally {
      setLoading(false)
    }
  }

  const selectCategory = async (categoryName: string) => {
    const selectedCategory = categories.find(cat => cat.name === categoryName)
    if (!selectedCategory) return

    setSelectedCategoryId(selectedCategory.id)
    updateGameState({ selectedCategory: categoryName })
    setCurrentPhase("cards")
    await generatePlayersWithWords(selectedCategory)
  }

  const generatePlayersWithWords = async (category: CategoryWithWords) => {
    const players: Player[] = []
    const impostorId = Math.floor(Math.random() * playerCount)
    
    // Si la categoría no tiene palabras cargadas, obtenerlas de Supabase
    let words = category.words
    if (words.length === 0 && selectedCategoryId) {
      words = await getCategoryWords(selectedCategoryId)
    }
    
    if (words.length === 0) {
      console.error('No words found for category:', category.name)
      return
    }
    
    const selectedWord = words[Math.floor(Math.random() * words.length)]

    for (let i = 0; i < playerCount; i++) {
      players.push({
        id: i,
        name: `Jugador ${i + 1}`,
        isImpostor: i === impostorId,
        role: i === impostorId ? "IMPOSTOR" : selectedWord,
        hasVoted: false,
        votes: 0,
      })
    }

    updateGameState({
      players,
      impostorId,
    })
    setCardsRevealed(new Array(playerCount).fill(false))
    setCardsUsed(new Array(playerCount).fill(false))
  }

  const revealCard = (index: number) => {
    if (cardsUsed[index]) {
      return
    }

    // Verificar si hay alguna otra tarjeta revelada
    const anyCardRevealed = cardsRevealed.some((revealed, i) => revealed && i !== index)
  
    if (cardsRevealed[index]) {
      // Si la tarjeta actual está revelada, marcarla como usada
      const newRevealed = [...cardsRevealed]
      newRevealed[index] = false
      setCardsRevealed(newRevealed)

      const newUsed = [...cardsUsed]
      newUsed[index] = true
      setCardsUsed(newUsed)

      if (cardTimers[index]) {
        clearTimeout(cardTimers[index])
        setCardTimers((prev) => ({ ...prev, [index]: null }))
      }
    } else if (!anyCardRevealed) {
      // Solo revelar si NO hay ninguna otra tarjeta revelada
      const newRevealed = [...cardsRevealed]
      newRevealed[index] = true
      setCardsRevealed(newRevealed)

      const timer = setTimeout(() => {
        setCardsRevealed((prev) => {
          const updated = [...prev]
          updated[index] = false
          return updated
        })
        setCardsUsed((prev) => {
          const updatedUsed = [...prev]
          updatedUsed[index] = true
          return updatedUsed
        })
        setCardTimers((prev) => ({ ...prev, [index]: null }))
      }, 3000)

      setCardTimers((prev) => ({ ...prev, [index]: timer }))
    }
  }

  const startGame = () => {
    Object.values(cardTimers).forEach((timer) => {
      if (timer) clearTimeout(timer)
    })
    updateGameState({ phase: "play" })
  }

  useEffect(() => {
    return () => {
      Object.values(cardTimers).forEach((timer) => {
        if (timer) clearTimeout(timer)
      })
    }
  }, [cardTimers])

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {currentPhase === "players" && (
        <Card className="p-8 clean-card bg-card/95 backdrop-blur-sm">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-accent">Configuración del Juego</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Número de Jugadores</label>
                <Input
                  type="number"
                  min="3"
                  max="10"
                  value={playerCount}
                  onChange={(e) => setPlayerCount(Number.parseInt(e.target.value))}
                  className="w-32 mx-auto text-center bg-input border-border text-foreground rounded-xl"
                />
              </div>

              <Button
                onClick={() => setCurrentPhase("category")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
                size="lg"
              >
                Continuar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {currentPhase === "category" && (
        <Card className="p-8 clean-card bg-card/95 backdrop-blur-sm">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-accent">Seleccionar Categoría</h2>
            <p className="text-muted-foreground text-lg">Elige la categoría para esta ronda</p>
            {usingFallback && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <p className="text-amber-600 text-sm">
                  ℹ️ Usando categorías offline. Para más categorías, configura Supabase en Vercel.
                </p>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="text-muted-foreground">Cargando categorías...</span>
              </div>
            ) : error ? (
              <div className="text-center space-y-4 max-w-md mx-auto">
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                  <p className="text-destructive text-sm font-medium mb-2">Error de Configuración</p>
                  <p className="text-destructive/80 text-sm">{error}</p>
                </div>
                {error.includes('Vercel') && (
                  <div className="text-xs text-muted-foreground space-y-2">
                    <p>Para solucionarlo:</p>
                    <ol className="list-decimal list-inside text-left space-y-1">
                      <li>Ve a tu proyecto en Vercel</li>
                      <li>Settings → Environment Variables</li>
                      <li>Agrega NEXT_PUBLIC_SUPABASE_URL</li>
                      <li>Agrega NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                      <li>Redeploy el proyecto</li>
                    </ol>
                  </div>
                )}
                <Button onClick={loadCategories} variant="outline" className="rounded-xl">
                  Reintentar
                </Button>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">No se encontraron categorías</p>
                <Button onClick={loadCategories} variant="outline" className="rounded-xl">
                  Reintentar
                </Button>
              </div>
            ) : (
              <Select onValueChange={selectCategory}>
                <SelectTrigger className="w-64 mx-auto bg-input border-border text-foreground rounded-xl">
                  <SelectValue placeholder="Elige una categoría" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border rounded-xl">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name} className="hover:bg-accent/10 text-foreground rounded-lg">
                      {category.name} ({category.words.length} palabras)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </Card>
      )}

      {currentPhase === "cards" && gameState.players.length > 0 && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-accent mb-4">Revelación de Palabras</h2>
            <p className="text-muted-foreground mb-2 text-lg">
              Categoría: <span className="text-primary font-bold">{gameState.selectedCategory}</span>
            </p>
            <p className="text-muted-foreground">Cada jugador debe hacer clic en su carta para ver su palabra</p>
            <p className="text-sm text-muted-foreground mt-2">
              La carta se volteará automáticamente en 3 segundos o puedes hacer clic de nuevo
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {gameState.players.map((player, index) => (
              <div key={player.id} className="relative h-40 w-full max-w-[200px] sm:w-[200px]">
                <div
                  className={`clean-card h-full rounded-xl transition-all duration-200 ${
                    cardsUsed[index] ? "card-disabled" : "cursor-pointer hover:shadow-lg"
                  }`}
                  onClick={() => revealCard(index)}
                >
                  <div className={`card-container h-full ${cardsRevealed[index] ? "flipped" : ""}`}>
                    <div className="card-front bg-card rounded-xl p-4">
                      <div className="text-center h-full flex flex-col justify-center">
                        <div className="text-xl font-bold text-accent mb-2">{player.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {cardsUsed[index] ? "Ya utilizada" : "Toca para revelar"}
                        </div>
                      </div>
                    </div>

                    <div className={`card-back rounded-xl p-4 ${player.isImpostor ? "impostor-card" : "player-card"}`}>
                      <div className="text-center h-full flex flex-col justify-center space-y-2">
                        <div className="text-lg font-bold text-accent">{player.name}</div>
                        <div
                          className={`text-2xl font-bold ${player.isImpostor ? "text-destructive" : "text-primary"}`}
                        >
                          {player.role}
                        </div>
                        {player.isImpostor && (
                          <div className="text-sm text-destructive font-medium">¡Eres el impostor!</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={startGame}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
              size="lg"
            >
              Iniciar Juego
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

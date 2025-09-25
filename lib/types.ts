// Tipos compartidos para el juego de impostores

export type GamePhase = "setup" | "play" | "voting" | "result"

// Tipo para categorías con sus palabras
export interface CategoryWithWords {
  id: number
  name: string
  words: string[]
}

export interface Player {
  id: number
  name: string
  isImpostor: boolean
  role: string
  hasVoted: boolean
  votes: number
}

export interface GameState {
  phase: GamePhase
  players: Player[]
  selectedCategory: string
  impostorId: number
  votingComplete: boolean
  gameComplete: boolean
}

// Props interfaces para componentes
export interface GameComponentProps {
  gameState: GameState
  updateGameState: (updates: Partial<GameState>) => void
}

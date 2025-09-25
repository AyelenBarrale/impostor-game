"use client"

import { useState } from "react"

// Removed dynamic export to fix Vercel 404 issues
import { GameSetup } from "@/components/game-setup"
import { GamePlay } from "@/components/game-play"
import { GameVoting } from "@/components/game-voting"
import { GameResult } from "@/components/game-result"
import type { GameState } from "@/lib/types"

export default function HomePage() {
  const [gameState, setGameState] = useState<GameState>({
    phase: "setup",
    players: [],
    selectedCategory: "",
    impostorId: -1,
    votingComplete: false,
    gameComplete: false,
  })

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState((prev) => ({ ...prev, ...updates }))
  }

  return (
    <div className="min-h-screen bg-background geometric-pattern">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-accent mb-4 tracking-wide">EL IMPOSTOR</h1>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="text-muted-foreground mt-6 text-lg">Juego de deducción social</p>
        </header>

        {gameState.phase === "setup" && <GameSetup gameState={gameState} updateGameState={updateGameState} />}

        {gameState.phase === "play" && <GamePlay gameState={gameState} updateGameState={updateGameState} />}

        {gameState.phase === "voting" && <GameVoting gameState={gameState} updateGameState={updateGameState} />}

        {gameState.phase === "result" && <GameResult gameState={gameState} updateGameState={updateGameState} />}
      </div>
    </div>
  )
}

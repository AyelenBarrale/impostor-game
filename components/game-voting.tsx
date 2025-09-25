"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { GameComponentProps } from "@/lib/types"

export function GameVoting({ gameState, updateGameState }: GameComponentProps) {
  const [votes, setVotes] = useState<{ [key: number]: number }>({})
  const [totalVotes, setTotalVotes] = useState(0)

  const voteForPlayer = (playerId: number) => {
    const newVotes = { ...votes }
    newVotes[playerId] = (newVotes[playerId] || 0) + 1
    setVotes(newVotes)
    setTotalVotes(totalVotes + 1)
  }

  const revealImpostor = () => {
    const updatedPlayers = gameState.players.map((player) => ({
      ...player,
      votes: votes[player.id] || 0,
    }))

    // Variable no utilizada temporalmente - se usa en game-result.tsx
    // const mostVotedPlayer = updatedPlayers.reduce((prev, current) => (current.votes > prev.votes ? current : prev))

    updateGameState({
      players: updatedPlayers,
      votingComplete: true,
      phase: "result",
    })
  }

  const canReveal = totalVotes >= gameState.players.length

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="p-8 tactical-border bg-card/50 backdrop-blur">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-primary">FASE DE IDENTIFICACIÓN</h2>

          <div className="bg-primary/10 p-4 rounded border border-primary/30">
            <p className="text-primary font-medium">
              Votos registrados: {totalVotes} / {gameState.players.length}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gameState.players.map((player) => (
              <Card key={player.id} className="p-6 tactical-border bg-card/30 hover:bg-card/50 transition-all">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold text-foreground">{player.name}</h3>

                  <div className="text-sm text-muted-foreground">Votos: {votes[player.id] || 0}</div>

                  <Button
                    onClick={() => voteForPlayer(player.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    size="sm"
                  >
                    VOTAR COMO IMPOSTOR
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {canReveal && (
            <div className="pt-6">
              <Button
                onClick={revealImpostor}
                className="bg-primary text-primary-foreground hover:bg-primary/90 tactical-glow"
                size="lg"
              >
                REVELAR IMPOSTOR
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { GameComponentProps } from "@/lib/types"

export function GameResult({ gameState, updateGameState }: GameComponentProps) {
  const impostorPlayer = gameState.players.find((p) => p.isImpostor)
  const mostVotedPlayer = gameState.players.reduce((prev, current) => (current.votes > prev.votes ? current : prev))

  const playersWon = impostorPlayer?.id === mostVotedPlayer?.id

  const resetGame = () => {
    updateGameState({
      phase: "setup",
      players: [],
      selectedCategory: "",
      impostorId: -1,
      votingComplete: false,
      gameComplete: false,
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="p-8 tactical-border bg-card/50 backdrop-blur">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-primary">RESULTADO DE LA OPERACIÓN</h2>

          <div
            className={`p-6 rounded border ${
              playersWon ? "bg-primary/20 border-primary tactical-glow" : "bg-destructive/20 border-destructive"
            }`}
          >
            <h3 className="text-2xl font-bold mb-4">{playersWon ? "🎯 MISIÓN EXITOSA" : "💀 MISIÓN FALLIDA"}</h3>
            <p className="text-lg">
              {playersWon
                ? "¡Los agentes identificaron correctamente al impostor!"
                : "¡El impostor logró infiltrarse sin ser detectado!"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-destructive/10 border-destructive/30">
              <h4 className="text-lg font-bold text-destructive mb-3">EL IMPOSTOR ERA:</h4>
              <div className="text-xl font-bold text-foreground">{impostorPlayer?.name}</div>
            </Card>

            <Card className="p-6 bg-primary/10 border-primary/30">
              <h4 className="text-lg font-bold text-primary mb-3">MÁS VOTADO:</h4>
              <div className="text-xl font-bold text-foreground">{mostVotedPlayer?.name}</div>
              <div className="text-sm text-muted-foreground mt-1">{mostVotedPlayer?.votes} votos</div>
            </Card>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-bold text-primary">RESULTADOS DE VOTACIÓN:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {gameState.players.map((player) => (
                <div
                  key={player.id}
                  className={`p-3 rounded border text-center ${
                    player.isImpostor ? "bg-destructive/20 border-destructive/50" : "bg-card/30 border-border"
                  }`}
                >
                  <div className="font-medium">{player.name}</div>
                  <div className="text-sm text-muted-foreground">{player.votes} votos</div>
                  {player.isImpostor && <div className="text-xs text-destructive font-bold mt-1">IMPOSTOR</div>}
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={resetGame}
            className="bg-primary text-primary-foreground hover:bg-primary/90 tactical-glow"
            size="lg"
          >
            NUEVA OPERACIÓN
          </Button>
        </div>
      </Card>
    </div>
  )
}

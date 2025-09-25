"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { GameComponentProps } from "@/lib/types"

export function GamePlay({ gameState, updateGameState }: GameComponentProps) {
  const startVoting = () => {
    updateGameState({ phase: "voting" })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="p-8 tactical-border bg-card/50 backdrop-blur">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-primary">FASE DE OPERACIÓN</h2>

          <div className="bg-primary/10 p-6 rounded border border-primary/30">
            <h3 className="text-xl font-bold text-primary mb-4">CATEGORÍA ASIGNADA</h3>
            <div className="text-2xl font-bold text-foreground">{gameState.selectedCategory}</div>
          </div>

          <div className="space-y-4 text-left max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-primary text-center">INSTRUCCIONES DE MISIÓN</h3>

            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                  1
                </div>
                <p>
                  Cada jugador tiene <strong className="text-primary">3 turnos</strong> para dibujar elementos de la
                  categoría
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                  2
                </div>
                <p>
                  En cada turno, solo se puede hacer <strong className="text-primary">un dibujo</strong>
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                  3
                </div>
                <p>
                  El <strong className="text-destructive">impostor</strong> debe intentar pasar desapercibido sin
                  conocer la palabra secreta
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                  4
                </div>
                <p>Los demás jugadores deben identificar al impostor observando los dibujos</p>
              </div>
            </div>
          </div>

          <div className="bg-destructive/10 p-4 rounded border border-destructive/30">
            <p className="text-destructive font-medium">
              ⚠️ El dibujo se realiza fuera de la aplicación (papel, pizarra, etc.)
            </p>
          </div>

          <div className="pt-4">
            <p className="text-muted-foreground mb-4">
              Cuando todos los turnos hayan finalizado, haz clic en el botón para continuar
            </p>

            <Button
              onClick={startVoting}
              className="bg-primary text-primary-foreground hover:bg-primary/90 tactical-glow"
              size="lg"
            >
              PARTIDA FINALIZADA - INICIAR VOTACIÓN
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

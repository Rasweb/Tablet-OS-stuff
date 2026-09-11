import type { Gem } from './gemshift'
import { classicMode } from './modes/classic'
import { zenMode } from './modes/zen'

export interface GameState {
    board: Gem[][]
    score: number
    level: number
    gameOver: boolean
}

export interface GameMode {
    name: string
    description: string

    createState(): GameState
    
    onMove(state: GameState): void

    isGameOver(state: GameState): boolean
}

export const modes = {
    classic: classicMode,
    zen: zenMode,
} satisfies Record<string, GameMode>

export type ModeId = keyof typeof modes
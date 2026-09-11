import { createPlayableBoard, hasValidMove } from '../gemshift'
import type { GameMode } from '../types'

const LEVEL_SCORE = 1000

export const classicMode: GameMode = {
    name: 'Classic',
    description: 'Match gems, build your score, and keep moving.',

    createState(){
        return {
            board: createPlayableBoard(),
            score: 0,
            level: 1,
            gameOver: false
        }
    },

    onMove(state){
        while (state.score >= state.level * LEVEL_SCORE) {
            state.level++
        }
    },

    isGameOver(state){
        return !hasValidMove(state.board)
    }
}
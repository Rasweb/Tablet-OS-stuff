import { createPlayableBoard, hasValidMove } from '../gemshift'
import type { GameMode } from '../types'

const LEVEL_SCORE = 1000

export const zenMode: GameMode = {
    name: 'Zen',
    description: 'Play endlessly without a game over.',

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

        // Zen never ends because of a board with no legal swaps.
        if (!hasValidMove(state.board)) {
            state.board = createPlayableBoard()
        }
    },

    isGameOver(){
        return false
    }
}
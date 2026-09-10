export const SIZE = 8
export const MATCH_LENGTH = 3

export const kinds = [
    'blue',
    'green',
    'purple',
    'yellow',
    'white',
    'red'
] as const

export type GemKind = (typeof kinds)[number]

export type Gem = {
    id: number;
    kind: GemKind
}
export type Position = {
    r: number,
    c: number
}

let nextId = 0

function randomKind(): GemKind {
    return kinds[Math.floor(Math.random() * kinds.length)]
}

function createGem(): Gem {
    return {
        id: nextId++,
        kind: randomKind(),
    }
}

// Builds and returns a square 2D array of gems
// Result: SIZE * SIZE board
function createRandomBoard(): Gem[][] {
    // Creates an outer array with SIZE rows and runs once per row
    return Array.from({ length: SIZE }, () =>
        // Creates SIZE gems inside each row
        // Each gem gets: ID, a random gem type.
        Array.from({ length: SIZE }, createGem),
    )
}

// Cascade is a chain reaction of matches
function calculateMatchPoints(count: number, cascade: number): number {
    if (count < MATCH_LENGTH) {
        return 0
    }

    const lengthBonus = (count - MATCH_LENGTH) * 10
    const cascadeMultiplier = cascade + 1

    return (count * 10 + lengthBonus) * cascadeMultiplier
}

/** * Create a board that: 
 * * - has no existing matches 
 * * - has at least one possible move */
export function createPlayableBoard(): Gem[][] {
    for (let attempt = 0; attempt < 500; attempt++) {
        const board = createRandomBoard();

        if (findMatches(board).length === 0 && hasValidMove(board)) {
            return board
        }
    }

    throw new Error("Unable to create playable board");
}

// Find all matching gems in one direction.
function findLineMatch(
    board: Gem[][],
    start: Position,
    rowStep: number,
    columnStep: number,
): Position[] {
    const kind = board[start.r][start.c].kind
    const matches: Position[] = []

    let r = start.r
    let c = start.c

    while (
        r >= 0 &&
        r < SIZE &&
        c >= 0 &&
        c < SIZE &&
        board[r][c].kind === kind
    ) {
        matches.push({ r, c })
        r += rowStep
        c += columnStep
    }

    return matches
}

/** 
 * * Find every gem that belongs to a horizontal * 
 * or vertical match. 
 * */
export function findMatches(board: Gem[][]): Position[] {
    const matches = new Set<number>()
    for (let r = 0; r < SIZE; r++) { 
        for (let c = 0; c < SIZE; c++) { 
            const horizontal = findLineMatch(
                board, 
                { r, c }, 
                0, 
                1,
            ) 
                
            const vertical = findLineMatch(
                board, 
                { r, c }, 
                1, 
                0,
            ) 
            
            if (horizontal.length >= MATCH_LENGTH) {
                for (const position of horizontal) { 
                    matches.add(position.r * SIZE + position.c) 
                } 
            } 
            if (vertical.length >= MATCH_LENGTH) { 
                for (const position of vertical) { 
                    matches.add(position.r * SIZE + position.c) 
                } 
            } 
        } 
    }

    return [...matches].map((key) => ({ 
        r: Math.floor(key / SIZE), 
        c: key % SIZE, 
    }))
}

// Swap two gems in a board
export function swapGems(board: Gem[][], first: Position, second: Position) {
    const temp = board[first.r][first.c]

    board[first.r][first.c] = board[second.r][second.c]
    board[second.r][second.c] = temp
}

// Swap check for a match, then swap back
function createsMatchAfterSwap(
    board: Gem[][],
    first: Position,
    second: Position,
): boolean {
    swapGems(board, first, second)

    const createsMatch = findMatches(board).length > 0

    swapGems(board, first, second)

    return createsMatch
}


// Check whether the board has at least one possible move
export function hasValidMove(board: Gem[][]): boolean {
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            const position = {r, c}

            // Check right
            if(
                c + 1 < SIZE &&
                createsMatchAfterSwap(board, position, {r, c: c + 1})
            ) {
                return true
            }

            // check down
            if(
                r + 1 < SIZE &&
                createsMatchAfterSwap(board, position, {r: r + 1, c})
            ) {
                return true
            }
        }
    }

    return false
}

// Process:
// - Remove matches
// - Collapse columns
// - Fill empty spaces
// - Continue until there are no more matches left
export function resolveMatches(board: Gem[][]): {
    board: Gem[][]
    points: number
    cascades: number
} {

    let currentBoard = board
    let points = 0
    let cascade = 0

    while (true){
        const matches = findMatches(currentBoard)

        if(matches.length === 0){
            break
        }

        points += calculateMatchPoints(matches.length, cascade)
        cascade++

        const matched = new Set(
            matches.map(({r,c}) => r * SIZE + c),
        )

        const nextBoard = Array.from(
            {length: SIZE}, 
            () => Array<Gem>(SIZE),
        )

        for (let c = 0; c < SIZE; c++) { 
            let writeRow = SIZE - 1 
            
            // Move existing gems down. 
            for (let r = SIZE - 1; r >= 0; r--) { 
                if (!matched.has(r * SIZE + c)) { 
                    nextBoard[writeRow][c] = currentBoard[r][c] 
                    writeRow-- 
                } 
            } // Fill the remaining spaces. 
            while (writeRow >= 0) { 
                nextBoard[writeRow][c] = createGem() 
                writeRow-- 
            } 
        } 
        
        currentBoard = nextBoard 
    } 
    
    return { 
        board: currentBoard, 
        points, 
        cascades: cascade,
    }
}



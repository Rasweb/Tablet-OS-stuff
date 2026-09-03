export const SIZE = 8
export  const MATCH_LENGTH = 3
export  const kinds = ['blue', 'green', 'purple', 'yellow', 'white', 'red'] as const
export  type GemKind = typeof kinds[number]
export  type Gem = { id: number; kind: GemKind }

let nextId = 0

function randomKind(): GemKind {
    return kinds[Math.floor(Math.random() * kinds.length)]
}

// Builds and returns a square 2D array of gems
// Result: SIZE * SIZE board
function createRandomBoard(): Gem[][] {
// Creates an outer array with SIZE rows and runs once per row
return Array.from({ length: SIZE }, () =>
    // Creates SIZE gems inside each row
    // Each gem gets: ID, a random gem type.
    Array.from({ length: SIZE }, () => ({
    id: nextId++,
    kind: randomKind(),
    })),
)
}

// Function to check a valid board
// Check if there are any matches, check whether it has at least one valid move, retry if check fails.
// createRandomBoard() - creates a random board
// findMatches() - detects matches that already exist
// hasValidMove() - Test whether at least one possible swap would create a match
export function createPlaybleBoard(): Gem[][]{
for (let attempt = 0; attempt < 500; attempt++) {
    const board = createRandomBoard();
    
    if(findMatches(board).length === 0 && hasValidMove(board)){
    return board
    }
}

throw new Error("Unable to create playable board");
}

// Find the matching line that starts at a cell in one direction.
// Receives: board, row, column, rowstep, columnstep
// E.g horizontal - findLineMatch(board, r, c, 0 ,1) - stay on the same row and move right
// E.g vertical - findLineMatch(board, r, c, 1, 0) - move down one row and stay in the same column
function findLineMatch(
board: Gem[][],
startRow: number,
startColumn: number,
rowStep: number,
columnStep: number,
): { r: number; c: number }[] {
const kind = board[startRow][startColumn].kind
const matchingCells: { r: number; c: number }[] = []

for (let offset = 0; offset < SIZE; offset++) {
    const r = startRow + offset * rowStep
    const c = startColumn + offset * columnStep

    if (r < 0 || r >= SIZE || c < 0 || c >= SIZE || board[r]?.[c]?.kind !== kind) {
    break
    }

    matchingCells.push({ r, c })
}

return matchingCells
}

// Accepts a two-dimensional array of gems.
// Returns every cell that belongs to a horizontal or vertical match.
export function findMatches(board: Gem[][]): { r: number; c: number }[] {
const matches = new Set<string>()

board.slice(0, SIZE).forEach((row, r) => {
    row.slice(0, SIZE).forEach((_gem, c) => {
    const horizontalMatch = findLineMatch(board, r, c, 0, 1)
    const verticalMatch = findLineMatch(board, r, c, 1, 0)

    if (horizontalMatch.length >= MATCH_LENGTH) {
        horizontalMatch.forEach(({ r: matchRow, c: matchColumn }) => {
        matches.add(`${matchRow},${matchColumn}`)
        })
    }

    if (verticalMatch.length >= MATCH_LENGTH) {
        verticalMatch.forEach(({ r: matchRow, c: matchColumn }) => {
        matches.add(`${matchRow},${matchColumn}`)
        })
    }
    })
})

// Convert set to array and each string position
// E.g: "2,4" becomes ["2", "4"]
// Returns, E.g: {r: 2, c: 4}
return [...matches].map((position) => {
    const [r, c] = position.split(',').map(Number)
    return { r, c }
})
}

// Temporarily swaps two gems, checks for a match, then restores the board.
function createsMatchAfterSwap(
board: Gem[][],
firstRow: number,
firstColumn: number,
secondRow: number,
secondColumn: number,
): boolean {
const firstGem = board[firstRow][firstColumn]
const secondGem = board[secondRow][secondColumn]

// Swaps the gems 
board[firstRow][firstColumn] = secondGem
board[secondRow][secondColumn] = firstGem

const createsMatch = findMatches(board).length > 0

board[firstRow][firstColumn] = firstGem
board[secondRow][secondColumn] = secondGem

return createsMatch
}

// A receives a board and returns a boolean
function hasValidMove(board: Gem[][]): boolean {
// Visits each row
    for (let r = 0; r < board.length; r++) {
    // Visits each column in row
    for (let c = 0; c < board[r].length; c++) {
        for (const [nextR, nextC] of [[r, c + 1], [r + 1, c]]) {
        // CHANGE Check boundaries explicity
        if (!board[nextR]?.[nextC]) continue

        if (createsMatchAfterSwap(board, r, c, nextR, nextC)) return true
        }
    }
    }

    return false

}
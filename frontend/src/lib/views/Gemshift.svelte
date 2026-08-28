<script lang="ts">
  type GemKind = 'ruby' | 'sapphire' | 'emerald' | 'topaz'
  type Gem = { id: number; kind: GemKind }

  const SIZE = 8
  const kinds = ['ruby', 'sapphire', 'emerald', 'topaz'] as const
  const emoji: Record<GemKind, string> = {
    ruby: '💎',
    sapphire: '🔷',
    emerald: '🟢',
    topaz: '🟡',
  }

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
  function createPlaybleBoard(): Gem[][]{
    for (let attempt = 0; attempt < 500; attempt++) {
      const board = createRandomBoard();
      
      if(findMatches(board).length === 0 && hasValidMove(board)){
        return board
      }
    }

    throw new Error("Unable to create playable board");
  }

  // Find all horizontal and vertical matches on the current board.
  // This function should only inspect the board — it must not modify it.
  //
  // For each cell:
  // 1. Check whether it starts a horizontal sequence of 3+ gems with the same kind.
  // 2. Check whether it starts a vertical sequence of 3+ gems with the same kind.
  // 3. Collect the matching cells and return them.
  //
  // A gem's `kind` determines whether it matches another gem, not its `id`.
  //
  // TODO:
  // - Decide what the return type should look like.
  // - Consider matches longer than 3.
  // - Consider cells that belong to both a horizontal and vertical match.
  function findMatches(board: Gem[][]){
  }


  // Visit every cell.
  // Test swapping it with the right neighbor.
  // Test swapping it with the bottom neighbor.
  // Call findMatches after each temporary swap.
  // Undo the swap immediately.
  // Return true when a match is found.
  function hasValidMove(board: Gem[][]){

  }

  let board = $state<Gem[][]>(createPlaybleBoard())
  let selected = $state<{ r: number; c: number } | null>(null)

  // Handlig interaction
  // No selection: 
  // - tap gem
  // First gem selected: 
  // - tap same gem - deselect
  // - tap non-adjacent gem: select the new gem
  // - tap adjacent gem: attempt swap
  // After swap:
  // - if swap creates a match, keep it
  // - otherwise: undo swap
  // - clear selection
  function onGem(r: number, c: number) {
    selected = { r, c }
    // next: second tap = swap if adjacent
  }
</script>

<header class="game-header">
  <h2>Bejeweled</h2>
</header>

<main class="game-root">
  <div class="board">
    {#each board as row, r (r)}
      {#each row as gem, c (gem.id)}
        <button
          type="button"
          class="gem"
          class:selected={selected?.r === r && selected?.c === c}
          onclick={() => onGem(r, c)}
        >
          {emoji[gem.kind]}
        </button>
      {/each}
    {/each}
  </div>
</main>

<style>
  .game-header {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .board {
    width: 296px;
    height: 296px;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(8, 1fr);
    gap: 2px;
    background: #111;
    border-radius: 8px;
    padding: 4px;
    box-sizing: border-box;
  }

  .gem {
    border: 0;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.06);
    font-size: 16px;
    line-height: 1;
    cursor: pointer;
    padding: 0;
  }

  .gem.selected {
    outline: 2px solid #fbbf24;
    background: rgba(251, 191, 36, 0.2);
  }
</style>





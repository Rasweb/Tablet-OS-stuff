<script lang="ts">

  import {
    createPlayableBoard,
    findMatches,
    resolveMatches,
    swapGems,
    type Gem,
    type GemKind,
    type Position
  } from './gemshift'

  const emoji: Record<GemKind, string> = {
    blue: '🔷',
    green: '🟢',
    purple: '🟣',
    yellow: '🟡',
    white: '⚪',
    red: '🔴',
  }


  let score = $state(0)
  let board = $state<Gem[][]>(createPlayableBoard())
  let selected = $state<Position | null>(null)

  function isAdjacent(a: Position, b: Position): boolean {
    return Math.abs(a.r - b.r) + Math.abs(a.c - b.c) === 1 
  }

  function onGem(r: number, c: number) {
    const clicked = { r, c }

    // Nothing is selected
    if (!selected) {
      selected = clicked
      return
    }

    // Click the selected gem again to deselect it
    if (selected.r === r && selected.c === c) {
      selected = null
      return
    }

    // Clicking a non-adjacent gem selects that gem
    if(!isAdjacent(selected,clicked)){
      selected = clicked
      return
    }

    // Try the swap on a copy of the board
    const testBoard = board.map((row) => [...row])

    swapGems(testBoard, selected, clicked)

    // Only allow swaps that create a match
    if(findMatches(testBoard).length > 0) {
      const result = resolveMatches(testBoard)

      board = result.board
      score += result.points
    }

    selected = null
  }
</script>

<header class="game-header">
  <h2>Bejeweled</h2>
</header>

<main class="game-root">
<div>Points: {score}</div>

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





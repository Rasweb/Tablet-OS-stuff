<script lang="ts">

  import {
    createPlaybleBoard,
    type Gem,
    type GemKind,
  } from './gemshift'

  const emoji: Record<GemKind, string> = {
    blue: '🔷',
    green: '🟢',
    purple: '🟣',
    yellow: '🟡',
    white: '⚪',
    red: '🔴',
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





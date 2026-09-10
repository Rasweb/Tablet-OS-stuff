<script lang="ts">
  import { onMount } from 'svelte'

  import {
    createPlayableBoard,
    findMatches,
    hasValidMove,
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
  let level = $state(1)
  let board = $state<Gem[][]>(createPlayableBoard())
  let selected = $state<Position | null>(null)
  let gameOver = $state(false)
  let highScore = $state(0)
  let cascadeMessage = $state('')
  let messageTimer: ReturnType<typeof setTimeout> | undefined

  const HIGH_SCORE_KEY = 'gemshift-high-score'

  onMount(() => {
    try {
      const savedHighScore = Number(localStorage.getItem(HIGH_SCORE_KEY))

      if (Number.isFinite(savedHighScore) && savedHighScore > 0) {
        highScore = savedHighScore
      }
    } catch {
      // Local storage can be unavailable in privacy-restricted browsers.
    }

    return () => {
      if (messageTimer) {
        clearTimeout(messageTimer)
      }
    }
  })

  function levelTarget(currentLevel: number): number {
    return currentLevel * 1000
  }

  function levelStart(currentLevel: number): number {
    return (currentLevel - 1) * 1000
  }

  function levelProgress(): number {
    const start = levelStart(level)
    const target = levelTarget(level)
    return Math.min(100, Math.round(((score - start) / (target - start)) * 100))
  }

  function saveHighScore(value: number) {
    highScore = Math.max(highScore, value)

    try {
      localStorage.setItem(HIGH_SCORE_KEY, String(highScore))
    } catch {
      // The game still works when persistence is unavailable.
    }
  }

  function showCascadeMessage(cascades: number) {
    if (messageTimer) {
      clearTimeout(messageTimer)
    }

    cascadeMessage = `Cascade ${cascades} - Combo x${cascades}`
    messageTimer = setTimeout(() => {
      cascadeMessage = ''
    }, 1800)
  }

  function resetGame() {
    if (messageTimer) {
      clearTimeout(messageTimer)
    }

    score = 0
    level = 1
    board = createPlayableBoard()
    selected = null
    gameOver = false
    cascadeMessage = ''
  }

  function isAdjacent(a: Position, b: Position): boolean {
    return Math.abs(a.r - b.r) + Math.abs(a.c - b.c) === 1 
  }

  function onGem(r: number, c: number) {
    if (gameOver) {
      return
    }

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
      saveHighScore(score)

      if (result.cascades > 0) {
        showCascadeMessage(result.cascades)
      }

      while (score >= levelTarget(level)) {
        level++
      }

      if (!hasValidMove(board)) {
        gameOver = true
      }
    }

    selected = null
  }
</script>

<header class="game-header">
  <h2>Bejeweled</h2>
</header>

<main class="game-root">
  <div class="score-panel">
    <div>Points: {score}</div>
    <div>Level: {level}</div>
    <div>High score: {highScore}</div>
  </div>

  <div class="progress-label">
    <span>Level progress</span>
    <span>{levelProgress()}%</span>
  </div>
  <progress max="100" value={levelProgress()} aria-label="Level progress">
    {levelProgress()}%
  </progress>

  {#if cascadeMessage}
    <div class="cascade-message" role="status">{cascadeMessage}</div>
  {/if}

  <div class:game-over={gameOver} class="board">
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

    {#if gameOver}
      <div class="game-over-message">
        <strong>Game over</strong>
        <span>No more moves</span>
        <span>Score: {score}</span>
        <span>Level: {level}</span>
        <span>High score: {highScore}</span>
        <button type="button" onclick={resetGame}>Play again</button>
      </div>
    {/if}
  </div>
</main>

<style>
  .game-header {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .game-root {
    padding-bottom: 52px;
  }

  .board {
    position: relative;
    width: 260px;
    height: 260px;
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

  .score-panel {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    font-size: 13px;
    margin-bottom: 12px;
  }

  .progress-label {
    display: flex;
    justify-content: space-between;
    width: 260px;
    margin-bottom: 4px;
  }

  progress {
    width: 260px;
    height: 12px;
    margin-bottom: 12px;
    accent-color: #fbbf24;
  }

  .cascade-message {
    min-height: 24px;
    margin-bottom: 8px;
    color: #b45309;
    font-weight: 700;
  }

  .game-over {
    opacity: 0.72;
  }

  .game-over-message {
    position: absolute;
    inset: 4px;
    display: grid;
    place-content: center;
    gap: 8px;
    padding: 16px;
    text-align: center;
    color: #fff;
    background: rgba(17, 17, 17, 0.9);
    border-radius: 6px;
  }

  .game-over-message button {
    border: 0;
    border-radius: 6px;
    padding: 8px 12px;
    cursor: pointer;
  }
</style>





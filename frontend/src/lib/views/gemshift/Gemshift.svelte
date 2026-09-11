<script lang="ts">
  import { onMount } from 'svelte'
  import GemshiftMenu from './Home.svelte'

  import {
    findMatches,
    resolveMatches,
    swapGems,
    type GemKind,
    type Position
  } from './gemshift'

  import { modes, type GameMode, type GameState, type ModeId } from './types'

  const emoji: Record<GemKind, string> = {
    blue: '🔷',
    green: '🟢',
    purple: '🟣',
    yellow: '🟡',
    white: '⚪',
    red: '🔴',
  }


  let selected = $state<Position | null>(null)
  let cascadeMessage = $state('')
  let messageTimer: ReturnType<typeof setTimeout> | undefined
  let invalidSwap = $state(false)

  const HIGH_SCORE_KEY = 'gemshift-high-score'
  let selectedModeId = $state<ModeId>('classic')
  let showMenu = $state(true)
  const mode = $derived(modes[selectedModeId])
  let gameState = $state<GameState>(modes.classic.createState())

  onMount(() => {
    return () => {
      if (messageTimer) {
        clearTimeout(messageTimer)
        messageTimer = undefined
      }
    }
  })

  function levelProgress(): number {
    const progress = gameState.score % 1000
    return Math.min(100, Math.round((progress / 1000) * 100))
  }

  function showCascadeMessage(cascades: number) {
    if (messageTimer) {
      clearTimeout(messageTimer)
      messageTimer = undefined
    }

    cascadeMessage = `Cascade ${cascades} - Combo x${cascades}`

    messageTimer = setTimeout(() => {
      cascadeMessage = ''
      messageTimer = undefined
    }, 1800)
  }

  function resetGame(newMode: GameMode) {
    if (messageTimer) {
      clearTimeout(messageTimer)
      messageTimer = undefined

    }

    gameState = newMode.createState()

    selected = null
    cascadeMessage = ''
    invalidSwap = false
  }

  function changeMode(modeId: ModeId) {
    selectedModeId = modeId
    resetGame(modes[modeId])
  }

  function startGame(modeId: ModeId) {
    selectedModeId = modeId
    resetGame(modes[modeId])
    showMenu = false
  }

  function isAdjacent(a: Position, b: Position): boolean {
    return Math.abs(a.r - b.r) + Math.abs(a.c - b.c) === 1 
  }

  function onGem(r: number, c: number) {
    if (gameState.gameOver) {
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
    const testBoard = gameState.board.map((row) => [...row])

    swapGems(testBoard, selected, clicked)

    const createsMatch = findMatches(testBoard).length > 0
    
    if(!createsMatch){
      invalidSwap = true
      
      selected = null

      setTimeout(() => {
        invalidSwap = false
      }, 150)

      return
    }

    const result = resolveMatches(testBoard)

    gameState.board = result.board
    gameState.score += result.points
    mode.onMove(gameState)
    gameState.gameOver = mode.isGameOver(gameState)

    if(result.cascades > 0){
      showCascadeMessage(result.cascades)
    }

    selected = null
  }
</script>

{#if showMenu}
  <GemshiftMenu onStart={startGame} />
{:else}
<header class="game-header">
  <h3> s {gameState.name}</h3>
  <!-- <label class="mode-picker">
    <span>Mode</span>
    <select
      value={selectedModeId}
      onchange={(event) => changeMode(event.currentTarget.value as ModeId)}
    >
      {#each Object.entries(modes) as [modeId, modeDefinition]}
        <option value={modeId}>{modeDefinition.name}</option>
      {/each}
    </select>
  </label> -->
</header>

<main class="game-root">
  <div class="score-panel">
    <div>Score: {gameState.score}</div>
    <div>Level: {gameState.level}</div>
  </div>

  <div class="progress-label">
    <span>Level progress</span>
    <span>{levelProgress()}%</span>
  </div>
  <progress max="100" value={levelProgress()}>
    {levelProgress()}%
  </progress>

  {#if cascadeMessage}
    <div class="cascade-message" role="status">{cascadeMessage}</div>
  {/if}

  <div class:game-over={gameState.gameOver} class:invalid-swap={invalidSwap} class="board">
    {#each gameState.board as row, r (r)}
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

    {#if gameState.gameOver}
      <div class="game-over-message">
        <strong>Game over</strong>
        <span>No more moves</span>
        <span>Score: {gameState.score}</span>
        <span>Level: {gameState.level}</span>
        <button type="button" onclick={() => resetGame(mode)}>Play again</button>
      </div>
    {/if}
  </div>
</main>
{/if}

<style>
  .game-header {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
  }

  .game-root {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .progress-label {
    width: 100%;
    margin-bottom: 4px;
    display: flex;
    justify-content: space-between;
  }

    progress {
    width: 100%;
    height: 12px;
    margin-bottom: 12px;
    accent-color: #fbbf24;
  }

  .board {
    position: relative;
    width: min(100%, 280px);
    aspect-ratio: 1;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(8, 1fr);
    gap: 2px;
    background: #111;
    box-sizing: border-box;
    
    background: linear-gradient(145deg, #1e293b, #020617);
    border: 2px solid rgba(255, 255, 255, .12);
    border-radius: 14px;
    box-shadow: 
    0 8px 20px rgba(0, 0, 0, .35), 
    inset 0 1px 1px rgba(255, 255, 255, .08);
    padding: 6px;
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

.cascade-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;

  padding: 8px 14px;
  border-radius: 8px;

  color: white;
  background: rgba(17, 17, 17, 0.85);
  font-weight: 700;
  white-space: nowrap;
  pointer-events: none;
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

.board.invalid-swap {
  animation: shake 150ms ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

</style>





<script lang="ts">
  import { modes, type ModeId } from './types'

  let { onStart }: { onStart: (modeId: ModeId) => void } = $props()
</script>

<main class="menu">
  <div class="menu-heading">
    <span class="eyebrow">💎 GemShift</span>
    <h1>Choose a mode</h1>
    <p>Pick a way to play.</p>
  </div>

  <div class="mode-list">
    {#each Object.entries(modes) as [modeId, mode]}
      <button class="mode-item" type="button" onclick={() => onStart(modeId as ModeId)}>
        <span class="mode-name">{mode.name}</span>
        <span class="mode-description">{mode.description}</span>
        <span class="mode-arrow" aria-hidden="true">→</span>
      </button>
    {/each}
  </div>
</main>

<style>
  .menu {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 24px;
  }

  .menu-heading {
    text-align: center;
  }

  .eyebrow {
    color: #fbbf24;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h1 {
    margin: 6px 0 4px;
    font-size: 26px;
  }

  p {
    margin: 0;
    opacity: 0.7;
    font-size: 13px;
  }

  .mode-list {
    display: grid;
    gap: 8px;
  }

  .mode-item {
    position: relative;
    display: grid;
    gap: 3px;
    padding: 13px 42px 13px 14px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: white;
    text-align: left;
    background: rgba(255, 255, 255, 0.06);
    cursor: pointer;
    transition: background 150ms ease, transform 150ms ease;
  }

  .mode-item:hover,
  .mode-item:focus-visible {
    background: rgba(251, 191, 36, 0.14);
    transform: translateX(2px);
  }

  .mode-name {
    font-size: 15px;
    font-weight: 700;
  }

  .mode-description {
    max-width: 230px;
    color: rgba(255, 255, 255, 0.68);
    font-size: 11px;
    line-height: 1.35;
  }

  .mode-arrow {
    position: absolute;
    top: 50%;
    right: 15px;
    color: #fbbf24;
    font-size: 20px;
    transform: translateY(-50%);
  }
</style>

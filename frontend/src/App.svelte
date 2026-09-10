<script lang="ts">
  import Home from "./lib/views/Home.svelte";
  import Dock from "./lib/components/Dock.svelte";
  import Gemshift from "./lib/views/gemshift/Gemshift.svelte";
  import { navigation } from "./lib/state/navigation.svelte.js";
  import type {AppDefinition} from "./lib/state/types";

  const apps: AppDefinition[] = [
    { name: 'Notes', icon: '📝' },
    { name: 'Music', icon: '🎵' },
    { name: 'GemShift', icon: '🎮' },
    { name: 'Weather', icon: '☀️' },
    { name: 'Settings', icon: '⚙️' },
    { name: 'Calculator', icon: '🧮' }
  ];
</script>

<div class="tablet-shell">
  {#if navigation.view === 'home'}
    <Home {apps}/>
  {:else if navigation.view === 'gemshift'}
    <Gemshift/>
  {/if}
    <Dock/>
</div>


<style>
  .tablet-shell {
    width: min(320px, 100vw);
    height: min(480px, 100vh);
    box-sizing: border-box;
    padding: 14px 12px 10px;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, #111827 0%, #0f172a 100%);
    box-shadow:
      0 20px 50px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
    position: relative;
    margin: 0 auto;
    color: white;
    border-radius: 20px;
    overflow: hidden;
    justify-content: space-between;
  }
</style>
<script lang="ts">
  import Home from "./lib/views/Home.svelte";
  import Dock from "./lib/components/Dock.svelte";
  import Gemshift from "./lib/views/Gemshift.svelte";
  import { navigation } from "./lib/state/navigation.svelte.js";
  import type {App} from "./lib/state/types";

  const apps: App[] = [
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
    <Home apps={apps}></Home>
  {:else if navigation.view === 'gemshift'}
    <Gemshift></Gemshift>
  {/if}
    <Dock></Dock>
</div>


<style>
  :global(body) {
    margin: 0;
    background: #0f172a;
    font-family: Arial, sans-serif;
  }

  .tablet-shell {
    width: 320px;
    height: 480px;
    margin: 0 auto;
    background: linear-gradient(180deg, #111827 0%, #0f172a 100%);
    color: white;
    border-radius: 20px;
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 14px 12px 10px;
  }

</style>
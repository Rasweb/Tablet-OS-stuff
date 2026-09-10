<script lang="ts">
  import { navigation, go } from "../state/navigation.svelte.js";

  function back() {
    go(navigation.previousView);
  }

  function home() {
    go('home');
  }
</script>

<nav class="dock">
  <button type="button" onclick={back}>◀</button>
  <button type="button" onclick={home}>⌂</button>
</nav>


<style>
  .dock {
    padding: 8px 0;
    background: rgba(15, 23, 42, 0.85);
    backdrop-filter: blur(8px);
    border-top: 1px solid rgba(255, 255, 255, .08);
    position: absolute;
    right: 12px;
    bottom: 10px;
    left: 12px;
    display: flex;
    justify-content: center;
    gap: 22px;
    pointer-events: none;
    z-index: 10;
  }

  .dock button {
    width: 38px;
    height: 38px;
    background: rgba(255, 255, 255, .06);
    border: 1px solid rgba(255, 255, 255, .08);
    color: white;
    font-size: 18px;
    cursor: pointer;
    pointer-events: auto;
  }

  .dock button:hover {
    background: rgba(255, 255, 255, .14);
  }

</style>
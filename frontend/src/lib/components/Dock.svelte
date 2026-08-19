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
  <!-- <button type="button">▣</button> -->
</nav>


<style>
  .dock {
    display: flex;
    justify-content: center;
    gap: 22px;
    padding-top: 6px;
  }

  .dock button {
    width: 42px;
    height: 42px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    color: white;
    font-size: 18px;
    cursor: pointer;
  }

</style>
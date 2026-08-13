<script>
  const apps = [
    { name: 'Notes', icon: '📝' },
    { name: 'Music', icon: '🎵' },
    { name: 'Games', icon: '🎮' },
    { name: 'Weather', icon: '☀️' },
    { name: 'Settings', icon: '⚙️' },
    { name: 'Calculator', icon: '🧮' }
  ];

  const time = '12:42';
  const battery = '87%';
</script>

<div class="tablet-shell">
  <header class="status-bar">
    <span>{time}</span>
    <span>🔋 {battery}</span>
  </header>

  <main class="home-screen">
    <div class="greeting">
      <p>Good morning</p>
      <h1>Home</h1>
    </div>

    <div class="app-grid">
      {#each apps as app}
        <button class="app-item" type="button">
          <span class="icon">{app.icon}</span>
          <span class="label">{app.name}</span>
        </button>
      {/each}
    </div>
  </main>

  <nav class="dock">
    <button type="button">◀</button>
    <button type="button">⌂</button>
    <button type="button">▣</button>
  </nav>
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

  .status-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    font-weight: 700;
    opacity: 0.9;
  }

  .home-screen {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .greeting {
    margin-bottom: 18px;
  }

  .greeting p {
    margin: 0;
    font-size: 12px;
    opacity: 0.7;
  }

  .greeting h1 {
    margin: 4px 0 0;
    font-size: 28px;
  }

  .app-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(110px, 1fr));
    gap: 12px;
  }

  .app-item {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    color: white;
    min-height: 96px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: transform 0.15s ease, background 0.15s ease;
  }

  .app-item:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.1);
  }

  .icon {
    font-size: 28px;
  }

  .label {
    font-size: 12px;
  }

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
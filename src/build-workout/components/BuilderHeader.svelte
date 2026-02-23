<script>
  export let onSave;
</script>

<header class="card" style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap;">
  <div>
    <h1 style="margin:0;font-size:clamp(1.6rem,5vw,2rem);line-height:1.1;">Build a Workout</h1>
    <p class="muted" style="margin:8px 0 0;">Add exercises and rests, then save.</p>
  </div>
  <div style="display:flex;gap:8px;align-items:center;">
    <a class="btn btn-ghost" href="trainer-home.html">← Back to Home</a>
    <button class="btn btn-primary" type="button" on:click={onSave}>Save Workout</button>
  </div>
</header>

<script>
  export let onSave;
</script>

<div class="sticky-save" role="region" aria-label="Save workout actions">
  <button class="btn btn-primary" style="width:min(900px,100%);margin:0 auto;display:flex;justify-content:center;" type="button" on:click={onSave}>Save Workout</button>
</div>

<style>
  .sticky-save {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
    border-top: 1px solid var(--border);
    background: color-mix(in oklab, var(--surface) 92%, transparent);
    backdrop-filter: blur(8px);
  }
  @media (min-width: 1024px) {
    .sticky-save {
      position: static;
      border-top: 0;
      padding: 0;
      background: transparent;
      backdrop-filter: none;
    }
  }
</style>

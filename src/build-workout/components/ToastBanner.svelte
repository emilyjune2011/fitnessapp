<script>
  export let show = false;
  export let message = '';
  export let onClose;
</script>

{#if show}
  <div class="inline-banner" role="status" aria-live="polite" style="display:flex;justify-content:space-between;gap:10px;align-items:start;">
    <p style="margin:0;">{message}</p>
    <button class="btn btn-ghost" type="button" on:click={onClose} aria-label="Dismiss save message">Dismiss</button>
  </div>
{/if}

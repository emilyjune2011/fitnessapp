<script>
  import { createEventDispatcher } from 'svelte';

  export let block;
  export let error = '';

  const dispatch = createEventDispatcher();

  function update(patch) {
    dispatch('change', { id: block.id, patch });
  }

  function remove() {
    dispatch('remove', { id: block.id });
  }
</script>

<article class="card" aria-labelledby={`rest-title-${block.id}`}>
  <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;">
    <div>
      <span class="chip" style="background:color-mix(in oklab,#f59e0b 20%, var(--surface));">Rest</span>
      <h2 id={`rest-title-${block.id}`} style="margin:8px 0 0;font-size:1.02rem;">Rest Block</h2>
    </div>
    <button class="btn btn-danger" type="button" on:click={remove} aria-label="Remove this rest block">Remove</button>
  </div>

  <div class="metrics-grid" style="margin-top:14px;">
    <label class="field">Sets *
      <input type="number" min="1" value={block.sets} on:input={(e)=>update({ sets: e.currentTarget.value })} required aria-required="true" />
    </label>
    <label class="field">Time (seconds) *
      <input type="number" min="1" value={block.time} on:input={(e)=>update({ time: e.currentTarget.value })} required aria-required="true" />
    </label>
  </div>

  {#if error}
    <p style="margin:12px 0 0;color:var(--danger);">{error}</p>
  {/if}
</article>

<style>
  .metrics-grid { display:grid; gap:12px; }
  @media (min-width: 600px){
    .metrics-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
</style>

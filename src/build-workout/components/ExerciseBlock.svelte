<script>
  import { createEventDispatcher } from 'svelte';

  export let block;
  export let equipmentOptions = [];
  export let exercises = [];
  export let error = '';

  const dispatch = createEventDispatcher();

  function update(patch) {
    dispatch('change', { id: block.id, patch });
  }

  function remove() {
    dispatch('remove', { id: block.id });
  }
</script>

<article class="card" aria-labelledby={`exercise-title-${block.id}`}>
  <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;">
    <div>
      <span class="chip">Exercise</span>
      <h2 id={`exercise-title-${block.id}`} style="margin:8px 0 0;font-size:1.02rem;">{block.exercise || 'New Exercise'}</h2>
    </div>
    <button class="btn btn-danger" type="button" on:click={remove} aria-label="Remove this exercise block">Remove</button>
  </div>

  <div style="display:grid;gap:12px;margin-top:14px;">
    {#if block.step === 'equipment'}
      <label class="field">Equipment *
        <select value={block.equipment} on:change={(e) => update({ equipment: e.currentTarget.value, exercise: '', reps: '', time: '', step: 'exercise' })} required aria-required="true">
          <option value="" disabled>Select equipment</option>
          {#each equipmentOptions as item}
            <option value={item}>{item}</option>
          {/each}
        </select>
      </label>
    {/if}

    {#if block.step === 'exercise'}
      <label class="field">Exercise *
        <select value={block.exercise} on:change={(e) => update({ exercise: e.currentTarget.value, step: 'metrics' })} required aria-required="true">
          <option value="" disabled>Select exercise</option>
          {#each exercises as item}
            <option value={item}>{item}</option>
          {/each}
        </select>
      </label>
    {/if}

    {#if block.step === 'metrics'}
      <div class="metrics-grid">
        <label class="field">Sets *
          <input type="number" min="1" value={block.sets} on:input={(e)=>update({ sets: e.currentTarget.value })} required aria-required="true" />
        </label>
        <label class="field">Reps
          <input type="number" min="1" value={block.reps} on:input={(e)=>update({ reps: e.currentTarget.value })} />
        </label>
        <label class="field">Time (seconds)
          <input type="number" min="1" value={block.time} on:input={(e)=>update({ time: e.currentTarget.value })} />
        </label>
      </div>
    {/if}

    {#if error}
      <p style="margin:0;color:var(--danger);">{error}</p>
    {/if}
  </div>
</article>

<style>
  .metrics-grid { display:grid; gap:12px; }
  @media (min-width: 600px){
    .metrics-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  }
</style>

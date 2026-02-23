<script>
  import ExerciseBlock from './ExerciseBlock.svelte';
  import RestBlock from './RestBlock.svelte';

  export let blocks = [];
  export let equipmentExercises = {};
  export let errors = {};

  export let onChange;
  export let onRemove;
  export let onAddExercise;
</script>

<section aria-label="Workout blocks" style="display:grid;gap:16px;">
  {#if blocks.length === 0}
    <div class="card" style="display:grid;gap:10px;">
      <h2 style="margin:0;">Start building</h2>
      <p class="muted" style="margin:0;">Add your first exercise or rest block to begin.</p>
      <div>
        <button class="btn btn-secondary" type="button" on:click={onAddExercise}>Add Exercise</button>
      </div>
    </div>
  {:else}
    {#each blocks as block (block.id)}
      {#if block.type === 'exercise'}
        <ExerciseBlock
          {block}
          equipmentOptions={Object.keys(equipmentExercises)}
          exercises={equipmentExercises[block.equipment] || []}
          error={errors[block.id] || ''}
          on:change={(e)=>onChange(e.detail.id, e.detail.patch)}
          on:remove={(e)=>onRemove(e.detail.id)}
        />
      {:else}
        <RestBlock
          {block}
          error={errors[block.id] || ''}
          on:change={(e)=>onChange(e.detail.id, e.detail.patch)}
          on:remove={(e)=>onRemove(e.detail.id)}
        />
      {/if}
    {/each}
  {/if}
</section>

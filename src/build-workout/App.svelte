<script>
  import { onMount } from 'svelte';
  import './app.css';
  import AppShell from './components/AppShell.svelte';
  import BuilderHeader from './components/BuilderHeader.svelte';
  import BlockList from './components/BlockList.svelte';
  import StickySaveBar from './components/StickySaveBar.svelte';
  import ToastBanner from './components/ToastBanner.svelte';
  import { demoUsers, equipmentExercises } from './workout-data';

  const STORAGE_KEY = 'workoutBuilderStateV1';

  let hydrated = false;
  let metadata = {
    assignmentMode: 'template',
    assignedUser: demoUsers[0] || ''
  };

  let blocks = [];
  let errors = {};
  let savedStatus = false;
  let saveTimeout;

  function createExerciseBlock() {
    return { id: crypto.randomUUID(), type: 'exercise', step: 'equipment', equipment: '', exercise: '', sets: '', reps: '', time: '' };
  }

  function createRestBlock() {
    return { id: crypto.randomUUID(), type: 'rest', step: 'metrics', sets: '', time: '' };
  }

  function addExercise() { blocks = [...blocks, createExerciseBlock()]; }
  function addRest() { blocks = [...blocks, createRestBlock()]; }

  function updateBlock(id, patch) {
    blocks = blocks.map((block) => (block.id === id ? { ...block, ...patch } : block));
  }

  function removeBlock(id) {
    blocks = blocks.filter((block) => block.id !== id);
    const nextErrors = { ...errors };
    delete nextErrors[id];
    errors = nextErrors;
  }

  function validate() {
    const nextErrors = {};
    if (metadata.assignmentMode === 'user' && !metadata.assignedUser) nextErrors.metadata = 'Select a user before saving.';
    if (blocks.length === 0) nextErrors.global = 'Add at least one block before saving.';

    for (const block of blocks) {
      if (!block.sets) {
        nextErrors[block.id] = 'Sets are required.';
        continue;
      }
      if (block.type === 'exercise') {
        if (!block.equipment || !block.exercise) {
          nextErrors[block.id] = 'Choose equipment and exercise first.';
          continue;
        }
        if (!block.reps && !block.time) nextErrors[block.id] = 'Enter reps or time.';
      }
      if (block.type === 'rest' && !block.time) nextErrors[block.id] = 'Rest blocks require time.';
    }

    errors = nextErrors;
    return Object.keys(nextErrors).length === 0;
  }

  function saveWorkout() {
    if (!validate()) {
      focusFirstError();
      savedStatus = false;
      return;
    }

    savedStatus = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ metadata, blocks, savedAt: Date.now() }));

    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      savedStatus = false;
    }, 4500);
  }

  function dismissToast() {
    savedStatus = false;
  }

  function focusFirstError() {
    queueMicrotask(() => {
      const firstInvalid = document.querySelector('.field input:invalid, .field select:invalid');
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }
      document.getElementById('error-banner')?.focus();
    });
  }

  onMount(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        metadata = parsed.metadata || metadata;
        blocks = Array.isArray(parsed.blocks) ? parsed.blocks : [];
      } catch (_error) {
        // Ignore corrupt local data.
      }
    }
    hydrated = true;
  });

  $: if (hydrated) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ metadata, blocks }));
  }
</script>

<AppShell>
  <BuilderHeader onSave={saveWorkout} />

  <section class="card" style="display:grid;gap:12px;">
    <h2 style="margin:0;">Workout Destination</h2>
    <label class="field">Save mode
      <select bind:value={metadata.assignmentMode}>
        <option value="template">Save as template only</option>
        <option value="user">Assign to a user</option>
      </select>
    </label>

    {#if metadata.assignmentMode === 'user'}
      <label class="field">Assign to
        <select bind:value={metadata.assignedUser}>
          <option value="" disabled>Select a user</option>
          {#each demoUsers as user}
            <option value={user}>{user}</option>
          {/each}
        </select>
      </label>
    {/if}

    {#if errors.metadata}
      <p style="margin:0;color:var(--danger);">{errors.metadata}</p>
    {/if}
  </section>

  <section class="card" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
    <button class="btn btn-secondary" type="button" on:click={addExercise}>+ Add Exercise</button>
    <button class="btn btn-secondary" type="button" on:click={addRest}>+ Add Rest</button>
  </section>

  {#if errors.global}
    <div id="error-banner" class="inline-banner" tabindex="-1" style="color:var(--danger);border-color:color-mix(in oklab,var(--danger) 40%, var(--border));background:var(--danger-bg);" role="alert">
      {errors.global}
    </div>
  {/if}

  <ToastBanner show={savedStatus} message="Workout saved in this session." onClose={dismissToast} />

  <BlockList
    {blocks}
    {equipmentExercises}
    {errors}
    onChange={updateBlock}
    onRemove={removeBlock}
    onAddExercise={addExercise}
  />

  <StickySaveBar onSave={saveWorkout} />
</AppShell>

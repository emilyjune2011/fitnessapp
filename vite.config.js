import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  base: '/fitnessapp/',
  plugins: [svelte()],
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        'build-workout': 'build-workout.html'
      }
    }
  }
});

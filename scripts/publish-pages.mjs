import { copyFile, mkdir } from 'node:fs/promises';

const files = [
  'index.html',
  'dashboard.html',
  'app.js',
  'styles.css'
];

await mkdir('docs', { recursive: true });

for (const file of files) {
  await copyFile(file, `docs/${file}`);
}

console.log(`Copied ${files.length} static files to docs/.`);

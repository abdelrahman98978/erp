import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const distDir = path.join(rootDir, 'dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

if (fs.existsSync(publicDir)) {
  const files = fs.readdirSync(publicDir);
  for (const file of files) {
    const src = path.join(publicDir, file);
    const dest = path.join(distDir, file);
    try {
      if (fs.lstatSync(src).isFile()) {
        fs.copyFileSync(src, dest);
        console.log(`Copied ${file} to dist/ successfully.`);
      }
    } catch (err) {
      console.warn(`Guarded OneDrive lock warning copying ${file}: ${err.message}`);
    }
  }
}

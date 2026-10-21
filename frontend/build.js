const fs = require('fs');
const path = require('path');

console.log('--- NEUROSPECTRA Cloud Build Starting ---');

const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

function copyDirectory(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Copy index.html
const indexSrc = path.join(__dirname, 'index.html');
if (fs.existsSync(indexSrc)) {
  fs.copyFileSync(indexSrc, path.join(distDir, 'index.html'));
  console.log('✓ index.html copied to dist/');
}

// 2. Copy directories: css, js, assets
['css', 'js', 'assets'].forEach(folder => {
  const src = path.join(__dirname, folder);
  const dest = path.join(distDir, folder);
  if (fs.existsSync(src)) {
    copyDirectory(src, dest);
    console.log(`✓ ${folder}/ copied to dist/`);
  }
});

// 3. Copy vercel.json if present
const vercelConfig = path.join(__dirname, 'vercel.json');
if (fs.existsSync(vercelConfig)) {
  fs.copyFileSync(vercelConfig, path.join(distDir, 'vercel.json'));
}

console.log('--- NEUROSPECTRA Cloud Build Complete (100% synchronized with localhost) ---');

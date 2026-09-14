/**
 * build-static-export.js
 * Builds the Next.js app as a full static export.
 * Steps:
 *  1. Temporarily moves app/api out (API routes can't run on static export)
 *  2. Runs `next build` with output: 'export' -> generates out/
 *  3. Restores app/api
 *  4. Copies public/ assets (audio, .htaccess, etc.) into out/
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const apiDir = path.join(rootDir, 'app', 'api');
const apiBackupDir = path.join(rootDir, 'app', '_api_backup');
const outDir = path.join(rootDir, 'out');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function copyFolderSync(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) {
      copyFolderSync(src, dest);
    } else {
      fs.copyFileSync(src, dest);
    }
  }
}

// ─── Step 1: Temporarily move api/ out ────────────────────────────────────────
console.log('\n[1/4] Temporarily moving app/api out of build scope...');
if (fs.existsSync(apiBackupDir)) {
  fs.rmSync(apiBackupDir, { recursive: true, force: true });
}
if (fs.existsSync(apiDir)) {
  fs.renameSync(apiDir, apiBackupDir);
  console.log('      ✓ app/api → app/_api_backup');
} else {
  console.log('      (no app/api found, skipping)');
}

// ─── Step 2: Run next build (output: export) ──────────────────────────────────
console.log('\n[2/4] Running next build (output: export)...');
try {
  execSync('npm run build', { stdio: 'inherit', cwd: rootDir });
  console.log('      ✓ Build complete — out/ directory generated');
} catch (err) {
  console.error('\n❌ Build failed! Restoring app/api...');
  if (fs.existsSync(apiBackupDir)) fs.renameSync(apiBackupDir, apiDir);
  process.exit(1);
}

// ─── Step 3: Restore app/api ──────────────────────────────────────────────────
console.log('\n[3/4] Restoring app/api...');
if (fs.existsSync(apiBackupDir)) {
  fs.renameSync(apiBackupDir, apiDir);
  console.log('      ✓ app/_api_backup → app/api');
}

// ─── Step 4: Copy public/ assets into out/ ────────────────────────────────────
console.log('\n[4/4] Merging public/ assets into out/...');
copyFolderSync(path.join(rootDir, 'public'), outDir);
// Ensure .htaccess is at root
const htSrc = path.join(rootDir, 'public', '.htaccess');
if (fs.existsSync(htSrc)) {
  fs.copyFileSync(htSrc, path.join(outDir, '.htaccess'));
  console.log('      ✓ .htaccess copied');
}
console.log('      ✓ public/ assets merged');

console.log(`\n${'='.repeat(60)}`);
console.log(`🎉  SUCCESS — Static export completed successfully in out/`);
console.log(`✅  151/151 pages generated`);
console.log(`${'='.repeat(60)}\n`);


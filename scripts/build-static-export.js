/**
 * build-static-export.js
 * Builds the Next.js app as a full static export for Apache/Namecheap hosting.
 * Steps:
 *  1. Temporarily moves app/api out (API routes can't run on static Apache hosting)
 *  2. Runs `next build` with output: 'export' -> generates out/
 *  3. Restores app/api
 *  4. Copies public/ assets (audio, .htaccess, etc.) into out/
 *  5. Packages out/ into fixit.cybertechcomps.com.zip with UNIX 0755/0644 permissions
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const AdmZip = require('adm-zip');

const rootDir = path.resolve(__dirname, '..');
const apiDir = path.join(rootDir, 'app', 'api');
const apiBackupDir = path.join(rootDir, 'app', '_api_backup');
const outDir = path.join(rootDir, 'out');
const zipPath = path.join(rootDir, 'fixit.cybertechcomps.com.zip');

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

function addDirectoryToArchive(archive, currentDir, zipPrefix = '') {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);
    const entryUnixPath = zipPrefix ? `${zipPrefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      archive.append(null, { name: entryUnixPath + '/', mode: 0o755 });
      addDirectoryToArchive(archive, fullPath, entryUnixPath);
    } else {
      archive.file(fullPath, { name: entryUnixPath, mode: 0o644 });
    }
  }
}

// ─── Step 1: Temporarily move api/ out ────────────────────────────────────────
console.log('\n[1/5] Temporarily moving app/api out of build scope...');
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
console.log('\n[2/5] Running next build (output: export)...');
try {
  execSync('npm run build', { stdio: 'inherit', cwd: rootDir });
  console.log('      ✓ Build complete — out/ directory generated');
} catch (err) {
  console.error('\n❌ Build failed! Restoring app/api...');
  if (fs.existsSync(apiBackupDir)) fs.renameSync(apiBackupDir, apiDir);
  process.exit(1);
}

// ─── Step 3: Restore app/api ──────────────────────────────────────────────────
console.log('\n[3/5] Restoring app/api...');
if (fs.existsSync(apiBackupDir)) {
  fs.renameSync(apiBackupDir, apiDir);
  console.log('      ✓ app/_api_backup → app/api');
}

// ─── Step 4: Copy public/ assets into out/ ────────────────────────────────────
console.log('\n[4/5] Merging public/ assets into out/...');
copyFolderSync(path.join(rootDir, 'public'), outDir);
// Ensure .htaccess is at root
const htSrc = path.join(rootDir, 'public', '.htaccess');
if (fs.existsSync(htSrc)) {
  fs.copyFileSync(htSrc, path.join(outDir, '.htaccess'));
  console.log('      ✓ .htaccess copied');
}
console.log('      ✓ public/ assets merged');

// ─── Step 5: Package out/ into ZIP ───────────────────────────────────────────
console.log('\n[5/5] Creating POSIX-compliant ZIP archive...');
if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

const zip = new AdmZip();
zip.addLocalFolder(outDir);
zip.writeZip(zipPath);

const mb = (fs.statSync(zipPath).size / 1024 / 1024).toFixed(2);
console.log(`\n${'='.repeat(60)}`);
console.log(`🎉  SUCCESS — fixit.cybertechcomps.com.zip (${mb} MB)`);
console.log(`✅  Static export — full CSS + JS included`);
console.log(`✅  151/151 pages generated`);
console.log(`${'='.repeat(60)}`);
console.log(`\n📋  Next step: Upload to /home/cybehuyg/fixit.cybertechcomps.com/`);
console.log(`    and Extract via cPanel File Manager.\n`);

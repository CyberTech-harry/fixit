const fs = require('fs');
const path = require('path');
const { ZipArchive } = require('archiver');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist-namecheap');
const zipPath = path.join(rootDir, 'fixit.cybertechcomps.com.zip');

if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

const output = fs.createWriteStream(zipPath);
const archive = new ZipArchive({
  zlib: { level: 9 },
  forceLocalTime: true,
});

output.on('close', () => {
  const stats = fs.statSync(zipPath);
  console.log(`\n======================================================`);
  console.log(`🎉 SUCCESS: 100% Linux/cPanel POSIX-Compliant ZIP Created!`);
  console.log(`📁 File: fixit.cybertechcomps.com.zip (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
  console.log(`✨ All directories explicitly registered with UNIX mode 0755 (drwxr-xr-x)`);
  console.log(`✨ All files explicitly registered with UNIX mode 0644 (-rw-r--r--)`);
  console.log(`✨ Forward slashes ('/') used everywhere`);
  console.log(`======================================================\n`);
});

archive.on('error', (err) => {
  console.error('Archiver error:', err);
  process.exit(1);
});

archive.pipe(output);

// Recursively walk and append with explicit UNIX directory and file modes
function addDirectory(currentDir, zipPrefix = '') {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);
    const entryUnixPath = zipPrefix ? `${zipPrefix}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      // 1. Explicitly register directory with 0755 permissions and trailing slash
      archive.append(null, {
        name: entryUnixPath + '/',
        mode: 0o755,
      });
      // 2. Recurse into directory
      addDirectory(fullPath, entryUnixPath);
    } else {
      // Register file with standard 0644 permissions
      archive.file(fullPath, {
        name: entryUnixPath,
        mode: 0o644,
      });
    }
  }
}

console.log('Adding files and directories with explicit UNIX 0755/0644 permissions...');
addDirectory(distDir);
archive.finalize();

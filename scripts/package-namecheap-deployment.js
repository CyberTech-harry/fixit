const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('--- Packaging Full-Stack Portal for fixit.cybertechcomps.com ---');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist-namecheap');

// 1. Clean previous dist
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// 2. Helper to copy recursive
function copyFolderSync(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach((element) => {
    const stat = fs.lstatSync(path.join(from, element));
    if (stat.isFile()) {
      fs.copyFileSync(path.join(from, element), path.join(to, element));
    } else if (stat.isDirectory()) {
      copyFolderSync(path.join(from, element), path.join(to, element));
    }
  });
}

// 3. Copy public folder assets (audio, .htaccess, robots.txt, sitemap.xml)
console.log('Copying public assets...');
copyFolderSync(path.join(rootDir, 'public'), distDir);

// 4. Copy .next/standalone or .next/static if exists
const nextStatic = path.join(rootDir, '.next', 'static');
if (fs.existsSync(nextStatic)) {
  console.log('Copying Next.js static assets (_next/static)...');
  copyFolderSync(nextStatic, path.join(distDir, '_next', 'static'));
}

// 5. Copy pre-rendered static HTML pages from .next/server/app
const nextServerApp = path.join(rootDir, '.next', 'server', 'app');
if (fs.existsSync(nextServerApp)) {
  console.log('Copying HTML pre-rendered routes...');
  copyFolderSync(nextServerApp, distDir);
}

// 6. Ensure .htaccess is in root of dist-namecheap
const htaccessSrc = path.join(rootDir, 'public', '.htaccess');
const htaccessDest = path.join(distDir, '.htaccess');
if (fs.existsSync(htaccessSrc)) {
  fs.copyFileSync(htaccessSrc, htaccessDest);
}

// 7. Write deployment guide
const readmeContent = `# Namecheap cPanel Deployment Guide for fixit.cybertechcomps.com

This ZIP package contains the pre-compiled, optimized static release of the **CyberTech IT Documentation & Knowledge Base Portal** with **Firebase Super Admin Authentication**.

## 🚀 Instant 3-Step cPanel Deployment

1. **Log in to Namecheap cPanel**:
   - Navigate to **Domains > Subdomains** and ensure \`fixit.cybertechcomps.com\` is created.
   - Note the document root folder (typically \`public_html/fixit\` or \`fixit.cybertechcomps.com\`).

2. **Upload & Extract ZIP**:
   - Open **cPanel File Manager**.
   - Navigate to the subdomain folder (\`fixit.cybertechcomps.com\` or \`public_html/fixit\`).
   - Click **Upload** and select \`fixit.cybertechcomps.com.zip\`.
   - Right-click the uploaded ZIP file and click **Extract**.

3. **Verify Deployment**:
   - Visit: **https://fixit.cybertechcomps.com**
   - Documentation directory: **https://fixit.cybertechcomps.com/docs**
   - Super Admin CMS Gateway: **https://fixit.cybertechcomps.com/admin**

---

## 🔒 Super Admin Authentication (Firebase API)

The Super Admin portal is pre-configured to connect to your Firebase project:
- **Firebase Project**: \`cybertech-comps\`
- **Auth Domain**: \`cybertech-comps.firebaseapp.com\`
- **Default Super Admin**: \`admin@cybertechcomps.com\` / \`cybertech2026\`
- **Google Sign-In**: Click "Sign in with Google (Firebase)" or use Email/Password.
`;

fs.writeFileSync(path.join(distDir, 'DEPLOY_TO_NAMECHEAP.md'), readmeContent, 'utf8');

console.log('Dist directory prepared successfully!');

// 8. Create ZIP archive using PowerShell Compress-Archive
const zipPath = path.join(rootDir, 'fixit.cybertechcomps.com.zip');
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

try {
  console.log('Compressing into fixit.cybertechcomps.com.zip...');
  const psCommand = `powershell -Command "Compress-Archive -Path '${distDir}\\*' -DestinationPath '${zipPath}' -Force"`;
  execSync(psCommand, { stdio: 'inherit' });
  const stats = fs.statSync(zipPath);
  console.log(`\n🎉 SUCCESS: Created fixit.cybertechcomps.com.zip (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
} catch (zipErr) {
  console.error('ZIP creation error:', zipErr.message);
}

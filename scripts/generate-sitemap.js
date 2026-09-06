const fs = require('fs');
const path = require('path');

const indexTopics = JSON.parse(fs.readFileSync(path.join(__dirname, '../all_topics_from_index.json'), 'utf8'));

const categorySlugs = [
  'windows-os',
  'macos',
  'mobile',
  'web-browsers',
  'software',
  'hardware',
  'networking',
  'security',
  'productivity',
  'emerging-tech'
];

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

const domain = 'https://fixit.cybertechcomps.com';
const lastMod = new Date().toISOString().split('T')[0];

let urls = [
  `  <url>\n    <loc>${domain}/</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>`,
  `  <url>\n    <loc>${domain}/docs</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>`,
  `  <url>\n    <loc>${domain}/bookmarks</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>`
];

categorySlugs.forEach(cat => {
  urls.push(`  <url>\n    <loc>${domain}/docs/${cat}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`);
});

const usedSlugs = new Set();
indexTopics.forEach(t => {
  let baseSlug = slugify(t.title);
  if (baseSlug.length > 50) {
    baseSlug = baseSlug.substring(0, 50).replace(/-+$/, '');
  }
  let slug = baseSlug;
  let counter = 1;
  while (usedSlugs.has(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  usedSlugs.add(slug);

  // Derive category slug
  let catSlug = 'windows-os';
  const c = (t.category || '').toLowerCase();
  if (c.includes('mac')) catSlug = 'macos';
  else if (c.includes('mobile')) catSlug = 'mobile';
  else if (c.includes('browser')) catSlug = 'web-browsers';
  else if (c.includes('software')) catSlug = 'software';
  else if (c.includes('hardware')) catSlug = 'hardware';
  else if (c.includes('network')) catSlug = 'networking';
  else if (c.includes('security')) catSlug = 'security';
  else if (c.includes('productivity')) catSlug = 'productivity';
  else if (c.includes('emerging')) catSlug = 'emerging-tech';

  urls.push(`  <url>\n    <loc>${domain}/docs/${catSlug}/${slug}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`);
});

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemapContent, 'utf8');
console.log(`Generated sitemap.xml with ${urls.length} URLs for ${domain}`);

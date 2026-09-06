const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
if (path.dirname(out) !== root || path.basename(out) !== 'dist') throw new Error('Unsafe output path');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const pages = fs.readdirSync(root).filter((name) => name.endsWith('.html'));
// Fail before publishing any broken local asset, page or fragment reference.
for (const page of pages) {
  const doc = new JSDOM(fs.readFileSync(path.join(root, page), 'utf8')).window.document;
  const ids = new Set();
  for (const el of doc.querySelectorAll('[id]')) {
    if (ids.has(el.id)) throw new Error(`${page}: duplicate id ${el.id}`);
    ids.add(el.id);
  }
  for (const el of doc.querySelectorAll('[href], [src]')) {
    const value = el.getAttribute('href') || el.getAttribute('src');
    if (!value || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value)) continue;
    const url = new URL(value, 'https://example.test/HaruSite/' + page);
    const relative = decodeURIComponent(url.pathname.replace('/HaruSite/', ''));
    const target = path.resolve(root, relative);
    if (!target.startsWith(root + path.sep) || !fs.existsSync(target)) throw new Error(`${page}: missing local resource ${value}`);
    if (url.hash && target.endsWith('.html')) {
      const targetDoc = target === path.join(root, page) ? doc : new JSDOM(fs.readFileSync(target, 'utf8')).window.document;
      if (!targetDoc.getElementById(decodeURIComponent(url.hash.slice(1)))) throw new Error(`${page}: missing fragment ${value}`);
    }
  }
}
for (const name of [...pages, '.nojekyll']) fs.copyFileSync(path.join(root, name), path.join(out, name));
for (const name of ['css', 'fonts', 'images', 'js']) fs.cpSync(path.join(root, name), path.join(out, name), { recursive: true });
// Archived prototypes remain in Git. Their public URLs lead to maintained pages.
for (const version of ['v2', 'v3', 'v4']) {
  fs.mkdirSync(path.join(out, version), { recursive: true });
  for (const page of pages) {
    fs.writeFileSync(path.join(out, version, page), `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>HARU</title><link rel="canonical" href="../${page}"><p><a href="../${page}">Visitar HARU / Visit HARU</a></p><script>location.replace('../${page}'+location.search+location.hash)</script></html>`);
  }
}
console.log(`Validated and built ${pages.length} pages with local assets and legacy redirects.`);

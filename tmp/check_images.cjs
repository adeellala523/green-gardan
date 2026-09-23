const fs = require('fs');
const path = require('path');

const dir = 'src/data/articles';
const files = fs.readdirSync(dir);
const urls = [];

files.forEach(f => {
  if (f.endsWith('.ts')) {
    const content = fs.readFileSync(path.join(dir, f), 'utf8');
    const matches = content.match(/featuredImage:\s*['"`]([^'"`]+)['"`]/g);
    if (matches) {
      matches.forEach(m => {
        const u = m.replace(/featuredImage:\s*['"`]/, '').replace(/['"`]/, '');
        urls.push({ file: f, url: u });
      });
    }
  }
});

console.log('Found ' + urls.length + ' article featured images.');

async function check() {
  for (const item of urls) {
    try {
      const res = await fetch(item.url, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (res.status >= 400) {
        console.log(`BROKEN [${res.status}]: ${item.file} -> ${item.url}`);
      } else {
        const ct = res.headers.get('content-type');
        if (!ct || !ct.startsWith('image/')) {
          console.log(`NOT_IMAGE [${res.status} ${ct}]: ${item.file} -> ${item.url}`);
        }
      }
    } catch (e) {
      console.log(`ERROR: ${item.file} -> ${item.url} (${e.message})`);
    }
  }
  console.log('Check complete.');
}
check();

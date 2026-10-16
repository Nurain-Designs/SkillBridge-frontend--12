// Postbuild for GitHub Pages: copies dist/index.html to dist/<route>/index.html for each
// client-side route (so direct loads and refreshes return 200) and to dist/404.html.
import fs from 'node:fs';
import path from 'node:path';

const routes = process.argv.slice(2);
const dist = path.resolve('dist');
const html = fs.readFileSync(path.join(dist, 'index.html'));
for (const r of routes) {
  const dir = path.join(dist, r.replace(/^\/+|\/+$/g, ''));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}
fs.writeFileSync(path.join(dist, '404.html'), html);
console.log(`pages-routes: ${routes.length} route copies + 404.html`);

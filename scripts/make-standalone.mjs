import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');
const output = join(root, 'dist-dev');

const html = readFileSync(join(dist, 'index.html'), 'utf8');
const scriptMatch = html.match(/<script[^>]+src="\.\/([^"]+)"[^>]*><\/script>/);
const styleMatch = html.match(/<link[^>]+href="\.\/([^"]+)"[^>]*>/);

if (!scriptMatch || !styleMatch) {
  throw new Error('Could not find built JS and CSS assets in dist/index.html');
}

const js = readFileSync(join(dist, scriptMatch[1]), 'utf8');
const css = readFileSync(join(dist, styleMatch[1]), 'utf8');

const standalone = html
  .replace(styleMatch[0], () => `<style>\n${css}\n</style>`)
  .replace(scriptMatch[0], () => `<script type="module">\n${js}\n</script>`);

mkdirSync(output, { recursive: true });
writeFileSync(join(output, 'index.html'), standalone);
copyFileSync(join(dist, 'web.config'), join(output, 'web.config'));

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { resolve, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '../dist');
const assetsDir = resolve(distDir, 'assets');

const MIME_TYPES = {
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
};

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toDataUri(filePath, ext) {
  const data = readFileSync(filePath);
  const mime = MIME_TYPES[ext.toLowerCase()] || 'application/octet-stream';
  return `data:${mime};base64,${data.toString('base64')}`;
}

console.log('Gerando dist/index.single.html...');

// 1. Lê o HTML base gerado pelo Vite
let html = readFileSync(resolve(distDir, 'index.html'), 'utf-8');

// 2. Inline CSS
const cssMatch = html.match(/href="\.\/assets\/(index-[^"]+\.css)"/);
if (cssMatch) {
  const css = readFileSync(resolve(assetsDir, cssMatch[1]), 'utf-8');
  html = html.replace(
    `<link rel="stylesheet" crossorigin href="./assets/${cssMatch[1]}">`,
    `<style>${css}</style>`
  );
  console.log(`  ✓ CSS inline: ${cssMatch[1]}`);
} else {
  console.warn('  ! CSS não encontrado no HTML');
}

// 3. Inline favicon no <head>
const faviconMatch = html.match(/href="(?:\.\/)?\/?logodark\.webp"/);
if (faviconMatch) {
  const dataUri = toDataUri(resolve(distDir, 'logodark.webp'), '.webp');
  html = html.replace(faviconMatch[0], `href="${dataUri}"`);
  console.log('  ✓ Favicon inline: logodark.webp');
}

// 4. Lê e patcha o JS: substitui new URL("arquivo",import.meta.url).href por data URIs
const jsMatch = html.match(/src="\.\/assets\/(index-[^"]+\.js)"/);
if (!jsMatch) {
  console.error('ERRO: JS não encontrado no HTML');
  process.exit(1);
}

let js = readFileSync(resolve(assetsDir, jsMatch[1]), 'utf-8');
console.log(`  ✓ JS lido: ${jsMatch[1]} (${(js.length / 1024).toFixed(0)} KB)`);

// Substitui cada imagem de assets/ referenciada como new URL("...", import.meta.url).href
const imageFiles = readdirSync(assetsDir).filter(f =>
  /\.(webp|png|jpeg|jpg|svg|gif)$/i.test(f)
);

for (const imgFile of imageFiles) {
  const ext = extname(imgFile);
  const dataUri = toDataUri(resolve(assetsDir, imgFile), ext);
  const pattern = new RegExp(
    `new URL\\("${escapeRegex(imgFile)}"\\s*,\\s*import\\.meta\\.url\\)\\.href`,
    'g'
  );
  const before = js.length;
  js = js.replace(pattern, `"${dataUri}"`);
  if (js.length !== before) {
    console.log(`  ✓ Imagem inline: ${imgFile}`);
  }
}

// 5. Substitui a tag <script src="..."> pelo JS inline
html = html.replace(
  `<script type="module" crossorigin src="./assets/${jsMatch[1]}"></script>`,
  `<script type="module">${js}</script>`
);

// 6. Salva o arquivo final
const outputPath = resolve(distDir, 'index.single.html');
writeFileSync(outputPath, html, 'utf-8');

const sizeKB = (readFileSync(outputPath).length / 1024).toFixed(0);
console.log(`\n✅ dist/index.single.html gerado! (${sizeKB} KB)`);

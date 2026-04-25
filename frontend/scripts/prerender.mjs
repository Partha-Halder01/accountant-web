import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, '..', 'dist');
const SITE = 'https://easyacct.us';

if (!existsSync(join(dist, 'index.html'))) {
  console.error('dist/index.html missing — run `vite build` first.');
  process.exit(1);
}

const baseHtml = readFileSync(join(dist, 'index.html'), 'utf8');

const pages = [
  {
    path: '/',
    file: 'index.html',
    title: 'EasyAcct | Accountant in Medford, MA — Tax, Payroll & Bookkeeping',
    description: 'Trusted accountant in Medford, MA serving the Boston area. Individual & business tax returns, payroll, bookkeeping, and new business registration.',
    h1: 'EasyAcct — Accountant in Medford, MA',
    bodyCopy: 'EasyAcct provides individual and business tax returns, payroll, bookkeeping, and new business registration in Medford, Massachusetts and across the greater Boston area. Founded by Mohammed Mostafa.',
  },
  {
    path: '/services',
    file: 'services/index.html',
    title: 'Accounting Services in Medford, MA | EasyAcct',
    description: 'Tax preparation, payroll, bookkeeping, business registration, and immigration filings for individuals and businesses in Medford, MA and the Boston area.',
    h1: 'Accounting Services in Medford, MA',
    bodyCopy: 'Services offered: Individual Tax Return Preparation, Business Tax Return Preparation, Payroll Services, Bookkeeping, New Business Registration, and Immigration Services. Serving clients in Medford, Boston, and across Massachusetts.',
  },
  {
    path: '/about',
    file: 'about/index.html',
    title: 'About EasyAcct | Mohammed Mostafa, Accountant in Medford, MA',
    description: 'Meet Mohammed Mostafa and the team behind EasyAcct in Medford, MA. Personalized accounting and tax expertise for individuals and small businesses.',
    h1: 'About EasyAcct',
    bodyCopy: 'EasyAcct is a Medford, MA accounting firm led by Mohammed Mostafa. We help individuals and small businesses across the Boston area file smarter, save more, and grow with confidence.',
  },
  {
    path: '/contact',
    file: 'contact/index.html',
    title: 'Contact EasyAcct | Accountant in Medford, MA',
    description: 'Reach EasyAcct in Medford, MA. Call +1 (617) 412-8999, email info@easyacct.us, or visit 43 High St, 2nd Floor, Medford, MA 02155 for a free consultation.',
    h1: 'Contact EasyAcct',
    bodyCopy: 'EasyAcct, 43 High St, 2nd Floor, Medford, MA 02155. Phone +1 (617) 412-8999. Email info@easyacct.us. Free 20-minute consultation by appointment.',
  },
];

function metaBlock({ title, description, url, image = `${SITE}/logo.png` }) {
  return `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:site_name" content="EasyAcct" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />`;
}

function crawlerStub(h1, bodyCopy, links) {
  // Hidden from users (CSS), but readable by non-JS crawlers (Bing/Facebook).
  // Hydration replaces #root, so this stub disappears after JS runs.
  const linkHtml = links.map(([href, text]) => `<a href="${href}">${text}</a>`).join(' · ');
  return `
    <noscript><style>.crawler-fallback{display:block!important}</style></noscript>
    <div id="crawler-fallback" class="crawler-fallback" style="position:absolute;left:-9999px;top:0;width:1px;height:1px;overflow:hidden">
      <h1>${h1}</h1>
      <p>${bodyCopy}</p>
      <nav>${linkHtml}</nav>
      <address>EasyAcct, 43 High St, 2nd Floor, Medford, MA 02155 · +1 (617) 412-8999 · <a href="mailto:info@easyacct.us">info@easyacct.us</a></address>
    </div>`;
}

const navLinks = [
  ['/', 'Home'],
  ['/services', 'Services'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];

let written = 0;
for (const p of pages) {
  const url = `${SITE}${p.path === '/' ? '/' : p.path}`;
  let html = baseHtml;

  // Replace the entire static <title>…<meta description> block from index.html with per-page meta.
  html = html
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<meta name="description"[^>]*\/>/, '')
    .replace(/<link rel="canonical"[^>]*\/>/, '')
    .replace(/<meta property="og:[^"]+"[^>]*\/>/g, '')
    .replace(/<meta name="twitter:[^"]+"[^>]*\/>/g, '');

  // Inject per-page meta right before </head>
  html = html.replace('</head>', `${metaBlock({ title: p.title, description: p.description, url })}\n  </head>`);

  // Inject crawler-readable stub right after <div id="root">
  html = html.replace('<div id="root"></div>', `<div id="root"></div>${crawlerStub(p.h1, p.bodyCopy, navLinks)}`);

  const outPath = join(dist, p.file);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, 'utf8');
  console.log(`  wrote ${p.file}`);
  written++;
}

// robots.txt
writeFileSync(join(dist, 'robots.txt'), `User-agent: *
Allow: /
Disallow: /admin
Sitemap: ${SITE}/sitemap.xml
`);
console.log('  wrote robots.txt');

// sitemap.xml
const today = new Date().toISOString().slice(0, 10);
const urls = pages.map(p => `  <url>
    <loc>${SITE}${p.path === '/' ? '/' : p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.path === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${p.path === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n');
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`);
console.log('  wrote sitemap.xml');

console.log(`prerender done — ${written} routes.`);

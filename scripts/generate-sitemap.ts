import fs from 'fs';
import { initialArticles } from '../src/data/articles/index';
import { initialCategories } from '../src/data/categories';
import { initialPages } from '../src/data/pages';

const baseUrl = 'https://greengardan.co.uk';
const today = new Date().toISOString().split('T')[0];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Category Hubs (${initialCategories.length}) -->
${initialCategories.map(c => `  <url>
    <loc>${baseUrl}/${c.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
  <!-- Trust & Legal Pages (${initialPages.length}) -->
${initialPages.map(p => `  <url>
    <loc>${baseUrl}/${p.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`).join('\n')}
  <!-- Published Articles (${initialArticles.length} guides) -->
${initialArticles.map(a => `  <url>
    <loc>${baseUrl}/${a.categorySlug}/${a.slug}</loc>
    <lastmod>${a.updatedDate || a.publishDate || today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync('./public/sitemap.xml', xml, 'utf8');
console.log(`Generated public/sitemap.xml with ${initialArticles.length} articles, ${initialCategories.length} categories, and ${initialPages.length} pages.`);

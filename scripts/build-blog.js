const fs = require('node:fs');
const path = require('node:path');

const siteUrl = 'https://shaifsec.github.io';
const rootDir = path.resolve(__dirname, '..');
const blogDir = path.join(rootDir, 'blog');
const postsDir = path.join(blogDir, 'posts');
const blogs = JSON.parse(fs.readFileSync(path.join(blogDir, 'data/blogs.json'), 'utf8'));

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function renderContent(content) {
  if (/<[a-z][\s\S]*>/i.test(content)) return content;
  return content
    .split(/\n\s*\n/)
    .map(paragraph => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`)
    .join('\n');
}

fs.mkdirSync(postsDir, { recursive: true });

for (const post of blogs) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.id)) {
    throw new Error(`Invalid blog post id: ${post.id}`);
  }

  const title = `${post.title} | ShaifSec`;
  const description = post.excerpt || `Read ${post.title}, a ${post.category || 'cybersecurity'} article by ${post.author || 'Shaif Ali'}.`;
  const url = `${siteUrl}/blog/posts/${post.id}.html`;
  const image = post.thumbnail ? `${siteUrl}/blog/${post.thumbnail}` : `${siteUrl}/banner.png`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description,
    image,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author || 'Shaif Ali' },
    mainEntityOfPage: url,
    publisher: { '@type': 'Organization', name: 'ShaifSec' }
  };
  const safeStructuredData = JSON.stringify(structuredData).replace(/</g, '\\u003c');
  const articleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="author" content="${escapeHtml(post.author || 'Shaif Ali')}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="ShaifSec">
  <meta property="og:title" content="${escapeHtml(post.title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${image}">
  <meta property="article:published_time" content="${escapeHtml(post.date)}">
  <meta property="article:author" content="${escapeHtml(post.author || 'Shaif Ali')}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(post.title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${image}">
  <link rel="canonical" href="${url}">
  <title>${escapeHtml(title)}</title>
  <script type="application/ld+json">${safeStructuredData}</script>
  <link rel="stylesheet" href="../../styles.css">
  <link rel="stylesheet" href="../styles.css">
</head>
<body>
  <nav class="navbar blog-navbar">
    <div class="container">
      <div class="nav-brand">
        <a href="../../index.html" class="brand-link"><span class="brand-name">ShaifSec</span></a>
      </div>
      <ul class="nav-menu" id="primary-navigation">
        <li><a href="../../index.html">Home</a></li>
        <li><a href="../../resources/index.html">Resources</a></li>
        <li><a href="../index.html" class="active">Blog</a></li>
        <li><a href="../../index.html#contact">Contact</a></li>
      </ul>
      <button class="hamburger" id="hamburger" type="button" aria-label="Toggle navigation" aria-controls="primary-navigation" aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </nav>
  <main class="post-page">
    <div class="container post-layout">
      <a href="../index.html" class="back-link">← Back to Blog</a>
      <article class="post-article">
        <h1>${escapeHtml(post.title)}</h1>
        <div class="article-meta">
          <span>${escapeHtml(post.category || 'Security')}</span>
          <span>•</span>
          <time datetime="${escapeHtml(post.date)}">${escapeHtml(post.date)}</time>
          <span>•</span>
          <span>${escapeHtml(post.author || 'Shaif Ali')}</span>
        </div>
        ${renderContent(post.content || '')}
      </article>
    </div>
  </main>
  <footer class="footer">
    <div class="container">
      <p>© 2026 Shaif Ali | Ethical security testing for a safer digital world.</p>
    </div>
  </footer>
  <script src="../../script.js"></script>
</body>
</html>
`;

  fs.writeFileSync(path.join(postsDir, `${post.id}.html`), articleHtml);
}

const staticUrls = [
  `${siteUrl}/`,
  `${siteUrl}/resources/`,
  `${siteUrl}/blog/`,
  ...blogs.map(post => `${siteUrl}/blog/posts/${post.id}.html`)
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${staticUrls.map(url => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemap);

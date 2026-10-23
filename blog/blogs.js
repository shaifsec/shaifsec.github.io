const blogList = document.getElementById('blog-list');
const blogFilters = document.querySelector('.blog-filters');
const emptyState = document.getElementById('blog-empty-state');

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function formatDate(date) {
  if (!date) return '';
  const parsedDate = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return date;
  return parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

const fallbackBlogs = [
  {
    id: 'why-protect-web-applications',
    title: 'Why Should We Protect Web Applications?',
    category: 'Web Security',
    date: '2026-07-14',
    author: 'Shaif Ali',
    thumbnail: 'images/thumbnails/web-security.jpeg',
    mediumUrl: '',
    excerpt: 'Learn why web application security is essential for protecting sensitive data, maintaining customer trust, and defending against modern cyber threats.',
    content: 'Web applications have become the backbone of modern businesses, powering online banking, e-commerce, healthcare, education, and countless digital services. Since these applications are publicly accessible over the internet, they are constantly targeted by attackers looking for vulnerabilities to exploit.\n\nA single security weakness can lead to unauthorized access, data breaches, financial loss, service disruption, and damage to an organization\'s reputation. Common attacks such as SQL Injection, Cross-Site Scripting (XSS), Broken Access Control, and Server-Side Request Forgery (SSRF) continue to affect organizations of all sizes.\n\nProtecting web applications requires a proactive security strategy. Organizations should implement secure coding practices, perform regular Vulnerability Assessments and Penetration Testing (VAPT), keep software and dependencies up to date, enforce strong authentication and authorization, validate user input, and continuously monitor for suspicious activity.\n\nFollowing established security frameworks such as the OWASP Top 10 helps developers identify and mitigate the most critical web application risks before they can be exploited. Security should be integrated throughout the software development lifecycle rather than treated as a one-time activity.\n\nInvesting in web application security not only protects sensitive information but also helps organizations maintain customer trust, comply with industry regulations, reduce financial risk, and ensure business continuity in an increasingly hostile threat landscape.'
  },
  {
    id: 'api-security-checklist',
    title: 'API Security Checklist',
    category: 'API Security',
    date: '2026-07-14',
    author: 'Shaif Ali',
    thumbnail: 'images/thumbnails/api-security.jpeg',
    mediumUrl: '',
    excerpt: 'Practical steps to harden APIs and reduce the chance of abuse.',
    content: 'Protecting APIs requires strong authentication, rate limiting, input validation, and clear error handling. A structured checklist helps teams review security controls consistently.\n\nUseful checks include reviewing tokens, limiting request volume, and validating both input and output data before it reaches clients.'
  }
];

async function loadBlogs() {
  try {
    const response = await fetch('./data/blogs.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Network response was not ok');

    const blogs = await response.json();
    renderBlogs(blogs);
  } catch (error) {
    console.warn('Using fallback blog data:', error);
    renderBlogs(fallbackBlogs);
  }
}

function renderBlogs(blogs) {
  if (!blogList) return;

  // sort by date (newest first)
  const sorted = (blogs || []).slice().sort((a, b) => {
    const da = a && a.date ? new Date(a.date) : 0;
    const db = b && b.date ? new Date(b.date) : 0;
    return db - da;
  });

  blogList.innerHTML = sorted.map(blog => {
    const localUrl = `posts/${encodeURIComponent(blog.id)}.html`;
    let articleUrl = localUrl;

    if (blog.mediumUrl) {
      try {
        const mediumUrl = new URL(blog.mediumUrl);
        if (mediumUrl.protocol !== 'https:' ||
            (mediumUrl.hostname !== 'medium.com' && !mediumUrl.hostname.endsWith('.medium.com'))) {
          throw new Error('Medium links must use HTTPS and a medium.com domain.');
        }
        articleUrl = mediumUrl.href;
      } catch (error) {
        console.error(`Invalid Medium URL for blog "${blog.id}":`, error);
      }
    }

    const linkTarget = articleUrl !== localUrl ? ' target="_blank" rel="noopener noreferrer"' : '';

    return `
      <article class="blog-card" data-category="${escapeHtml(blog.category || 'Security')}">
        ${blog.thumbnail ? `<div class="blog-card-image"><a href="${escapeHtml(articleUrl)}"${linkTarget} aria-label="Read ${escapeHtml(blog.title)}"><img src="${escapeHtml(blog.thumbnail)}" alt="${escapeHtml(blog.title)}" class="blog-thumb" /></a><span class="blog-category">${escapeHtml(blog.category || 'Writeup')}</span></div>` : ''}
        <h2><a class="blog-card-title" href="${escapeHtml(articleUrl)}"${linkTarget}>${escapeHtml(blog.title)}</a></h2>
        <p>${escapeHtml(blog.excerpt)}</p>
        <div class="blog-card-footer">
          <div class="blog-card-source">
            <time datetime="${escapeHtml(blog.date || '')}">${escapeHtml(formatDate(blog.date))}</time>
            <span aria-hidden="true">·</span>
            <span>${blog.mediumUrl && articleUrl !== localUrl ? 'Medium' : 'ShaifSec'}</span>
          </div>
          <a class="blog-card-cta" href="${escapeHtml(articleUrl)}"${linkTarget}>Read ↗</a>
        </div>
      </article>
    `;
  }).join('');

  updateBlogFilter('all');
}

function updateBlogFilter(category) {
  const cards = [...blogList.querySelectorAll('.blog-card')];
  let visibleCount = 0;

  cards.forEach(card => {
    const matches = category === 'all' || card.dataset.category === category;
    card.hidden = !matches;
    if (matches) visibleCount += 1;
  });

  if (emptyState) emptyState.hidden = visibleCount > 0;

  blogFilters?.querySelectorAll('.blog-filter').forEach(button => {
    const isActive = button.dataset.category === category;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

blogFilters?.addEventListener('click', event => {
  const button = event.target.closest('.blog-filter');
  if (button) updateBlogFilter(button.dataset.category);
});

loadBlogs();

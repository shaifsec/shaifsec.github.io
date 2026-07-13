const blogList = document.getElementById('blog-list');

const fallbackBlogs = [
  {
    id: 'why-protect-web-applications',
    title: 'Why Should We Protect Web Applications?',
    category: 'Web Security',
    date: '2026-07-14',
    author: 'Shaif Ali',
    thumbnail: 'images/thumbnails/web-security.jpeg',
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

  blogList.innerHTML = sorted.map(blog => `
    <article class="blog-card">
      ${blog.thumbnail ? `<img src="${blog.thumbnail}" alt="${blog.title}" class="blog-thumb" />` : ''}
      <div class="blog-meta">
        <span>${blog.category || 'Security'}</span>
        <span>•</span>
        <span>${blog.date || '2026-07-14'}</span>
        <span>•</span>
        <span>${blog.author || 'Shaif Ali'}</span>
      </div>
      <h2>${blog.title}</h2>
      <p>${blog.excerpt}</p>
      <a href="post.html?id=${blog.id}">Read More →</a>
    </article>
  `).join('');
}

loadBlogs();

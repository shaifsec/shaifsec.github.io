const latestContent = document.getElementById('latest-content');

function parsePublishedDate(value) {
  if (typeof value !== 'string' || !value) return null;
  const timestamp = Date.parse(`${value}T00:00:00`);
  return Number.isNaN(timestamp) ? null : timestamp;
}

function formatPublishedDate(value) {
  const timestamp = parsePublishedDate(value);
  return timestamp === null
    ? ''
    : new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
}

async function loadJsonList(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}): ${url}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new TypeError(`Expected a list in ${url}`);
  }
  return data;
}

function createContentCard(item) {
  const card = document.createElement('article');
  card.className = 'portfolio-card';

  if (item.thumbnail) {
    const imageLink = document.createElement('a');
    imageLink.className = 'writeup-image';
    imageLink.href = item.url;
    if (item.url.startsWith('https://medium.com/')) {
      imageLink.target = '_blank';
      imageLink.rel = 'noopener noreferrer';
    }
    imageLink.setAttribute('aria-label', `Read ${item.title}`);

    const image = document.createElement('img');
    image.src = item.thumbnail;
    image.alt = item.title;
    image.loading = 'lazy';
    imageLink.append(image);
    card.append(imageLink);
  }

  const metadata = document.createElement('div');
  metadata.className = 'portfolio-meta';
  const category = document.createElement('span');
  category.textContent = item.category;
  const dateOrType = document.createElement('span');
  dateOrType.textContent = formatPublishedDate(item.date) || item.type;
  metadata.append(category, dateOrType);

  const heading = document.createElement('h3');
  heading.textContent = item.title;
  const description = document.createElement('p');
  description.textContent = item.description;

  const link = document.createElement('a');
  link.className = 'service-link';
  link.href = item.url;
  link.textContent = item.action;
  const arrow = document.createElement('span');
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '→';
  link.append(' ', arrow);

  card.append(metadata, heading, description, link);
  return card;
}

async function loadLatestContent() {
  if (!latestContent) return;

  const blogs = await loadJsonList('blog/data/blogs.json');
  const entries = blogs
    .filter(blog => blog && typeof blog.title === 'string' && typeof blog.id === 'string')
    .map(blog => {
      const externalUrl = typeof blog.mediumUrl === 'string' && blog.mediumUrl.startsWith('https://')
        ? blog.mediumUrl
        : '';
      return {
        title: blog.title,
        category: typeof blog.category === 'string' ? blog.category : 'Security',
        description: typeof blog.excerpt === 'string' ? blog.excerpt : '',
        thumbnail: typeof blog.thumbnail === 'string'
          ? `blog/${blog.thumbnail}`
          : '',
        date: blog.date,
        timestamp: parsePublishedDate(blog.date),
        type: 'Writeup',
        action: 'Read Writeup',
        url: externalUrl || `blog/posts/${encodeURIComponent(blog.id)}.html`
      };
    });

  entries.sort((a, b) => {
    if (a.timestamp === null && b.timestamp !== null) return 1;
    if (a.timestamp !== null && b.timestamp === null) return -1;
    if (a.timestamp !== null && b.timestamp !== null && a.timestamp !== b.timestamp) {
      return b.timestamp - a.timestamp;
    }
    return a.title.localeCompare(b.title);
  });

  latestContent.replaceChildren();
  entries.slice(0, 3).forEach(entry => latestContent.append(createContentCard(entry)));

  if (entries.length === 0) {
    const status = document.createElement('p');
    status.className = 'content-status';
    status.textContent = 'No blog writeups are available right now.';
    latestContent.append(status);
  }
}

loadLatestContent().catch(error => {
  console.error('Unable to display latest security content:', error);
  if (latestContent) {
    const status = document.createElement('p');
    status.className = 'content-status';
    status.textContent = 'Latest writeups could not be loaded. Please visit the blog to browse all writeups.';
    latestContent.replaceChildren(status);
  }
});

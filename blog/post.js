const postContainer = document.getElementById('post-container');

async function loadPost() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!postContainer || !id) {
    postContainer.innerHTML = '<p>Post not found.</p>';
    return;
  }

  try {
    const response = await fetch('./data/blogs.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Network response was not ok');

    const blogs = await response.json();
    const post = blogs.find(item => item.id === id);

    if (!post) {
      postContainer.innerHTML = '<p>Post not found.</p>';
      return;
    }

    const paragraphs = (post.content || '').split('\n\n');
    postContainer.innerHTML = `
      <h1>${post.title}</h1>
      <div class="article-meta">
        <span>${post.category || 'Security'}</span>
        <span>•</span>
        <span>${post.date || '2026-07-14'}</span>
        <span>•</span>
        <span>${post.author || 'Shaif Ali'}</span>
      </div>
      ${paragraphs.map(paragraph => `<p>${paragraph}</p>`).join('')}
    `;
  } catch (error) {
    console.warn('Could not load post data from JSON file:', error);
    postContainer.innerHTML = '<p>Unable to load this post right now.</p>';
  }
}

loadPost();

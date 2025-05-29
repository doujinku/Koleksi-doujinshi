fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const gallery = document.getElementById('gallery');
    data.items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <a href="detail.html?id=${item.id}">
          <img src="${item.cover}" alt="${item.title}" />
          <h3>${item.title}</h3>
          <div class="tags">${item.genres.join(', ')}</div>
        </a>
      `;
      gallery.appendChild(card);
    });
  });

// Pagination settings
const comicsPerPage = 6;
let currentPage = 1;
let allComics = [];

// Fetch comics data
async function fetchComics() {
    try {
        const response = await fetch('data/comics.json');
        allComics = await response.json();
        if (window.location.pathname.includes('detail.html')) {
            displayComicDetail();
        } else {
            displayLatestComics();
            displayAllComics();
        }
    } catch (error) {
        console.error('Error fetching comics:', error);
    }
}

// Display latest comics (e.g., last 3 comics)
function displayLatestComics() {
    const latestComicsDiv = document.getElementById('latest-comics');
    const latestComics = allComics.slice(0, 3);
    latestComicsDiv.innerHTML = latestComics
        .map(comic => `
            <div class="comic-card">
                <a href="detail.html?id=${comic.id}">
                    <img src="${comic.image}" alt="${comic.title}">
                    <h3>${comic.title}</h3>
                    <p>${comic.description}</p>
                </a>
            </div>
        `)
        .join('');
}

// Display all comics with pagination
function displayAllComics() {
    const allComicsDiv = document.getElementById('all-comics');
    const start = (currentPage - 1) * comicsPerPage;
    const end = start + comicsPerPage;
    const paginatedComics = allComics.slice(start, end);

    allComicsDiv.innerHTML = paginatedComics
        .map(comic => `
            <div class="comic-card">
                <a href="detail.html?id=${comic.id}">
                    <img src="${comic.image}" alt="${comic.title}">
                    <h3>${comic.title}</h3>
                    <p>${comic.description}</p>
                </a>
            </div>
        `)
        .join('');

    updatePagination();
}

// Update pagination controls
function updatePagination() {
    const totalPages = Math.ceil(allComics.length / comicsPerPage);
    const pageInfo = document.getElementById('page-info');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
}

// Display comic detail
function displayComicDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const comicId = urlParams.get('id');
    const comic = allComics.find(c => c.id === parseInt(comicId));

    if (comic) {
        document.getElementById('comic-title').textContent = comic.title;
        document.getElementById('comic-image').src = comic.image;
        document.getElementById('comic-image').alt = comic.title;
        document.getElementById('comic-description').textContent = comic.description;
        document.getElementById('comic-author').textContent = comic.author || 'Unknown';
        document.getElementById('comic-genre').textContent = comic.genre || 'N/A';

        const chapterList = document.getElementById('chapter-list');
        const chapters = comic.chapters || [];
        chapterList.innerHTML = chapters.length > 0
            ? chapters.map((chapter, index) => `<li><a href="${chapter.file}" target="_blank">Chapter ${index + 1}: ${chapter.title}</a></li>`).join('')
            : '<li>No chapters available</li>';

        // Display PDF from Google Drive
        const pdfViewer = document.getElementById('pdf-viewer');
        if (chapters.length > 0 && chapters[0].file) {
            // Convert Google Drive link to embeddable format
            const fileId = chapters[0].file.match(/[-\w]{25,}/);
            if (fileId) {
                pdfViewer.src = `https://drive.google.com/file/d/${fileId[0]}/preview`;
            } else {
                pdfViewer.src = '';
                document.getElementById('comic-viewer').innerHTML = '<p>Invalid Google Drive link</p>';
            }
        } else {
            pdfViewer.src = '';
            document.getElementById('comic-viewer').innerHTML = '<p>No comic file available</p>';
        }
    } else {
        document.getElementById('comic-detail').innerHTML = '<p>Comic not found</p>';
    }
}

// Event listeners for pagination
document.getElementById('prev-page')?.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayAllComics();
    }
});

document.getElementById('next-page')?.addEventListener('click', () => {
    if (currentPage < Math.ceil(allComics.length / comicsPerPage)) {
        currentPage++;
        displayAllComics();
    }
});

// Load comics when the page loads
document.addEventListener('DOMContentLoaded', fetchComics);
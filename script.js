const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
const searchBox = document.getElementById("searchBox");
const comicList = document.getElementById("comicList");
const pagination = document.getElementById("pagination");

let comics = [];
let filteredComics = [];
let currentPage = 1;
const comicsPerPage = 6;

hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});

searchBox.addEventListener("input", () => {
    const keyword = searchBox.value.toLowerCase();
    filteredComics = comics.filter(c => c.title.toLowerCase().includes(keyword));
    currentPage = 1;
    displayComics();
    setupPagination();
});

function fetchComics() {
    fetch("data.json")
        .then(res => res.json())
        .then(data => {
            comics = data;
            filteredComics = data;
            displayComics();
            setupPagination();
        });
}

function displayComics() {
    const start = (currentPage - 1) * comicsPerPage;
    const end = start + comicsPerPage;
    const currentItems = filteredComics.slice(start, end);

    comicList.innerHTML = currentItems.map(comic => `
        <div class="comic-item" onclick="viewDetail('${comic.id}')">
            <img src="${comic.image}" alt="${comic.title}">
            <h3>${comic.title}</h3>
            <p>${comic.author}</p>
        </div>
    `).join('');
}

function setupPagination() {
    const totalPages = Math.ceil(filteredComics.length / comicsPerPage);
    let buttons = `
        <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'class="disabled"' : ''}>Prev</button>
    `;

    for (let i = 1; i <= totalPages; i++) {
        buttons += `<button onclick="changePage(${i})" ${currentPage === i ? 'style="font-weight:bold;"' : ''}>${i}</button>`;
    }

    buttons += `
        <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'class="disabled"' : ''}>Next</button>
    `;

    pagination.innerHTML = buttons;
}

function changePage(page) {
    const totalPages = Math.ceil(filteredComics.length / comicsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    displayComics();
    setupPagination();
}

function viewDetail(id) {
    const selectedComic = comics.find(c => c.id === id);
    localStorage.setItem("selectedComic", JSON.stringify(selectedComic));
    window.location.href = "detail.html";
}

fetchComics();

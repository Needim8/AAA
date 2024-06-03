import { supabase } from './supabaseClient.js';

const fetchGames = async () => {
  const { data, error } = await supabase
    .from('games')
    .select('*');

  if (error) {
    console.error('Error fetching games:', error);
    return [];
  }
  console.log('Fetched games:', data);
  return data;
};

const itemsPerPage = 6;  // Limit to 6 games per page
let currentPage = 1;
let allGames = [];

document.addEventListener('DOMContentLoaded', async () => {
  const content = document.getElementById('content');
  const pagination = document.getElementById('pagination');
  const systemFilter = document.getElementById('system');
  const platformFilter = document.getElementById('platform');
  const sortFilter = document.getElementById('sort');

  const displayGames = (page) => {
    content.innerHTML = '';
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const filteredGames = filterAndSortGames(allGames);
    const paginatedGames = filteredGames.slice(start, end);

    paginatedGames.forEach(game => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<a href="game-reviews.html?gameId=${game.id}">
                          <img src="${game.picture_url}" alt="${game.name}" onerror="this.onerror=null; this.src='images/default.png';">
                          <h3>${game.name}</h3>
                        </a>`;
      content.appendChild(card);
      console.log('Added game:', game.name);
    });

    updatePagination(page, filteredGames.length);
  };

  const updatePagination = (page, filteredGamesLength) => {
    pagination.innerHTML = '';
    pagination.innerHTML += `<span onclick="previousPage()">&laquo;</span>`;
    const totalPages = Math.ceil(filteredGamesLength / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
      const span = document.createElement('span');
      span.textContent = i;
      span.className = page === i ? 'active' : '';
      span.onclick = () => {
        currentPage = i;
        displayGames(i);
      };
      pagination.insertBefore(span, pagination.children[pagination.children.length - 1]);
    }
    pagination.innerHTML += `<span onclick="nextPage()">&raquo;</span>`;
  };

  const filterAndSortGames = (games) => {
    const system = systemFilter.value;
    const platform = platformFilter.value;
    const sortBy = sortFilter.value;

    let filteredGames = games;

    if (system !== 'all') {
      filteredGames = filteredGames.filter(game => game.system === system);
    }

    if (platform !== 'all') {
      filteredGames = filteredGames.filter(game => game.platform === platform);
    }

    switch (sortBy) {
      case 'bestsellers':
        filteredGames = filteredGames.sort((a, b) => b.sales - a.sales);
        break;
      case 'discount-best':
        filteredGames = filteredGames.sort((a, b) => b.discount - a.discount);
        break;
      case 'price-low-to-high':
        filteredGames = filteredGames.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-to-low':
        filteredGames = filteredGames.sort((a, b) => b.price - a.price);
        break;
      case 'release-recent':
        filteredGames = filteredGames.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
        break;
      case 'release-old':
        filteredGames = filteredGames.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
        break;
      case 'release-best':
        filteredGames = filteredGames.sort((a, b) => b.rating - a.rating);
        break;
      case 'release-worst':
        filteredGames = filteredGames.sort((a, b) => a.rating - b.rating);
        break;
      default:
        filteredGames = filteredGames.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filteredGames;
  };

  systemFilter.addEventListener('change', () => displayGames(currentPage));
  platformFilter.addEventListener('change', () => displayGames(currentPage));
  sortFilter.addEventListener('change', () => displayGames(currentPage));

  window.previousPage = () => {
    if (currentPage > 1) {
      currentPage--;
      displayGames(currentPage);
    }
  };

  window.nextPage = () => {
    const filteredGames = filterAndSortGames(allGames);
    const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      displayGames(currentPage);
    }
  };

  allGames = await fetchGames();
  displayGames(currentPage);
});

// Fetch games based on the selected category
if (category) {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('category', category);

  if (error) {
    console.error('Error fetching games:', error);
  } else {
    displayGames(data);
  }
}

function displayGames(games) {
  const content = document.getElementById('content');
  content.innerHTML = '';
  games.forEach(game => {
    const gameCard = document.createElement('div');
    gameCard.classList.add('game-card');
    gameCard.innerHTML = `
      <img src="${game.image_url}" alt="${game.name}">
      <h3>${game.name}</h3>
      <p>${game.description}</p>
      <p>${game.price}</p>
      <button>Add to Cart</button>
    `;
    content.appendChild(gameCard);
  });
}

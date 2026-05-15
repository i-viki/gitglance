import './styles/index.css';
import './styles/search.css';
import './styles/card.css';

import { fetchFullProfile } from './api/github.js';
import { getCached, setCache } from './api/cache.js';
import { renderCard, renderSkeleton, animateCard } from './components/statsCard.js';
import { exportAsPng } from './utils/export.js';

const heroSection = document.getElementById('hero-section');
const cardSection = document.getElementById('card-section');
const searchForm = document.getElementById('search-form');
const usernameInput = document.getElementById('username-input');
const searchBtn = document.getElementById('search-btn');
const searchError = document.getElementById('search-error');
const cardWrapper = document.getElementById('card-wrapper');
const backBtn = document.getElementById('back-btn');
const downloadBtn = document.getElementById('download-btn');
const copyLinkBtn = document.getElementById('copy-link-btn');
const copyBadgeBtn = document.getElementById('copy-badge-btn');
const shareXBtn = document.getElementById('share-x-btn');

let currentUsername = '';

function showCardView() {
  heroSection.classList.add('hidden');
  cardSection.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showSearchView() {
  cardSection.classList.add('hidden');
  heroSection.classList.remove('hidden');
  currentUsername = '';
  const url = new URL(window.location);
  url.searchParams.delete('user');
  window.history.replaceState({}, '', url);

  const globalBadge = document.getElementById('global-rate-limit');
  if (globalBadge) {
    globalBadge.classList.add('hidden');
  }
}

function setLoading(loading) {
  searchBtn.classList.toggle('loading', loading);
  searchBtn.disabled = loading;
  usernameInput.disabled = loading;
}

function showError(message) {
  searchError.textContent = message;
}

function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 200);
  }, 2000);
}

async function generateCard(username) {
  username = username.trim().replace(/^@/, '');
  if (!username) {
    showError('Please enter a GitHub username');
    return;
  }

  showError('');
  setLoading(true);

  showCardView();
  cardWrapper.innerHTML = renderSkeleton();

  try {
    let data = getCached(username);
    if (!data) {
      data = await fetchFullProfile(username);
      setCache(username, data);
    }

    currentUsername = username;

    const url = new URL(window.location);
    url.searchParams.set('user', username);
    window.history.replaceState({}, '', url);

    cardWrapper.innerHTML = renderCard(data);
    saveRecentSearch(data.username);

    // Dynamic SEO update
    const pageTitle = `GitGlance - ${data.name || data.username}'s GitHub Stats`;
    document.title = pageTitle;
    
    // Update Meta Tags (for browsers and some bots)
    const metaTitle = document.querySelector('meta[property="og:title"]');
    if (metaTitle) metaTitle.setAttribute('content', pageTitle);
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', `Explore high-fidelity GitHub statistics, pinned repositories, and developer achievements for ${data.name || data.username}.`);

    if (data.rate_limit) {
      updateRateLimitUI(data.rate_limit);
    }

    requestAnimationFrame(() => {
      const cardEl = document.getElementById('stats-card');
      if (cardEl) animateCard(cardEl);
    });
  } catch (err) {
    showSearchView();
    showError(err.message || 'Failed to fetch profile');
  } finally {
    setLoading(false);
  }
}

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  generateCard(usernameInput.value);
});

document.querySelectorAll('.example-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const username = btn.dataset.username;
    usernameInput.value = username;
    generateCard(username);
  });
});

backBtn.addEventListener('click', showSearchView);

downloadBtn.addEventListener('click', async () => {
  const card = document.getElementById('stats-card');
  if (!card) return;

  downloadBtn.disabled = true;
  try {
    await exportAsPng(card, `${currentUsername}-gitglance.png`);
    showToast('Card downloaded!');
  } catch (err) {
    showToast('Export failed');
  } finally {
    downloadBtn.disabled = false;
  }
});

copyLinkBtn.addEventListener('click', async () => {
  const url = new URL(window.location);
  url.searchParams.set('user', currentUsername);

  try {
    await navigator.clipboard.writeText(url.toString());
    showToast('Link copied to clipboard!');
  } catch {
    showToast('Could not copy link');
  }
});

if (copyBadgeBtn) {
  copyBadgeBtn.addEventListener('click', async () => {
    const url = new URL(window.location);
    url.searchParams.set('user', currentUsername);
    const badgeMd = `[![GitGlance Stats](https://img.shields.io/badge/GitGlance_Profile-00E5FF?style=for-the-badge&logo=github&logoColor=black)](${url.toString()})`;
    try {
      await navigator.clipboard.writeText(badgeMd);
      showToast('README badge copied!');
    } catch {
      showToast('Could not copy badge');
    }
  });
}

shareXBtn.addEventListener('click', () => {
  const text = `Check out @${currentUsername}'s GitHub profile stats!`;
  const url = window.location.href;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  window.open(twitterUrl, '_blank', 'width=550,height=420');
});

const params = new URLSearchParams(window.location.search);
const userParam = params.get('user');
if (userParam) {
  usernameInput.value = userParam;
  generateCard(userParam);
}

function updateRateLimitUI(rateLimit) {
  if (!rateLimit) return;
  
  const globalBadge = document.getElementById('global-rate-limit');
  const rateLimitText = document.getElementById('rate-limit-text');
  
  if (globalBadge && rateLimitText) {
    globalBadge.classList.remove('hidden');
    rateLimitText.textContent = `${rateLimit.remaining} / ${rateLimit.limit} requests left`;
  }
}


const RECENT_KEY = 'gitglance_recent_searches';

function loadRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
  } catch {
    return [];
  }
}

function saveRecentSearch(username) {
  const recents = loadRecentSearches();
  const filtered = recents.filter(u => u.toLowerCase() !== username.toLowerCase());
  filtered.unshift(username);
  if (filtered.length > 5) filtered.pop();
  localStorage.setItem(RECENT_KEY, JSON.stringify(filtered));
  renderRecentSearches();
}

function renderRecentSearches() {
  const container = document.getElementById('recent-searches-container');
  const list = document.getElementById('recent-searches-list');
  if (!container || !list) return;

  const recents = loadRecentSearches();
  if (recents.length === 0) {
    container.classList.add('hidden');
    return;
  }

  container.classList.remove('hidden');
  list.innerHTML = recents.map(u => `<button type="button" class="example-btn recent-btn" data-username="${u}">${u}</button>`).join('');

  list.querySelectorAll('.recent-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const u = btn.dataset.username;
      usernameInput.value = u;
      generateCard(u);
    });
  });
}

document.querySelectorAll('.theme-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const theme = btn.dataset.theme;
    const cardEl = document.getElementById('stats-card');
    if (cardEl) {
      cardEl.dataset.theme = theme;
    }
  });
});

renderRecentSearches();

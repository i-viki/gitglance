import './styles/index.css';
import './styles/search.css';
import './styles/card.css';

import { fetchFullProfile } from './api/github.js';
import { getToken, setToken } from './api/github.js';
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
const shareXBtn = document.getElementById('share-x-btn');

const tokenToggle = document.getElementById('token-toggle');
const tokenToggleText = document.getElementById('token-toggle-text');
const tokenPanel = document.getElementById('token-panel');
const tokenInput = document.getElementById('token-input');
const tokenSaveBtn = document.getElementById('token-save-btn');
const tokenClearBtn = document.getElementById('token-clear-btn');
const tokenStatus = document.getElementById('token-status');

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

function refreshTokenUI() {
  const hasToken = !!getToken();
  tokenToggle.classList.toggle('active', hasToken);
  tokenToggleText.textContent = hasToken
    ? 'GitHub Token connected ✓'
    : 'Add GitHub Token for higher rate limits';
  tokenStatus.className = hasToken ? 'token-status connected' : 'token-status';
  tokenStatus.textContent = hasToken ? 'Connected — ' : '';
  tokenSaveBtn.classList.toggle('hidden', hasToken);
  tokenClearBtn.classList.toggle('hidden', !hasToken);
  tokenInput.value = '';
  if (hasToken) tokenInput.placeholder = '•••••••••••••••';
  else tokenInput.placeholder = 'ghp_xxxxxxxxxxxx';
}

tokenToggle.addEventListener('click', () => {
  const isOpen = tokenPanel.classList.toggle('open');
  tokenToggle.classList.toggle('open', isOpen);
});

tokenSaveBtn.addEventListener('click', () => {
  const val = tokenInput.value.trim();
  if (!val) return;
  setToken(val);
  refreshTokenUI();
  showToast('GitHub token saved!');
});

tokenClearBtn.addEventListener('click', () => {
  setToken(null);
  refreshTokenUI();
  showToast('Token removed.');
});

refreshTokenUI();

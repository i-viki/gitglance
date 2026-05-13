import { formatNumber, formatDate, animateCounter } from '../utils/formatters.js';

export function renderSkeleton() {
  return `
    <div class="stats-card">
      <div class="card-profile">
        <div class="skeleton skeleton-avatar"></div>
        <div class="card-user-info">
          <div class="skeleton skeleton-line" style="width:60%;height:18px"></div>
          <div class="skeleton skeleton-line" style="width:40%;height:12px"></div>
          <div class="skeleton skeleton-line" style="width:80%;height:12px"></div>
        </div>
      </div>
      <div class="card-stats-row">
        <div class="skeleton skeleton-stat"></div>
        <div class="skeleton skeleton-stat"></div>
        <div class="skeleton skeleton-stat"></div>
        <div class="skeleton skeleton-stat"></div>
      </div>
      <div class="skeleton" style="height:110px;margin-bottom:24px"></div>
      <div class="skeleton" style="height:90px"></div>
    </div>
  `;
}

export function renderCard(data) {
  const metaItems = [];
  if (data.location) {
    metaItems.push(`
      <span class="card-meta-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        ${escapeHtml(data.location)}
      </span>
    `);
  }
  if (data.company) {
    metaItems.push(`
      <span class="card-meta-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
        ${escapeHtml(data.company)}
      </span>
    `);
  }
  if (data.blog) {
    const blogDisplay = data.blog.replace(/^https?:\/\//, '').replace(/\/$/, '');
    metaItems.push(`
      <span class="card-meta-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        ${escapeHtml(blogDisplay)}
      </span>
    `);
  }

  const languagesHtml = data.top_languages.length > 0
    ? data.top_languages.map(lang => `
        <div class="language-item">
          <span class="language-dot" style="background:${lang.color};color:${lang.color}"></span>
          <span class="language-name">${escapeHtml(lang.name)}</span>
          <div class="language-bar-track">
            <div class="language-bar-fill" style="background:${lang.color}" data-width="${lang.percentage}%"></div>
          </div>
          <span class="language-percent">${lang.percentage}%</span>
        </div>
      `).join('')
    : '<p style="color:var(--text-muted);font-size:12px">No language data available</p>';

  const streakHtml = (data.contributions.total > 0) ? `
    <div class="card-streaks">
      <div class="card-streaks-title">
        <span>🔥</span> Contribution Activity
      </div>
      <div class="streak-grid">
        <div class="streak-item">
          <div class="streak-item-value" data-counter="${data.contributions.current}">${data.contributions.current}</div>
          <div class="streak-item-label">Current Streak</div>
        </div>
        <div class="streak-item">
          <div class="streak-item-value" data-counter="${data.contributions.longest}">${data.contributions.longest}</div>
          <div class="streak-item-label">Longest Streak</div>
        </div>
        <div class="streak-item">
          <div class="streak-item-value" data-counter="${data.contributions.total}">${data.contributions.total}</div>
          <div class="streak-item-label">Recent Events</div>
        </div>
      </div>
    </div>
  ` : '';

  return `
    <div class="stats-card" id="stats-card">
      <div class="card-profile">
        <img
          class="card-avatar"
          src="${data.avatar_url}"
          alt="${escapeHtml(data.name)}'s avatar"
          crossorigin="anonymous"
        />
        <div class="card-user-info">
          <div class="card-name">${escapeHtml(data.name)}</div>
          <div class="card-username">@${escapeHtml(data.username)}</div>
          ${data.bio ? `<div class="card-bio">${escapeHtml(data.bio)}</div>` : ''}
          ${metaItems.length > 0 ? `<div class="card-meta">${metaItems.join('')}</div>` : ''}
        </div>
      </div>

      <div class="card-stats-row">
        <div class="stat-badge stat-badge--repos">
          <span class="stat-value" data-counter="${data.public_repos}">${formatNumber(data.public_repos)}</span>
          <span class="stat-label">Repos</span>
        </div>
        <div class="stat-badge stat-badge--stars">
          <span class="stat-value" data-counter="${data.total_stars}">${formatNumber(data.total_stars)}</span>
          <span class="stat-label">Stars</span>
        </div>
        <div class="stat-badge stat-badge--followers">
          <span class="stat-value" data-counter="${data.followers}">${formatNumber(data.followers)}</span>
          <span class="stat-label">Followers</span>
        </div>
        <div class="stat-badge stat-badge--following">
          <span class="stat-value" data-counter="${data.following}">${formatNumber(data.following)}</span>
          <span class="stat-label">Following</span>
        </div>
      </div>

      ${streakHtml}

      <div class="card-languages">
        <div class="card-languages-title">Top Languages</div>
        ${languagesHtml}
      </div>

      <div class="card-footer">
        <span class="card-footer-text">Member since ${formatDate(data.created_at)}</span>
        <span class="card-footer-brand">GitGlance</span>
      </div>
    </div>
  `;
}

export function animateCard(cardEl) {
  const counters = cardEl.querySelectorAll('[data-counter]');
  counters.forEach((el, i) => {
    const target = parseInt(el.dataset.counter, 10);
    if (target > 0) {
      setTimeout(() => animateCounter(el, target, 1000), i * 80);
    }
  });

  const bars = cardEl.querySelectorAll('.language-bar-fill');
  bars.forEach((bar, i) => {
    const targetWidth = bar.dataset.width;
    setTimeout(() => {
      bar.style.width = targetWidth;
    }, 200 + i * 100);
  });
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

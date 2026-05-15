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
      <div class="card-columns">
        <div class="card-col">
          <div class="skeleton" style="height:110px;margin-bottom:24px"></div>
          <div class="skeleton" style="height:140px"></div>
        </div>
        <div class="card-col">
          <div class="skeleton" style="height:110px;margin-bottom:24px"></div>
          <div class="skeleton" style="height:140px"></div>
        </div>
      </div>
    </div>
  `;
}

export function calculateRank(data) {
  const starsScore = (data.total_stars || 0) * 10;
  const followersScore = (data.followers || 0) * 5;
  const contributionsScore = (data.contributions?.total || 0) * 1;
  const streakScore = (data.contributions?.longest || 0) * 10;
  const reposScore = (data.public_repos || 0) * 2;

  const totalScore = starsScore + followersScore + contributionsScore + streakScore + reposScore;

  if (totalScore >= 5000) return { tier: 'S+', color: 'linear-gradient(135deg, #ffbc00, #ff0055)', shadow: 'rgba(255, 0, 85, 0.4)' };
  if (totalScore >= 2000) return { tier: 'S', color: 'linear-gradient(135deg, #00f2fe, #4facfe)', shadow: 'rgba(0, 242, 254, 0.4)' };
  if (totalScore >= 800) return { tier: 'A+', color: 'linear-gradient(135deg, #16a085, #f4d03f)', shadow: 'rgba(244, 208, 63, 0.4)' };
  if (totalScore >= 300) return { tier: 'A', color: 'linear-gradient(135deg, #a8ff78, #78ffd6)', shadow: 'rgba(120, 255, 214, 0.4)' };
  if (totalScore >= 100) return { tier: 'B', color: 'linear-gradient(135deg, #9d50bb, #6e48aa)', shadow: 'rgba(157, 80, 187, 0.4)' };
  return { tier: 'C', color: 'linear-gradient(135deg, #bdc3c7, #2c3e50)', shadow: 'rgba(189, 195, 199, 0.4)' };
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
    const displayBlog = data.blog.replace(/^https?:\/\//, '').replace(/\/$/, '');
    metaItems.push(`<div class="card-meta-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>${escapeHtml(displayBlog)}</div>`);
  }
  if (data.created_at) {
    const joinedDate = new Date(data.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    metaItems.push(`<div class="card-meta-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>Joined ${joinedDate}</div>`);
  }
  if (data.twitterUsername) {
    metaItems.push(`
      <span class="card-meta-item">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
        @${escapeHtml(data.twitterUsername)}
      </span>
    `);
  }

  const badgesHtml = [];
  if (data.badges?.isGitHubStar) badgesHtml.push('<span class="user-badge star"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> Star</span>');
  if (data.badges?.isCampusExpert) badgesHtml.push('<span class="user-badge expert"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> Expert</span>');
  if (data.badges?.isEmployee) badgesHtml.push('<span class="user-badge staff"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> Staff</span>');
  if (data.badges?.isHireable) badgesHtml.push('<span class="user-badge hireable"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Hireable</span>');
  if (data.badges?.isDeveloperProgramMember) badgesHtml.push('<span class="user-badge dev"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> Dev</span>');

  const statusHtml = data.status && data.status.message ? `<div class="user-status"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> ${escapeHtml(data.status.message)}</div>` : '';

  const languagesHtml = data.top_languages.length > 0
    ? `
      <div class="language-bar">
        ${data.top_languages.map(lang => `
          <div 
            class="language-bar-segment" 
            style="width:${lang.percentage}%;background:${lang.color}"
            title="${lang.name}: ${lang.percentage}%"
          ></div>
        `).join('')}
      </div>
      ${data.top_languages.map(lang => `
        <div class="language-item" title="${lang.name} makes up ${lang.percentage}% of non-forked code">
          <span class="language-dot" style="background:${lang.color}"></span>
          <span class="language-name">${escapeHtml(lang.name)}</span>
          <span class="language-percentage">${lang.percentage}%</span>
        </div>
      `).join('')}
      `
    : '<p style="color:var(--text-muted);font-size:12px">No language data available</p>';

  const streakHtml = `
    <div class="streak-card">
      <div class="streak-grid">
        <div class="streak-item">
          <span class="streak-value" data-counter="${data.contributions.current}">${data.contributions.current}</span>
          <span class="streak-label">Current Streak</span>
        </div>
        <div class="streak-item streak-item--highlight">
          <span class="streak-value" data-counter="${data.contributions.total}">${formatNumber(data.contributions.total)}</span>
          <span class="streak-label">Total Contribs</span>
        </div>
        <div class="streak-item">
          <span class="streak-value" data-counter="${data.contributions.longest}">${data.contributions.longest}</span>
          <span class="streak-label">Longest Streak</span>
        </div>
      </div>
      
      ${data.contributions.calendar ? `
        <div class="contribution-heatmap">
          ${data.contributions.calendar.slice(-70).map(day => `
            <div 
              class="heatmap-cell" 
              style="background: ${day.contributionCount > 0 ? (day.color || '#00E5FF') : 'rgba(255,255,255,0.05)'}; 
                     opacity: ${day.contributionCount > 0 ? 0.3 + (day.contributionCount * 0.1) : 1}"
              title="${day.date}: ${day.contributionCount} contributions"
            ></div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;

  const orgsHtml = data.advanced_stats?.organizations?.length > 0 ? `
    <div class="org-spotlight">
      <div class="card-stats-title">Affiliations</div>
      <div class="org-list">
        ${data.advanced_stats.organizations.map(org => `
          <img src="${org.avatarUrl}" alt="${escapeHtml(org.name || org.login)}" class="org-avatar" title="${escapeHtml(org.name || org.login)}" crossorigin="anonymous" />
        `).join('')}
      </div>
    </div>
  ` : '';

  const socialIcons = {
    TWITTER: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>',
    LINKEDIN: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>',
    GENERIC: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>'
  };

  const socialsHtml = data.advanced_stats?.social_accounts?.length > 0 ? `
    <div class="social-links">
      ${data.advanced_stats.social_accounts.map(social => `
        <a href="${social.url}" target="_blank" class="social-link" title="${social.displayName || social.provider}">
          ${socialIcons[social.provider] || socialIcons.GENERIC}
        </a>
      `).join('')}
    </div>
  ` : '';

  const reposToRender = data.pinned_repos?.length > 0 ? data.pinned_repos : (data.top_repo ? [data.top_repo] : []);
  
  const topRepoIcon = data.pinned_repos?.length > 0 
    ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.68V6a3 3 0 0 0-3-3h-0a3 3 0 0 0-3 3v4.68a2 2 0 0 1-1.11 1.87l-1.78.89A2 2 0 0 0 5 15.24Z"/></svg> Pinned' 
    : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Top Repository';

  const topRepoHtml = reposToRender.length > 0 ? `
    <div class="top-repo-spotlight">
      <div class="top-repo-header">
        <span class="top-repo-label">${topRepoIcon}</span>
      </div>
      <div class="pinned-repos-grid ${reposToRender.length === 1 ? 'single' : ''}">
        ${reposToRender.map(repo => `
          <div class="pinned-repo-item">
            <div class="top-repo-name">${escapeHtml(repo.name)}</div>
            ${repo.description ? `<div class="top-repo-desc">${escapeHtml(repo.description)}</div>` : ''}
            <div class="top-repo-stats">
              ${repo.language ? `<span class="top-repo-lang"><span class="language-dot" style="background:${repo.language_color};color:${repo.language_color}"></span>${escapeHtml(repo.language)}</span>` : ''}
              <span class="top-repo-stat"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>${formatNumber(repo.stargazers_count)}</span>
              <span class="top-repo-stat"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 18H7a2 2 0 0 1-2-2V6"/><circle cx="5" cy="5" r="2"/><circle cx="12" cy="20" r="2"/><circle cx="19" cy="13" r="2"/><path d="M12 14v-2a2 2 0 0 1 2-2h3"/></svg>${formatNumber(repo.forks_count)}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  const rank = calculateRank(data);
  const activeThemeBtn = document.querySelector('.theme-btn.active');
  const currentTheme = activeThemeBtn ? activeThemeBtn.dataset.theme : 'geist';

  return `
    <div class="stats-card" id="stats-card" data-theme="${currentTheme}">
      <div class="card-profile">
        <img
          class="card-avatar"
          src="${data.avatar_url}"
          alt="${escapeHtml(data.name)}'s avatar"
          crossorigin="anonymous"
        />
        <div class="card-user-info">
          <div class="card-name-row">
            <div class="card-name">${escapeHtml(data.name)}</div>
            ${badgesHtml.join('')}
            <div class="rank-badge" style="background:${rank.color};box-shadow:0 0 10px ${rank.shadow}">
              <span class="rank-badge-label">Rank</span>
              <span class="rank-badge-tier">${rank.tier}</span>
            </div>
          </div>
          <div class="card-username">@${escapeHtml(data.username)}</div>
          ${statusHtml}
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

      <div class="card-columns">
        <div class="card-col">
          ${topRepoHtml}
          <div class="card-languages">
            <div class="card-languages-title">Top Languages</div>
            ${languagesHtml}
          </div>
        </div>
        
        <div class="card-col">
          ${streakHtml}
          <div class="card-advanced-stats">
            <div class="card-stats-title">Advanced Insights</div>
            <div class="advanced-stats-grid">
              <div class="adv-stat">
                <span class="adv-stat-label">Commits</span>
                <span class="adv-stat-value" data-counter="${data.advanced_stats?.commits || 0}">${formatNumber(data.advanced_stats?.commits || 0)}</span>
              </div>
              <div class="adv-stat">
                <span class="adv-stat-label">PRs</span>
                <span class="adv-stat-value" data-counter="${data.advanced_stats?.pull_requests || 0}">${formatNumber(data.advanced_stats?.pull_requests || 0)}</span>
              </div>
              <div class="adv-stat">
                <span class="adv-stat-label">Issues</span>
                <span class="adv-stat-value" data-counter="${data.advanced_stats?.issues || 0}">${formatNumber(data.advanced_stats?.issues || 0)}</span>
              </div>
              <div class="adv-stat">
                <span class="adv-stat-label">PR Reviews</span>
                <span class="adv-stat-value" data-counter="${data.advanced_stats?.pr_reviews || 0}">${formatNumber(data.advanced_stats?.pr_reviews || 0)}</span>
              </div>
              <div class="adv-stat">
                <span class="adv-stat-label">Repos Created</span>
                <span class="adv-stat-value" data-counter="${data.advanced_stats?.repos_created || 0}">${formatNumber(data.advanced_stats?.repos_created || 0)}</span>
              </div>
              <div class="adv-stat">
                <span class="adv-stat-label">Contributed To</span>
                <span class="adv-stat-value" data-counter="${data.advanced_stats?.contributed_to || 0}">${formatNumber(data.advanced_stats?.contributed_to || 0)}</span>
              </div>
              <div class="adv-stat">
                <span class="adv-stat-label">Packages</span>
                <span class="adv-stat-value" data-counter="${data.advanced_stats?.packages || 0}">${formatNumber(data.advanced_stats?.packages || 0)}</span>
              </div>
              <div class="adv-stat">
                <span class="adv-stat-label">Sponsoring</span>
                <span class="adv-stat-value" data-counter="${data.advanced_stats?.sponsoring || 0}">${formatNumber(data.advanced_stats?.sponsoring || 0)}</span>
              </div>
              <div class="adv-stat">
                <span class="adv-stat-label">Sponsors</span>
                <span class="adv-stat-value" data-counter="${data.advanced_stats?.sponsors || 0}">${formatNumber(data.advanced_stats?.sponsors || 0)}</span>
              </div>
            </div>
          </div>
          ${orgsHtml}
        </div>
      </div>

      <div class="card-footer">
        <div class="card-footer-brand">
          <span class="brand-name">GitGlance</span>
        </div>
        ${socialsHtml}
        <div class="card-footer-date">Generated ${new Date().toLocaleDateString()}</div>
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

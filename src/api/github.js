const API_BASE = 'https://api.github.com';
const TOKEN_KEY = 'gitglance_gh_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token.trim());
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

function buildHeaders() {
  const headers = { Accept: 'application/vnd.github.v3+json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function ghFetch(url) {
  return fetch(url, { headers: buildHeaders() });
}

export async function fetchProfile(username) {
  const res = await ghFetch(`${API_BASE}/users/${username}`);
  if (res.status === 404) throw new Error('User not found');
  if (res.status === 403) {
    const isAuthed = !!getToken();
    throw new Error(
      isAuthed
        ? "Rate limit exceeded — your token's quota is exhausted. Try again later."
        : 'Rate limit exceeded — add a GitHub token below for 5,000 requests/hour.'
    );
  }
  if (!res.ok) throw new Error(`GitHub API error (${res.status})`);
  return res.json();
}

export async function fetchRepos(username) {
  const repos = [];
  let page = 1;
  const perPage = 100;

  while (page <= 3) {
    const res = await ghFetch(
      `${API_BASE}/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated`
    );
    if (!res.ok) break;
    const data = await res.json();
    if (data.length === 0) break;
    repos.push(...data);
    if (data.length < perPage) break;
    page++;
  }

  return repos;
}

export function computeLanguages(repos) {
  const langCounts = {};

  for (const repo of repos) {
    if (repo.language && !repo.fork) {
      langCounts[repo.language] = (langCounts[repo.language] || 0) + (repo.size || 1);
    }
  }

  const total = Object.values(langCounts).reduce((a, b) => a + b, 0);
  if (total === 0) return [];

  const sorted = Object.entries(langCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({
      name,
      percentage: Math.round((count / total) * 100),
      color: getLanguageColor(name),
    }));

  return sorted;
}

export function computeTotalStars(repos) {
  return repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
}

export async function fetchContributions(username) {
  try {
    const events = [];
    let page = 1;

    while (page <= 3) {
      const res = await ghFetch(
        `${API_BASE}/users/${username}/events/public?per_page=100&page=${page}`
      );
      if (!res.ok) break;
      const data = await res.json();
      if (data.length === 0) break;
      events.push(...data);
      if (data.length < 100) break;
      page++;
    }

    const contributionDays = {};
    const pushTypes = ['PushEvent', 'CreateEvent', 'PullRequestEvent', 'IssuesEvent'];

    for (const event of events) {
      if (pushTypes.includes(event.type)) {
        const day = event.created_at.split('T')[0];
        contributionDays[day] = (contributionDays[day] || 0) + 1;
      }
    }

    const sortedDays = Object.keys(contributionDays).sort();
    const totalContributions = Object.values(contributionDays).reduce((a, b) => a + b, 0);

    let currentStreak = 0;
    const checkDate = new Date();

    for (let i = 0; i < 365; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (contributionDays[dateStr]) {
        currentStreak++;
      } else if (i > 0) {
        break;
      }
      checkDate.setDate(checkDate.getDate() - 1);
    }

    let longestStreak = 0;
    let tempStreak = 0;
    let prevDate = null;

    for (const day of sortedDays) {
      if (prevDate) {
        const diff = (new Date(day) - new Date(prevDate)) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
      longestStreak = Math.max(longestStreak, tempStreak);
      prevDate = day;
    }

    return {
      current: currentStreak,
      longest: longestStreak,
      total: totalContributions,
    };
  } catch {
    return { current: 0, longest: 0, total: 0 };
  }
}

function getLanguageColor(lang) {
  const colors = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#178600',
    Go: '#00ADD8',
    Rust: '#dea584',
    Ruby: '#701516',
    PHP: '#4F5D95',
    Swift: '#F05138',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
    Shell: '#89e051',
    HTML: '#e34c26',
    CSS: '#563d7c',
    SCSS: '#c6538c',
    Vue: '#41b883',
    Svelte: '#ff3e00',
    Lua: '#000080',
    R: '#198CE7',
    Scala: '#c22d40',
    Elixir: '#6e4a7e',
    Haskell: '#5e5086',
    Jupyter: '#DA5B0B',
    Dockerfile: '#384d54',
    Makefile: '#427819',
    Zig: '#ec915c',
    Nim: '#ffc200',
    OCaml: '#3be133',
  };
  return colors[lang] || '#8b8b8b';
}

export async function fetchFullProfile(username) {
  const [profile, repos, contributions] = await Promise.all([
    fetchProfile(username),
    fetchRepos(username),
    fetchContributions(username),
  ]);

  return {
    avatar_url: profile.avatar_url,
    username: profile.login,
    name: profile.name || profile.login,
    bio: profile.bio,
    location: profile.location,
    company: profile.company,
    blog: profile.blog,
    public_repos: profile.public_repos,
    total_stars: computeTotalStars(repos),
    followers: profile.followers,
    following: profile.following,
    top_languages: computeLanguages(repos),
    contributions,
    created_at: profile.created_at,
  };
}

import { githubGraphql } from './githubGraphQL.js';
import { getUserStats, getLanguageSize, getContributionCalendar, getCommitsPerRepo } from '../utils/githubParsers.js';

const API_BASE = 'https://api.github.com';

async function ghFetch(url) {
  // Legacy REST fallback if needed (no token)
  return fetch(url, { headers: { Accept: 'application/vnd.github.v3+json' } });
}

export async function fetchProfile(username) {
  const res = await ghFetch(`${API_BASE}/users/${username}`);
  if (res.status === 404) throw new Error('User not found');
  if (res.status === 403) {
    throw new Error('Rate limit exceeded. Please try again later.');
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

export function computeTopRepo(repos) {
  const originalRepos = repos.filter(r => !r.fork);
  const list = originalRepos.length > 0 ? originalRepos : repos;
  if (list.length === 0) return null;

  const top = list.reduce((prev, curr) =>
    ((prev.stargazers_count || 0) > (curr.stargazers_count || 0)) ? prev : curr
  );

  if (!top || top.stargazers_count === undefined) return null;

  return {
    name: top.name,
    description: top.description,
    stargazers_count: top.stargazers_count,
    forks_count: top.forks_count,
    language: top.language,
    language_color: top.language ? getLanguageColor(top.language) : null,
  };
}

export async function fetchFullProfile(username) {
  try {
    const rawData = await githubGraphql({
      variables: { username }
    });

  if (!rawData || !rawData.user) {
    throw new Error('User not found');
  }

  const { user, rateLimit } = rawData;
  const stats = getUserStats(user);
  const topLanguages = getLanguageSize(user.repositories?.nodes || []);
  
  const contributionDays = getContributionCalendar(user.contributionsCollection)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  
  let longestStreak = 0;
  let currentStreak = 0;
  let tempStreak = 0;
  
  for (const day of contributionDays) {
    if (day.contributionCount > 0) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  for (let i = contributionDays.length - 1; i >= 0; i--) {
    if (contributionDays[i].contributionCount > 0) {
      currentStreak++;
    } else if (i < contributionDays.length - 1) {
      break;
    }
  }

  // Map GraphQL data back to the format expected by your UI components
  return {
    rate_limit: rateLimit,
    avatar_url: user.avatarUrl || `https://github.com/${username}.png`,
    username: username,
    name: user.name || username,
    bio: user.bio,
    location: user.location,
    company: user.company,
    blog: user.websiteUrl,
    public_repos: stats.Repositories || user.repositories?.totalCount || 0,
    total_stars: stats['Star Earned'] || 0,
    followers: user.followers?.totalCount || 0,
    following: user.following?.totalCount || 0,
    top_languages: topLanguages.map(lang => ({
      name: lang.name,
      percentage: Math.round(lang.size),
      color: getLanguageColor(lang.name)
    })),
    // Map stargazerCount to stargazers_count for the existing computeTopRepo function
    top_repo: computeTopRepo((user.repositories?.nodes || []).map(repo => ({
      ...repo,
      stargazers_count: repo.stargazerCount,
      forks_count: repo.forkCount,
      fork: repo.isFork
    }))),
    contributions: {
      total: user.contributionsCollection?.totalCommitContributions || 0,
      current: currentStreak,
      longest: longestStreak
    },
    status: user.status || null,
    twitterUsername: user.twitterUsername,
    badges: {
      isHireable: user.isHireable,
      isGitHubStar: user.isGitHubStar,
      isCampusExpert: user.isCampusExpert,
      isEmployee: user.isEmployee,
      isDeveloperProgramMember: user.isDeveloperProgramMember,
    },
    pinned_repos: (user.pinnedItems?.nodes || []).map(repo => ({
      name: repo.name,
      description: repo.description,
      stargazers_count: repo.stargazerCount,
      forks_count: repo.forkCount,
      fork: repo.isFork,
      language: repo.languages?.edges?.[0]?.node?.name,
      language_color: repo.languages?.edges?.[0]?.node?.name ? getLanguageColor(repo.languages.edges[0].node.name) : null,
    })),
    // Advanced Stats
    advanced_stats: {
      organizations: user.organizations?.totalCount || 0,
      gists: user.gists?.totalCount || 0,
      pull_requests: user.contributionsCollection?.totalPullRequestContributions || user.pullRequests?.totalCount || 0,
      issues: user.contributionsCollection?.totalIssueContributions || user.issues?.totalCount || 0,
      commits: user.contributionsCollection?.totalCommitContributions || 0,
      sponsors: user.sponsors?.totalCount || 0,
      sponsoring: user.sponsoring?.totalCount || 0,
      contributed_to: user.repositoriesContributedTo?.totalCount || 0,
      packages: user.packages?.totalCount || 0,
      projects: user.projectsV2?.totalCount || 0,
      pr_reviews: user.contributionsCollection?.totalPullRequestReviewContributions || 0,
      repos_created: user.contributionsCollection?.totalRepositoryContributions || 0,
    },
    created_at: user.createdAt,
  };
  } catch (error) {
    console.error('fetchFullProfile Error:', error);
    throw error;
  }
}

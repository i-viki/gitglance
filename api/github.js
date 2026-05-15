export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN;
  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'Server is missing GitHub Token. Please add it to Vercel environment variables.' });
  }

  const fetchUserDataQuery = `
    query ($username: String!) {
      user(login: $username) {
        name
        bio
        location
        company
        websiteUrl
        avatarUrl
        createdAt
        isHireable
        isGitHubStar
        isCampusExpert
        isEmployee
        isDeveloperProgramMember
        twitterUsername
        status {
          emojiHTML
          message
        }
        followers { totalCount }
        following { totalCount }
        repositoriesWithStargazerCount: repositories(first: 100, orderBy: {field: STARGAZERS, direction: DESC}) {
          totalCount
          nodes { stargazerCount }
        }
        organizations(first: 1) { totalCount }
        gists(first: 1) { totalCount }
        pullRequests(first: 1) { totalCount }
        issues(first: 1) { totalCount }
        packages(first: 1) { totalCount }
        projectsV2(first: 1) { totalCount }
        sponsoring(first: 1) { totalCount }
        contributionsCollection {
          totalCommitContributions
          totalPullRequestReviewContributions
          totalPullRequestContributions
          totalIssueContributions
          totalRepositoryContributions
          contributionCalendar {
            weeks {
              contributionDays {
                contributionCount
                contributionLevel
                date
              }
            }
          }
        }
        sponsors(first: 1) { totalCount }
        repositoriesContributedTo(first: 1) { totalCount }
        pinnedItems(first: 2, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              stargazerCount
              forkCount
              isFork
              languages(first: 1, orderBy: {field: SIZE, direction: DESC}) {
                edges {
                  node { name }
                }
              }
            }
          }
        }
        repositories(first: 10, orderBy: {field: STARGAZERS, direction: DESC}) {
          totalCount
          nodes {
            name
            description
            stargazerCount
            forkCount
            isFork
            languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
              edges {
                size
                node { name }
              }
            }
          }
        }
      }
      rateLimit {
        limit
        remaining
        resetAt
      }
    }
  `;

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github+json'
      },
      body: JSON.stringify({
        query: fetchUserDataQuery,
        variables: { username }
      })
    });

    const data = await response.json();

    if (data.errors) {
      return res.status(400).json({ errors: data.errors });
    }

    return res.status(200).json(data.data);
  } catch (error) {
    console.error('GitHub API Request Error:', error);
    return res.status(500).json({ error: 'Internal Server Error while fetching GitHub data' });
  }
}

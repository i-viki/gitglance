/**
 * Utility functions to parse raw GitHub GraphQL data into usable formats.
 */

export const getLanguageSize = (repos) => {
    let languages = { totalSize: 0 };
    repos?.forEach((repo) => {
        repo.languages.edges.forEach(({ node: { name }, size }) => {
            if (languages[name]) languages[name] += size;
            else languages[name] = size;
            languages.totalSize += size;
        });
    });

    for (const lang in languages) {
        if (lang === 'totalSize') continue;
        languages[lang] = ((languages[lang] / languages.totalSize) * 100).toFixed(2);
    }

    delete languages.totalSize;
    languages = Object.entries(languages).map(([name, size]) => ({ name, size }));
    languages.sort((a, b) => b.size - a.size);
    return languages.slice(0, 8);
};

export const getUserStats = (userData) => {
    if (!userData) return {};
    const stats = {
        Followers: userData.followers?.totalCount || 0,
        Repositories: userData.repositoriesWithStargazerCount?.totalCount || 0,
        Organizations: userData.organizations?.totalCount || 0,
        Gists: userData.gists?.totalCount || 0,
        'Pull Requests': userData.pullRequests?.totalCount || 0,
        Issues: userData.issues?.totalCount || 0,
        Commits: userData.contributionsCollection?.totalCommitContributions || 0,
        Sponsors: userData.sponsors?.totalCount || 0,
        'Contributed To': userData.repositoriesContributedTo?.totalCount || 0,
    };

    stats['Star Earned'] = (userData.repositoriesWithStargazerCount?.nodes || []).reduce(
        (acc, repo) => acc + (repo.stargazerCount || 0),
        0
    );

    return stats;
};

export const getContributionCalendar = (contributionsCollection) => {
    const weeks = contributionsCollection?.contributionCalendar?.weeks || [];
    return weeks.flatMap((week) => week.contributionDays || []);
};

export const getCommitsPerRepo = (repos) => {
    return repos?.map((repo) => ({
        name: repo.name,
        commits: repo.defaultBranchRef?.target?.history?.totalCount || 0,
    })).sort((a, b) => b.commits - a.commits).slice(0, 10);
};

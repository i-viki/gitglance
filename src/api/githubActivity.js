import axios from 'axios';
import { getToken } from './github.js';

/**
 * Fetches recent public activity events for a GitHub user.
 * @param {string} login - The GitHub username.
 * @returns {Promise<Array>} Organized activity data.
 */
export const fetchActivity = async (login) => {
    const token = getToken();
    const headers = { Accept: 'application/vnd.github+json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    try {
        const { data } = await axios.get(`https://api.github.com/users/${login}/events/public`, { headers });

        return data.map(({ type, payload, created_at: timestamp, repo }) => {
            switch (type) {
                case 'CreateEvent':
                    return {
                        type: 'create',
                        ref: { name: payload.ref, type: payload.ref_type },
                        timestamp,
                        repo,
                    };
                case 'PushEvent':
                    return {
                        type: 'push',
                        commits: payload.commits,
                        size: payload.size,
                        timestamp,
                        repo,
                    };
                case 'PullRequestEvent':
                    return {
                        type: 'pull_request',
                        action: payload.action,
                        pr: payload.pull_request,
                        timestamp,
                        repo,
                    };
                default:
                    return { type, timestamp, repo, payload };
            }
        });
    } catch (error) {
        console.error('Error fetching activity:', error);
        return [];
    }
};

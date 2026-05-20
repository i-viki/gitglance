import axios from 'axios';

/**
 * Calls the Vercel Serverless backend to fetch GitHub data.
 * The backend has its own complete GraphQL query — we just send the username.
 * @param {{ variables: { username: string } }} params
 * @returns {Promise<Object>} The data returned by GitHub.
 */
export const githubGraphql = ({ variables }) => {
    return axios.post(
        '/api/github',
        { username: variables.username },
        { headers: { 'Content-Type': 'application/json' } }
    ).then(response => {
        if (response.data.errors) {
            console.error('Backend GraphQL Errors:', response.data.errors);
            return Promise.reject(response.data.errors);
        }
        return response.data;
    }).catch(error => {
        console.error('Backend Request Error:', error.response?.data || error.message);
        return Promise.reject(error.response?.data || error);
    });
};

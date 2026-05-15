import axios from 'axios';

/**
 * Calls the Vercel Serverless backend to fetch GitHub data.
 * @param {string} username - The GitHub username.
 * @returns {Promise<Object>} The data returned by GitHub.
 */
export const githubGraphql = ({ variables }) => {
    return new Promise((resolve, reject) => {
        // Fetch from our own secure backend instead of GitHub directly
        axios.post(
            '/api/github',
            { username: variables.username },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(response => {
            console.log('Backend Response:', response.data);
            if (response.data.errors) {
                console.error('Backend GraphQL Errors:', response.data.errors);
                reject(response.data.errors);
            } else {
                resolve(response.data);
            }
        }).catch(error => {
            console.error('Backend Request Error:', error.response?.data || error.message);
            reject(error.response?.data || error);
        });
    });
};

// We don't need fetchUserDataQuery exported here anymore, 
// as the backend handles the GraphQL construction.
export const fetchUserDataQuery = null;

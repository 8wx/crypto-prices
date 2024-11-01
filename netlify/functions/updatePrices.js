// netlify/functions/updatePrices.js
const axios = require('axios');
const { Octokit } = require('@octokit/rest');

export default async (req) => {
    console.log('Function triggered');
    
    // Handle both scheduled events and manual HTTP requests
    if (req.headers) {
        console.log('HTTP request received');
    } else {
        try {
            const { next_run } = await req.json();
            console.log("Scheduled event received. Next run at:", next_run);
        } catch (error) {
            console.log("Error parsing scheduled event:", error);
        }
    }

    try {
        // 1. Fetch prices from CoinGecko
        console.log('Fetching prices from CoinGecko...');
        const response = await axios.get(
            'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd'
        );
        console.log('CoinGecko response:', response.data);
        
        const prices = {
            lastUpdated: new Date().toISOString(),
            prices: response.data
        };

        // 2. Initialize GitHub API client
        console.log('Initializing GitHub client...');
        const octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN
        });

        // Log environment variables (excluding sensitive data)
        console.log('Environment check:', {
            hasGithubToken: !!process.env.GITHUB_TOKEN,
            githubUsername: process.env.GITHUB_USERNAME,
            githubRepo: process.env.GITHUB_REPO
        });

        // 3. Get the current file's SHA (if it exists)
        console.log('Checking for existing prices.json...');
        let sha;
        try {
            const { data } = await octokit.repos.getContent({
                owner: process.env.GITHUB_USERNAME,
                repo: process.env.GITHUB_REPO,
                path: 'prices.json',
            });
            sha = data.sha;
            console.log('Existing file found with SHA:', sha);
        } catch (error) {
            console.log('No existing file found, will create new one');
        }

        // 4. Update or create the prices.json file
        console.log('Updating prices.json...');
        const result = await octokit.repos.createOrUpdateFileContents({
            owner: process.env.GITHUB_USERNAME,
            repo: process.env.GITHUB_REPO,
            path: 'prices.json',
            message: 'Update crypto prices',
            content: Buffer.from(JSON.stringify(prices, null, 2)).toString('base64'),
            sha: sha
        });
        console.log('File update result:', result.status);

        return new Response(JSON.stringify({ 
            message: "Prices updated successfully",
            data: prices,
            updateResult: result.status
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            response: error.response?.data
        });
        
        return new Response(JSON.stringify({ 
            error: "Failed to update prices",
            details: error.message,
            stack: error.stack
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};
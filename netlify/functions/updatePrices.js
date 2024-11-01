// netlify/functions/updatePrices.js
const axios = require('axios');
const { Octokit } = require('@octokit/rest');

exports.handler = async function(event, context) {
    // Only allow scheduled events or GET requests
    if (event.httpMethod !== "GET" && !event.isScheduled) {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method not allowed" })
        };
    }

    try {
        // Fetch prices from CoinGecko
        const response = await axios.get(
            'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd'
        );
        
        const prices = {
            lastUpdated: new Date().toISOString(),
            prices: response.data
        };

        // Initialize GitHub API client
        const octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN
        });

        // Get the current file's SHA (if it exists)
        let sha;
        try {
            const { data } = await octokit.repos.getContent({
                owner: process.env.GITHUB_USERNAME,
                repo: process.env.GITHUB_REPO,
                path: 'prices.json',
            });
            sha = data.sha;
        } catch (error) {
            // File doesn't exist yet, which is fine
        }

        // Update or create the prices.json file
        await octokit.repos.createOrUpdateFileContents({
            owner: process.env.GITHUB_USERNAME,
            repo: process.env.GITHUB_REPO,
            path: 'prices.json',
            message: 'Update crypto prices',
            content: Buffer.from(JSON.stringify(prices, null, 2)).toString('base64'),
            sha: sha
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ 
                message: "Prices updated successfully",
                data: prices
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: "Failed to update prices",
                details: error.message
            })
        };
    }
};
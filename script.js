// script.js
async function getCryptoPrices() {
    try {
        const response = await fetch('prices.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Update Bitcoin price
        const bitcoinPrice = data.prices.bitcoin.usd;
        document.getElementById('bitcoin-price').textContent = 
            `$${bitcoinPrice.toLocaleString()}`;
        
        // Update Ethereum price
        const ethereumPrice = data.prices.ethereum.usd;
        document.getElementById('ethereum-price').textContent = 
            `$${ethereumPrice.toLocaleString()}`;
        
        // Update timestamps
        const lastUpdated = new Date(data.lastUpdated);
        const timeAgo = getTimeAgo(lastUpdated);
        
        document.getElementById('last-updated').textContent = 
            `Last updated: ${timeAgo} (${lastUpdated.toLocaleString()})`;
        
        document.getElementById('error-message').style.display = 'none';
    } catch (error) {
        console.error('Error details:', error);
        document.getElementById('error-message').textContent = 
            `Error loading prices: ${error.message}. Please try again later.`;
        document.getElementById('error-message').style.display = 'block';
    }
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
    }
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;
    }
    
    return 'just now';
}

// Fetch prices immediately when page loads
getCryptoPrices();

// Refresh the display every minute
setInterval(getCryptoPrices, 60000);
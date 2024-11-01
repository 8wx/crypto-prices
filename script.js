// script.js
async function getCryptoPrices() {
    try {
        const response = await fetch('prices.json');
        if (!response.ok) {
            throw new Error('Failed to fetch prices');
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
        
        // Update timestamp
        document.getElementById('last-updated').textContent = 
            `Last updated: ${new Date(data.lastUpdated).toLocaleString()}`;
        
        document.getElementById('error-message').style.display = 'none';
    } catch (error) {
        console.error('Error fetching prices:', error);
        document.getElementById('error-message').style.display = 'block';
    }
}

// Fetch prices immediately when page loads
getCryptoPrices();

// Refresh prices every minute
setInterval(getCryptoPrices, 60000);
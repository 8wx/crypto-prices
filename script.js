// script.js
async function getCryptoPrices() {
    try {
        const response = await fetch('prices.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validate the data structure
        if (!data.prices || !data.prices.bitcoin || !data.prices.ethereum) {
            throw new Error('Invalid data structure in prices.json');
        }
        
        // Update Bitcoin price
        const bitcoinPrice = data.prices.bitcoin.usd;
        document.getElementById('bitcoin-price').textContent = 
            bitcoinPrice === 0 ? 'Loading...' : `$${bitcoinPrice.toLocaleString()}`;
        
        // Update Ethereum price
        const ethereumPrice = data.prices.ethereum.usd;
        document.getElementById('ethereum-price').textContent = 
            ethereumPrice === 0 ? 'Loading...' : `$${ethereumPrice.toLocaleString()}`;
        
        // Update timestamp
        document.getElementById('last-updated').textContent = 
            `Last updated: ${new Date(data.lastUpdated).toLocaleString()}`;
        
        document.getElementById('error-message').style.display = 'none';
        
        // Log success for debugging
        console.log('Prices updated successfully:', data);
    } catch (error) {
        console.error('Error details:', error);
        document.getElementById('error-message').textContent = 
            `Error loading prices: ${error.message}. Please try again later.`;
        document.getElementById('error-message').style.display = 'block';
    }
}

// Fetch prices immediately when page loads
getCryptoPrices();

// Refresh prices every minute
setInterval(getCryptoPrices, 60000);
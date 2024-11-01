// netlify/functions/updatePrices.js
exports.handler = async function(event, context) {
    try {
        // Simple response to test if function works
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Function is working",
                timestamp: new Date().toISOString()
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
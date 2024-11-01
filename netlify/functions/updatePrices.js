// netlify/functions/updatePrices.js
exports.handler = async function(event, context) {
    // Log the event type
    console.log('Event type:', event.type);
    console.log('Is scheduled?:', !!event.isScheduled);
    
    try {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Function executed",
                timestamp: new Date().toISOString(),
                eventType: event.type,
                isScheduled: !!event.isScheduled
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
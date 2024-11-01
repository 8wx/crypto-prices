// netlify/functions/updatePrices.js
exports.handler = async function(event, context) {
    console.log('Event:', event); // Log the entire event object
    console.log('Context:', context); // Log the entire context object
    
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
        console.error('Error:', error); // Log the error
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};

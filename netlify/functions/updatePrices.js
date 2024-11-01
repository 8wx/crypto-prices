// netlify/functions/updatePrices.js
exports.handler = async function (req) {
    // Handle the request for a scheduled function
    const { next_run } = await req.json(); // Extract next_run from the request body

    console.log("Received event! Next invocation at:", next_run); // Log the next scheduled run time

    try {
        // Here you can implement your price update logic

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Function executed successfully",
                nextRun: next_run,
                timestamp: new Date().toISOString()
            }),
        };
    } catch (error) {
        console.error('Error:', error); // Log any errors
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

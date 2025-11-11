exports.handler = async (event, context) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        
        // List available models
        const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const listData = await listResponse.json();
        
        console.log('Available models:', JSON.stringify(listData, null, 2));
        
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                success: true, 
                models: listData.models || listData,
                fullResponse: listData
            }),
        };

    } catch (error) {
        console.error('List models error:', error.message);
        
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                success: false, 
                error: error.message,
                stack: error.stack
            }),
        };
    }
};
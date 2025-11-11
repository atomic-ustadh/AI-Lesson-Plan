const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async (event, context) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        console.log('API Key exists:', !!apiKey);
        console.log('API Key length:', apiKey ? apiKey.length : 0);
        console.log('API Key starts with:', apiKey ? apiKey.substring(0, 10) + '...' : 'N/A');
        
        if (!apiKey) {
            throw new Error('Gemini API key not configured');
        }

        console.log('Initializing GoogleGenerativeAI...');
        const genAI = new GoogleGenerativeAI(apiKey);
        
        console.log('Getting model...');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        console.log('Generating content...');
        const result = await model.generateContent('Hello');
        console.log('Getting response...');
        const response = await result.response;
        console.log('Getting text...');
        const text = response.text();
        
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                success: true, 
                message: 'API working',
                response: text 
            }),
        };

    } catch (error) {
        console.error('Full error details:', {
            message: error.message,
            stack: error.stack,
            status: error.status,
            statusText: error.statusText
        });
        
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                success: false, 
                error: error.message,
                stack: error.stack,
                details: {
                    status: error.status,
                    statusText: error.statusText
                }
            }),
        };
    }
};
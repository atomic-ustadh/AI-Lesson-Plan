const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async (event, context) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Try to list models or use the most basic working model
        console.log('Testing basic model initialization...');
        
        // Based on the error, let's try the model that should work with v1beta API
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        const result = await model.generateContent('Hello, respond with "Working"');
        const response = await result.response;
        const text = response.text();
        
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                success: true, 
                message: 'Model working',
                model: 'gemini-pro',
                response: text 
            }),
        };

    } catch (error) {
        console.error('Model test error:', error.message);
        
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                success: false, 
                error: error.message,
                status: error.status,
                statusText: error.statusText
            }),
        };
    }
};
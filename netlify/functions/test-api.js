const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async (event, context) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('Gemini API key not configured');
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Test basic connectivity
        console.log('Testing Gemini API connectivity...');
        
        // Try to get model info
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        // Simple test prompt
        const testResult = await model.generateContent('Hello, can you respond with just "API working"?');
        const response = await testResult.response;
        const text = response.text();
        
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                success: true, 
                message: 'API test successful',
                response: text,
                model: 'gemini-1.5-flash'
            }),
        };

    } catch (error) {
        console.error('Test Error:', error);
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
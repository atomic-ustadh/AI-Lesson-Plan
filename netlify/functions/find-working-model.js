const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async (event, context) => {
    const models = [
        'gemini-1.5-flash',
        'gemini-1.5-flash-8b',
        'gemini-1.5-flash-002',
        'gemini-1.5-pro',
        'gemini-1.5-pro-002',
        'gemini-pro',
        'gemini-pro-vision'
    ];

    const results = [];

    for (const modelName of models) {
        try {
            const apiKey = process.env.GEMINI_API_KEY;
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: modelName });
            
            // Simple test
            const testResult = await model.generateContent('Test');
            const response = await testResult.response;
            const text = response.text();
            
            results.push({
                model: modelName,
                status: 'SUCCESS',
                response: text.substring(0, 50)
            });
            
            console.log(`✓ ${modelName} works`);
            break; // Stop at first successful model
            
        } catch (error) {
            results.push({
                model: modelName,
                status: 'FAILED',
                error: error.message
            });
            
            console.log(`✗ ${modelName} failed: ${error.message}`);
        }
    }

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results }),
    };
};
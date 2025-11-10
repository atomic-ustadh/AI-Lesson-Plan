const { GoogleGenerativeAI } = require('@google/generative-ai');

// CORS headers
const HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
};

exports.handler = async (event, context) => {
    // Handle pre-flight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: HEADERS,
            body: '',
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: HEADERS,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    try {
        // Validate API key
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('Gemini API key not configured');
        }

        // Parse request body
        const { subject, topic, classLevel } = JSON.parse(event.body);
        
        if (!subject || !topic || !classLevel) {
            return {
                statusCode: 400,
                headers: HEADERS,
                body: JSON.stringify({ error: 'Missing required fields: subject, topic, classLevel' }),
            };
        }

        // Initialize Gemini AI
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Craft detailed prompt for structured output
        const prompt = `
You are an expert curriculum designer and educator. Based on the following information, create a comprehensive lesson plan:

Subject: ${subject}
Topic: ${topic}
Class/Grade Level: ${classLevel}

Generate the following content and return it as a valid JSON object with these exact keys:
- "subject": the subject name (string)
- "topic": the topic name (string) 
- "behavioralObjectives": an array of exactly 3 specific, measurable behavioral objectives (array of strings)
- "summary": a comprehensive 2-3 paragraph lesson summary (string)

Requirements for behavioral objectives:
- Each objective must start with an action verb (e.g., "Students will be able to...", "Learners will...")
- Objectives should be specific and measurable
- Objectives should be appropriate for the ${classLevel} level
- Each objective should be concise but complete

Requirements for summary:
- Include key concepts to be covered
- Suggest teaching methods and activities
- Mention assessment approaches
- Should be 2-3 paragraphs total

IMPORTANT: Return ONLY the JSON object. Do not include any explanatory text, markdown formatting, or code blocks. The response must be valid JSON that can be parsed directly.

Example format:
{"subject": "Mathematics", "topic": "Fractions", "behavioralObjectives": ["Students will be able to identify proper and improper fractions", "Students will be able to convert mixed numbers to improper fractions", "Students will be able to add fractions with like denominators"], "summary": "This lesson introduces students to the concept of fractions..."}
`;

        // Generate content with Gemini
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean and parse JSON response
        let cleanedText = text.trim();
        
        // Remove any markdown code blocks if present
        if (cleanedText.startsWith('```json')) {
            cleanedText = cleanedText.replace(/```json\n?/, '').replace(/```\n?$/, '');
        } else if (cleanedText.startsWith('```')) {
            cleanedText = cleanedText.replace(/```\n?/, '').replace(/```\n?$/, '');
        }

        // Parse JSON
        const generatedData = JSON.parse(cleanedText);

        // Validate response structure
        if (!generatedData.behavioralObjectives || !Array.isArray(generatedData.behavioralObjectives)) {
            throw new Error('Invalid response: behavioralObjectives must be an array');
        }

        if (generatedData.behavioralObjectives.length !== 3) {
            throw new Error('Invalid response: behavioralObjectives must contain exactly 3 objectives');
        }

        // Return successful response
        return {
            statusCode: 200,
            headers: HEADERS,
            body: JSON.stringify(generatedData),
        };

    } catch (error) {
        console.error('AI Function Error:', error);
        
        // Return detailed error information
        return {
            statusCode: 500,
            headers: HEADERS,
            body: JSON.stringify({ 
                error: 'Failed to generate lesson plan', 
                details: error.message 
            }),
        };
    }
};
# AI Lesson Plan Generator

A web application that generates comprehensive lesson plans using Google's Gemini AI and Netlify Functions.

## Features

- 🤖 AI-powered lesson plan generation
- 📝 Structured output with behavioral objectives and summaries
- 🎨 Responsive, modern UI design
- ✏️ Edit and regenerate functionality
- 🔒 Secure API key handling
- 📱 Mobile-friendly interface

## Quick Start

### 1. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Local Development

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your API key:
   ```bash
   cp .env.example .env
   # Edit .env and replace 'your_gemini_api_key_here' with your actual API key
   ```

4. Start local development server:
   ```bash
   npx netlify dev
   ```

5. Open your browser to `http://localhost:8888`

### 3. Deployment to Netlify

1. Push your code to a GitHub repository
2. Connect your repo to Netlify
3. Set environment variable in Netlify dashboard:
   - Go to Site settings → Build & deploy → Environment
   - Add variable: `GEMINI_API_KEY` with your API key
4. Deploy!

## Usage

1. Fill in the Subject, Topic, and Class Level fields
2. Click "Generate Lesson Plan"
3. Review the generated behavioral objectives and summary
4. Edit if needed, then save your lesson plan

## Project Structure

```
├── index.html              # Main HTML file
├── style.css               # Styling and responsive design
├── script.js               # Frontend JavaScript logic
├── netlify/
│   └── functions/
│       └── generate-lesson.js  # Backend Netlify Function
├── package.json            # Node.js dependencies
├── netlify.toml           # Netlify configuration
├── .env.example           # Environment variables template
└── README.md              # This file
```

## API Endpoints

- `POST /.netlify/functions/generate-lesson` - Generate lesson plan

**Request Body:**
```json
{
  "subject": "Mathematics",
  "topic": "Fractions", 
  "classLevel": "Grade 5"
}
```

**Response:**
```json
{
  "subject": "Mathematics",
  "topic": "Fractions",
  "behavioralObjectives": [
    "Students will be able to identify proper and improper fractions",
    "Students will be able to convert mixed numbers to improper fractions", 
    "Students will be able to add fractions with like denominators"
  ],
  "summary": "This lesson introduces students to the concept of fractions..."
}
```

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Netlify Functions (Node.js)
- **AI**: Google Gemini API
- **Styling**: CSS Grid, Flexbox, CSS Variables
- **Deployment**: Netlify

## Security Notes

- ✅ API keys are stored securely in environment variables
- ✅ No sensitive data is exposed to the frontend
- ✅ CORS headers are properly configured
- ✅ Input validation on both frontend and backend

## Troubleshooting

### Common Issues

1. **"Gemini API key not configured"**
   - Make sure your `.env` file contains the correct API key
   - For production, ensure the environment variable is set in Netlify dashboard

2. **"Failed to generate lesson plan"**
   - Check your internet connection
   - Verify your Gemini API key is valid
   - Check Netlify function logs for detailed error messages

3. **CORS errors**
   - Ensure your function includes proper CORS headers
   - Check that your frontend is making requests to the correct URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.
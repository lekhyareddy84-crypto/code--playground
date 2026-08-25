# Code Playground / Code Analyzer
A web-based code editor that lets users write and run code in Python, JavaScript, Java, C, C++, and Ruby.

## Features

- Code editor with multiple programming languages
- Run code and view output
- Optional standard input
- Code execution history
- AI code analysis
- Dark responsive interface

A MERN-style web IDE based on the uploaded project report:
- React frontend
- Node.js + Express backend
- Judge0 for multi-language execution
- Perplexity-compatible AI analysis endpoint
- MongoDB-ready architecture
- Code history
- Dark responsive interface

## Requirements
- Node.js 18+
- Judge0 RapidAPI key
- Perplexity API key (optional; AI analysis can be disabled)

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Add API keys to .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## API
- GET `/api/health`
- POST `/api/execute`
- POST `/api/analyze`
- GET `/api/history`
- POST `/api/history`

## Security
Never expose API keys in frontend code. Store them in backend environment variables.

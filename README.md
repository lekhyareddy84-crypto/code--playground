# Code Playground / Code Analyzer

A web-based editor for writing and executing Python, JavaScript, Java, C, C++, and Ruby programs. It also supports optional AI code analysis and execution history.

## Features

- Multi-language Monaco code editor
- Standard-input field and output panel
- Judge0-powered code execution
- Optional Perplexity-compatible AI code review
- Execution history stored in MongoDB or temporary memory storage
- Responsive dark interface

## Technology

- React and Vite frontend
- Node.js and Express backend
- MongoDB and Mongoose (optional)
- Judge0 CE API for code execution

## Requirements

- Node.js 18 or later
- Ollama with the `llama3.2` model (optional, for AI analysis)
- MongoDB connection string (optional, for persistent history)

## Setup

### Backend
```bash
cd backend
npm.cmd install
```

Create `backend/.env` and add the following values:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
# Optional: override the public Judge0 CE endpoint
JUDGE0_API_URL=https://ce.judge0.com

# Optional: enables local AI analysis through Ollama
OLLAMA_API_URL=http://127.0.0.1:11434/api/chat
OLLAMA_MODEL=llama3.2

# Optional: enables persistent history
MONGODB_URI=your_mongodb_connection_string
```

Start the backend:

```powershell
npm.cmd run dev
```


### 2. Start the frontend

In the second terminal:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1. Start both the backend and frontend.
2. Choose a language from the selector.
3. Write or edit the code in the editor.
4. Enter optional standard input.
5. Click **Run Code** to execute it.
6. Click **Analyze Code** to receive AI feedback when configured.

## API
- GET `/api/health`
- POST `/api/execute`
- POST `/api/analyze`
- GET `/api/history`
- POST `/api/history`

## Security

Never commit or upload `backend/.env`. Keep API keys only in backend environment variables, and ensure `.gitignore` includes `.env` and `node_modules/`.

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
- An active Judge0 CE RapidAPI subscription and API key
- Perplexity API key (optional, for AI analysis)
- MongoDB connection string (optional, for persistent history)

## Setup


Open two terminals in the project folder.

### 1. Configure the backend

```powershell
cd backend
npm.cmd install
```

Create `backend/.env` and add the following values:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
JUDGE0_API_KEY=your_rapidapi_key
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_HOST=judge0-ce.p.rapidapi.com

# Optional: enables AI analysis
PERPLEXITY_API_KEY=your_perplexity_api_key
PERPLEXITY_API_URL=https://api.perplexity.ai/chat/completions
PERPLEXITY_MODEL=sonar

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
- `GET /api/health`
- `POST /api/execute`
- `POST /api/analyze`
- `GET /api/history`
- `POST /api/history`

## Notes

- Judge0 returns “You are not subscribed to this API” until the RapidAPI account associated with `JUDGE0_API_KEY` has an active Judge0 CE subscription.
- If MongoDB is unavailable, history is kept in memory and is cleared when the backend restarts.

## Security

Never commit or upload `backend/.env`. Keep API keys only in backend environment variables, and ensure `.gitignore` includes `.env` and `node_modules/`.

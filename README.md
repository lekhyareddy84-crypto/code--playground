# 💻 Code Playground

An AI-powered online code playground where users can write, execute, and analyze programming code directly from their browser.

## 🌐 Live Project

🚀 **Try the project here:**

👉 https://code-playground-iota-jade.vercel.app

## 🔗 Project Links

- **Live Project:** https://code-playground-iota-jade.vercel.app
- **Backend API:** https://code-playground-44e6.onrender.com
- **GitHub Repository:** https://github.com/lekhyareddy84-crypto/code--playground

## ✨ Features

- 📝 Online code editor
- 💻 Monaco Editor
- ▶️ Code execution
- 🤖 AI-powered code analysis using Google Gemini
- 🔍 Syntax error detection
- 🧠 Logical error analysis
- ⏱️ Time complexity analysis
- 💾 Space complexity analysis
- 🚀 Code optimization suggestions
- 📚 Code history
- 🌐 Publicly accessible online

## 🛠️ Technologies Used

### Frontend

- React
- Vite
- Monaco Editor
- JavaScript

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

Open https://code-playground-iota-jade.vercel.app/ in your browser.

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

import React, { useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const languages = {
  Python: { id: 71, monaco: "python", starter: `def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))` },
  JavaScript: { id: 63, monaco: "javascript", starter: `function greet(name) {\n  return \`Hello, \${name}!\`;\n}\n\nconsole.log(greet("World"));` },
  Java: { id: 62, monaco: "java", starter: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}` },
  C: { id: 50, monaco: "c", starter: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}` },
  "C++": { id: 54, monaco: "cpp", starter: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!";\n    return 0;\n}` },
  Ruby: { id: 72, monaco: "ruby", starter: `def greet(name)\n  "Hello, #{name}!"\nend\n\nputs greet("World")` }
};

function App() {
  const [language, setLanguage] = useState("Python");
  const [code, setCode] = useState(languages.Python.starter);
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [activeTab, setActiveTab] = useState("output");
  const [running, setRunning] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");

  const languageConfig = useMemo(() => languages[language], [language]);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const response = await fetch(`${API}/history`);
      const data = await response.json();
      if (Array.isArray(data)) setHistory(data);
    } catch {
      // Backend may not be running yet.
    }
  }

  function changeLanguage(value) {
    setLanguage(value);
    setCode(languages[value].starter);
    setOutput("");
    setAnalysis("");
  }

  async function runCode() {
    setRunning(true);
    setMessage("");
    setActiveTab("output");

    try {
      const response = await fetch(`${API}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          stdin
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setOutput(data.error || "Execution failed.");
        return;
      }

      const text =
        data.stderr ||
        data.compile_output ||
        data.stdout ||
        "Program executed successfully.";

      setOutput(
        `${text}\n\nStatus: ${data.status || "Unknown"}${
          data.time ? `\nTime: ${data.time}s` : ""
        }${data.memory ? `\nMemory: ${data.memory} KB` : ""}`
      );

      await saveHistory(text, "");
    } catch (error) {
      setOutput(`Cannot connect to backend.\n\n${error.message}`);
    } finally {
      setRunning(false);
    }
  }

  async function analyzeCode() {
    setAnalyzing(true);
    setActiveTab("analysis");
    setAnalysis("");

    try {
      const response = await fetch(`${API}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language })
      });

      const data = await response.json();

      if (!response.ok) {
        setAnalysis(data.error || "Analysis failed.");
        return;
      }

      setAnalysis(data.analysis || "No analysis returned.");
    } catch (error) {
      setAnalysis(`Cannot connect to backend.\n\n${error.message}`);
    } finally {
      setAnalyzing(false);
    }
  }

  async function saveHistory(savedOutput = output, savedAnalysis = analysis) {
    try {
      await fetch(`${API}/history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          code,
          stdin,
          output: savedOutput,
          analysis: savedAnalysis
        })
      });
      loadHistory();
    } catch {
      // History is optional if backend/database is unavailable.
    }
  }

  function loadItem(item) {
    setLanguage(item.language);
    setCode(item.code);
    setStdin(item.stdin || "");
    setOutput(item.output || "");
    setAnalysis(item.analysis || "");
    setActiveTab("output");
    setMessage("History item loaded.");
  }

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <div className="brand">Code Playground</div>
          <div className="subtitle">Online IDE · Execute · Analyze · Learn</div>
        </div>

        <div className="top-actions">
          <button className="ghost" onClick={loadHistory}>↻ History</button>
          <select value={language} onChange={(e) => changeLanguage(e.target.value)}>
            {Object.keys(languages).map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <div className="side-title">WORKSPACE</div>
          <button className="side-active">⌘ Code Editor</button>
          <button>▶ Executions</button>
          <button>◈ AI Analysis</button>

          <div className="side-title history-title">RECENT CODE</div>

          <div className="history">
            {history.length === 0 ? (
              <div className="empty-history">No saved executions yet.</div>
            ) : (
              history.map((item) => (
                <button
                  className="history-item"
                  key={item._id || item.createdAt}
                  onClick={() => loadItem(item)}
                >
                  <strong>{item.language}</strong>
                  <span>{new Date(item.createdAt).toLocaleString()}</span>
                </button>
              ))
            )}
          </div>
        </aside>

        <main className="main">
          <div className="toolbar">
            <div className="file-name">main.{language === "Python" ? "py" : language === "JavaScript" ? "js" : language === "Java" ? "java" : language === "Ruby" ? "rb" : language === "C++" ? "cpp" : "c"}</div>

            <div className="toolbar-actions">
              <button className="secondary" onClick={() => setCode(languageConfig.starter)}>
                Reset
              </button>
              <button className="ai" onClick={analyzeCode} disabled={analyzing}>
                {analyzing ? "Analyzing..." : "✦ Analyze Code"}
              </button>
              <button className="run" onClick={runCode} disabled={running}>
                {running ? "Running..." : "▶ Run Code"}
              </button>
            </div>
          </div>

          <section className="editor-card">
            <Editor
              height="58vh"
              theme="vs-dark"
              language={languageConfig.monaco}
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 15,
                automaticLayout: true,
                padding: { top: 16 },
                scrollBeyondLastLine: false
              }}
            />
          </section>

          <section className="input-card">
            <div className="section-heading">
              <span>Standard Input</span>
              <small>Optional program input</small>
            </div>
            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Enter input here..."
            />
          </section>

          <section className="results-card">
            <div className="tabs">
              <button
                className={activeTab === "output" ? "tab active" : "tab"}
                onClick={() => setActiveTab("output")}
              >
                Output
              </button>
              <button
                className={activeTab === "analysis" ? "tab active" : "tab"}
                onClick={() => setActiveTab("analysis")}
              >
                AI Analysis
              </button>
            </div>

            <div className="result-content">
              {activeTab === "output" ? (
                <pre>{output || "Run your program to see output here."}</pre>
              ) : (
                <pre>{analysis || "Analyze your code to receive AI-powered feedback."}</pre>
              )}
            </div>
          </section>

          {message && <div className="toast">{message}</div>}
        </main>
      </div>
    </div>
  );
}

export default App;

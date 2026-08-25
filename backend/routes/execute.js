import { Router } from "express";

const router = Router();

const LANGUAGE_IDS = {
  Python: 71,
  JavaScript: 63,
  Java: 62,
  C: 50,
  "C++": 54,
  Ruby: 72
};

router.post("/", async (req, res) => {
  try {
    const { code, language, stdin = "" } = req.body;

    if (!code?.trim()) {
      return res.status(400).json({ error: "Code is required." });
    }

    const languageId = LANGUAGE_IDS[language];

    if (!languageId) {
      return res.status(400).json({ error: "Unsupported language." });
    }

    if (!process.env.JUDGE0_API_KEY) {
      return res.status(503).json({
        error: "Judge0 API key is not configured.",
        hint: "Add JUDGE0_API_KEY to backend/.env"
      });
    }

    const base = process.env.JUDGE0_API_URL || "https://judge0-ce.p.rapidapi.com";

    const response = await fetch(
      `${base}/submissions?base64_encoded=false&wait=true`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-key": process.env.JUDGE0_API_KEY,
          "x-rapidapi-host":
            process.env.JUDGE0_API_HOST || "judge0-ce.p.rapidapi.com"
        },
        body: JSON.stringify({
          source_code: code,
          language_id: languageId,
          stdin
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.message || "Judge0 execution failed.",
        details: data
      });
    }

    res.json({
      stdout: data.stdout || "",
      stderr: data.stderr || "",
      compile_output: data.compile_output || "",
      status: data.status?.description || "Unknown",
      time: data.time,
      memory: data.memory
    });
  } catch (error) {
    res.status(500).json({
      error: "Execution service failed.",
      details: error.message
    });
  }
});

export default router;

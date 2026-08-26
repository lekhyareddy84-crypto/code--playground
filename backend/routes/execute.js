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

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

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

    const base = process.env.JUDGE0_API_URL || "https://ce.judge0.com";

    const submissionResponse = await fetch(
      `${base}/submissions?base64_encoded=false&wait=false`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          source_code: code,
          language_id: languageId,
          stdin
        })
      }
    );

    const submission = await submissionResponse.json();

    if (!submissionResponse.ok || !submission.token) {
      return res.status(submissionResponse.status || 502).json({
        error: submission?.message || "Judge0 submission failed.",
        details: submission
      });
    }

    let result;

    for (let attempt = 0; attempt < 20; attempt += 1) {
      await delay(300);
      const resultResponse = await fetch(
        `${base}/submissions/${submission.token}?base64_encoded=false`
      );
      result = await resultResponse.json();

      if (!resultResponse.ok) {
        return res.status(resultResponse.status).json({
          error: result?.message || "Judge0 result lookup failed.",
          details: result
        });
      }

      if (![1, 2].includes(result?.status?.id)) break;
    }

    res.json({
      stdout: result?.stdout || "",
      stderr: result?.stderr || "",
      compile_output: result?.compile_output || "",
      status: result?.status?.description || "Processing",
      time: result?.time,
      memory: result?.memory
    });
  } catch (error) {
    res.status(500).json({
      error: "Execution service failed.",
      details: error.message
    });
  }
});

export default router;

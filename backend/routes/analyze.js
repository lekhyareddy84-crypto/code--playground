import { Router } from "express";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code?.trim()) {
      return res.status(400).json({ error: "Code is required." });
    }

    const prompt = `
Review this ${language} program.

Return a clear report with:
1. What the code does
2. Syntax errors, if any
3. Logical errors, if any
4. Time complexity
5. Space complexity
6. Optimization suggestions
7. Readability suggestions
8. Improved code only if useful

Code:
${code}
`;

    const response = await fetch(
      process.env.OLLAMA_API_URL || "http://127.0.0.1:11434/api/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: process.env.OLLAMA_MODEL || "llama3.2",
          stream: false,
          messages: [
            {
              role: "system",
              content: "You are an expert programming code reviewer."
            },
            { role: "user", content: prompt }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Ollama returned an error.",
        details: data
      });
    }

    res.json({
      analysis: data?.message?.content || "No analysis was returned."
    });
  } catch (error) {
    res.status(500).json({
      error: "AI analysis failed.",
      details: error.message
    });
  }
});

export default router;

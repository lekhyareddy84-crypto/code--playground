import { Router } from "express";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code?.trim()) {
      return res.status(400).json({ error: "Code is required." });
    }

    if (!process.env.PERPLEXITY_API_KEY) {
      return res.status(503).json({
        error: "AI analysis is not configured.",
        hint: "Add PERPLEXITY_API_KEY to backend/.env"
      });
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
      process.env.PERPLEXITY_API_URL ||
        "https://api.perplexity.ai/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`
        },
        body: JSON.stringify({
          model: process.env.PERPLEXITY_MODEL || "sonar",
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
        error: "AI provider returned an error.",
        details: data
      });
    }

    res.json({
      analysis:
        data?.choices?.[0]?.message?.content ||
        "No analysis was returned."
    });
  } catch (error) {
    res.status(500).json({
      error: "AI analysis failed.",
      details: error.message
    });
  }
});

export default router;

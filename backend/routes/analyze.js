import { Router } from "express";
import { GoogleGenAI } from "@google/genai";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code?.trim()) {
      return res.status(400).json({
        error: "Code is required."
      });
    }

    // Check whether Vercel/local environment has the key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is missing."
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const prompt = `
You are an expert programming code reviewer.

Review this ${language || "programming"} program.

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

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt
    });

    res.json({
      analysis: response.text || "No analysis was returned."
    });

  } catch (error) {
    console.error("FULL GEMINI ERROR:", error);

    res.status(500).json({
      error: "Gemini AI analysis failed.",
      details: error?.message || String(error)
    });
  }
});

export default router;
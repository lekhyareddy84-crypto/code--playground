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

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "Gemini API key is missing."
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

    const models = [
      "gemini-3.5-flash-lite",
      "gemini-3.6-flash"
    ];

    let response = null;
    let lastError = null;

    for (const model of models) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          console.log(
            `Trying Gemini model: ${model}, attempt ${attempt}`
          );

          response = await ai.models.generateContent({
            model: model,
            contents: prompt
          });

          if (response?.text) {
            console.log(
              `Gemini succeeded with model: ${model}`
            );

            break;
          }

        } catch (error) {
          lastError = error;

          console.error(
            `Gemini model ${model}, attempt ${attempt} failed:`,
            error?.message || error
          );

          if (attempt < 2) {
            await new Promise(resolve =>
              setTimeout(resolve, 1500)
            );
          }
        }
      }

      if (response?.text) {
        break;
      }
    }

    if (!response?.text) {
      throw lastError || new Error(
        "Gemini returned no response."
      );
    }

    res.json({
      analysis: response.text
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
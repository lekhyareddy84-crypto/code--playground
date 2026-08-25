import { Router } from "express";
import CodeHistory from "../models/CodeHistory.js";

const router = Router();

const memoryHistory = [];

router.get("/", async (req, res) => {
  try {
    if (CodeHistory.db.readyState === 1) {
      const rows = await CodeHistory.find()
        .sort({ createdAt: -1 })
        .limit(50);
      return res.json(rows);
    }

    res.json(memoryHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const item = {
      language: req.body.language,
      code: req.body.code,
      stdin: req.body.stdin || "",
      output: req.body.output || "",
      analysis: req.body.analysis || "",
      status: req.body.status || "completed"
    };

    if (!item.language || !item.code) {
      return res.status(400).json({
        error: "language and code are required."
      });
    }

    if (CodeHistory.db.readyState === 1) {
      const saved = await CodeHistory.create(item);
      return res.status(201).json(saved);
    }

    const saved = {
      ...item,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    memoryHistory.unshift(saved);
    memoryHistory.splice(50);

    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

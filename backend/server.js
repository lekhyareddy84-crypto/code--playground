import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import executeRouter from "./routes/execute.js";
import analyzeRouter from "./routes/analyze.js";
import historyRouter from "./routes/history.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "Code Playground API" });
});

app.use("/api/execute", executeRouter);
app.use("/api/analyze", analyzeRouter);
app.use("/api/history", historyRouter);

const PORT = process.env.PORT || 5000;

async function start() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("MongoDB connected");
    } catch (error) {
      console.warn("MongoDB unavailable. History will use memory storage.");
    }
  }

  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

start();

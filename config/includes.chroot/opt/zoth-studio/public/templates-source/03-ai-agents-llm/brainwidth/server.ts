import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Initialize Database
const db = new Database("usage.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS usage (
    ip TEXT PRIMARY KEY,
    last_used_at INTEGER
  )
`);

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenAI({ apiKey: apiKey || "" });

app.use(express.json());

// Rate Limiting Middleware
const checkRateLimit = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  const row = db.prepare("SELECT last_used_at FROM usage WHERE ip = ?").get(ip) as { last_used_at: number } | undefined;

  if (row && now - row.last_used_at < oneDay) {
    return res.status(429).json({
      error: "Rate limit exceeded",
      message: "You can only use the AI features once per day. Join our waitlist for unlimited access!",
      limitReached: true
    });
  }

  next();
};

const updateUsage = (ip: string | string[] | undefined) => {
  const clientIp = ip || "unknown";
  db.prepare("INSERT OR REPLACE INTO usage (ip, last_used_at) VALUES (?, ?)").run(clientIp, Date.now());
};

// API Routes
app.post("/api/ai/parse-voice", checkRateLimit, async (req, res) => {
  const { transcript } = req.body;
  if (!apiKey) return res.status(500).json({ error: "Gemini API key not configured on server" });

  try {
    const model = "gemini-3-flash-preview";
    const response = await genAI.models.generateContent({
      model,
      contents: `Extract task details from this voice transcript: "${transcript}".
      
      Rules:
      - Category must be one of: 'Deep Work', 'Shallow Work', 'Meetings', 'Learning', 'Personal', 'Admin'.
      - Recurrence must be one of: 'none', 'daily', 'weekly', 'monthly'.
      - Duration is in minutes (default 60 if not mentioned).
      - BandwidthScore is 1-10 (1: low effort, 10: extreme focus).
      
      Return a JSON object.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            duration: { type: Type.NUMBER },
            recurrence: { type: Type.STRING },
            bandwidthScore: { type: Type.NUMBER }
          },
          required: ["title", "description", "category", "duration", "recurrence", "bandwidthScore"]
        },
      },
    });

    updateUsage(req.ip || req.headers["x-forwarded-for"]);
    res.json(JSON.parse(response.text));
  } catch (error) {
    console.error("Gemini Proxy Error:", error);
    res.status(500).json({ error: "Failed to process AI request" });
  }
});

app.post("/api/ai/insights", checkRateLimit, async (req, res) => {
  const { tasks } = req.body;
  if (!apiKey) return res.status(500).json({ error: "Gemini API key not configured on server" });

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze these tasks and provide a 2-sentence briefing on cognitive load: ${JSON.stringify(tasks)}. Focus on peak load times and energy management.`,
    });

    updateUsage(req.ip || req.headers["x-forwarded-for"]);
    res.json({ text: response.text });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate insights" });
  }
});

app.post("/api/ai/optimize", checkRateLimit, async (req, res) => {
  const { tasks } = req.body;
  if (!apiKey) return res.status(500).json({ error: "Gemini API key not configured on server" });

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Look at this schedule and suggest 3 specific changes to better balance cognitive load (Brain Bandwidth): ${JSON.stringify(tasks)}. Be concise.`,
    });

    updateUsage(req.ip || req.headers["x-forwarded-for"]);
    res.json({ text: response.text });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate optimization suggestions" });
  }
});

// Vite middleware
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

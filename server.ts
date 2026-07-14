import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { processTriageRequest } from "./server/triage.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Triage Endpoint
  app.post("/api/triage", async (req, res) => {
    try {
      const { messages, petProfile, previousUrgencies } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is not configured." });
      }

      const response = await processTriageRequest(messages, petProfile, previousUrgencies || []);
      res.json(response);
    } catch (error: any) {
      console.error("Error in AI triage:", error);
      res.status(500).json({ error: error.message || "Failed to generate response." });
    }
  });

  // Vite middleware for development
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
}

startServer();

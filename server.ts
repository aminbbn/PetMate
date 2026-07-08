import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Triage Endpoint
  app.post("/api/triage", async (req, res) => {
    try {
      const { messages, petProfile } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key is not configured." });
      }

      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `You are the AI Assistant for 'Pet Mate', an app for Iranian pet owners.
You MUST reply entirely in Farsi (Persian).
You act as a warm, caring, and encouraging friend.
The user's pet:
- Name: ${petProfile?.name || "the pet"}
- Type: ${petProfile?.type || "unknown"}
- Breed: ${petProfile?.breed || "unknown"}
- Age: ${petProfile?.age || "unknown"}

Guidelines:
1. Provide helpful guidance but NEVER give definitive medical diagnoses.
2. If something seems urgent, clearly recommend seeing a vet (do not soft-pedal it).
3. Do not prescribe medications.
4. Keep the tone warm, soft, and slightly playful.
5. End your response by categorizing the urgency. The LAST line of your response MUST be one of:
[URGENCY: SUCCESS] - Everything is fine / normal / healthy.
[URGENCY: CAUTION] - Home care is likely fine, keep an eye on it.
[URGENCY: ALERT] - Needs a vet visit.`;

      const formattedMessages = messages.map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: formattedMessages,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.4,
        },
      });

      const responseText = response.text;
      
      let urgency = "CAUTION";
      let content = responseText;
      
      if (responseText) {
        if (responseText.includes("[URGENCY: SUCCESS]")) {
          urgency = "SUCCESS";
          content = responseText.replace("[URGENCY: SUCCESS]", "").trim();
        } else if (responseText.includes("[URGENCY: CAUTION]")) {
          urgency = "CAUTION";
          content = responseText.replace("[URGENCY: CAUTION]", "").trim();
        } else if (responseText.includes("[URGENCY: ALERT]")) {
          urgency = "ALERT";
          content = responseText.replace("[URGENCY: ALERT]", "").trim();
        }
      }

      res.json({ content, urgency });
    } catch (error) {
      console.error("Error in AI triage:", error);
      res.status(500).json({ error: "Failed to generate response." });
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

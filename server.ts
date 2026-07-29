import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load from .env.local if exists
dotenv.config({ path: ".env.local" });
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON (increased limit for base64 audio/video)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// API Route: AI Writer
app.post("/api/ai-writer", async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Tulis artikel informatif sekitar 500 kata tentang: ${prompt}. Gunakan bahasa yang baik dan mudah dipahami.`,
    });
    res.json({ text: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// API Route: Grammar Checker
app.post("/api/grammar-checker", async (req, res) => {
  try {
    const { text } = req.body;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Tolong periksa dan perbaiki tata bahasa (grammar) dari teks berikut. Berikan teks yang sudah diperbaiki, lalu berikan penjelasan singkat tentang apa saja yang diperbaiki.\n\nTeks Asli:\n${text}`,
    });
    res.json({ text: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// API Route: Paraphraser
app.post("/api/paraphraser", async (req, res) => {
  try {
    const { text } = req.body;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Buat 3 versi parafrase yang berbeda (Formal, Santai, Kreatif) dari teks berikut. Pisahkan tiap versi dengan jelas.\n\nTeks:\n${text}`,
    });
    res.json({ text: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// API Route: Translator
app.post("/api/translator", async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Terjemahkan teks berikut ke dalam bahasa ${targetLanguage}. Berikan hanya hasil terjemahannya saja tanpa penjelasan lain.\n\nTeks:\n${text}`,
    });
    res.json({ text: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// API Route: Subtitle Generator
app.post("/api/subtitle-generator", async (req, res) => {
  try {
    const { base64Data, mimeType } = req.body;
    
    // Convert base64 to buffer and extract only the data part if it has data URL scheme
    let cleanBase64 = base64Data;
    if (base64Data.includes(",")) {
      cleanBase64 = base64Data.split(",")[1];
    }
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: mimeType,
            data: cleanBase64
          }
        },
        "Tolong buatkan subtitle dalam format SRT (SubRip Subtitle) yang akurat berdasarkan percakapan/suara dalam media ini. Buat format waktunya seperti 00:00:01,000 --> 00:00:04,000."
      ],
    });
    res.json({ text: response.text });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
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
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

import http from "node:http";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { WebSocketServer, WebSocket } from "ws";
import { serverStore, SyncMutation } from "./serverStore";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const server = http.createServer(app);

  // Generous limit for high-res logo/gallery base64 payloads
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ extended: true, limit: "25mb" }));

  // WebSocket Server attached to the same HTTP server on path '/ws'
  const wss = new WebSocketServer({ server, path: "/ws" });
  const clients = new Set<WebSocket>();

  function broadcast(msg: any, excludeWs?: WebSocket) {
    const payload = typeof msg === "string" ? msg : JSON.stringify(msg);
    for (const client of clients) {
      if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
        try {
          client.send(payload);
        } catch (e) {
          console.warn("[WS Broadcast Error]", e);
        }
      }
    }
  }

  wss.on("connection", (ws, req) => {
    clients.add(ws);
    const ip = req.socket.remoteAddress || "unknown";
    console.log(`[WS] Device connected from ${ip}. Total connected: ${clients.size}`);

    // Send initial snapshot on connect
    ws.send(
      JSON.stringify({
        type: "sync:init",
        version: serverStore.getVersion(),
        lastUpdated: serverStore.getLastUpdated(),
        data: serverStore.getData(),
        connectedClients: clients.size,
      })
    );

    // Broadcast updated client count to all
    broadcast({
      type: "sync:clients_count",
      count: clients.size,
    });

    ws.on("message", (raw) => {
      try {
        const message = JSON.parse(raw.toString());
        if (message.type === "sync:mutation" && message.mutation) {
          const result = serverStore.applyMutation(message.mutation);
          if (result.success) {
            broadcast(
              {
                type: "sync:event",
                mutation: message.mutation,
                version: result.version,
                timestamp: new Date().toISOString(),
              },
              ws
            );
          }
        } else if (message.type === "ping") {
          ws.send(JSON.stringify({ type: "pong", timestamp: Date.now() }));
        }
      } catch (e) {
        console.warn("[WS] Error parsing message:", e);
      }
    });

    ws.on("close", () => {
      clients.delete(ws);
      console.log(`[WS] Device disconnected. Total connected: ${clients.size}`);
      broadcast({
        type: "sync:clients_count",
        count: clients.size,
      });
    });

    ws.on("error", (err) => {
      console.warn("[WS] Socket error:", err.message);
    });
  });

  // REST Synchronization Endpoints
  app.get("/api/sync/all", (_req, res) => {
    res.json({
      success: true,
      version: serverStore.getVersion(),
      lastUpdated: serverStore.getLastUpdated(),
      data: serverStore.getData(),
      connectedClients: clients.size,
    });
  });

  app.post("/api/sync/mutation", (req, res) => {
    const mutation = req.body as SyncMutation;
    if (!mutation || !mutation.type) {
      return res.status(400).json({ error: "Invalid mutation payload" });
    }

    const result = serverStore.applyMutation(mutation);
    if (result.success) {
      broadcast({
        type: "sync:event",
        mutation,
        version: result.version,
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      version: result.version,
      lastUpdated: serverStore.getLastUpdated(),
    });
  });

  app.post("/api/sync/bootstrap", (req, res) => {
    const initialData = req.body;
    const modified = serverStore.bootstrap(initialData);
    if (modified) {
      broadcast({
        type: "sync:init",
        version: serverStore.getVersion(),
        lastUpdated: serverStore.getLastUpdated(),
        data: serverStore.getData(),
        connectedClients: clients.size,
      });
    }

    res.json({
      success: true,
      bootstrapped: modified,
      version: serverStore.getVersion(),
    });
  });

  app.get("/api/sync/status", (_req, res) => {
    res.json({
      status: "ok",
      connectedClients: clients.size,
      version: serverStore.getVersion(),
      lastUpdated: serverStore.getLastUpdated(),
      isPopulated: serverStore.isPopulated(),
      tables: serverStore.getTableStats(),
    });
  });

  // Initialize Gemini AI client if API key is provided
  let aiClient: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.warn("Failed to initialize Gemini AI client:", err);
    }
  }

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", hospital: "Khair Hospital", timestamp: new Date().toISOString() });
  });

  // AI Assistant endpoint for Khair Hospital inquiry & symptom guidance
  app.post("/api/chat", async (req, res) => {
    const { message, history } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message string is required" });
    }

    if (!aiClient && process.env.GEMINI_API_KEY) {
      try {
        aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      } catch (e) {
        console.error("Gemini init error:", e);
      }
    }

    if (!aiClient) {
      // Fallback response when GEMINI_API_KEY is not configured
      return res.json({
        reply: `Welcome to Khair Hospital, Basti! 🏥\n\nI can assist you with:\n- OPD Timings: 8:00 AM to 8:00 PM (24x7 Emergency & ICU)\n- Departments: Cardiology, Orthopedics, Surgery, Gynecology, Pediatrics, ICU/NICU, Dialysis.\n- Doctor appointments & OPD schedule.\n- Emergency helpline: +91 94151 23456 / 05542 282828.\n\nHow can I help you today?`,
        fallback: true
      });
    }

    try {
      const systemPrompt = `You are Khair Care AI Assistant, the official virtual health desk for KHAIR HOSPITAL located in Basti, Uttar Pradesh.
Khair Hospital is a premier multi-specialty 24x7 healthcare institute providing quality medical care.

Hospital Key Details:
- Location: Malviya Road / Basti Hospital Road, Basti, UP - 272001
- Emergency Helpline: +91 94151 23456 / +91 98390 12345 (24x7 Ambulance & Emergency)
- OPD Timings: Monday to Saturday 8:00 AM - 8:00 PM, Sunday 9:00 AM - 2:00 PM
- Major Departments: General & Laparoscopic Surgery, Cardiology, Orthopedics & Joint Replacement, Obstetrics & Gynecology, Pediatrics & NICU, Nephrology & Dialysis Unit, Neurology, ICU & Critical Care, Radiodiagnosis & CT Scan, Pathology.
- Facilities: 24x7 Emergency & Trauma Center, Modular Operation Theatre, Digital X-Ray, Ultrasound, 24x7 Pharmacy, Blood Storage Unit, Deluxe & ICU Beds.

Instructions:
1. Provide warm, respectful, professional, and clear answers.
2. If the user mentions medical symptoms, offer informative guidance on which department or specialist to consult (e.g., chest pain -> Cardiology / Emergency; joint pain -> Orthopedics), but emphasize that this is informational and urge them to consult Khair Hospital doctors or visit Emergency (+91 94151 23456) in urgent situations.
3. Keep answers concise, formatted with clear bullet points where applicable.`;

      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Understood. I am Khair Care AI Assistant, ready to assist patients with Khair Hospital services, OPD timings, doctors, and health guidance." }] }
      ];

      if (Array.isArray(history)) {
        for (const item of history) {
          if (item.sender === "user") {
            contents.push({ role: "user", parts: [{ text: item.text }] });
          } else if (item.sender === "bot") {
            contents.push({ role: "model", parts: [{ text: item.text }] });
          }
        }
      }

      contents.push({ role: "user", parts: [{ text: message }] });

      const response = await aiClient.models.generateContent({
        model: "gemini-3.6-flash",
        contents,
      });

      const replyText = response.text || "Thank you for contacting Khair Hospital. How else may I assist you?";
      return res.json({ reply: replyText });
    } catch (err: unknown) {
      console.error("Gemini API error:", err);
      return res.json({
        reply: "Thank you for reaching out to Khair Hospital. For immediate assistance or OPD appointment booking, please call our 24x7 helpline at +91 94151 23456 or visit our OPD desk.",
        error: true
      });
    }
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Khair Hospital server & live sync running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});

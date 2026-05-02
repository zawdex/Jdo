import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // API Proxy for Matches
  app.get("/api/matches", async (req, res) => {
    try {
      const response = await fetch("https://yalatt.playstoreapp.sbs/api/matches.php");
      if (!response.ok) throw new Error("Failed to fetch matches");
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Match Fetch Error:", error);
      res.status(500).json({ error: "Failed to fetch matches" });
    }
  });

  // API Proxy for Streams (Minimal obfuscation via redirect)
  app.get("/api/stream", (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).send("URL required");
    
    try {
      // Small layer of security: URL is expected to be base64 encoded from client
      const decodedUrl = Buffer.from(url as string, "base64").toString("utf-8");
      
      // Basic validation
      if (!decodedUrl.startsWith("http")) {
        return res.status(403).send("Invalid stream source");
      }

      // Redirect to the actual stream
      // Note: For true "hiding", we would need to fetch and pipe, 
      // but that requires complex header mapping for HLS/Segments.
      res.redirect(decodedUrl);
    } catch (e) {
      res.status(500).send("Error processing stream");
    }
  });

  // Vite development middleware
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
    console.log(`KickOff Server running at http://localhost:${PORT}`);
  });
}

startServer();

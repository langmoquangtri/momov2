import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file automatically if present
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  if (typeof process.loadEnvFile === "function") {
    try {
      process.loadEnvFile(envPath);
    } catch (err) {
      console.warn("Could not load .env file:", err);
    }
  }
}

const DEFAULT_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbyeJjlbNmKEJSUSEUeI8aQ7HRvOh0pvLAMF23cyH2XXXG6OuX4onBUDOviocwGAaVdy/exec";

const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON bodies
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(__dirname));

// Route to handle lead submissions and proxy to Google Sheet Webhook if defined
app.post("/api/submit-lead", async (req, res) => {
  const { name, phone, businessModel } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, message: "Số điện thoại là bắt buộc" });
  }

  console.log(`[Lead received] Name: "${name || 'N/A'}", Phone: "${phone}", Business Model: "${businessModel || 'N/A'}"`);

  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || DEFAULT_WEBHOOK_URL;

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, phone, businessModel }),
      redirect: "follow"
    });

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      data = { message: responseText };
    }

    console.log("[Webhook response]", data);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error forwarding lead to Google Sheet:", error);
    return res.status(500).json({
      success: false,
      message: "Không thể kết nối đến Google Sheets: " + error.message
    });
  }
});

// Route to serve index.html for any unmatched routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running at http://0.0.0.0:${PORT}`);
});

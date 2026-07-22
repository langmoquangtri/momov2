import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("GOOGLE_SHEET_WEBHOOK_URL environment variable is not configured.");
    // Simulate successful save when the environment variable is not yet set
    return res.status(200).json({
      success: true,
      simulated: true,
      message: "Lead processed successfully in simulation mode."
    });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, phone, businessModel })
    });

    if (!response.ok) {
      throw new Error(`Google Sheets script responded with status: ${response.status}`);
    }

    const data = await response.json();
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

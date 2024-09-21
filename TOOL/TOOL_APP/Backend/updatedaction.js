const express = require("express");
const fs = require("fs");
const path = require("path");
const { RecaptchaV2 } = require("express-recaptcha");
const winston = require("winston");

const app = express();
const PORT = process.env.PORT || 2000;

// Initialize reCAPTCHA with your keys
const recaptcha = new RecaptchaV2("YOUR_SITE_KEY", "YOUR_SECRET_KEY"); // Replace with your actual keys

// Rate Limiting Configuration
const rateLimitWindow = 30 * 1000; // 30 seconds
const requestThreshold = 10; // 10 requests in the window
const logDirectory = path.join(__dirname,"../../", "logs");
const logFilePath = path.join(logDirectory, "logs.json");
const blockedIPsFilePath = path.join(logDirectory, "blocked_ips.json");
const ipRequestCounts = {};
const blockedIPs = new Set(); // Track blocked IPs in memory

// Ensure logs directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Setup logging with Winston for errors and process logs
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(logDirectory, "combined.log"),
    }),
  ],
});

// Load blocked IPs from JSON file at startup
const loadBlockedIPs = () => {
  if (fs.existsSync(blockedIPsFilePath)) {
    try {
      const data = fs.readFileSync(blockedIPsFilePath, "utf-8");
      const blockedData = JSON.parse(data);
      blockedData.forEach((ip) => blockedIPs.add(ip)); // Add to in-memory set
      logger.info("Blocked IPs loaded from file.");
    } catch (error) {
      logger.error("Error loading blocked IPs from JSON file:", error);
    }
  }
};

// Save blocked IPs to JSON file
const saveBlockedIPs = () => {
  const blockedData = Array.from(blockedIPs);
  fs.writeFile(
    blockedIPsFilePath,
    JSON.stringify(blockedData, null, 2),
    (err) => {
      if (err) {
        logger.error("Error saving blocked IPs to JSON file:", err);
      } else {
        logger.info("Blocked IPs saved to JSON file.");
      }
    }
  );
};

// Function to analyze logs from logs.json and block IPs based on request threshold
const analyzeLogs = () => {
  if (!fs.existsSync(logFilePath)) {
    logger.warn("logs.json not found, skipping analysis.");
    return;
  }

  const logContent = fs.readFileSync(logFilePath, "utf-8").trim(); // Trim whitespace

  if (!logContent) {
    logger.warn("logs.json is empty, skipping analysis.");
    return;
  }

  const logEntries = logContent.split(",\n").filter(Boolean); // Split by newline and filter empty entries
  let logData;

  try {
    logData = logEntries.map((entry) => JSON.parse(entry)); // Parse each log entry
  } catch (error) {
    logger.error("Failed to parse logs.json: Invalid JSON format.", error);
    return;
  }

  logData.forEach((entry) => {
    const ip = entry.ip;
    if (!ipRequestCounts[ip]) {
      ipRequestCounts[ip] = [];
    }
    ipRequestCounts[ip].push(new Date(entry.timestamp));

    // Remove old entries outside the rateLimitWindow
    ipRequestCounts[ip] = ipRequestCounts[ip].filter(
      (timestamp) => new Date() - new Date(timestamp) < rateLimitWindow
    );

    if (ipRequestCounts[ip].length > requestThreshold) {
      if (!blockedIPs.has(ip)) {
        blockedIPs.add(ip); // Add IP to in-memory blocked set
        saveBlockedIPs(); // Save to JSON file
        logger.warn(`Blocked IP due to rate limit: ${ip}`);
      }
    }
  });
};

// Periodically analyze logs
setInterval(analyzeLogs, 10 * 1000); // Analyze every 10 seconds

// Middleware to block requests from IPs that are in blockedIPs set
app.use((req, res, next) => {
  const ip = req.ip;
  if (blockedIPs.has(ip)) {
    logger.warn(`Blocked request from ${ip}`);
    return res
      .status(403)
      .send("Your IP has been blocked due to too many requests.");
  }
  next();
});

// CAPTCHA Route and Verification
app.get("/captcha", recaptcha.middleware.render, (req, res) => {
  res.send(`
    <form action="/verify-captcha" method="post">
      ${res.recaptcha}
      <button type="submit">Submit</button>
    </form>
  `);
});

// Serve tools.html at the /tool path
app.get("/tool", (req, res) => {
  res.sendFile(path.join(__dirname, "tools.html"));
});

// Verification for reCAPTCHA
app.post("/verify-captcha", recaptcha.middleware.verify, (req, res) => {
  const ip = req.ip;
  if (!req.recaptcha.error) {
    logger.info("CAPTCHA passed");
    blockedIPs.delete(ip); // Unblock IP if CAPTCHA passed
    saveBlockedIPs(); // Save to JSON file
    res.send("CAPTCHA passed, you are now whitelisted.");
  } else {
    logger.warn("CAPTCHA failed");
    res.send("CAPTCHA failed");
  }
});

// Load blocked IPs from file at server start
loadBlockedIPs();

// Start the Server
app.listen(PORT, () => {
  logger.info(`DDoS Protection Tool running on port ${PORT}`);
});

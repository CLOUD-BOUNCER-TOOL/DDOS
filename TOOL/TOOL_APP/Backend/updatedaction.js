const express = require("express");
require('dotenv').config();
const fs = require("fs");
const path = require("path");
const winston = require("winston");

const app = express();
// Serve analysis images statically
app.use('/analysis-images', express.static(process.env.ANALYSIS_IMAGES_PATH));
// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Tool server is running.' });
});
const PORT = process.env.PORT || 2000;
const logsPath = process.env.LOGS_PATH;
const blockedIpsPath = process.env.BLOCKED_IPS_PATH;
const analysisImagesPath = process.env.ANALYSIS_IMAGES_PATH;

// Rate Limiting Configuration
const rateLimitWindow = 30 * 1000; // 30 seconds
const requestThreshold = 10; // 10 requests in the window
const logFilePath = process.env.LOGS_PATH;
const blockedIPsFilePath = process.env.BLOCKED_IPS_PATH;
const ipRequestCounts = {};
const blockedIPs = new Set(); // Track blocked IPs in memory

// Ensure logs directory exists

// Setup logging with Winston for errors and process logs
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "e:/DDOS/TOOL/TOOL_APP/Backend/logs/combined.log",
    }),
  ],
});

// Load blocked IPs from JSON file at startup
const loadBlockedIPs = () => {
  // Track previous blocked IPs
  const prevBlocked = new Set([...blockedIPs]);
  blockedIPs.clear();
  if (fs.existsSync(blockedIPsFilePath)) {
    try {
      const data = fs.readFileSync(blockedIPsFilePath, "utf-8");
      const blockedData = JSON.parse(data);
      blockedData.forEach((entry) => blockedIPs.add(entry.ip)); // Add to in-memory set
      // Clear request history for IPs that were unblocked
      prevBlocked.forEach(ip => {
        if (!blockedIPs.has(ip)) {
          ipRequestCounts[ip] = [];
        }
      });
      logger.info("Blocked IPs loaded from file.");
    } catch (error) {
      logger.error("Error loading blocked IPs from JSON file:", error);
    }
  }
};

// Save blocked IPs to JSON file
const saveBlockedIPs = () => {
  const blockedData = Array.from(blockedIPs).map((ip) => ({
    ip,
    timestamp: new Date().toISOString(),
  }));
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

// Function to insert key-value pairs into blocked_ips.json
const insertBlockedIP = (ip) => {
  let blockedIPsData = [];

  // Read the existing file content
  if (fs.existsSync(blockedIPsFilePath)) {
    try {
      const data = fs.readFileSync(blockedIPsFilePath, "utf-8");
      blockedIPsData = JSON.parse(data);
    } catch (error) {
      logger.error("Error reading blocked_ips.json file:", error);
    }
  }

  // Add new entry
  const timestamp = new Date().toISOString();
  blockedIPsData.push({ ip, timestamp });

  // Write updated content back to file
  fs.writeFileSync(
    blockedIPsFilePath,
    JSON.stringify(blockedIPsData, null, 2),
    (err) => {
      if (err) {
        logger.error("Error writing to blocked_ips.json file:", err);
      } else {
        logger.info("Blocked IP added to blocked_ips.json file.");
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

  // Reload blocked IPs from file to keep in-memory set in sync
  blockedIPs.clear();
  if (fs.existsSync(blockedIPsFilePath)) {
    try {
      const data = fs.readFileSync(blockedIPsFilePath, "utf-8");
      const blockedData = JSON.parse(data);
      blockedData.forEach((entry) => blockedIPs.add(entry.ip));
    } catch (error) {
      logger.error("Error loading blocked IPs from JSON file:", error);
    }
  }

  let logContent = fs.readFileSync(logFilePath, "utf-8").trim();

  if (!logContent) {
    logger.warn("logs.json is empty, skipping analysis.");
    return;
  }

  // Wrap the log content in an array to ensure valid JSON format
  if (!logContent.startsWith("[")) {
    logContent = "[" + logContent;
  }
  if (!logContent.endsWith("]")) {
    logContent += "]";
  }

  let logData;
  try {
    logData = JSON.parse(logContent);
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
      // Always re-block IP if it attacks again
      if (!blockedIPs.has(ip)) {
        blockedIPs.add(ip); // Add IP to in-memory blocked set
        insertBlockedIP(ip); // Log to JSON file
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

// Load blocked IPs from file at server start

loadBlockedIPs();

// Analyze only the last 30 seconds of logs on startup
const analyzeRecentLogs = () => {
  if (!fs.existsSync(logFilePath)) {
    logger.warn("logs.json not found, skipping analysis.");
    return;
  }
  let logContent = fs.readFileSync(logFilePath, "utf-8").trim();
  if (!logContent) {
    logger.warn("logs.json is empty, skipping analysis.");
    return;
  }
  if (!logContent.startsWith("[")) {
    logContent = "[" + logContent;
  }
  if (!logContent.endsWith("]")) {
    logContent += "]";
  }
  let logData;
  try {
    logData = JSON.parse(logContent);
  } catch (error) {
    logger.error("Failed to parse logs.json: Invalid JSON format.", error);
    return;
  }
  const now = Date.now();
  const recentLogData = logData.filter(entry => {
    if (!entry.timestamp) return false;
    const entryTime = new Date(entry.timestamp).getTime();
    return now - entryTime <= 30 * 1000; // last 30 seconds
  });
  recentLogData.forEach((entry) => {
    const ip = entry.ip;
    if (!ipRequestCounts[ip]) {
      ipRequestCounts[ip] = [];
    }
    ipRequestCounts[ip].push(new Date(entry.timestamp));
    ipRequestCounts[ip] = ipRequestCounts[ip].filter(
      (timestamp) => now - new Date(timestamp).getTime() < rateLimitWindow
    );
    if (ipRequestCounts[ip].length > requestThreshold) {
      if (!blockedIPs.has(ip)) {
        blockedIPs.add(ip);
        insertBlockedIP(ip);
        logger.warn(`Blocked IP due to rate limit: ${ip}`);
      }
    }
  });
};

analyzeRecentLogs(); // Immediate analysis on restart (last 30 seconds)

// Start the Server
app.listen(PORT, () => {
  logger.info(`DDoS Protection Tool running on port ${PORT}`);
});

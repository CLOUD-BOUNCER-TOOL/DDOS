const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 2000;

// Rate Limiting Configuration
const rateLimitWindow = 30 * 1000; // 30 seconds
const requestThreshold = 10; // 10 requests
const logDirectory = path.join("../../", 'logs');
const logFilePath = path.join(logDirectory, 'logs.json');
const blockedIPsFilePath = path.join(logDirectory, 'blocked_ips.json');
const ipRequestCounts = {};
const blockedIPs = new Set(); // Track blocked IPs in memory

// Ensure logs directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Function to append a blocked IP with a timestamp to the JSON file
const appendBlockedIP = (ip) => {
  const timestamp = new Date().toISOString();
  const blockedIpData = { ip, timestamp };

  let blockedIpsList = [];

  // Check if the blocked_ips.json file exists, if so, read its contents
  if (fs.existsSync(blockedIPsFilePath)) {
    const blockedIpsContent = fs.readFileSync(blockedIPsFilePath, "utf-8").trim();
    if (blockedIpsContent) {
      try {
        blockedIpsList = JSON.parse(blockedIpsContent);
      } catch (error) {
        console.error("Failed to parse blocked_ips.json: Invalid JSON format.", error);
        return;
      }
    }
  }

  // Append the new IP data to the list
  blockedIpsList.push(blockedIpData);

  // Write the updated list back to the file
  fs.writeFileSync(blockedIPsFilePath, JSON.stringify(blockedIpsList, null, 2));
  blockedIPs.add(ip); // Add IP to in-memory blocked set
  console.warn(`Blocked IP due to rate limit: ${ip}`);
};

// Function to analyze logs from logs.json
const analyzeLogs = () => {
  if (!fs.existsSync(logFilePath)) {
    console.warn("logs.json not found, skipping analysis.");
    return;
  }

  const logContent = fs.readFileSync(logFilePath, "utf-8").trim(); // Trim any whitespace or empty content

  if (!logContent) {
    console.warn("logs.json is empty, skipping analysis.");
    return;
  }

  let logData;
  try {
    logData = JSON.parse(logContent);
  } catch (error) {
    console.error("Failed to parse logs.json: Invalid JSON format.", error);
    return;
  }

  logData.forEach((entry) => {
    const ip = entry.ip;
    if (!ipRequestCounts[ip]) {
      ipRequestCounts[ip] = [];
    }
    ipRequestCounts[ip].push(new Date(entry.timestamp));

    // Remove old entries
    ipRequestCounts[ip] = ipRequestCounts[ip].filter(
      (timestamp) => new Date() - new Date(timestamp) < rateLimitWindow
    );

    if (ipRequestCounts[ip].length > requestThreshold) {
      if (!blockedIPs.has(ip)) {
        appendBlockedIP(ip);
      }
    }
  });
};

// Periodically analyze logs
setInterval(analyzeLogs, 10 * 1000); // Analyze every 10 seconds

app.use(express.static(path.join(__dirname, "public")));

// Serve tools.html at the /tool path
app.get("/tool", (req, res) => {
  res.sendFile(path.join(__dirname, "tools.html"));
});

// Start the Server
app.listen(port, () => {
  console.log(`DDoS Protection Tool running on port ${port}`);
});

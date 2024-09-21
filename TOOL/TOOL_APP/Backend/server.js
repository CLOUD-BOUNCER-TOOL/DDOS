const express = require("express");
const fs = require("fs");
const path = require("path");
const os = require("os"); // Import the os module
const app = express();
const port = 3000;

// Create a log directory if it doesn't exist
const logDirectory = path.join(__dirname, "logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// JSON log file path
const jsonLogFilePath = path.join(logDirectory, "logs.json");

// Function to append data to a JSON file
const appendLogToJsonFile = (data) => {
  let logs = [];
  if (fs.existsSync(jsonLogFilePath)) {
    const fileData = fs.readFileSync(jsonLogFilePath, "utf8");
    if (fileData) {
      try {
        logs = JSON.parse(fileData);
      } catch (e) {
        console.error("Error parsing JSON from log file:", e);
        logs = [];
      }
    }
  }
  logs.push(data);
  try {
    fs.writeFileSync(jsonLogFilePath, JSON.stringify(logs, null, 2));
  } catch (e) {
    console.error("Error writing JSON to file:", e);
  }
};

// Middleware to log requests in JSON format
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
    user_agent: req.headers["user-agent"],
    referrer: req.headers.referer || "",
    http_version: req.httpVersion,
    status_code: null,
    response_size_bytes: 0,
    query_params: req.query,
    cookies: req.headers.cookie || "",
  };

  res.on("finish", () => {
    logEntry.status_code = res.statusCode;
    logEntry.response_size_bytes = parseInt(
      res.getHeader("Content-Length") || 0,
      10
    );
    appendLogToJsonFile(logEntry);
  });

  next();
});

// Blocking IPs logic using JSON
const blockedIPsFilePath = path.join(logDirectory, "blocked_ips.json");
const blocklist = new Set();

// Function to load blocked IPs from JSON file
const loadBlockedIPs = () => {
  if (fs.existsSync(blockedIPsFilePath)) {
    try {
      const fileData = fs.readFileSync(blockedIPsFilePath, "utf8");
      const blockedIPs = JSON.parse(fileData);
      blockedIPs.forEach((ip) => blocklist.add(ip.trim()));
    } catch (error) {
      console.error("Error reading blocked IPs from JSON:", error);
    }
  }
};

// Function to save blocked IPs to JSON file
const saveBlockedIPs = () => {
  try {
    const blockedIPs = Array.from(blocklist);
    fs.writeFileSync(blockedIPsFilePath, JSON.stringify(blockedIPs, null, 2));
  } catch (error) {
    console.error("Error saving blocked IPs to JSON file:", error);
  }
};

// Load blocked IPs when the server starts
loadBlockedIPs();

// Watch the file for changes and reload IPs dynamically
fs.watchFile(blockedIPsFilePath, (curr, prev) => {
  blocklist.clear();
  loadBlockedIPs();
});

app.use((req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const cleanedIp = ip.split(",")[0].trim();

  if (blocklist.has(cleanedIp)) {
    console.log(`Blocked IP tried to access: ${cleanedIp}`);

    // Get the dynamic IP address of the server
    const networkInterfaces = os.networkInterfaces();
    let dynamicIp = "localhost"; // Default to localhost if no valid IP found

    for (const iface of Object.values(networkInterfaces)) {
      for (const detail of iface) {
        if (detail.family === "IPv4" && !detail.internal) {
          dynamicIp = detail.address; // Use the first non-internal IPv4 address found
          break;
        }
      }
    }

    // Redirect to dynamic IP on access denied
    return res.redirect(`http://${dynamicIp}:2000/captcha`);
  }

  next();
});

// Serve static files
app.use(express.static("public"));

// Route to serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${port}/`);
});

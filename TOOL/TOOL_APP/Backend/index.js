require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
// Serve analysis images statically
app.use('/analysis-images', express.static(process.env.ANALYSIS_IMAGES_PATH));
const handleLog = require("./middleware/log");
const userRoutes = require('./routes/user_routes');
const { checkBlockedIp } = require("./middleware/blockIps");
const port = process.env.PORT || 8000;
const logsPath = process.env.LOGS_PATH;
const blockedIpsPath = process.env.BLOCKED_IPS_PATH;
const analysisImagesPath = process.env.ANALYSIS_IMAGES_PATH;
const path = require("path");
const fs = require("fs");

const { exec } = require('child_process');

app.set('trust proxy', true);

// middlewares
app.use(express.json());
app.use(
    cors({
        origin: "*",
    })
);

app.use(express.urlencoded({ extended: true }));
app.use("/", handleLog, userRoutes);

// Endpoint to trigger Python graph generation
app.post('/generate-graphs', (req, res) => {
    const pythonScript = process.env.PYTHON_ANALYSIS_SCRIPT_PATH || 'e:/DDOS/Python/detector_analysis.py';
    // Use the virtual environment python executable if available
    const pythonExe = process.env.PYTHON_EXE_PATH || 'E:/DDOS/.venv/Scripts/python.exe';
    const pythonCmd = `"${pythonExe}" "${pythonScript}"`;
    exec(pythonCmd, (error, stdout, stderr) => {
        if (error) {
            console.error('Error running Python script:', error);
            return res.status(500).json({ success: false, error: stderr || error.message });
        }
        res.json({ success: true, output: stdout });
    });
});

// app.get("/blockedIps", (req, res) => {
//     const filePath = path.join("../logs", 'blocked_ips.json');

//     fs.readFile(filePath, 'utf8', (err, data) => {
//         if (err) {
//             return res.status(500).json({ error: 'Failed to read file' });
//         }

//         try {
//             const jsonData = JSON.parse(data);
//             res.json(jsonData);
//         } catch (parseError) {
//             res.status(500).json({ error: 'Failed to parse JSON' });
//         }
//     });
// });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const handleLog = require("./middleware/log");
const userRoutes = require('./routes/user_routes');
const { checkBlockedIp } = require("./middleware/blockIps");
const port = process.env.port || 8000;
const path = require("path");
const fs = require("fs");

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

require("dotenv").config();
const User = require("./models/user.model");
const { checkPassword } = require("./bcrypt");
const path = require('path');
const fs = require('fs');
const port = 8000;

const express = require("express");
const cors = require("cors");

const app = express();
const jwt = require("jsonwebtoken");

const { authenticate } = require("./utilities");
const handleLog = require("./middleware/log");

app.use(express.json());

// Load blocked IPs from blocked_ips.json
const blockedIpsFilePath = path.join(__dirname, '../../logs/blocked_ips.json');
let blockedIps = [];

try {
    const blockedIpsData = fs.readFileSync(blockedIpsFilePath);
    blockedIps = JSON.parse(blockedIpsData);
} catch (err) {
    console.error('Error reading blocked_ips.json:', err);
}

// Middleware to block requests from blocked IPs
app.use((req, res, next) => {
    const clientIp = req.ip || req.connection.remoteAddress;

    // Check if the IP is in the blocked IPs list
    if (blockedIps.includes(clientIp)) {
        console.log(`Blocked IP attempt: ${clientIp}`);
        return res.status(403).send("Access Denied"); 
         // Show "Access Denied" message
    }

    next();
});

// Using middleware cors that allows any domain to make requests
app.use(
    cors({
        origin: "*",
    })
);

app.use(handleLog);
app.set('trust proxy', true);
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.status(200).json({ data: "king" });
});

// Signup
app.post("/signup", async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName) {
        return res.status(400).json({ error: true, message: "Name is required" });
    }
    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required" });
    }
    if (!password) {
        return res.status(400).json({ error: true, message: "Password is required" });
    }

    const isUser = await User.findOne({ email: email });

    if (isUser) {
        return res.json({ error: true, message: "User already exists" });
    }

    const user = new User({ fullName, email, password });
    await user.save();

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "36000m",
    });

    return res.json({
        error: false,
        user,
        accessToken,
        message: "Registration Successful",
    });
});

// Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required" });
    }
    if (!password) {
        return res.status(400).json({ error: true, message: "Password is required" });
    }

    const userEmail = await User.findOne({ email: email });

    if (!userEmail) {
        return res.status(400).json({ error: true, message: "User not found" });
    }

    const encryptedPassword = userEmail.password;
    const isMatch = await checkPassword(password, encryptedPassword);

    if (userEmail.email == email && isMatch) {
        const user = { user: userEmail };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "36000m",
        });

        return res.json({
            error: false,
            message: "Login Successful",
            email,
            accessToken,
        });
    } else {
        return res.status(400).json({ error: true, message: "Invalid credentials" });
    }
});

// Getting user
app.get("/get-user", authenticate, async (req, res) => {
    const { user } = req.user;
    const isUser = await User.findOne({ _id: user._id });

    if (!isUser) {
        return res.sendStatus(401);
    }

    return res.json({
        user: {
            Name: user.Name,
            email: isUser.email,
            _id: isUser._id,
        },
        message: "User info",
    });
});

// App is listening on port 8000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;

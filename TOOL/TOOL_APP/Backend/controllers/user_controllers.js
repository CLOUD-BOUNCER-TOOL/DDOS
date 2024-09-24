const User = require("../models/user.model");
const { checkPassword } = require("../bcrypt");
const jwt = require("jsonwebtoken");
const path = require('path');
const fs = require('fs');

function handleLanding(req, res) {
    res.status(200).json({ "data": "king" })
}

async function handlSignUp(req, res) {
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
};

async function handleLogin(req, res) {
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
};

async function handleBlockedIps(req, res) {
    const filePath = path.join("../../logs", 'blocked_ips.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read file' });
        }

        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (parseError) {
            res.status(500).json({ error: 'Failed to parse JSON' });
        }
    });
}

async function GetUser(req, res) {
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
};

module.exports = { handlSignUp, handleLogin, GetUser, handleLanding, handleBlockedIps };
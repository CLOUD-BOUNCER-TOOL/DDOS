require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const handleLog = require("./middleware/log");
const userRoutes = require('./routes/user_routes');
const port = process.env.port || 8000;

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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;

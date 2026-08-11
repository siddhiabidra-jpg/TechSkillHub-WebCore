require("dns").setServers(["8.8.8.8", "8.8.4.4"]);
require("dotenv").config();

const express = require("express");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

app.use(express.json());

// API routes
const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
res.sendFile(path.join(__dirname, "public", "index.html"));
});

connectDB();

app.listen(PORT, () => {
console.log("Server is running on port " + PORT);
});

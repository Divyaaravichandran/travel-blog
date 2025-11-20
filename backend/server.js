const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const { setIO } = require("./socket");

// Load dotenv only for local development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const authRoutes = require("./routes/auth");
const postsRoutes = require("./routes/posts");
const blogsRoutes = require("./routes/blogs");
const adminRoutes = require("./routes/admin");

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, { cors: { origin: "*" } });
setIO(io);

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/blogs", blogsRoutes);
app.use("/api/admin", adminRoutes);

// Use Render dynamic port or fallback to 5000 locally
const PORT = process.env.PORT || 5000;

// MongoDB connection
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined. Set it in your environment variables!");
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ DB Connection Error:", err));

// Socket.io logging
io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);
});

// Start server
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

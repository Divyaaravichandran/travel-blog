const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const { setIO } = require("./socket");

const authRoutes = require("./routes/auth");
const postsRoutes = require("./routes/posts");
const blogsRoutes = require("./routes/blogs");
const adminRoutes = require("./routes/admin");

const app = express();
const server = http.createServer(app);

// Use Render's dynamic port
const PORT = process.env.PORT || 5000;

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

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ DB Connection Error:", err));

// Optional: Socket.io connection logging
io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);
});

// Start server
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

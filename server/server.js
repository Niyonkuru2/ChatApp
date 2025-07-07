import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDb } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messagesRoutes.js";
import { Server } from "socket.io";

// Create express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize socket.io
export const io = new Server(server, {
  cors: {
    origin: "*", // You can restrict this later
  },
});

// Map to track online users
export const userSocketMap = {}; // { userId: socketId }

// Socket.io connection
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected:", userId);

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Health check route
app.get("/api/status", (req, res) => res.send("Server is Live"));

// Routes
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect to DB and start server
await connectDb();

const PORT = process.env.PORT || 5070;
server.listen(PORT, () => console.log("Server running on PORT:", PORT));

// Export server (optional for testing)
export default server;

import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { router as authRoutes } from "./routes/auth.routes";
import { router as habitRoutes } from "./routes/habit.routes";
import { router as eventRoutes } from "./routes/event.routes";
import { router as userRoutes } from "./routes/user.routes";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Base route to check if API is working
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// API routes - choose either with or without /api prefix based on frontend config
// Without /api prefix (if frontend adds it in the API service baseURL)
app.use("/auth", authRoutes);
app.use("/habits", habitRoutes);
app.use("/events", eventRoutes);
app.use("/users", userRoutes);

// Socket.io connection handling
io.on("connection", (socket: Socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

export { app, httpServer };

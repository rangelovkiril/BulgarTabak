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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);

// Socket.io connection handling
io.on("connection", (socket: Socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

export { app, httpServer };

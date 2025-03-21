import express from "express";
import { Request, Response } from "express";
import { authenticateToken } from "../middleware/auth";
import { pool } from "../config/database";

const router = express.Router();

type AsyncHandler = (req: Request, res: Response) => Promise<void>;

const getEvents: AsyncHandler = async (req, res) => {
  const userId = (req as any).user?.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const [events] = await pool.execute(
    "SELECT * FROM events WHERE user_id = ?",
    [userId]
  );
  res.json(events || []);
};

const createEvent: AsyncHandler = async (req, res) => {
  const userId = (req as any).user?.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { title, description, start_time, end_time } = req.body;
  const [result] = await pool.execute(
    "INSERT INTO events (id, user_id, title, description, start_time, end_time) VALUES (UUID(), ?, ?, ?, ?, ?)",
    [userId, title, description, start_time, end_time]
  );
  res.status(201).json(result);
};

router.get("/", authenticateToken, (req, res) => getEvents(req, res));
router.post("/", authenticateToken, (req, res) => createEvent(req, res));

export { router };

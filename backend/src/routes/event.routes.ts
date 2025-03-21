import express from "express";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { authenticateToken } from "../middleware/auth";
import db from "../config/database";

const router = express.Router();

const getEvents = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const events = db.get("events").filter({ user_id: userId }).value() || [];
  res.json(events);
};

const createEvent = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { title, description, start_time, end_time } = req.body;

  const newEvent = {
    id: uuidv4(),
    user_id: userId,
    title,
    description,
    start_time,
    end_time,
    created_at: new Date().toISOString(),
  };

  db.get("events").push(newEvent).write();
  res.status(201).json(newEvent);
};

router.get("/", authenticateToken, getEvents);
router.post("/", authenticateToken, createEvent);

export { router };

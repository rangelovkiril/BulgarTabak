import express, { Request, Response } from "express";

const router = express.Router();

router.get("/profile", (_req: Request, res: Response) => {
  res.json({}); // Temporary empty response
});

export { router };

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type AuthMiddleware = (req: Request, res: Response, next: NextFunction) => void;

export const authenticateToken: AuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    (req as any).user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

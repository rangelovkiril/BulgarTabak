import express from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { pool } from "../config/database";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Route definition that avoids the Promise<Response> issue
router.post("/google", (req, res) => {
  (async () => {
    try {
      const { credential } = req.body;
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        res.status(400).json({ message: "Invalid token" });
        return;
      }

      // Check if user exists
      const [users] = await pool.execute(
        "SELECT * FROM users WHERE google_id = ?",
        [payload.sub]
      );

      let userId;
      const userArray = users as any[];
      if (userArray.length === 0) {
        // Create new user
        const [result] = await pool.execute(
          "INSERT INTO users (id, email, name, google_id) VALUES (UUID(), ?, ?, ?)",
          [payload.email, payload.name, payload.sub]
        );
        userId = (result as any).insertId;
      } else {
        userId = userArray[0].id;
      }

      const token = jwt.sign(
        { userId, email: payload.email },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "24h" }
      );

      res.json({
        token,
        user: { id: userId, email: payload.email, name: payload.name },
      });
    } catch (error) {
      console.error("Auth error:", error);
      res.status(500).json({ message: "Authentication failed" });
    }
  })();
});

export { router };

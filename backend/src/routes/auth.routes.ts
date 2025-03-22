import express from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import db from "../config/database";

// Define a User interface to properly type the user variable
interface User {
  id: string;
  email: string;
  name: string;
  google_id: string;
  created_at: string;
  last_login: string;
}

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Route definition that avoids the Promise<Response> issue
router.post("/google", (req, res) => {
  (async () => {
    try {
      console.log("Google auth request received");
      const { credential } = req.body;

      if (!credential) {
        console.error("Missing credential in request");
        return res.status(400).json({ message: "Missing Google credential" });
      }

      try {
        const ticket = await client.verifyIdToken({
          idToken: credential,
          audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
          console.error("Invalid Google token - no payload");
          return res.status(400).json({ message: "Invalid token" });
        }

        console.log("Google authentication successful for:", payload.email);

        // Get all users
        const allUsers = db.get("users").value() as User[];

        // Find user with matching Google ID
        const matchingUsers = allUsers.filter(
          (u) => u.google_id === payload.sub
        );
        let isNewUser = false;
        let user: User;

        if (matchingUsers.length === 0) {
          // Create new user
          isNewUser = true;
          user = {
            id: uuidv4(),
            email: payload.email || "",
            name: payload.name || "",
            google_id: payload.sub || "",
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
          };

          // Add user to database
          db.get("users").push(user).write();
        } else {
          user = matchingUsers[0];

          // Find and update user directly
          const users = db.get("users").value() as User[];
          const userIndex = users.findIndex((u) => u.id === user.id);

          if (userIndex !== -1) {
            users[userIndex].last_login = new Date().toISOString();
            db.set("users", users).write();
          }
        }

        const token = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.JWT_SECRET || "default_secret",
          { expiresIn: "24h" }
        );

        return res.json({
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            isNewUser,
          },
        });
      } catch (googleError) {
        console.error("Google verification error:", googleError);
        return res
          .status(401)
          .json({ message: "Google authentication failed" });
      }
    } catch (error) {
      console.error("Auth error:", error);
      return res.status(500).json({ message: "Authentication failed" });
    }
  })();
});

export { router };

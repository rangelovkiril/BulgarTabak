import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import path from "path";
import fs from "fs";

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, "..", "..", "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Define database schema
interface Schema {
  users: {
    id: string;
    email: string;
    name: string;
    google_id: string;
    created_at: string;
    last_login: string;
  }[];
  habits: {
    id: string;
    user_id: string;
    name: string;
    type: string;
    description: string;
    created_at: string;
  }[];
  events: {
    id: string;
    user_id: string;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    created_at: string;
  }[];
}

// Create or load the JSON database file
const adapter = new FileSync<Schema>(path.join(dataDir, "db.json"));
const db = low<Schema>(adapter);

// Set defaults (initialize empty collections)
db.defaults({ users: [], habits: [], events: [] }).write();

export default db;

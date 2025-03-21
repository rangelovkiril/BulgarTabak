import { httpServer } from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

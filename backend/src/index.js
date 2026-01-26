import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/database.js";

dotenv.config({ path: ".env" });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post("/users", async (req, res) => {
  const { username, email, password } = req.body;
  const sql =
    "INSERT INTO `users` (`username`, `email`, `password`) VALUES (?, ?, ?)";

  try {
    const [result] = await db.query(sql, [username, email, password]);
    res.status(201).json({
      message: "User Created",
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

app.listen(PORT, () => {
  console.log(`App is listening on Port: ${PORT}`);
});

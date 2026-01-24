import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/database";

dotenv.config({ path: '.env'})

const app = express();
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`App is listening on Port: ${PORT}`);
});


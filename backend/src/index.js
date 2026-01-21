import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: '.env'})

const app = express();
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`App is listening on Port: ${PORT}`);
})

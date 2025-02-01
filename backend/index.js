require("dotenv").config();

const express = require("express");

const MONGO_URI = process.env.MONGO_URI_CONNECTION_STRING;
const port = process.env.PORT || 3000;

const app = express();

const mongoose = require("mongoose");

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

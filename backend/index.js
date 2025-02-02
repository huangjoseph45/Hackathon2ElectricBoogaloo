const express = require("express");
const { auth, requiresAuth } = require("express-openid-connect");
const mongoose = require("mongoose");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes.js");
const mapsRoutes = require("./routes/mapsRoutes.js");

const app = express();
const port = 3000;

const MONGO_URI = process.env.MONGO_URI_CONNECTION_STRING;

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: "bbnaAgHpUZLRq063k1U7_ebkjQSlTB9uDI_qkpK6MF0l5G1bHQiGpcbLzZx9MB59",
  baseURL: "http://localhost:5173",
  clientID: "Aj7IoPUpsl0nADIn0HUzdezyd2nXCFrQ",
  issuerBaseURL: "https://dev-eq8gecr3aifn0jqv.us.auth0.com",
};

app.use(auth(config));

app.use(express.json());
app.use(
  cors({
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

app.get("/profile", requiresAuth(), (req, res) => {
  res.json(req.oidc.user);
});

app.use("/product", productRoutes);
app.use("/maps", mapsRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

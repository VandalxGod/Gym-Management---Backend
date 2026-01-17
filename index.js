const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

/* =========================
   MIDDLEWARE
========================= */

// Parse JSON
app.use(express.json({ limit: "10mb" }));

// ✅ CORS – JWT DOES NOT NEED credentials:true
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://gym-management-djqs.onrender.com",
      "https://sumitweb.me",
      "https://www.sumitweb.me",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* =========================
   DATABASE CONNECTION
========================= */
require("./DBConn/conn");

/* =========================
   ROUTES
========================= */
app.use("/auth", require("./Routes/gym"));
app.use("/plans", require("./Routes/membership"));
app.use("/members", require("./Routes/member"));

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("✅ Gym Management API is running");
});

/* =========================
   SERVER START
========================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

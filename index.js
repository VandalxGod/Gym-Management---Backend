const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

/* =========================
   MIDDLEWARE
========================= */

// Parse JSON
app.use(express.json({ limit: "10mb" }));

// Parse cookies (IMPORTANT for auth)
app.use(cookieParser());

// ✅ CORS CONFIG (FINAL, SAFE)
const allowedOrigins = [
  "http://localhost:5173",
  "https://gym-management-djqs.onrender.com",
  "https://gym.sumitweb.me",
  "https://sumitweb.me",
  "https://www.sumitweb.me",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow server-to-server
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // 🔥 REQUIRED for cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests
app.options("*", cors());

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

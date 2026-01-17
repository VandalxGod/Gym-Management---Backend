const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");

const PORT = process.env.PORT || 4000;

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://gym-management-djqs.onrender.com",
];

// ✅ Single CORS options object (IMPORTANT)
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["set-cookie"],
};


// ✅ Apply CORS to ALL requests
app.use(cors(corsOptions));

// ✅ Explicitly handle preflight (THIS IS THE FIX)
app.options("*", cors(corsOptions));

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

// DB
require("./DBConn/conn");

// Routes
app.use("/auth", require("./Routes/gym"));
app.use("/plans", require("./Routes/membership"));
app.use("/members", require("./Routes/member"));

app.get("/", (req, res) => {
  res.send("Gym Management API is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");

const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://gym-management-djqs.onrender.com",
  "https://sumitweb.me",
  "https://www.sumitweb.me"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

require("./DBConn/conn");

app.use("/auth", require("./Routes/gym"));
app.use("/plans", require("./Routes/membership"));
app.use("/members", require("./Routes/member"));

app.get("/", (req, res) => {
  res.send("Gym Management API is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

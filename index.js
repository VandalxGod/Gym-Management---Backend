const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();
const cors = require('cors');

const PORT = process.env.PORT || 4000;

// ✅ PRODUCTION-SAFE CORS
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true
}));

app.options("*", cors());

app.use(cookieParser());
app.use(express.json());

// ✅ MongoDB Connection
require('./DBConn/conn');

// Routes
const GymRoutes = require('./Routes/gym');
const MembershipRoutes = require('./Routes/membership');
const MemberRoutes = require('./Routes/member');

app.use('/auth', GymRoutes);
app.use('/plans', MembershipRoutes);
app.use('/members', MemberRoutes);

app.get('/', (req, res) => {
    res.send('Gym Management API is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

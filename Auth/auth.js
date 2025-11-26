
const Gym = require('../Models/gym');
const jwt = require('jsonwebtoken');


const auth = async (req, res, next) => {
    try {
        const token = req.cookies.cookie_token;

        if (!token) {
            return res.status(401).json({ error: "No token, authorization denied" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SecretKey);
        // const gym = await Gym.findById(decoded.gym_id);

        // if (!gym) {
        //     return res.status(401).json({ error: "Invalid token: Gym not found" });
        // }
        // // console.log("Cookies:", token);
        req.gym = await Gym.findById(decoded.gym_id).select("-password");    
        next();
    } catch (err) {
        console.log("Auth middleware error:", err);
        return res.status(401).json({ error: "Token is invalid or expired" });
    }
};

module.exports = auth;
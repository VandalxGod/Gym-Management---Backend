const Gym = require("../Models/gym");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    // Expect header: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No authorization header" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SecretKey);

    const gym = await Gym.findById(decoded.gym_id).select("-password");

    if (!gym) {
      return res.status(401).json({ error: "Gym not found" });
    }

    req.gym = gym;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ error: "Token invalid or expired" });
  }
};

module.exports = auth;

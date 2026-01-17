const Gym = require("../Models/gym");
const bcrypts = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

/* =========================
   REGISTER
========================= */
exports.register = async (req, res) => {
  try {
    const { userName, password, gymName, profilePic, email } = req.body;

    const isExist = await Gym.findOne({ userName });
    if (isExist) {
      return res.status(400).json({
        error: "Username already exists",
      });
    }

    const hashedPassword = await bcrypts.hash(password, 10);
    const newGym = new Gym({
      userName,
      password: hashedPassword,
      gymName,
      profilePic,
      email,
    });

    await newGym.save();

    res.status(201).json({
      message: "Gym registered successfully",
    });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

/* =========================
   LOGIN (JWT HEADER BASED)
========================= */
exports.login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const gym = await Gym.findOne({ userName });
    if (!gym) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypts.compare(password, gym.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { gym_id: gym._id },
      process.env.JWT_SecretKey,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      gym: {
        _id: gym._id,
        gymName: gym.gymName,
        profilePic: gym.profilePic,
        email: gym.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

/* =========================
   EMAIL CONFIG
========================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/* =========================
   SEND OTP
========================= */
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const gym = await Gym.findOne({ email });

    if (!gym) {
      return res.status(400).json({ error: "Gym not found" });
    }

    const buffer = crypto.randomBytes(4);
    const otp = buffer.readUInt32BE(0) % 900000 + 100000;

    gym.resetPasswordToken = otp;
    gym.resetPasswordExpires = Date.now() + 3600000;
    await gym.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is: ${otp}`,
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

/* =========================
   VERIFY OTP
========================= */
exports.checkOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const gym = await Gym.findOne({
      email,
      resetPasswordToken: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!gym) {
      return res.status(400).json({ error: "OTP invalid or expired" });
    }

    res.status(200).json({ message: "OTP verified" });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

/* =========================
   RESET PASSWORD
========================= */
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const gym = await Gym.findOne({ email });
    if (!gym) {
      return res.status(400).json({ error: "Gym not found" });
    }

    gym.password = await bcrypts.hash(newPassword, 10);
    gym.resetPasswordToken = undefined;
    gym.resetPasswordExpires = undefined;

    await gym.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

/* =========================
   UPDATE PROFILE PIC
========================= */
exports.updateProfilePic = async (req, res) => {
  try {
    const { profilePic } = req.body;

    const gym = await Gym.findById(req.gym._id);
    if (!gym) {
      return res.status(404).json({ error: "Gym not found" });
    }

    gym.profilePic = profilePic;
    await gym.save();

    res.status(200).json({
      message: "Profile picture updated",
      profilePic: gym.profilePic,
    });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

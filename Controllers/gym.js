const Gym = require('../Models/gym');
const bcrypts = require('bcryptjs');
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');


//This is the controller for gym registration and login
exports.register = async (req, res) => {
    try {
        const { userName, password, gymName, profilePic, email } = req.body;



        const isExist = await Gym.findOne({ userName });

        if (isExist) {
            res.status(400).json({
                error: "username Already Exist ,Please try with other username"
            })
        } else {
            const hashedPassword = await bcrypts.hash(password, 10);
            console.log(hashedPassword);
            const newGym = new Gym({ userName, password: hashedPassword, gymName, profilePic, email });
            await newGym.save();

            res.status(201).json({ message: 'User register successfully', success: "yes", data: newGym });
        }


    } catch (err) {
        res.status(500).json({
            error: "Server Error"
        })
    }
}
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None"
};

//This is the controller for gym login
exports.login = async (req, res) => {
    try {
        const { userName, password } = req.body;

        const gym = await Gym.findOne({ userName });
        if (gym && await bcrypts.compare(password, gym.password)) {

            const token = jwt.sign(
                { gym_id: gym._id },
                process.env.JWT_SecretKey,
                { expiresIn: "7d" }
            );

            // console.log("jwtToken :",token);
            res.cookie("cookie_token", token, cookieOptions)


            res.json({ message: 'Logged is successfully', success: "true", gym, token });
        } else {
            res.status(400).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({
            error: "Server Error"
        })
    }

}

//This is the controller for gym profile
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
})
//This is the controller for sending otp
exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const gym = await Gym.findOne({ email });
        if (gym) {

            const buffer = crypto.randomBytes(4);//Get random 4 bytes
            const token = buffer.readUInt32BE(0) % 900000 + 100000;


            gym.resetPasswordToken = token;
            gym.resetPasswordExpires = Date.now() + 3600000;
            // 1 hour expiry date

            // console.log(token);
            await gym.save();

            const mailOptions = {
                from: 'vandalxgod@gmail.com',
                to: email,
                subject: 'Password Reset',
                text: `You requested a password reset.Your OTP is : ${token} `
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    res.status(500).json({ error: 'Server error', errorMsg: error });
                } else {
                    res.status(200).json({ message: "OTP Sent to your email" })
                }
            })


        } else {
            return res.status(400).json({ error: 'Gym not found' })
        }

    } catch (err) {
        res.status(500).json({
            error: "Server Error"
        })
    }
}

//This is the controller for checking otp
exports.checkOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const gym = await Gym.findOne({
            email,
            resetPasswordToken: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });


        if (!gym) {
            return res.status(400).json({ error: 'Otp is invalid or has expired' });
        }
        res.status(200).json({ message: 'OTP is Successfully Verified' });



    } catch (err) {
        res.status(500).json({
            error: "Server Error"
        })
    }
}


//This is the controller for gym profile
exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const gym = await Gym.findOne({ email });

        if (!gym) {
            return res.status(400).json({ error: 'Some Technical Issue , please try again later' })
        }
        const hashedPassword = await bcrypts.hash(newPassword, 10);
        gym.password = hashedPassword;
        gym.resetPasswordToken = undefined;
        gym.resetPasswordExpires = undefined;

        await gym.save();

        res.status(200).json({ message: "Password Reset Successfully" })



    } catch (err) {
        res.status(500).json({
            error: "Server Error"
        })
    }
}
// exports.checking =(req,res) => {
//     console.log(req.gym)
// }

exports.logout = async (req, res) => {
    res.clearCookie('cookie_token', cookieOptions).json({ message: 'Logged out successfully' });
}



exports.updateProfilePic = async (req, res) => {
    try {
        const { profilePic } = req.body;

        // ID comes from auth middleware
        const gym = await Gym.findById(req.gym._id);

        if (!gym) {
            return res.status(404).json({ error: "Gym not found" });
        }

        gym.profilePic = profilePic;
        await gym.save();

        res.status(200).json({
            message: "Profile picture updated successfully",
            profilePic: gym.profilePic
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server Error" });
    }
};

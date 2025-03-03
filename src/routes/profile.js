const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const {validateProfileEditData} = require("../utils/validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const nodemailer = require("nodemailer");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try{
        const user = req.user;
        res.send(user);
    } catch(err) {
        res.send("ERROR: "+err.message)
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try{
        if(!validateProfileEditData(req)){
            throw new Error("Invalid Edit Request");
        }

        const loggedInUser = req.user;
        
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

        const data = req.body;

        const updatedUser = await User.findOneAndUpdate({ _id: loggedInUser._id }, data, { 
            new: true,
            runValidators: true
        }).select("firstName lastName emailId photoUrl about skills age gender");
        res.json({
            message: "User Update Successful",
            data: updatedUser
        })

    } catch(err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

profileRouter.post("/profile/password/forgot", async (req, res) => {
    try{
        const email = req.body.email;
        const user = await User.findOne({emailId: email});
        console.log(user);
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '10m'});

        // Sending token to user's email
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Email Config
        const mailOptions = {
            from: process.env.EMAIL,
            to: req.body.email,
            subject: "Reset Password",
            html: `<h1>Reset Your Password</h1>
                <p>Click on the following link to reset your password:</p>
                <a href="http://localhost:5173/reset-password/${token}">http://localhost:5173/reset-password/${token}</a>
                <p>The link will expire in 10 minutes.</p>
                <p>If you didn't request a password reset, please ignore this email.</p>`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if(err) {
                return res.status(500).send({message: err.message});
            }
            res.status(200).send({message: "Email sent!"});
        });
    } catch(err) {
        res.send("ERROR: " + err.message);
    }
})

profileRouter.patch("/profile/password/reset", async (req, res) => {
    try{
        console.log(req.params.reset_token);
        const decodedToken = jwt.verify(req.query.reset_token, proces.env.JWT_SECRET);
        if(!decodedToken){
            return res.status(401).send({message: "Invalid token"});
        }
        const {_id} = decodedToken;
        const user = await User.findById(_id);

        const newPassword = await bcrypt.hash(req.body.newPassword, 10);

        user.password = newPassword;

        await user.save();
        res.status(200).send({message: "Password Updated!"});

    } catch(err) {
        res.send("ERROR: " + err.message);
    }
})

module.exports = profileRouter;
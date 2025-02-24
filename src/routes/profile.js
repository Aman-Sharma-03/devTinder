const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const {validateProfileEditData} = require("../utils/validation");
const User = require("../models/user");

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
        });
        res.json({
            message: "User Update Successful",
            data: updatedUser
        })

    } catch(err) {
        res.send("ERROR: " + err.message);
    }
})

module.exports = profileRouter;
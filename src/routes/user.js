const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "about","age", "gender", "skills"];

// Get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA)



        res.json({
            message: "Data fetched Successfully",
            data: connectionRequests
        })
    } catch( err){
        res.status(400).send("ERROR: "+err.message);
    }
})

// Get all the sent connection request
userRouter.get("/user/requests/sent", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const sentConnectionRequests = await ConnectionRequest.find({
            fromUserId: loggedInUser._id,
            status: "interested"
        }).populate("toUserId", USER_SAFE_DATA);



        res.json({
            message: "Data fetched Successfully",
            data: sentConnectionRequests
        })
    } catch( err){
        res.status(400).send("ERROR: "+err.message);
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const sentConnectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted"},
                { toUserId: loggedInUser._id, status: "accepted"}
            ],
            
        }).populate("fromUserId", USER_SAFE_DATA);

        const data = sentConnectionRequests.map((row) => row.fromUserId);

        res.json({
            message: "Data fetched Successfully",
            data: data
        })
    } catch( err){
        res.status(400).send("ERROR: "+err.message);
    }
})

module.exports = userRouter;
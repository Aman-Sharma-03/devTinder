const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const User = require("../models/user");

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
            
        }).populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

        const data = sentConnectionRequests.map((row) => {
            // cannot compare to mongoose object id => coverting to the string and then checking
            // accepted status can be from the fromUser or toUser
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({
            message: "Data fetched Successfully",
            data: data
        })
    } catch( err){
        res.status(400).send("ERROR: "+err.message);
    }
})

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try{
        // User should see all the card except 
        // 0. his own
        // 1. his connections
        // 2. ignored people
        // 3. already sent the connectio request

        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const skip = (page-1)*limit;
        limit = limit > 50 ? 50 : limit;

        // Don't want these users in our feed
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        // Including our own profile
        const hideUserFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        })

        const users = await User.find({
            $and: [
                {_id: { $nin: Array.from(hideUserFromFeed) }},
                {_id: { $ne: loggedInUser._id}}
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.json({data: users});
    } catch(err) {
        res.status(400).json({message: err.message});
    }
})

module.exports = userRouter;
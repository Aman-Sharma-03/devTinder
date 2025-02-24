const express = require("express")
const requestRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require("../models/connectionRequest");
const { findOne } = require("../models/user");
const User = require("../models/user")

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        // Also handled on the Schema level using pre 
        // if(fromUserId === toUserId){
        //     return res.status(400).json({message: "Operation Not Allowed"})
        // }

        const allowedStatus = ["interested", "ignored"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message: "Invalid status type"
            });
        }

        // Check if there is an existing connection from the user
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        })

        if(existingConnectionRequest){
            return res.status(400).json({
                message: "Connection Request Already exists!"
            })
        }
        const connectionRequest = new ConnectionRequest({fromUserId,toUserId,status});
        
        // Check the toUserId
        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({message: "User not Found"});
        }
        const data = await connectionRequest.save();
        res.json({
            message: "Connection Request Sent!",
            data
        });


    } catch(err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const status = req.params.status;
        const requestId = req.params.requestId;
        // validate status
        const allowedStatus = ["accepted", "rejected"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message: "Status not allowed"
            })
        }


        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested",
        });
        if(!connectionRequest){
            return res.status(404).json({message: "Connetion request not found"});
        }
        connectionRequest.status = status;
        await connectionRequest.save()
        res.json({message: "Connection request: "+status})

    } catch(err) {
        res.status(400).json("ERROR: "+err.message);
    }

})

module.exports = requestRouter;
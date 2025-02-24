const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`,
        }
    }
}, {
    timestamps: true,
})

connectionRequestSchema.pre("save", function(next) {
    const connectionRequest = this;
    // Check if fromuserId is same as toUserId
    if(connectionRequest.fromUserId === connectionRequest.toUserId){
        throw new Error("Cannot send connection to yourself");
    }
    next();
})

connectionRequestSchema.index({fromUserId: 1, toUserId: 1});

const connectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = connectionRequestModel;
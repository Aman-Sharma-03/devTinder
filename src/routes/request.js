const express = require('express');
const requestRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const { getIO } = require('../socket');

const sendEmail = require('../utils/sendEmail');

requestRouter.post(
  '/request/send/:status/:toUserId',
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // Also handled on the Schema level using pre
      // if(fromUserId === toUserId){
      //     return res.status(400).json({message: "Operation Not Allowed"})
      // }

      const allowedStatus = ['interested', 'ignored'];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: 'Invalid status type',
        });
      }

      // Check if there is an existing connection from the user
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({
          message: 'Connection Request Already exists!',
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      // Check the toUserId
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: 'User not Found' });
      }
      let data = null;
      data = await connectionRequest.save();
      if (status === 'interested') {
        const emailRes = await sendEmail.run(
          'You got a New Connection Request from ' + req.user.firstName,
          `<div>Hey ${toUser.firstName}, You got a new connection request from ${req.user.firstName} on devTinder. Please login to your account to review the request. <a href="https://www.devtinder.in">devtinder.in</a></div>`
        );
        console.log(emailRes);
      }
      console.log('hi');
      const io = getIO();
      io.to(toUserId.toString()).emit('receive_request', {
        from: fromUserId.toString(),
        message:
          req.user.firstName +
          ' ' +
          req.user.lastName +
          ' sent you a connection request',
      });

      res.json({
        message: 'Connection Request Sent!',
        data,
      });
    } catch (err) {
      console.log(err.message);
      res.status(400).send('ERROR: ' + err.message);
    }
  }
);

requestRouter.post(
  '/request/review/:status/:requestId',
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const status = req.params.status;
      const requestId = req.params.requestId;
      // validate status
      const allowedStatus = ['accepted', 'rejected'];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: 'Status not allowed',
        });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: 'interested',
      });
      if (!connectionRequest) {
        return res.status(404).json({ message: 'Connetion request not found' });
      }
      connectionRequest.status = status;
      await connectionRequest.save();
      if (status === 'accepted') {
        const io = getIO();
        io.to(connectionRequest.fromUserId.toString()).emit(
          'request_accepted',
          {
            from: loggedInUser._id.toString(),
            name: loggedInUser.firstName + ' ' + loggedInUser.lastName,
            message: `${loggedInUser.firstName} accepted your connection request!`,
          }
        );
      }
      res.json({ message: 'Connection request: ' + status });
    } catch (err) {
      res.status(400).json('ERROR: ' + err.message);
    }
  }
);

module.exports = requestRouter;

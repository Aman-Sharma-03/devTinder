const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send('Please Login');
    }

    const { _id } = jwt.verify(token, 'Abrakadabra');

    const user = await User.findOne({ _id });
    if (!user) {
      throw new Error('User not found');
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const socketAuthUser = async (socket, next) => {
  try {
    const cookieHeader = socket.request.headers.cookie;
    if (!cookieHeader) {
      throw new Error('No cookies found');
    }
    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map((cookie) => cookie.split('='))
    );

    const token = cookies.token;
    if (!token) {
      throw new Error('Token not found in cookies');
    }
    const { _id } = jwt.verify(token, 'Abrakadabra');
    const user = await User.findOne({ _id });
    if (!user) {
      throw new Error('User not found');
    }
    socket.user = user;
    next();
  } catch (err) {
    next(new Error('Error Authenticating socket'));
  }
};

module.exports = { userAuth, socketAuthUser };

const { Server } = require('socket.io');
const { socketAuthUser } = require('./middlewares/auth');

let io;

const init = (server) => {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
    },
  });
  io.use(socketAuthUser);

  io.on('connection', (socket) => {
    console.log('Socket Connected:', socket.id);
    const user = socket.user;
    if (user && user._id) {
      const userId = user._id;
      socket.join(userId.toString());
      console.log(userId + ' joined there personal room');
    }
    socket.on('disconnect', (reason) => {
      console.log('Socket Disconnected:', socket.id, 'Reason:', reason);
    });
  });
  return io;
};

const getIO = () => {
  try {
    if (!io) throw new Error('Socket.io is not initialized');
    return io;
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { init, getIO };

const express = require('express');
// const bodyParser = require("./custom/bodyParser");
const bodyParser = require('body-parser');
const { connectDB } = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

require('dotenv').config();

// Custom BodyParser

const allowedOrigins = [
  'http://localhost:5173',
  'https://dev-tinder-web-eta.vercel.app',
  'https://devhive.jaii.in',
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log('Incoming origin:', origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ✅ Handle preflight OPTIONS
app.use(bodyParser.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log('Server running at port: ', PORT, '...');
    });
    console.log('Database connection established...');
  })
  .catch((err) => {
    console.log('Database cannot be connected!!' + err);
  });

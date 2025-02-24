const express = require('express');
// const bodyParser = require("./custom/bodyParser");
const bodyParser = require('body-parser');
const {connectDB} = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();

require("dotenv").config();

// Custom BodyParser
app.use(bodyParser.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

const PORT = process.env.PORT || 3000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log("Server running at port: ", PORT, "...");
        })
        console.log("Database connection established...");
    })
    .catch((err) => {
        console.log("Database cannot be connected!!");
    });
const express = require('express');
const bodyParser = require("./custom/bodyParser");
// const bodyParser = require('body-parser');
const {connectDB} = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();

// Custom BodyParser
app.use(bodyParser);
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB()
    .then(() => {
        app.listen(3000, () => {
            console.log("Server running at port: ", 3000, "...");
        })
        console.log("Database connection established...");
    })
    .catch((err) => {
        console.log("Database cannot be connected!!");
    });
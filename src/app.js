const express = require('express');
const bodyParser = require("./custom/bodyParser");
// const bodyParser = require('body-parser');
const {connectDB} = require("./config/database");
const User = require("./models/user")
const bcrypt = require("bcrypt");
const {validateSignUpData, validateLoginData} = require("./utils/validation")
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require('./middlewares/auth');

const app = express();

const PORT = 3000 || process.env.PORT;

// Custom BodyParser
app.use(bodyParser);

app.use(cookieParser());

app.post("/login", async (req, res) => {
    try{
        const {emailId, password} = req.body;
        validateLoginData(req);
        const user = await User.findOne({emailId: emailId});
        if(!user) {
            throw new Error("User doesn't exist");
        }
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            const token = await user.getJWT();
            res.cookie("token", token, { expires: new Date(Date.now()+604800000)});
            res.send("Login Successfull");
        } else {
            throw new Error("Invalid credentials");
        }
    } catch(err){
        res.status(400).send("Error: "+ err.message);
    }
})

// User SignUp
app.post("/signup", async (req, res) => {

    try {
        // Validation of the data
        validateSignUpData(req);

        const {firstName, lastName, emailId, password} = req.body;

        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Store the data
        const user = new User({
            firstName,
            lastName, 
            emailId, 
            password: passwordHash, 
        })

        const createdUser = await user.save();
        res.send("User Created Successfully");
    } catch(err){
        console.log("Error Creating user" + err.message);
        res.status(400).send(err.message);
    }
})

app.get("/profile", userAuth, async (req, res) => {
    try{
        const user = req.user;
        res.send(user);
    } catch(err) {
        res.send("ERROR: "+err.message)
    }
})

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user;

    
    // Sending a connection request

    res.send(user.firstName+" Sent the connection request");
})

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
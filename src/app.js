const express = require('express');
const bodyParser = require("./custom/bodyParser");
// const bodyParser = require('body-parser');
const {connectDB} = require("./config/database");
const User = require("./models/user")
const bcrypt = require("bcrypt");
const {validateSignUpData, validateLoginData} = require("./utils/validation")
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();

const PORT = 3000 || process.env.PORT;

// Custom BodyParser
app.use(bodyParser);

app.use(cookieParser());

app.post("/login", async (req, res) => {
    try{
        const {emailId, password} = req.body;
        // Validation
        validateLoginData(req);

        const user = await User.findOne({emailId: emailId});
        if(!user) {
            throw new Error("User doesn't exist");
        }
        
        // compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(isPasswordValid){

            // Create a JWT Token
            const token = await jwt.sign({ _id: user._id }, "Abrakadabra");

            // Add the token to the cookie and send a response back to the user
            res.cookie("token", token);

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

app.get("/profile", async (req, res) => {
    try{
        const {token} = req.cookies;
        if(!token){
            throw new Error("Invalid Token");
        }
        // Validate my token
        const {_id} = jwt.verify(token, "Abrakadabra");
        
        const user = await User.findOne({_id});
        if(!user){
            throw new Error("User doesn't exist, please try logging in again");
        }
        
        res.send(user);
    } catch(err) {
        res.send("ERROR: "+err.message)
    }
})

// Find user by email
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    try{
        const user = await User.findOne({emailId: userEmail});
        if(!user){
            res.status(404).send("User Not Found");
        } else {
            res.send(user);
        }
    } catch(err) {
        res.status(400).send("Something went wrong");
    }
})

// Delete user from database
app.delete("/user", async(req, res) => {
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("User Deleted Successfully");
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
})

// Fetching the feed
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch(err) {
        res.status(400).send("Something went wrong")
    }
})

// Update user
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    try{
        const ALLOWED_UPDATES = ["userId", "photoUrl", "about", "gender", "age", "skills"]

        const isUpdateAllowed = Object.keys(data).every(k => ALLOWED_UPDATES.includes(k))

        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }
        if(data?.skills?.length >= 10){
            throw new Error("Skills cannot be more than 10");
        }
        const deletedUser = await User.findByIdAndUpdate(userId, data, {
            returnDocument: "after", 
            runValidators: true
        });
        res.send("User Updated successfully");
    } catch(err) {
        res.status(400).send("Something went wrong" + err.message);
    }
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
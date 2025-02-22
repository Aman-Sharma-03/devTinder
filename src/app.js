const express = require('express');
const bodyParser = require("./custom/bodyParser");
// const bodyParser = require('body-parser');
const {connectDB} = require("./config/database");
const User = require("./models/user")

const app = express();

const PORT = 3000 || process.env.PORT;

// Custom BodyParser
app.use(bodyParser);

// User SignUp
app.post("/signup", async (req, res) => {
    try {
        const user = new User(req.body);
        const createdUser = await user.save();
        res.send({
            "New User": createdUser
        });
    } catch(err){
        console.log("Error Creating user");
        res.status(400).send(err.message);
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
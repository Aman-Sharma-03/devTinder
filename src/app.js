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
    const user = new User(req.body);
    try {
        const createdUser = await user.save();
        res.send({
            "New User": createdUser
        });
    } catch(err){
        console.log("Error Creating user: ", err);
        res.status(400).send("Error Creating an User: ", err.message);
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
app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try{
        const deletedUser = await User.findByIdAndUpdate(userId, data, {returnDocument: "after"});
        res.send("User Updated successfully");
    } catch(err) {
        res.status(400).send("Something went wrong");
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
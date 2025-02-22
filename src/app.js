const express = require('express');
const bodyParser = require("body-parser");
const {connectDB} = require("./config/database");
const User = require("./models/user")

const app = express();

const PORT = 3000 || process.env.PORT;

app.use(bodyParser.json());

app.post("/signup", async (req, res) => {
    const userObj = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailId: req.body.emailId,
        password: req.body.password,
    }
    const user = new User(userObj);
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
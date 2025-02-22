const express = require('express');
const bodyParser = require("./custom/bodyParser");
// const bodyParser = require('body-parser');
const {connectDB} = require("./config/database");
const User = require("./models/user")

const app = express();

const PORT = 3000 || process.env.PORT;

// Custom BodyParser
app.use(bodyParser);

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
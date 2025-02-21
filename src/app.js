const express = require('express');

const app = express();

const PORT = 3000 || process.env.PORT;

app.get("/getUserData", (req, res, next) => {
    // Try writing everything inside try and catch
    try{

    } catch(err){

    }
    // Logic of DB call and get user data
    throw new Error("asdfk"); // error apart from the db
    res.send("User Data Sent");
})

app.use("/", (err, req, res, next) => {
    if(err){
        // Log your errors
        // console.log(err);
        res.status(500).send("something went wrong");
    }
})

app.listen(PORT, () => {
    console.log("Server running at port: ", PORT, "...");
})
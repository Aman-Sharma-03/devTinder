const express = require('express');
const {userAuth} = require("./middlewares/auth");

const app = express();

app.use(userAuth);

const PORT = 3000 || process.PORT

app.get("/", (req, res) => {
    res.send({
        firstname: "jai",
        lastname: "sharma",
    })
})


app.listen(PORT, () => {
    console.log("Server running at port: ", PORT, "...");
})
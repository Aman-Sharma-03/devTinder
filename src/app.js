const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// app.use(bodyParser);

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
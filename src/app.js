const express = require('express');


const app = express();

const PORT = 3000 || process.PORT

app.use("/test", (req, res) => {
    res.send("Hello from the server!")
});


app.listen(PORT, () => {
    console.log("Server running at port: ", PORT, "...");
})
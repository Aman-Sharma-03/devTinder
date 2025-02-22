const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://jai:1gkqfFHsT0av3XSb@namastenode-c1.coegz.mongodb.net/devTinder");
};

module.exports = {connectDB};
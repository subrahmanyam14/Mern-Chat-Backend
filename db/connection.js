const mongoose = require("mongoose");

const Connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("connected to the MongoDb...");
    } catch (error) {
        console.log("Error occur in the MongoDb connection: ", error.message);
    }
}

module.exports = Connection;
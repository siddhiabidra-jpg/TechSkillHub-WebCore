const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const user = encodeURIComponent(process.env.MONGO_USER);
        const password = encodeURIComponent(process.env.MONGO_PASSWORD);
        const host = process.env.MONGO_HOST;

        const uri = `mongodb+srv://${user}:${password}@${host}/techskillhub_webcore?retryWrites=true&w=majority`;

        await mongoose.connect(uri);

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
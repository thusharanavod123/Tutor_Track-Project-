import mongoose from "mongoose";

const connectMongoDB = async () => {
    if (!process.env.MONGO_URI) {
        console.error("Error: MONGO_URI is not defined in the environment variables.");
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Mongodb connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

export default connectMongoDB;
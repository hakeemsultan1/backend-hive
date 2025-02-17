import mongoose from "mongoose";

async function connectDB() {
    try {
        let connection = await mongoose.connect(process.env.URI);
        if (connection) {
            console.log("Database connected");
        }
        else {
            console.log("Database not connected");
        }
    } catch (error) {
        console.log(error);
    }
}

export default connectDB
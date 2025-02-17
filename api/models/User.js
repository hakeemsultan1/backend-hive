import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, default: "" },
    email: String,
    password: String,
    phone: { type: String, default: "" },
    role: String,
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
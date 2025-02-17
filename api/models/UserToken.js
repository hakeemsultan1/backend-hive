import mongoose from "mongoose";

const userTokenSchema = new mongoose.Schema({
    userId: mongoose.Types.ObjectId,
    token: String,
}, { timestamps: true });

const UserToken = mongoose.model("UserToken", userTokenSchema);

export default UserToken;
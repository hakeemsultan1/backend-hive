import mongoose from "mongoose";

const rigSchema = new mongoose.Schema({
    name: String,
    createdBy: String,
    isDeleted: { type: Boolean, default: false },
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const Rig = mongoose.model("Rig", rigSchema);

export default Rig;
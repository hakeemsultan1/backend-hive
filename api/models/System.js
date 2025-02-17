import mongoose from "mongoose";

const systemSchema = new mongoose.Schema({
    name: String,
    createdBy: String,
    isDeleted: { type: Boolean, default: false },
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    rig: {
        id: { type: mongoose.Types.ObjectId, ref: "Rig" },
        name: String
    },
}, { timestamps: true });

const System = mongoose.model("System", systemSchema);

export default System;
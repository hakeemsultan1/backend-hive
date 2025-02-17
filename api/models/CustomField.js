import mongoose from "mongoose";

const customFieldSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    createdBy: String,
    uniqueKey: { type: String, unique: true },
    name: String,
    type: String,
    preFilValue: [String],
    module: String,
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const CustomField = mongoose.model("CustomField", customFieldSchema);

export default CustomField;
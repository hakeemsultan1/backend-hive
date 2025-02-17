import mongoose from "mongoose";

const partSchema = new mongoose.Schema({
    workOrder: { type: mongoose.Types.ObjectId, ref: "WorkOrder" },
    addedBy: { type: mongoose.Types.ObjectId, ref: "User" },
    part: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory" },
    quantity: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const Part = mongoose.model("Part", partSchema);

export default Part;
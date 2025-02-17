import mongoose from "mongoose";

const inspectionSchema = new mongoose.Schema({
    workOrder: { type: mongoose.Types.ObjectId, ref: "WorkOrder" },
    addedBy: { type: mongoose.Types.ObjectId, ref: "User" },
    rigNumber: { type: String, default: "" },
    parentAsset: { type: String, default: "" },
    date: { type: String, default: "" },
    supervisor: { type: String, default: "" },
    inspectedBy: { type: String, default: "" },
    recurring: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const Inspection = mongoose.model("Inspection", inspectionSchema);

export default Inspection;
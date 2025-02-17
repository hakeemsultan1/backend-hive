import mongoose from "mongoose";

const manHourSchema = new mongoose.Schema({
    manHours: { type: Number, default: 0 },
    workOrder: { type: mongoose.Types.ObjectId, ref: "WorkOrder" },
    performedBy: { type: String, default: "" },
    addedBy: { type: mongoose.Types.ObjectId, ref: "User" },
    companyDoingWork: { type: String, default: "" },
    rate: { type: String, default: "" },
    comment: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const ManHour = mongoose.model("ManHour", manHourSchema);

export default ManHour;
import mongoose from "mongoose";

const workOrderTimeSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    workOrder: { type: mongoose.Types.ObjectId, ref: "WorkOrder" },
    startTime: { type: Date, default: null },
    endTime: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const WorkOrderTime = mongoose.model("WorkOrderTime", workOrderTimeSchema);

export default WorkOrderTime;
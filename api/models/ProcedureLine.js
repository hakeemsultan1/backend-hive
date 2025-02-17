import mongoose from "mongoose";

const procedureLineSchema = new mongoose.Schema({
    workOrder: { type: mongoose.Types.ObjectId, ref: "WorkOrder" },
    addedBy: { type: mongoose.Types.ObjectId, ref: "User" },
    safetyTrainingDocumented: { type: String, default: "" },
    comment: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const ProcedureLine = mongoose.model("ProcedureLine", procedureLineSchema);

export default ProcedureLine;
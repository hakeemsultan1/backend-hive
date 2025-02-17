import mongoose from "mongoose";

const workOrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    createdBy: String,
    costCenter: { type: String, default: "" },
    issueIdentification: { type: String, default: "" },
    date: { type: String, default: "" },
    time: { type: String, default: "" },
    problemDescription: { type: String, default: "" },
    asset: {
        id: { type: mongoose.Types.ObjectId, ref: "Asset" },
        name: String,
        description: String
    },
    completedDate: { type: Date, default: null },
    affectedEquipment: { type: String, default: "" },
    immediateConcerns: { type: String, default: "" },
    initialAssessment: { type: String, default: "" },
    priorityLevel: { type: String, default: "" },
    technicianAssignment: { type: String, default: "" },
    estimatedCompletionTime: { type: String, default: "" },
    requiredParts: { type: String, default: "" },
    statusUpdates: { type: String, default: "" },
    checkIn1: { type: String, default: "" },
    checkIn2: { type: String, default: "" },
    checkIn3: { type: String, default: "" },
    repairedActionsTaken: { type: String, default: "" },
    partsReplaced: { type: String, default: "" },
    finalStatus: { type: String, default: "" },
    summary: { type: String, default: "" },
    type: { type: String, default: "unplanned" },
    status: { type: String, default: "pending" },
    isDeleted: { type: Boolean, default: false },
    companyDoingWork: { type: String, default: "" },
    personDoingWork: { type: String, default: "" },
    comments: { type: String, default: "" },
    recurring: { type: String, default: "" },
    parentAsset: { type: String, default: "" },
    inspectedBy: { type: String, default: "" },
    supervisor: { type: String, default: "" },
    physicalLocation: { type: String, default: "" },
    safetyTrainingDocumented: { type: String, default: "" },
    procedureComments: { type: String, default: "" },
}, { timestamps: true });

const WorkOrder = mongoose.model("WorkOrder", workOrderSchema);

export default WorkOrder;
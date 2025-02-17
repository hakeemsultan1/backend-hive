import mongoose from "mongoose";

const costSchema = new mongoose.Schema({
    workOrder: { type: mongoose.Types.ObjectId, ref: "WorkOrder" },
    addedBy: { type: mongoose.Types.ObjectId, ref: "User" },
    costType: { type: String, default: "" },
    item: { type: String, default: "" },
    description: { type: String, default: "" },
    quantity: { type: String, default: "" },
    costEach: { type: String, default: "" },
    currency: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const Cost = mongoose.model("Cost", costSchema);

export default Cost;
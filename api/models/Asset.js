import mongoose from "mongoose";

const assetSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    createdBy: String,
    physicalLocation: { type: String, default: "" },
    mainSystem: { type: String, default: "" },
    rfidBarCode: { type: String, default: "" },
    accountingDept: { type: String, default: "" },
    parentAsset: { type: String, default: "" },
    childAsset: { type: String, default: "" },
    assetNumber: { type: String, default: "" },
    serialNumber: { type: String, default: "" },
    duration: { type: Number, default: 180 },
    make: { type: String, default: "" },
    model: { type: String, default: "" },
    part: { type: String, default: "" },
    description: { type: String, default: "" },
    specDetails: { type: String, default: "" },
    installedDate: { type: String, default: "" },
    supplier: { type: String, default: "" },
    criticality: { type: String, default: "" },
    originalMfrDate: { type: String, default: "" },
    condition: { type: String, default: "" },
    maintStartDate: { type: String, default: "" },
    maintStatus: { type: String, default: "" },
    customFields: [{ uniqueKey: String, value: mongoose.Schema.Types.Mixed }],
    isDeleted: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

const Asset = mongoose.model("Asset", assetSchema);

export default Asset;
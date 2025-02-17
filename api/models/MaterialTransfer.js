import mongoose from "mongoose";

const materialTransferSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    createdBy: String,
    origination: { type: String, default: "" },
    destination: { type: String, default: "" },
    materialTransferType: { type: String, default: "" },
    transporter: { type: String, default: "" },
    attentionTo: { type: String, default: "" },
    comments: { type: String, default: "" },
    misc: { type: String, default: "" },
    link: { type: String, default: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
    isDeleted: { type: Boolean, default: false },
    customFields: [{ uniqueKey: String, value: mongoose.Schema.Types.Mixed }],
    inventory: { type: [String], default: [] },
    assets: [{
        id: { type: mongoose.Types.ObjectId, ref: "Asset" },
        condition: { type: String, default: "" },
        transferReason: { type: String, default: "" },
    }],
}, { timestamps: true });

const MaterialTransfer = mongoose.model("MaterialTransfer", materialTransferSchema);

export default MaterialTransfer;
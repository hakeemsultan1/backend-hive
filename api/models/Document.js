import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    asset: {
        id: { type: mongoose.Types.ObjectId, ref: "Asset" },
        name: String
    },
    materialTransfer: {
        id: { type: mongoose.Types.ObjectId, ref: "MaterialTransfer" },
        name: String
    },
    workOrder: {
        id: { type: mongoose.Types.ObjectId, ref: "WorkOrder" },
        name: String
    },
    uploadedBy: String,
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    createdBy: String,
    category: { type: String, default: "" },
    link: { type: String, default: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
    type: String,
    description: String,
    comment: String,
    title: String,
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const Document = mongoose.model("Document", documentSchema);

export default Document;
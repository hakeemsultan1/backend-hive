import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    createdBy: String,
    partName: { type: String, default: "" },
    partItem: { type: String, default: "" },
    category: { type: String, default: "" },
    details: { type: String, default: "" },
    quantity: { type: String, default: "" },
    price: { type: String, default: "" },
    location: { type: String, default: "" },
    PO: { type: String, default: "" },
    SO: { type: String, default: "" },
    invoiceNumber: { type: String, default: "" },
    supplier: { type: String, default: "" },
    receivedDate: { type: String, default: "" },
    customFields: [{ uniqueKey: String, value: mongoose.Schema.Types.Mixed }],
    isDeleted: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
})

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;
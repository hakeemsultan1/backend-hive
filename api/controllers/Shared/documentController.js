import Asset from "../../models/Asset.js";
import Document from "../../models/Document.js";
import MaterialTransfer from "../../models/MaterialTransfer.js";
import WorkOrder from "../../models/WorkOrder.js";

export const addDocument = async (req, res) => {
    try {
        let data = req.body;
        let existDocument = await Document.findOne({ title: "Test#%$" });
        if (existDocument) {
            return res.status(400).json({ error: "Document already exists" });
        } else if (data.asset != null && data.asset != undefined && data.asset != "") {
            // console.log(data.asset);
            let asset = await Asset.findOne({ _id: data.asset });
            if (!asset) {
                return res.status(400).json({ error: "Asset not found" });
            } else {
                let assetData = { name: asset.serialNumber, id: asset._id };
                data.asset = assetData;
                data.uploadedBy = req.user.role;
                data.userId = req.user.id;
                let document = { ...data };
                let newDocument = await Document.create(document);
                return res.status(200).json({ message: "Document added successfully", data: newDocument });
            }
        } else if (data.materialTransfer != null && data.materialTransfer != undefined && data.materialTransfer != "") {
            let materialTransfer = await MaterialTransfer.findOne({ _id: data.materialTransfer });
            if (!materialTransfer) {
                return res.status(400).json({ error: "Material Transfer not found" });
            } else {
                let materialTransferData = { name: materialTransfer.origination, id: materialTransfer._id };
                data.materialTransfer = materialTransferData;
                data.uploadedBy = req.user.role;
                data.userId = req.user.id;
                let document = { ...data };
                let newDocument = await Document.create(document);
                return res.status(200).json({ message: "Document added successfully", data: newDocument });
            }
        } else if (data.workOrder != null && data.workOrder != undefined && data.workOrder != "") {
            let workOrder = await WorkOrder.findOne({ _id: data.workOrder });
            if (!workOrder) {
                return res.status(400).json({ error: "Work Order not found" });
            } else {
                let workOrderData = { name: workOrder.affectedEquipment, id: workOrder._id };
                data.workOrder = workOrderData;
                data.uploadedBy = req.user.role;
                data.userId = req.user.id;
                let document = { ...data };
                let newDocument = await Document.create(document);
                return res.status(200).json({ message: "Document added successfully", data: newDocument });
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getDocuments = async (req, res) => {
    try {
        // let assetId = new mongoose.Types.ObjectId(String(req.params.assetId));
        let documents = await Document.find({ isDeleted: false }).sort({ createdAt: -1 }).select("-__v -updatedAt -isDeleted").populate("userId");
        return res.status(200).json({ data: documents });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const linkDocument = async (req, res) => {
    try {
        let data = req.body;
        if (!data.link) {
            return res.status(400).json({ error: "Link not found" });
        } else if (data.asset != null && data.asset != undefined && data.asset != "") {
            let asset = await Asset.findOne({ _id: data.asset });
            if (!asset) {
                return res.status(400).json({ error: "Asset not found" });
            } else {
                data.asset = { name: asset.serialNumber, id: asset._id };
                data.uploadedBy = req.user.role;
                data.userId = req.user.id;
                let document = { ...data };
                let newDocument = await Document.create(document);
                return res.status(200).json({ message: "Document linked successfully", data: newDocument });
            }
        } else if (data.materialTransfer != null && data.materialTransfer != undefined && data.materialTransfer != "") {
            let materialTransfer = await MaterialTransfer.findOne({ _id: data.materialTransfer });
            if (!materialTransfer) {
                return res.status(400).json({ error: "Material Transfer not found" });
            } else {
                data.materialTransfer = { name: materialTransfer.origination, id: materialTransfer._id };
                data.uploadedBy = req.user.role;
                data.userId = req.user.id;
                let document = { ...data };
                let newDocument = await Document.create(document);
                return res.status(200).json({ message: "Document linked successfully", data: newDocument });
            }
        } else if (data.workOrder != null && data.workOrder != undefined && data.workOrder != "") {
            let workOrder = await WorkOrder.findOne({ _id: data.workOrder });
            if (!workOrder) {
                return res.status(400).json({ error: "Work Order not found" });
            } else {
                data.workOrder = { name: workOrder.affectedEquipment, id: workOrder._id };
                data.uploadedBy = req.user.role;
                data.userId = req.user.id;
                let document = { ...data };
                let newDocument = await Document.create(document);
                return res.status(200).json({ message: "Document linked successfully", data: newDocument });
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

import CustomField from "../../models/CustomField.js";


export async function addCustomField(req, res) {
    try {
        let module = req.query.module;
        let user = req.user;
        let data = req.body;
        data.createdBy = user.role;
        data.userId = user.id;
        let uniqueKey = data.name.replace(/\s/g, "_").toLowerCase() + "_" + Date.now().toString();
        data.uniqueKey = uniqueKey;
        data.module = module;
        let customField = await CustomField.create(data);
        return res.status(200).json({ message: "Custom Field added successfully", data: customField });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getCustomFields(req, res) {
    try {
        let module = req.query.module;
        if (!module) {
            let customFields = await CustomField.find({ isDeleted: false }).select("-__v -createdAt -updatedAt -isDeleted").lean();
            return res.status(200).json({ data: customFields });
        }
        let customFields = await CustomField.find({ module: module, isDeleted: false }).select("-__v -createdAt -updatedAt -isDeleted").lean();
        return res.status(200).json({ data: customFields });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getAllCustomFields(req, res) {
    try {
        let customFields = await CustomField.find({ isDeleted: false }).lean();
        return res.status(200).json({ data: customFields });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteCustomField(req, res) {
    try {
        let id = req.params.id;
        await CustomField.findOneAndUpdate({ _id: id }, { isDeleted: true });
        return res.status(200).json({ message: "Custom Field deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
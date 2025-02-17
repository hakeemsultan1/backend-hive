import createCSV from "../../helpers/csvCreater.js";
// import uploadToCloudinary from "../../helpers/cloudinary.js";
import path from "path";
import Asset from "../../models/Asset.js";
import User from "../../models/User.js";
import fs from "fs";
import CustomField from "../../models/CustomField.js";
import MaterialTransfer from "../../models/MaterialTransfer.js";
import Document from "../../models/Document.js";
async function addAsset(req, res) {
    try {
        const user = req.user;
        const data = req.body;
        let existUser = await User.findOne({ _id: user.id });
        if (!existUser) {
            return res.status(400).json({ error: "User not found" });
        } else {
            let existAsset = await Asset.findOne({ serialNumber: data.serialNumber });
            if (existAsset) {
                return res.status(400).json({ error: "Asset already exists" });
            } else {
                // let rig = await Rig.findOne({ _id: data.rig });
                // if (!rig) {
                //     return res.status(400).json({ error: "Rig not found" });
                // } else {
                //     let rigData = { name: rig.name, id: rig._id };
                //     data.rig = rigData;
                // }
                // let system = await System.findOne({ _id: data.system });
                // if (!system) {
                //     return res.status(400).json({ error: "System not found" });
                // } else {
                //     let systemData = { name: system.name, id: system._id };
                //     data.system = systemData;
                // }
                data.createdBy = req.user.role;
                let asset = { userId: user.id, ...data };
                let newAsset = await Asset.create(asset);
                return res.status(200).json({ message: "Asset added successfully", data: newAsset });
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getAssets(req, res) {
    try {
        const query = req.body;
        let findQuery = { $and: [{ isDeleted: false }] };
        const queryKeys = Object.keys(query);
        for (let i = 0; i < queryKeys.length; i++) {
            if (query[queryKeys[i]] != '')
                findQuery.$and.push({ [queryKeys[i]]: query[queryKeys[i]] });
        }
        let assets = await Asset.find(findQuery).sort({ createdAt: -1 }).select("-__v -createdAt -updatedAt -isDeleted -isAvailable").lean();
        for (let i = 0; i < assets.length; i++) {
            let customFields = assets[i].customFields ? assets[i].customFields : [];
            for (let j = 0; j < customFields.length; j++) {
                let field = await CustomField.findOne({ uniqueKey: customFields[j].uniqueKey }).select("name");
                customFields[j].name = field.name;
            }
            assets[i].customFields = customFields;
        }
        return res.status(200).json({ data: assets });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getAssestsAll(req, res) {
    try {
        let assets = await Asset.find({ isDeleted: false }).sort({ createdAt: -1 }).select("-__v -createdAt -updatedAt -isDeleted -isAvailable").lean();
        for (let i = 0; i < assets.length; i++) {
            let customFields = assets[i].customFields ? assets[i].customFields : [];
            for (let j = 0; j < customFields.length; j++) {
                let field = await CustomField.findOne({ uniqueKey: customFields[j].uniqueKey }).select("name");
                customFields[j].name = field.name;
            }
            assets[i].customFields = customFields;
        }
        return res.status(200).json({ data: assets });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


async function getAssetDetails(req, res) {
    try {
        let slug = req.query.slug;
        if (!slug) {
            return res.status(400).json({ message: "Asset not found" });
        }
        let asset = await Asset.findOne({ _id: slug }).lean();
        if (!asset) {
            return res.status(400).json({ message: "Asset not found" });
        }
        let customFields = asset.customFields ? asset.customFields : [];
        for (let i = 0; i < customFields.length; i++) {
            let field = await CustomField.findOne({ uniqueKey: customFields[i].uniqueKey }).select("name");
            customFields[i].name = field.name;
        }
        asset.customFields = customFields;
        let materialTransfers = await MaterialTransfer.find({ 'assets.id': asset._id }).lean();
        let dashboard = asset;
        let workOrders = {};
        let maintenanceSchedules = {};
        let history = {};
        let cost = {};
        let documents = await Document.find({ "asset.id": asset._id, isDeleted: false }).sort({ createdAt: -1 }).select("-__v -updatedAt -isDeleted").lean();
        let readigs = {};
        return res.status(200).json({ data: { dashboard, materialTransfers, workOrders, maintenanceSchedules, history, cost, documents, readigs } });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function deleteAsset(req, res) {
    try {
        let slug = req.query.slug;
        if (!slug) {
            return res.status(400).json({ message: "Asset not found" });
        }
        let asset = await Asset.findOne({ _id: slug });
        if (!asset) {
            return res.status(400).json({ message: "Asset not found" });
        }
        asset.isDeleted = true;
        await asset.save();
        return res.status(200).json({ message: "Asset deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function updateAsset(req, res) {
    try {
        let slug = req.query.slug;
        if (!slug) {
            return res.status(400).json({ message: "Asset not found" });
        }
        let asset = await Asset.findOne({ _id: slug });
        if (!asset) {
            return res.status(400).json({ message: "Asset not found" });
        }
        let data = req.body;
        let updatedAsset = await Asset.findOneAndUpdate({ _id: slug }, data, { new: true });
        return res.status(200).json({ message: "Asset updated successfully", data: updatedAsset });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function getCsv(req, res) {
    try {
        let hierarchy = req.query.hierarchy;
        const csvPath = `${path.join(process.cwd(), "public/assets.csv")}`;
        if (hierarchy == "true") {

        } else {
            let assets = await Asset.find({ isDeleted: false }).select("-__v -rig -system -customFields -updatedAt").lean();
            if (assets.length == 0) {
                return res.status(400).json({ error: "No assets found" });
            }
            let fields = Object.keys(assets[0]);
            let flag = await createCSV(fields, assets, csvPath);
            if (flag) {
                let readFile = fs.readFileSync(csvPath);
                let file = {
                    buffer: readFile,
                    originalname: "assets.csv",
                    mimetype: "text/csv"
                }
                // let uploadFileUrl = await uploadToCloudinary(csvPath);
                return res.status(200).json({ message: "CSV created successfully", data: `${process.env.URL}/public/assets.csv` });
            }
            else {
                return res.status(400).json({ error: "Something went wrong" });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

async function getUpcommingAssetWorkOrders(req, res) {
    try {
        let date = new Date();
        let allAssets = await Asset.find({ isDeleted: false }).select('maintStartDate id serialNumber duration').lean();
        let assets = [];
        for (let i = 0; i < allAssets.length; i++) {
            if (new Date(allAssets[i].maintStartDate) > date) {
                assets.push(allAssets[i]);
            }
        }
        return res.status(200).json({ data: assets });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export { addAsset, getAssets, getCsv, getUpcommingAssetWorkOrders, getAssestsAll, getAssetDetails, deleteAsset, updateAsset };
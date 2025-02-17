import mongoose from "mongoose";
import createCSV from "../../helpers/csvCreater.js";
import Asset from "../../models/Asset.js";
import Inventory from "../../models/Inventory.js";
// import uploadToCloudinary from "../../helpers/cloudinary.js";
import path from "path";
import fs from "fs";
import CustomField from "../../models/CustomField.js";

async function addInventory(req, res) {
    try {
        const userId = req.user.id;
        const data = req.body;
        let existInventory = await Inventory.findOne({ partName: data.partName });
        if (existInventory) {
            return res.status(400).json({ error: "Inventory already exists" });
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
            let inventory = { userId: userId, ...data };
            let newInventory = await Inventory.create(inventory);
            return res.status(200).json({ message: "Inventory added successfully", data: newInventory });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getInventories(req, res) {
    try {
        let query = req.body;
        let findQuery = { $and: [{ isDeleted: false }] };
        const queryKeys = Object.keys(query);
        for (let i = 0; i < queryKeys.length; i++) {
            if (query[queryKeys[i]] != '')
                findQuery.$and.push({ [queryKeys[i]]: query[queryKeys[i]] });
        }
        let inventories = await Inventory.find(findQuery).sort({ createdAt: -1 }).select("-__v -createdAt -updatedAt -isDeleted -isAvailable").lean();
        for (let i = 0; i < inventories.length; i++) {
            let customFields = inventories[i].customFields ? inventories[i].customFields : [];
            for (let j = 0; j < customFields.length; j++) {
                let field = await CustomField.findOne({ uniqueKey: customFields[j].uniqueKey }).select("name");
                console.log(field);
                customFields[j].name = field.name;
            }
            inventories[i].customFields = customFields;
        }
        return res.status(200).json({ data: inventories });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getInventoriesAll(req, res) {
    try {
        let inventories = await Inventory.find({ isDeleted: false }).sort({ createdAt: -1 }).select("-__v -createdAt -updatedAt -isDeleted -isAvailable").lean();
        for (let i = 0; i < inventories.length; i++) {
            let customFields = inventories[i].customFields ? inventories[i].customFields : [];
            for (let j = 0; j < customFields.length; j++) {
                let field = await CustomField.findOne({ uniqueKey: customFields[j].uniqueKey }).select("name");
                console.log(field);
                customFields[j].name = field.name;
            }
            inventories[i].customFields = customFields;
        }
        return res.status(200).json({ data: inventories });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getCsv(req, res) {
    try {
        let csvPath = `${path.join(process.cwd(), "public/inventories.csv")}`;
        let inventories = await Inventory.find({ isDeleted: false }).select("-__v -rig -system -customFields -updatedAt").lean();
        if (inventories.length == 0) {
            return res.status(400).json({ error: "No inventories found" });
        }
        let fields = Object.keys(inventories[0]);
        let flag = createCSV(fields, inventories, csvPath);
        if (flag) {
            let readFile = fs.readFileSync(csvPath, "utf-8");
            let file = {
                buffer: readFile,
                originalname: "inventories.csv",
                mimetype: "text/csv"
            }
            // let uploadFileUrl = await uploadToCloudinary(file);
            // fs.unlinkSync(csvPath);
            return res.status(200).json({ message: "CSV created successfully", data: `${process.env.URL}/public/inventories.csv` });
        }
        else {
            return res.status(400).json({ error: "Something went wrong" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function convertToAsset(req, res) {
    try {
        let data = req.body;
        let inventory = await Inventory.findOne({ _id: data.inventoryId }).lean();
        if (!inventory) {
            return res.status(400).json({ error: "Inventory not found" });
        } else {
            let part = inventory.partItem;
            let updatedBy = req.user.role;
            let userId = req.user.id;
            data = { ...data, part: part, updatedBy: updatedBy, userId: userId };
            let asset = new Asset(data);
            await asset.save();
            await Inventory.deleteOne({ _id: data.inventoryId });
            return res.status(200).json({ message: "Inventory converted to asset successfully" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export { addInventory, getInventories, getCsv, convertToAsset, getInventoriesAll };
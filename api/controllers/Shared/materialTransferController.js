import MaterialTransfer from "../../models/MaterialTransfer.js";
import fs from "fs";
import path from "path";
// import uploadToCloudinary from "../../helpers/cloudinary.js";
import createCSV from "../../helpers/csvCreater.js";
import User from "../../models/User.js";
import sendEmail from "../../helpers/emailSending.js";
import materialTransferTemplate from "../../emailTemplates/materialTransferTemplate.js";
import pdf from "html-pdf";
import CustomField from "../../models/CustomField.js";
import Asset from "../../models/Asset.js";
import Document from "../../models/Document.js";
import materialTransferReport from "../../pdfTemplates/materialTransferReport.js";
import puppeteer from "puppeteer";
const options = {
    format: 'A4',
    border: '10mm',
    printBackground: true
};
async function addMaterialTransfer(req, res) {
    try {
        let data = req.body;
        let createdBy = req.user.role;
        data.createdBy = createdBy;
        data.userId = req.user.id;
        let asset = data.assets
        if (!asset) {
            return res.status(400).json({ error: "Asset not Selected" });
        }
        let assetF = await Asset.findOne({ _id: asset.id });
        if (!assetF) {
            return res.status(400).json({ error: "Asset not found" });
        }
        data.assets = [data.assets];
        let materialTransferAdd = await MaterialTransfer.create(data);
        let materialTransfer = await MaterialTransfer.findOne({ _id: materialTransferAdd._id }).select("-__v").lean();
        let pdfPath = `${path.join(process.cwd(), `public/materialTransfer-${new Date().getTime()}.pdf`)}`;
        let assets = materialTransfer.assets;
        for (let i = 0; i < assets.length; i++) {
            let asset = await Asset.findOne({ _id: assets[i].id }).select("-__v").lean();
            assets[i].description = asset.description ? asset.description : "-";
            assets[i].make = asset.make ? asset.make : "-";
            assets[i].model = asset.model ? asset.model : "-";
            assets[i].serialNumber = asset.serialNumber ? asset.serialNumber : "-";
            assets[i].assetNumber = asset.assetNumber ? asset.assetNumber : "-";
            assets[i].transferReason = assets[i].transferReason ? assets[i].transferReason : "-";
            assets[i].condition = assets[i].condition ? assets[i].condition : "-";
        }
        materialTransfer.assets = assets;
        const htmlContent = materialTransferReport(materialTransfer);
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for some server environments
        });
        const page = await browser.newPage();
        await page.setContent(htmlContent);
        await page.pdf({ path: pdfPath, format: 'A4' });
        await browser.close();
        data.link = `${process.env.URL}/public/materialTransfer-${new Date().getTime()}.pdf`;
        return res.status(200).json({ message: "Material Transfer added successfully", data: materialTransfer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function printMaterialTransfer(req, res) {
    try {
        res.status(200).json({ data: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function exportMaterialTransfer(req, res) {
    try {
        let csvPath = `${path.join(process.cwd(), "public/materialTransfer.csv")}`;
        let materialTransfer = await MaterialTransfer.find({ isDeleted: false }).select("-__v -_id -createdAt -updatedAt -customFields -inventory -assets").lean();
        if (materialTransfer.length == 0) {
            return res.status(400).json({ error: "No materialTransfer found" });
        }
        let fields = Object.keys(materialTransfer[0]);
        // fields = fields.map((field) => field.charAt(0).toUpperCase() + field.slice(1));
        let flag = await createCSV(fields, materialTransfer, csvPath);
        if (flag) {
            let readFile = fs.readFileSync(csvPath, "utf-8");
            let file = {
                buffer: readFile,
                originalname: "materialTransfer.csv",
                mimetype: "text/csv"
            }
            // let uploadFileUrl = await uploadToCloudinary(file);
            // fs.unlinkSync(csvPath);
            return res.status(200).json({ message: "CSV created successfully", data: `${process.env.URL}/public/materialTransfer.csv` });
        }
        else {
            return res.status(400).json({ error: "Something went wrong" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getFilteredMaterialTransfer(req, res) {
    try {
        let query = req.body;
        let findQuery = { $and: [{ isDeleted: false }] };
        const queryKeys = Object.keys(query);
        for (let i = 0; i < queryKeys.length; i++) {
            if (query[queryKeys[i]] != '')
                findQuery.$and.push({ [queryKeys[i]]: query[queryKeys[i]] });
        }
        let materialTransfer = await MaterialTransfer.find(findQuery).sort({ createdAt: -1 }).select("-__v -createdAt -updatedAt -isDeleted -isAvailable").lean();
        for (let i = 0; i < materialTransfer.length; i++) {
            let customFields = materialTransfer[i].customFields ? materialTransfer[i].customFields : [];
            for (let j = 0; j < customFields.length; j++) {
                let field = await CustomField.findOne({ uniqueKey: customFields[j].uniqueKey }).select("name");
                customFields[j].name = field.name;
            }
            materialTransfer[i].customFields = customFields;
        }
        return res.status(200).json({ data: materialTransfer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getMaterialTransfer(req, res) {
    try {
        let materialTransfer = await MaterialTransfer.find({ isDeleted: false }).lean();
        for (let i = 0; i < materialTransfer.length; i++) {
            let customFields = materialTransfer[i].customFields ? materialTransfer[i].customFields : [];
            for (let j = 0; j < customFields.length; j++) {
                let field = await CustomField.findOne({ uniqueKey: customFields[j].uniqueKey }).select("name");
                customFields[j].name = field.name;
            }
            materialTransfer[i].customFields = customFields;
        }
        return res.status(200).json({ data: materialTransfer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getMaterialTransferDetails(req, res) {
    try {
        let slug = req.query.slug;
        let materialTransfer = await MaterialTransfer.findOne({ _id: slug }).lean();
        let customFields = materialTransfer.customFields ? materialTransfer.customFields : [];
        for (let i = 0; i < customFields.length; i++) {
            let field = await CustomField.findOne({ uniqueKey: customFields[i].uniqueKey }).select("name");
            customFields[i].name = field.name;
        }
        let documents = await Document.find({ "materialTransfer.id": slug }).lean();
        materialTransfer.customFields = customFields;
        return res.status(200).json({ data: { materialTransfer, documents } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function emailMaterialTransfer(req, res) {
    try {
        let slug = req.query.slug;
        let userId = req.user.id;
        let user = await User.findOne({ _id: userId });
        let email = user.email;
        let materialTransfer = await MaterialTransfer.findOne({ _id: slug }).lean();
        let assets = materialTransfer.assets;
        for (let i = 0; i < assets.length; i++) {
            let asset = await Asset.findOne({ _id: assets[i].id }).select("-__v").lean();
            assets[i].description = asset.description ? asset.description : "-";
            assets[i].make = asset.make ? asset.make : "-";
            assets[i].model = asset.model ? asset.model : "-";
            assets[i].serialNumber = asset.serialNumber ? asset.serialNumber : "-";
            assets[i].assetNumber = asset.assetNumber ? asset.assetNumber : "-";
            assets[i].transferReason = assets[i].transferReason ? assets[i].transferReason : "-";
            assets[i].condition = assets[i].condition ? assets[i].condition : "-";
        }
        const template = materialTransferTemplate(materialTransfer);
        res.status(200).json({ message: "Email sent successfully" });
        await sendEmail(email, "Material Transfer", template);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function pdfMaterialTransfer(req, res) {
    try {
        let slug = req.query.slug;
        let pdfPath = `${path.join(process.cwd(), "public/materialTransfer.pdf")}`;
        let materialTransfer = await MaterialTransfer.findOne({ _id: slug }).select("-__v").lean();
        let assets = materialTransfer.assets;
        for (let i = 0; i < assets.length; i++) {
            let asset = await Asset.findOne({ _id: assets[i].id }).select("-__v").lean();
            assets[i].description = asset.description ? asset.description : "-";
            assets[i].make = asset.make ? asset.make : "-";
            assets[i].model = asset.model ? asset.model : "-";
            assets[i].serialNumber = asset.serialNumber ? asset.serialNumber : "-";
            assets[i].assetNumber = asset.assetNumber ? asset.assetNumber : "-";
            assets[i].transferReason = assets[i].transferReason ? assets[i].transferReason : "-";
            assets[i].condition = assets[i].condition ? assets[i].condition : "-";
        }
        materialTransfer.assets = assets;
        const htmlContent = materialTransferReport(materialTransfer);
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for some server environments
        });
        const page = await browser.newPage();
        await page.setContent(htmlContent);
        await page.pdf({ path: pdfPath, format: 'A4' });
        await browser.close();
        res.status(200).json({ data: `${process.env.URL}/public/materialTransfer.pdf` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateMaterialTransferIA(req, res) {
    try {
        let data = req.body;
        let materialTransferId = data.materialTransferId;
        let assets = data.assets;
        let inventory = data.inventory;
        let materialTransfer = await MaterialTransfer.findOne({ _id: materialTransferId }).select("-__v -_id -createdAt -updatedAt").lean();
        let updatedMT;
        if (!materialTransfer) {
            return res.status(400).json({ error: "Material Transfer not found" });
        }
        if (assets == '' && inventory == '') {
            return res.status(400).json({ error: "Please select assets and inventory" });
        }
        else if (assets == '' && inventory != '') {
            updatedMT = await MaterialTransfer.updateOne({ _id: materialTransferId }, { $addToSet: { inventory: inventory } }, { new: true });
        }
        else if (assets != '' && inventory == '') {
            let assets = materialTransfer.assets ? materialTransfer.assets : [];
            let findAsset = assets.find((asset) => asset.id == data.assets.id);
            if (findAsset) {
                return res.status(400).json({ error: "Asset already added" });
            }
            updatedMT = await MaterialTransfer.updateOne({ _id: materialTransferId }, { $addToSet: { assets: data.asset } }, { new: true });
        }
        let pdfPath = `${path.join(process.cwd(), `public/materialTransfer-${new Date().getTime()}.pdf`)}`;
        const htmlContent = materialTransferReport(updatedMT);
        pdf.create(htmlContent, options).toFile(pdfPath, function (err, res) {
            if (err) return res.status(400).json({ error: err.message });
        });
        await MaterialTransfer.updateOne({ _id: materialTransferId }, { $set: { link: `${process.env.URL}/public/materialTransfer-${new Date().getTime()}.pdf` } });
        return res.status(200).json({ message: "Material Transfer updated successfully", });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export { addMaterialTransfer, pdfMaterialTransfer, updateMaterialTransferIA, getMaterialTransfer, printMaterialTransfer, exportMaterialTransfer, getFilteredMaterialTransfer, getMaterialTransferDetails, emailMaterialTransfer };
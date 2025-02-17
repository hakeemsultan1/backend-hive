import Asset from "../../models/Asset.js";
import WorkOrder from "../../models/WorkOrder.js";
import User from "../../models/User.js";
import ManHour from "../../models/ManHour.js";
import mongoose from "mongoose";
import Cost from "../../models/Cost.js";
import Inventory from "../../models/Inventory.js";
import Part from "../../models/Part.js";
import createCSV from "../../helpers/csvCreater.js";
import path from "path";
import fs from "fs";
import Inspection from "../../models/Inspection.js";
import ProcedureLine from "../../models/ProcedureLine.js";
import workOrderTemplate from "../../pdfTemplates/workOrderTemplate.js";
// import workOrderTemplateEmail from "../../emailTemplates/workOrderTemplateEmail.js";
import pdf from 'html-pdf';
import sendEmail from "../../helpers/emailSending.js";
import WorkOrderTime from "../../models/WorkOrderTime.js";
import puppeteer from "puppeteer";



const options = {
    format: 'A4',
    border: '10mm',
    printBackground: true,
};

export async function addWorkOrder(req, res) {
    try {
        let data = req.body;
        let asset = data.assetNum;
        if (!asset) {
            return res.type(400).json({ error: "Asset not Selected" });
        }
        let assetF = await Asset.findOne({ _id: asset });
        if (!assetF) {
            return res.status(400).json({ error: "Asset not found" });
        }
        let dataAsset = {
            id: assetF._id,
            name: assetF.assetNumber,
            description: assetF.description,
        }
        let userId = req.user.id;
        data.userId = userId;
        data.createdBy = req.user.role;
        data.asset = dataAsset;
        data.type = 'unplanned';
        let checkExist = await WorkOrder.findOne({ 'asset.id': dataAsset.id });
        if (checkExist) {
            return res.status(400).json({ error: "Work Order already exists" });
        }
        let workOrder = await WorkOrder.create(data);
        let durationInDays = assetF.duration;
        let nextMaintDate = new Date().getTime() + durationInDays * 24 * 60 * 60 * 1000;
        nextMaintDate = nextMaintDate.toDateString();
        await Asset.updateOne({ _id: asset }, { $set: { maintStartDate: nextMaintDate } });
        return res.status(200).json({ message: "Work Order added successfully", data: workOrder });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

export async function updateWorkOrder(req, res) {
    try {
        let slug = req.params.id;
        if (!slug) {
            return res.status(400).json({ message: "Work Order not found" });
        }
        let data = req.body;
        delete data.asset;
        delete data._id;
        let workOrder = await WorkOrder.findOne({ _id: slug });
        if (!workOrder) {
            return res.status(400).json({ message: "Work Order not found" });
        }
        let updatedWorkOrder = await WorkOrder.findOneAndUpdate({ _id: slug }, data, { new: true });
        return res.status(200).json({ message: "Work Order updated successfully", data: updatedWorkOrder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getWorkOrders(req, res) {
    try {
        let query = req.query.query;
        let workOrders;
        if (!query || query == 'all' || query == '') {
            workOrders = await WorkOrder.find({ isDeleted: false }).sort({ createdAt: -1 }).select("-__v -updatedAt -isDeleted");
        } else if (query == 'planned') {
            workOrders = await WorkOrder.find({ isDeleted: false, type: 'planned' }).sort({ createdAt: -1 }).select("-__v -updatedAt -isDeleted");
        } else {
            workOrders = await WorkOrder.find({ isDeleted: false, type: 'unplanned' }).sort({ createdAt: -1 }).select("-__v -updatedAt -isDeleted");
        }
        return res.status(200).json({ data: workOrders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getWorkOrdersByStatus(req, res) {
    try {
        let query = req.query.query;
        let status = req.query.status;
        let workOrders;
        if (status == 'all' || status == '') {
            workOrders = await WorkOrder.find({ isDeleted: false, type: query }).sort({ createdAt: -1 }).select("-__v -updatedAt -isDeleted");
        } else {
            workOrders = await WorkOrder.find({ isDeleted: false, type: query, status: status }).sort({ createdAt: -1 }).select("-__v -updatedAt -isDeleted");
        }
        return res.status(200).json({ data: workOrders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getWorkOrderbyTimeRange(req, res) {
    try {
        let query = req.query.query;
        let timeRange = req.query.timeRange;
        let workOrders;
        if (timeRange == 'all' || timeRange == '') {
            workOrders = await WorkOrder.find({ isDeleted: false, type: query }).sort({ createdAt: -1 }).select("-__v -updatedAt -isDeleted");
        } else if (timeRange == 'last30Days') {
            let date = new Date();
            let last30days = new Date(date.getTime() - 30 * 24 * 60 * 60 * 1000);
            workOrders = await WorkOrder.find({ isDeleted: false, type: query, createdAt: { $gte: last30days } }).sort({ createdAt: -1 }).select("-__v -updatedAt -isDeleted");
        } else if (timeRange == 'last6Months') {
            let date = new Date();
            let last6months = new Date(date.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
            workOrders = await WorkOrder.find({ isDeleted: false, type: query, createdAt: { $gte: last6months } }).sort({ createdAt: -1 }).select("-__v -updatedAt -isDeleted");
        } else if (timeRange == 'last12Months') {
            let date = new Date();
            let last12months = new Date(date.getTime() - 12 * 30 * 24 * 60 * 60 * 1000);
            workOrders = await WorkOrder.find({ isDeleted: false, type: query, createdAt: { $gte: last12months } }).sort({ createdAt: -1 }).select("-__v -updatedAt -isDeleted");
        }
        return res.status(200).json({ data: workOrders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getFilteredWorkOrders(req, res) {
    try {
        let query = req.query.query;
        let body = req.body;
        let workOrders;
        workOrders = await WorkOrder.find({ isDeleted: false, type: query, body }).sort({ createdAt: -1 }).select("-__v -updatedAt -isDeleted");
        return res.status(200).json({ data: workOrders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getEarlyMaintananceData(req, res) {
    try {
        let data = await Asset.find({ isDeleted: false, maintStartDate: { $gt: new Date().getTime() } }).select("-__v -updatedAt -isDeleted");
        return res.status(200).json({ data: data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function addPlannedWorkOrderController(req, res) {
    try {
        let data = req.body;
        data.addedBy = req.user.id;
        let asset = await Asset.findOne({ _id: data.asset });
        if (!asset) {
            return res.status(400).json({ error: "Asset not found" });
        }
        let assetData = {
            id: asset._id,
            name: asset.assetNumber,
            description: asset.description,
        }
        data.asset = assetData;
        data.type = 'planned';
        data.status = 'open';
        let workOrder = await WorkOrder.create(data);
        let durationInDays = asset.duration;
        let nextMaintDate = new Date(new Date().getTime() + durationInDays * 24 * 60 * 60 * 1000);
        await Asset.updateOne({ _id: asset._id }, { $set: { maintStartDate: nextMaintDate } });
        return res.status(200).json({ message: "Work Order added successfully", data: workOrder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function addManHour(req, res) {
    try {
        let data = req.body;
        let performedBy = data.performedBy;
        let workOrder = data.workOrder;
        let existWorkOrder = await WorkOrder.findOne({ _id: workOrder });
        if (!existWorkOrder) {
            return res.status(400).json({ error: "Work Order not found" });
        }
        data.addedBy = req.user.id;
        data.workOrder = existWorkOrder._id;
        data.performedBy = performedBy;
        let manHour = await ManHour.create(data);
        return res.status(200).json({ message: "Man Hour added successfully", data: manHour });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function addCost(req, res) {
    try {
        let data = req.body;
        let workOrder = data.workOrder;
        let existWorkOrder = await WorkOrder.findOne({ _id: workOrder });
        if (!existWorkOrder) {
            return res.status(400).json({ error: "Work Order not found" });
        }
        data.addedBy = req.user.id;
        data.workOrder = existWorkOrder._id;
        let cost = await Cost.create(data);
        return res.status(200).json({ message: "Cost added successfully", data: cost });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function addPart(req, res) {
    try {
        let data = req.body;
        let workOrder = data.workOrder;
        let part = data.part;
        let existWorkOrder = await WorkOrder.findOne({ _id: workOrder });
        if (!existWorkOrder) {
            return res.status(400).json({ error: "Work Order not found" });
        }
        let existPart = await Inventory.findOne({ _id: part });
        if (!existPart) {
            return res.status(400).json({ error: "Part not found" });
        }
        data.addedBy = req.user.id;
        data.workOrder = existWorkOrder._id;
        data.part = existPart._id;
        let partItem = await Part.create(data);
        return res.status(200).json({ message: "Part added successfully", data: partItem });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function inspectionUA(req, res) {
    try {
        let id = req.query.slug;
        if (!id) {
            let data = req.body;
            let existWorkOrder = await WorkOrder.findOne({ _id: data.workOrder });
            if (!existWorkOrder) {
                return res.status(400).json({ error: "Work Order not found" });
            }
            let existInspectionOnWorkOrder = await Inspection.findOne({ workOrder: existWorkOrder._id });
            if (existInspectionOnWorkOrder) {
                return res.status(400).json({ error: "Inspection already exists for this work order" });
            }
            data.addedBy = req.user.id;
            data.workOrder = existWorkOrder._id;
            let inspection = await Inspection.create(data);
            return res.status(200).json({ message: "Inspection added successfully", data: inspection });
        } else {
            let existInspection = await Inspection.findOne({ _id: id });
            if (!existInspection) {
                return res.status(400).json({ error: "Inspection not found" });
            }
            let data = req.body;
            let existWorkOrder = await WorkOrder.findOne({ _id: data.workOrder });
            if (!existWorkOrder) {
                return res.status(400).json({ error: "Work Order not found" });
            }
            data.addedBy = req.user.id;
            data.workOrder = existWorkOrder._id;
            let inspection = await Inspection.findOneAndUpdate({ _id: id }, data, { new: true });
            return res.status(200).json({ message: "Inspection updated successfully", data: inspection });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function procedureLineUA(req, res) {
    try {
        let id = req.query.slug;
        if (!id) {
            let data = req.body;
            let existWorkOrder = await WorkOrder.findOne({ _id: data.workOrder });
            if (!existWorkOrder) {
                return res.status(400).json({ error: "Work Order not found" });
            }
            let existProcedureLineOnWorkOrder = await ProcedureLine.findOne({ workOrder: existWorkOrder._id });
            if (existProcedureLineOnWorkOrder) {
                return res.status(400).json({ error: "Procedure Line already exists for this work order" });
            }
            data.addedBy = req.user.id;
            data.workOrder = existWorkOrder._id;
            let procedureLine = await ProcedureLine.create(data);
            return res.status(200).json({ message: "Procedure Line added successfully", data: procedureLine });
        } else {
            let existProcedureLine = await ProcedureLine.findOne({ _id: id });
            if (!existProcedureLine) {
                return res.status(400).json({ error: "Procedure Line not found" });
            }
            let data = req.body;
            let existWorkOrder = await WorkOrder.findOne({ _id: data.workOrder });
            if (!existWorkOrder) {
                return res.status(400).json({ error: "Work Order not found" });
            }
            data.addedBy = req.user.id;
            data.workOrder = existWorkOrder._id;
            let procedureLine = await ProcedureLine.findOneAndUpdate({ _id: id }, data, { new: true });
            return res.status(200).json({ message: "Procedure Line updated successfully", data: procedureLine });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getWorkOrderDetails(req, res) {
    try {
        let slug = req.params.id;
        if (!slug) {
            return res.status(400).json({ error: "Work Order not found" });
        }
        slug = new mongoose.Types.ObjectId(slug);
        let workOrder = await WorkOrder.aggregate([
            { $match: { _id: slug } },
            {
                $lookup: {
                    from: "assets",
                    localField: "asset.id",
                    foreignField: "_id",
                    as: "asset"
                }
            },
            {
                $unwind: "$asset"
            },
            {
                $lookup: {
                    from: "manhours",
                    localField: "_id",
                    foreignField: "workOrder",
                    as: "manHours"
                }
            },
            {
                $lookup: {
                    from: "costs",
                    localField: "_id",
                    foreignField: "workOrder",
                    as: "costs"
                }
            },
            {
                $lookup: {
                    from: "parts",
                    localField: "_id",
                    foreignField: "workOrder",
                    as: "parts"
                }
            },
            {
                $lookup: {
                    from: "documents",
                    localField: "_id",
                    foreignField: "workOrder.id",
                    as: "documents"
                }
            },
            {
                $lookup: {
                    from: "inspections",
                    localField: "_id",
                    foreignField: "workOrder",
                    as: "inspections"
                }
            },
            // {
            //     $lookup: {
            //         from: "procedurelines",
            //         localField: "_id",
            //         foreignField: "workOrder",
            //         as: "procedureLines"
            //     }
            // },
            {
                $project: {
                    __v: 0,
                    updatedAt: 0,
                    isDeleted: 0,
                    "asset.__v": 0,
                    "asset.updatedAt": 0,
                    "asset.isDeleted": 0,
                    "asset._id": 0,
                    "asset.createdAt": 0,
                    "asset.createdBy": 0,
                    "asset.physicalLocation": 0,
                    "asset.mainSystem": 0,
                    "asset.rfidBarCode": 0,
                    "asset.userId": 0,
                    "asset.specDetails": 0,
                    "asset.installedDate": 0,
                    "asset.suplier": 0,
                    "asset.criticality": 0,
                    "asset.originalMfrDate": 0,
                    "asset.customFields": 0,
                    "asset.isAvailable": 0,
                    "asset.condition": 0,
                    "asset.maintStartDate": 0,
                }
            }
        ]);
        if (!workOrder || workOrder.length == 0) {
            return res.status(400).json({ error: "Work Order not found" });
        }
        let user = req.user;
        await WorkOrderTime.findOne({ workOrder: workOrder[0]._id, userId: user.id }).then(async (workOrderTime) => {
            if (workOrderTime) {
                workOrder[0].startTime = new Date(workOrderTime.startTime).toDateString();
                workOrder[0].endTime = new Date(workOrderTime.endTime).toDateString();
            }
            else {
                workOrder[0].startTime = null;
                workOrder[0].endTime = null;
            }
        })
        return res.status(200).json({ data: workOrder[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getCsv(req, res) {
    try {
        let query = req.query.query;
        let csvPath = `${path.join(process.cwd(), "public/workOrders.csv")}`;
        let workOrders;
        if (query && query == "all") {
            workOrders = await WorkOrder.find({ isDeleted: false }).select("-__v -asset -updatedAt").lean();
        } else if (query && query == "unplanned") {
            workOrders = await WorkOrder.find({ isDeleted: false, type: "unplanned" }).select("-__v -asset -updatedAt").lean();
        } else if (query && query == "planned") {
            workOrders = await WorkOrder.find({ isDeleted: false, type: "planned" }).select("-__v -asset -updatedAt").lean();
        }
        if (workOrders.length == 0) {
            return res.status(400).json({ error: "No work orders found" });
        }
        let fields = Object.keys(workOrders[0]);
        let flag = createCSV(fields, workOrders, csvPath);
        if (flag) {
            let readFile = fs.readFileSync(csvPath, "utf-8");
            let file = {
                buffer: readFile,
                originalname: "workOrders.csv",
                mimetype: "text/csv"
            }
            // let uploadFileUrl = await uploadToCloudinary(file);
            // fs.unlinkSync(csvPath);
            return res.status(200).json({ message: "CSV created successfully", data: `${process.env.URL}/public/workOrders.csv` });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function cancelWorkOrder(req, res) {
    try {
        let id = req.params.id;
        await WorkOrder.findOneAndUpdate({ _id: id }, { status: "cancelled" });
        return res.status(200).json({ message: "Work Order cancelled successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function completeWorkOrder(req, res) {
    try {
        let id = req.params.id;
        await WorkOrder.findOneAndUpdate({ _id: id }, { status: "completed" });
        return res.status(200).json({ message: "Work Order completed successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function printWorkOrder(req, res) {
    try {
        let slug = req.params.id;
        let pdfPath = `${path.join(process.cwd(), "public/workOrder.pdf")}`;
        if (!slug) {
            return res.status(400).json({ error: "Work Order not found" });
        }
        let workOrder = await WorkOrder.findOne({ _id: slug }).lean();
        if (!workOrder) {
            return res.status(400).json({ error: "Work Order not found" });
        }
        let asset = await Asset.findOne({ _id: workOrder.asset.id }).lean();
        let workOrderAsset = workOrder.asset;
        workOrderAsset.serialNumber = asset.serialNumber;
        workOrderAsset.physicalLocation = asset.physicalLocation;
        workOrderAsset.criticality = asset.criticality;
        workOrderAsset.description = workOrder.asset.description ? workOrder.asset.description : "-";
        workOrderAsset.assetNumber = workOrder.asset.name ? workOrder.asset.name : "-";
        workOrder.asset = workOrderAsset;
        let manHours = await ManHour.find({ workOrder: workOrder._id }).populate("performedBy").lean();
        workOrder.manHours = manHours;
        let costs = await Cost.find({ workOrder: workOrder._id }).lean();
        workOrder.costs = costs;
        const htmlContent = workOrderTemplate(workOrder)
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for some server environments
        });
        const page = await browser.newPage();
        await page.setContent(htmlContent);
        await page.pdf({ path: pdfPath, format: 'A4' });
        await browser.close();
        return res.status(200).json({ data: `${process.env.URL}/public/workOrder.pdf` });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function printMultipleWorkOrders(req, res) {
    try {
        let workOrders = req.body.ids;
        let pdfPath = `${path.join(process.cwd(), "public/workOrders.pdf")}`;
        let htmlContent = "";
        for (let i = 0; i < workOrders.length; i++) {
            let workOrder = await WorkOrder.findOne({ _id: workOrders[i] }).lean();
            let asset = await Asset.findOne({ _id: workOrder.asset.id }).lean();
            let workOrderAsset = workOrder.asset;
            workOrderAsset.serialNumber = asset.serialNumber;
            workOrderAsset.physicalLocation = asset.physicalLocation;
            workOrderAsset.criticality = asset.criticality;
            workOrderAsset.description = workOrder.asset.description ? workOrder.asset.description : "-";
            workOrderAsset.assetNumber = workOrder.asset.name ? workOrder.asset.name : "-";
            workOrder.asset = workOrderAsset;
            htmlContent += workOrderTemplate(workOrder);
        }
        pdf.create(htmlContent, options).toFile(pdfPath, function (err, res) {
            if (err) return res.status(400).json({ error: err.message });
        });
        return res.status(200).json({ data: `${process.env.URL}/public/workOrders.pdf` });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function emailWorkOrder(req, res) {
    try {
        let slug = req.params.id;
        let user = req.user;
        let userExist = await User.findOne({ _id: user.id }).select("-password -__v -createdAt -updatedAt");
        if (!slug) {
            return res.status(400).json({ error: "Work Order not found" });
        }
        let workOrder = await WorkOrder.findOne({ _id: slug }).lean();
        if (!workOrder) {
            return res.status(400).json({ error: "Work Order not found" });
        }
        let asset = await Asset.findOne({ _id: workOrder.asset.id }).lean();
        let workOrderAsset = workOrder.asset;
        workOrderAsset.serialNumber = asset.serialNumber;
        workOrderAsset.physicalLocation = asset.physicalLocation;
        workOrderAsset.criticality = asset.criticality;
        workOrderAsset.description = workOrder.asset.description ? workOrder.asset.description : "-";
        workOrderAsset.assetNumber = workOrder.asset.name ? workOrder.asset.name : "-";
        workOrder.asset = workOrderAsset;
        let manHours = await ManHour.find({ workOrder: workOrder._id }).populate("performedBy").lean();
        workOrder.manHours = manHours;
        let costs = await Cost.find({ workOrder: workOrder._id }).lean();
        workOrder.costs = costs;
        let template = workOrderTemplate(workOrder);
        res.status(200).json({ message: "Email sent successfully" });
        await sendEmail(userExist.email, "Work Order", template);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function addPlannedWorkOrder(assetId) {
    try {
        let asset = await Asset.findOne({ _id: assetId });
        if (!asset) {
            return;
        }
        let workOrder = await WorkOrder.findOne({ "asset.id": asset._id, status: "open" });
        if (workOrder) {
            return
        }
        let assetData = {
            id: asset._id,
            name: asset.serialNumber,
            description: asset.description,
        }
        let workOrderData = await WorkOrder.create({ asset: assetData, status: "open", type: "planned" });
        let durationInDays = asset.duration;
        let nextMaintDate = new Date().getTime() + durationInDays * 24 * 60 * 60 * 1000;
        maintStartDate = maintStartDate.toString();
        await Asset.updateOne({ _id: asset._id }, { $set: { maintStartDate: nextMaintDate } });
        return workOrderData;
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getWorkOrdersDashboard(req, res) {
    try {
        let workOrders = await WorkOrder.aggregate([
            {
                $match: {
                    date: { $gt: new Date() } // Filter future dates
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, // Group by formatted date
                        priority: "$priority" // Group by priority level
                    },
                    count: { $sum: 1 } // Count the documents in each group
                }
            },
            {
                $sort: { "_id.date": 1 } // Sort by date (optional)
            }
        ]);
        return res.status(200).json({ data: workOrders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getWorkOrdersOnDate(req, res) {
    try {
        let date = new Date(req.query.date);
        let workOrders = await WorkOrder.find({ date: date });
        return res.status(200).json({ data: workOrders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getDailyWorkOrders(req, res) {
    try {
        let date = new Date(req.query.date);
        let criticalWorkOrders = await WorkOrder.find({ date: date, priorityLevel: "critical" });
        let highWorkOrders = await WorkOrder.find({ date: date, priorityLevel: "high" });
        let mediumWorkOrders = await WorkOrder.find({ date: date, priorityLevel: "medium" });
        let lowWorkOrders = await WorkOrder.find({ date: date, priorityLevel: "low" });
        return res.status(200).json({ data: { critical: criticalWorkOrders, high: highWorkOrders, medium: mediumWorkOrders, low: lowWorkOrders } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function rescheduleWorkOrder(req, res) {
    try {
        let workOrders = req.body.workOrders;
        let date = new Date(req.body.date);
        for (let i = 0; i < workOrders.length; i++) {
            await WorkOrder.updateOne({ _id: workOrders[i] }, { $set: { date: date } });
        }
        return res.status(200).json({ message: "Work orders rescheduled successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function startWorkOrder(req, res) {
    try {
        let workOrder = req.body.workOrder;
        let userId = req.user.id;
        let checkStartDate = await WorkOrderTime.findOne({ workOrder: workOrder, userId: userId, startTime: { $ne: null }, isDeleted: false });
        if (checkStartDate) {
            return res.status(400).json({ error: "Work Order already started" });
        }
        await WorkOrderTime.create({ workOrder: workOrder, userId: userId, startTime: new Date() });
        return res.status(200).json({ message: "Work Order started successfully", data: new Date().toDateString() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function endWorkOrder(req, res) {
    try {
        let workOrder = req.body.workOrder;
        let userId = req.user.id;
        let checkStartDate = await WorkOrderTime.findOne({ workOrder: workOrder, userId: userId, startTime: null, isDeleted: false });
        if (checkStartDate) {
            return res.status(400).json({ error: "Work Order not started" });
        }
        let checkEndDate = await WorkOrderTime.findOne({ workOrder: workOrder, userId: userId, endTime: { $ne: null }, isDeleted: false });
        if (checkEndDate) {
            return res.status(400).json({ error: "Work Order already ended" });
        }
        await WorkOrderTime.updateOne({ workOrder: workOrder, userId: userId }, { $set: { endTime: new Date() } });
        return res.status(200).json({ message: "Work Order ended successfully", data: new Date().toDateString() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
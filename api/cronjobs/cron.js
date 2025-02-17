import cron from 'node-cron';
import { addPlannedWorkOrder } from '../controllers/Shared/workOrderController.js';
import Asset from '../models/Asset.js';
cron.schedule('0 0 * * *', async () => {
    let date = new Date().toDateString();
    let assets = await Asset.find({ "maintStartDate": date }).select("-__v -createdAt -updatedAt").lean();
    for (let i = 0; i < assets.length; i++) {
        await addPlannedWorkOrder(assets[i]._id);
    }
}, {
    scheduled: false,
});

export default cron;
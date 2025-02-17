import mongoose from "mongoose";
import System from "../../models/System.js";

async function getSystems(req, res) {
    try {
        let rigId = new mongoose.Types.ObjectId(String(req.params.rigId));
        let systems = await System.find({ isDeleted: false, "rig.id": rigId }).sort({ createdAt: -1 }).select("-__v -createdAt -updatedAt -isDeleted");
        return res.status(200).json({ data: systems });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export { getSystems };
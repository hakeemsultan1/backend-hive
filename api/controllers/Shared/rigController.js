import Rig from "../../models/Rig.js";

async function getRigs(req, res) {
    try {
        let rigs = await Rig.find({ isDeleted: false }).sort({ createdAt: -1 }).select("-__v -createdAt -updatedAt -isDeleted");
        return res.status(200).json({ data: rigs });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export { getRigs };
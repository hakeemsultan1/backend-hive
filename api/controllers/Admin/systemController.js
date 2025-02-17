import Rig from "../../models/Rig.js";
import System from "../../models/System.js";

async function addSystem(req, res) {
    try {
        let userId = req.user.id;
        let data = req.body;
        let existSystem = await System.findOne({ name: data.name });
        if (existSystem) {
            return res.status(400).json({ error: "System already exists" });
        } else {
            let rigCheck = await Rig.findOne({ _id: data.rig });
            if (!rigCheck) {
                return res.status(400).json({ error: "Rig not found" });
            } else {
                let rigData = { name: rigCheck.name, id: rigCheck._id };
                let system = { userId: userId, createdBy: "admin", name: data.name, rig: rigData };
                let newSystem = new System(system);
                await newSystem.save();
                return res.status(200).json({ message: "System added successfully" });
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export { addSystem };
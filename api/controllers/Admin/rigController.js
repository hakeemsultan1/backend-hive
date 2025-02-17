import Rig from "../../models/Rig.js";

async function addRig(req, res) {
    try {
        const userId = req.user.id;
        const data = req.body;
        let existRig = await Rig.findOne({ name: data.name });
        if (existRig) {
            return res.status(400).json({ error: "Rig already exists" });
        } else {
            let rig = { userId: userId, createdBy: "admin", ...data };
            let newRig = new Rig(rig);
            await newRig.save();
            return res.status(200).json({ message: "Rig added successfully" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export { addRig };
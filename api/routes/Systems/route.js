import { addSystem } from "../../controllers/Admin/systemController.js";
import { getSystems } from "../../controllers/Shared/systemController.js";
import { bearerAuth, adminAuth } from "../../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/add", bearerAuth, adminAuth, addSystem);
router.get("/get/:rigId", bearerAuth, getSystems);

export default router;
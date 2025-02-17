import { addRig } from "../../controllers/Admin/rigController.js";
import { getRigs } from "../../controllers/Shared/rigController.js";
import { bearerAuth, adminAuth } from "../../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/add", bearerAuth, adminAuth, addRig);
router.get("/get", bearerAuth, getRigs);

export default router;
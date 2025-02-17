import { addMaterialTransfer, getMaterialTransferDetails, updateMaterialTransferIA, pdfMaterialTransfer, emailMaterialTransfer, printMaterialTransfer, exportMaterialTransfer, getFilteredMaterialTransfer } from "../../controllers/Shared/materialTransferController.js";

import express from "express";
import { bearerAuth } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", bearerAuth, addMaterialTransfer);
router.get("/print", bearerAuth, printMaterialTransfer);
router.get("/export", bearerAuth, exportMaterialTransfer);
router.get("/get", bearerAuth, getFilteredMaterialTransfer);
router.post("/getFilteredMT", bearerAuth, getFilteredMaterialTransfer);
router.get("/getMaterialTransferDetails", bearerAuth, getMaterialTransferDetails);
router.get("/emailMaterialTransferDetails", bearerAuth, emailMaterialTransfer);
router.get("/printMaterialTransferDetails", bearerAuth, pdfMaterialTransfer);
router.post("/updateMaterialTransferIA", bearerAuth, updateMaterialTransferIA);

export default router;
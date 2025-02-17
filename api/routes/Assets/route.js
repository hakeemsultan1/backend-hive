import express from "express";
import { addAsset, getAssestsAll, getAssetDetails, getAssets, getUpcommingAssetWorkOrders, getCsv, deleteAsset, updateAsset } from "../../controllers/Shared/assetController.js";
import { bearerAuth } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", bearerAuth, addAsset);
router.get("/get", bearerAuth, getAssestsAll);
router.post("/getFilteredAssets", bearerAuth, getAssets);
router.get("/getAssetDetails", bearerAuth, getAssetDetails);
router.get("/getUpcommingAssetWorkOrders", bearerAuth, getUpcommingAssetWorkOrders);
router.get("/export", bearerAuth, getCsv);
router.post("/update", bearerAuth, updateAsset);
router.get("/delete", bearerAuth, deleteAsset);

export default router;
import { addInventory, getInventories, getCsv, convertToAsset, getInventoriesAll } from "../../controllers/Shared/inventoryController.js";
import { bearerAuth } from "../../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/add", bearerAuth, addInventory);
router.post("/getFilteredInventory", bearerAuth, getInventories);
router.get("/get", bearerAuth, getInventoriesAll);
router.get("/export", bearerAuth, getCsv);
router.post("/changeToAsset", bearerAuth, convertToAsset)

export default router;
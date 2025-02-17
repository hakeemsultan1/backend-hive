import { addCustomField, getAllCustomFields, getCustomFields, deleteCustomField } from "../../controllers/Shared/customFieldController.js";

import express from "express";
import { bearerAuth } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", bearerAuth, addCustomField);
router.get("/get", bearerAuth, getCustomFields);
router.get("/getAll", bearerAuth, getAllCustomFields);
router.delete("/delete/:id", bearerAuth, deleteCustomField);

export default router;
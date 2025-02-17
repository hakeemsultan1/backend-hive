import { addDocument, getDocuments, linkDocument } from "../../controllers/Shared/documentController.js";
import { bearerAuth } from "../../middlewares/authMiddleware.js";
import express from "express";
import upload from "../../helpers/multer.js";

const router = express.Router();

router.post("/add", upload.any("files"), bearerAuth, addDocument);
router.get("/get", bearerAuth, getDocuments);
router.post("/link", bearerAuth, linkDocument);

export default router;
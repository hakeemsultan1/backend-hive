import { pdfGenerate } from "../../controllers/Shared/readingController.js";
import express from "express";

const router = express.Router();

router.post("/generateReport", pdfGenerate);

export default router;
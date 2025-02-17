import express from "express";
import { login, changePassword, forgetPassword, resetPassword, updateAdminProfile, getUser } from "../../controllers/Auth/authController.js";
import { adminAuth, bearerAuth } from "../../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/login", login);
router.post("/changePassword", bearerAuth, changePassword);
router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword", resetPassword);
router.patch("/updateAdminProfile", bearerAuth, adminAuth, updateAdminProfile);
router.get("/getUser", bearerAuth, adminAuth, getUser);

export default router;
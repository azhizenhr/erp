import express from "express";
import { login ,verify} from "../controller/auth.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router=express.Router();

router.post("/login",login);
router.get("/verify",authMiddleware,verify);

export default router;
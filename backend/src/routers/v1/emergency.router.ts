import express from "express";
import { hasRole, requireAuth } from "../../middlewares/auth.middleware";
import { sendEmergencyAlert } from "../../controllers/emergency.controller";

const emergencyRouter = express.Router();

emergencyRouter.post("/send", sendEmergencyAlert);

export default emergencyRouter;

import { NextFunction, Request, Response } from "express";
import { sendToExchange } from "../lib/fcm";

const sendEmergencyAlert = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, body } = req.body;
    const message = {
      notification: {
        title,
        body,
      },
      topic: "emergency",
    };

    await sendToExchange("emergency", "emergency", message);
    return res.status(200).json({ message: "Emergency alert sent" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export { sendEmergencyAlert };

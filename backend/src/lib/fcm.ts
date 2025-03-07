// firebase cloud messaging

import admin from "firebase-admin";
import fs from "fs";
import path from "path";

const serviceAccountPath = path.resolve(__dirname, "../../firebase_service_acc.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const fcm = admin.messaging();

export const sendNotification = async (message: admin.messaging.Message) => {
  try {
    const response = await fcm.send(message);
    console.log(`Successfully sent message: ${response}`);
  } catch (error) {
    console.error(`Error sending message: ${error}`);
  }
};

export const subscribeToTopic = async (registrationTokens: string[], topic: string) => {
  try {
    const response = await fcm.subscribeToTopic(registrationTokens, topic);
    console.log(`Successfully subscribed to topic: ${response}`);
  } catch (error) {
    console.error(`Error subscribing to topic: ${error}`);
  }
};

export const unsubscribeFromTopic = async (registrationTokens: string[], topic: string) => {
  try {
    const response = await fcm.unsubscribeFromTopic(registrationTokens, topic);
    console.log(`Successfully unsubscribed from topic: ${response}`);
  } catch (error) {
    console.error(`Error unsubscribing from topic: ${error}`);
  }
};

export const sendToExchange = async (exchange: string, routingKey: string, data: any) => {
  try {
    const message = {
      data,
      topic: exchange,
    };

    await sendNotification(message);
  } catch (error) {
    console.error(`Error sending message to exchange: ${error}`);
  }
};

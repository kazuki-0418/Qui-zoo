import dotenv from "dotenv";
import * as admin from "firebase-admin";
import serviceAccount from "../../.service_account/final-project-firebase-admin-sdk.json";

dotenv.config();

const databaseURL = process.env.FIREBASE_DATABASE_URL;
if (!databaseURL) {
  console.error("FIREBASE_DATABASE_URL is not set in environment variables");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: databaseURL,
});

export const rtdb = admin.database();

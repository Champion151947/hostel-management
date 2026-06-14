import serverless from "serverless-http";
import app from "../../index.js";
import { connectDB } from "../../db.js";

let serverlessHandler;

export const handler = async (event, context) => {
  if (!serverlessHandler) {
    try {
      await connectDB();
    } catch (err) {
      console.error("MongoDB connection failed:", err.message);
    }
    serverlessHandler = serverless(app);
  }
  return serverlessHandler(event, context);
};

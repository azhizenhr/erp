import mongoose from "mongoose";
import { ENV_VARS } from "./envVars.js";
export const connectToDataBase=async()=>{
    try {
        await mongoose.connect(ENV_VARS.MONGODB_URL);
        console.log("Database Connected");
        
    } catch (error) {
        console.log("database error");
        
        console.error(error);
    }
}
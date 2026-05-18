import mongoose from "mongoose"
import { env } from "./env_config"
import logger from "../utils/logger"
export const ConnectToDb=async()=>{
    try{
        await mongoose.connect(env.databaseUrl)
        logger.info("connected to DataBASe")
    }catch(e){
        logger.info("Error while connecting to database",e)
    }
}
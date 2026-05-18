import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser"
import { ConnectToDb } from './config/db_config'
import authRouter from './routes/auth_routes'
import { requestLogger } from './middleware/req_logger'
import { globalErrorHandler } from './middleware/errorHandler'
import { corsConfig } from './config/cors_config'
dotenv.config()
export const app=express()
ConnectToDb()
app.use(cors(corsConfig))
app.use(helmet())
app.use(express.json())
app.use(cookieParser())
app.use("/api",authRouter)
app.use(requestLogger)
app.use(globalErrorHandler)
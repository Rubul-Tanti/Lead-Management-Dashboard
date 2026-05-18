import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser"
import { ConnectToDb } from './config/db_config'
dotenv.config()
export const app=express()
ConnectToDb()
app.use(helmet())
app.use(express.json())
app.use(cookieParser())

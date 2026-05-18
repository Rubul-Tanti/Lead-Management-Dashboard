import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser"
// import { prisma } from './db/prisma'
dotenv.config()
export const app=express()
app.use(helmet())
app.use(express.json())
app.use(cookieParser())

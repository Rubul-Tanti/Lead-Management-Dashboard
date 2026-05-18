import express from "express"
import authorizationMiddleware from "../middleware/authentication"
import { asyncError } from "../middleware/errorHandler"
import { createLead } from "../controler/Leads"
export const leadRouter=express.Router()
leadRouter.post('/',authorizationMiddleware([]),asyncError(createLead))
leadRouter.put('/:id',authorizationMiddleware([]),asyncError(createLead))
leadRouter.delete('/:id',authorizationMiddleware(['ADMIN']),asyncError(createLead))
leadRouter.get('/all',authorizationMiddleware([]),asyncError(createLead))
leadRouter.get('/:id',authorizationMiddleware([]),asyncError(createLead))
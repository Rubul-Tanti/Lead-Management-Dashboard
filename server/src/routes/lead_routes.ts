import express from "express"
import authorizationMiddleware from "../middleware/authentication"
import { asyncError } from "../middleware/errorHandler"
import { createLead, deleteLeadById, getLeadById, getLeads, getLeadsOverview, updateLead } from "../controler/Leads"
export const leadRouter=express.Router()
leadRouter.post('/',authorizationMiddleware([]),asyncError(createLead))
leadRouter.get("/overview",authorizationMiddleware([]),asyncError(getLeadsOverview))
leadRouter.put('/:id',authorizationMiddleware([]),asyncError(updateLead))
leadRouter.delete('/:id',authorizationMiddleware(['ADMIN']),asyncError(deleteLeadById))
leadRouter.get('/all',authorizationMiddleware([]),asyncError(getLeads))
leadRouter.get('/:id',authorizationMiddleware([]),asyncError(getLeadById))
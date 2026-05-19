import { Request, Response } from "express"
import { Lead } from "../../Models/leadsSchema"
import {
  createLeadsSchema,
  leadsFilterSchema,
  updateLeadsSchema,
} from "../../validation/leadsValidation"

import logger from "../../utils/logger"
import { ApiError } from "../../middleware/errorHandler"

export const createLead = async (req: Request, res: Response) => {
  try {
    const vr = createLeadsSchema.safeParse(req.body)

    if (!vr.success) {
      return res.status(400).json({
        message: "Input validation error",
        error: vr.error.flatten().fieldErrors,
      })
    }

    const alreadyExist = await Lead.findOne({
      email: vr.data.email,
    })

    if (alreadyExist) {
      return res.status(409).json({
        message: "Lead with email already exists",
        data: alreadyExist,
      })
    }

    const newLead = await Lead.create({
      ...vr.data,
      createdBy: req.user?.id,
    })

    logger.info("Lead created successfully")

    return res.status(201).json({
      message: "Lead created successfully",
      data: newLead,
    })
  } catch (e) {
    logger.error("Error while creating lead", e)

    if (e instanceof ApiError) {
      throw e
    }

    throw new ApiError("Internal server error", 500)
  }
}

export const updateLead = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string

    const vr = updateLeadsSchema.safeParse(req.body)

    if (!vr.success) {
      return res.status(400).json({
        message: "Input validation error",
        error: vr.error.flatten().fieldErrors,
      })
    }

    const existingLead = await Lead.findById(id)

    if (!existingLead) {
      throw new ApiError("Lead not found", 404)
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      vr.data,
      {
        new: true,
        runValidators: true,
      }
    )

    logger.info("Lead updated successfully")

    return res.status(200).json({
      message: "Lead updated successfully",
      data: updatedLead,
    })
  } catch (e) {
    logger.error("Error while updating lead", e)

    if (e instanceof ApiError) {
      throw e
    }

    throw new ApiError("Internal server error", 500)
  }
}

export const getLeads = async (req: Request, res: Response) => {
  try {
    const vr = leadsFilterSchema.safeParse(req.query)
    if (!vr.success) {
      return res.status(400).json({
        message: "Input validation error",
        error: vr.error.flatten().fieldErrors,
      })
    }

    const {
      page = 1,
      limit = 10,
      search,
      source,
      status,
      sort = "latest",
    } = vr.data

    const filter: any = {}

    if (status) {
      filter.status = status
    }

    if (source) {
      filter.source = source
    }

    // search by name or email
    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ]
    }

    // sorting
    let sortOption = {}

    if (sort === "latest") {
      sortOption = { createdAt: -1 }
    } else if (sort === "oldest") {
      sortOption = { createdAt: 1 }
    }

    const leads = await Lead.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    const total = await Lead.countDocuments(filter)

    return res.status(200).json({
      message: "Leads fetched successfully",
      data: leads,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (e) {
    logger.error("Error while fetching leads", e)

    if (e instanceof ApiError) {
      throw e
    }

    throw new ApiError("Internal server error", 500)
  }
}

export const getLeadById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string

    const lead = await Lead.findById(id)

    if (!lead) {
      throw new ApiError("Lead not found", 404)
    }

    return res.status(200).json({
      message: "Lead fetched successfully",
      data: lead,
    })
  } catch (e) {
    logger.error("Error while fetching lead", e)

    if (e instanceof ApiError) {
      throw e
    }

    throw new ApiError("Internal server error", 500)
  }
}

export const deleteLeadById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string

    const lead = await Lead.findById(id)

    if (!lead) {
      throw new ApiError("Lead not found", 404)
    }

    await Lead.findByIdAndDelete(id)

    logger.info("Lead deleted successfully")

    return res.status(200).json({
      message: "Lead deleted successfully",
    })
  } catch (e) {
    logger.error("Error while deleting lead", e)

    if (e instanceof ApiError) {
      throw e
    }

    throw new ApiError("Internal server error", 500)
  }
}
export const getLeadsOverview = async (req: Request, res: Response) => {
  try {
    console.log("Hit getLeadsOverview controller")

    const newLeads = await Lead.countDocuments({ status: "new" })
    const contactedLeads = await Lead.countDocuments({ status: "contacted" })
    const qualifiedLeads = await Lead.countDocuments({ status: "qualified" })
    const lostLeads = await Lead.countDocuments({ status: "lost" })

    return res.status(200).json({
      message: "Leads overview fetched successfully",
      data: {
        newLeads,
        contactedLeads,
        qualifiedLeads,
        lostLeads,
      },
    })
  } catch (e) {
    console.error(e)

    return res.status(500).json({
      message: "Internal server error",
    })
  }
}
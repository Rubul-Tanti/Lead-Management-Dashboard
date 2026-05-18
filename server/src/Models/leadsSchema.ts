import { Schema, model, Document, Types } from "mongoose"

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "lost"

export type LeadSource =
  | "website"
  | "instagram"
  | "referral"

export interface ILead extends Document {
  name: string
  email: string
  status: LeadStatus
  source: LeadSource
  createdBy: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, "Lead name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type:String,
      required: [true, "Lead email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email",
      ],
    },

    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "lost"],
      default: "new",
    },

    source: {
      type: String,
      enum: ["website", "instagram", "referral"],
      required: [true, "Lead source is required"],
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Lead = model<ILead>("Lead", leadSchema)
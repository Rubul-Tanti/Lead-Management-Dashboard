import {z} from "zod"
export const createLeadsSchema=z.object({
name:z.string().min(3).max(200)
,email:z.string().email(),
  status:z.enum(["new", "contacted", "qualified", "lost"]),
  source:z.enum(["website", "instagram", "referral"])
})
export const updateLeadsSchema=z.object({
name:z.string().min(3).max(200).optional()
,email:z.string().email().optional(),
  status:z.enum(["new", "contacted", "qualified", "lost"]).optional(),
  source:z.enum(["website", "instagram", "referral"]).optional()
})

export const leadsFilterSchema=z.object({
page:z.coerce.number().min(1).optional(),
limit:z.coerce.number().min(5).max(50).optional(),
status:z.enum(["new", "contacted", "qualified", "lost"]).optional(),
source:z.enum(["website", "instagram", "referral"]).optional(),
search:z.string().optional(),
sort:z.enum(['latest','oldest']).optional()
})
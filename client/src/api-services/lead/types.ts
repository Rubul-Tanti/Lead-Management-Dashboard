
export type Source="website"| "instagram"| "referral"|''
export type Status="new"| "contacted"| "qualified"| "lost"|''

export interface ILead {
  _id: string
  name: string
  email: string
  status: Status
  source: Source
  createdBy: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface CreateLeadResponse {
  message: string
  data: ILead
}
export type Filter={limit:number,page:number,search:string,sort:'latest'|'oldest',source:Source,status:Status}

export interface ILead {
  _id: string
  name: string
  email: string
  status: Status
  source: Source
  createdBy: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface GetLeadsResponse {
  message: string
  data: ILead[]
  pagination: Pagination
}
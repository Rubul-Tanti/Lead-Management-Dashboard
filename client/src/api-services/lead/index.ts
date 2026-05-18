import api from "../../lib/axios";
import type { CreateLeadResponse, Filter, GetLeadsResponse, Source, Status } from "./types";

export const handleCreateLead=async(formdata:{name:string,email:string,status:Status,source:Source})=>{
    const res=await api.post("/api/lead/",formdata)
    return res.data as CreateLeadResponse
}
export const handleUpdateLead=async({formdata,id}:{formdata:{name:string,email:string,status:Status,source:Source},id:string})=>{
    const res=await api.put(`/api/lead/${id}`,formdata)
    return res.data as CreateLeadResponse
}
export const handlegetLeads=async({limit,
    page,
    search,
    sort,
    status,
    source}:Filter)=>{
        const filter:any={}
        filter.page=page
        filter.limit=limit
        if(search){filter.search=search}
        if(status){filter.status=status}
        if(sort){filter.sort=sort}
        if(source){filter.source=source}

    const res =await api.get("/api/lead/all",{params:filter})
    return res.data as GetLeadsResponse
}
import { useMutation, useQuery } from "@tanstack/react-query"
import { handleCreateLead, handleDeleteLead, handlegetDashboardOverview, handleGetLeadById, handlegetLeads, handleUpdateLead } from "../api-services/lead"
import type { Filter } from "../api-services/lead/types"

export const useLead=()=>{
    const createLead=useMutation({mutationFn:handleCreateLead})
    const getLeads=(filter:Filter)=>useQuery({queryKey:['leads',filter],queryFn:()=>handlegetLeads(filter)})
    const updateLead=useMutation({mutationFn:handleUpdateLead})
    const getDashboardOverview=useQuery({queryKey:['dashboardOverview'],queryFn:()=>handlegetDashboardOverview()})
    const getLeadById=(id:string)=>useQuery({queryKey:['lead',id],queryFn:()=>handleGetLeadById(id)})
    const deleteLead=useMutation({mutationFn:handleDeleteLead})
    return {createLead,getLeads,deleteLead,getLeadById,updateLead,getDashboardOverview}
}

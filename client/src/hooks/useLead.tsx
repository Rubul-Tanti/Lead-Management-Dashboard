import { useMutation, useQuery } from "@tanstack/react-query"
import { handleCreateLead, handlegetLeads, handleUpdateLead } from "../api-services/lead"
import type { Filter } from "../api-services/lead/types"

export const useLead=()=>{
    const createLead=useMutation({mutationFn:handleCreateLead})
    const getLeads=(filter:Filter)=>useQuery({queryKey:['leads',filter],queryFn:()=>handlegetLeads(filter)})
    const updateLead=useMutation({mutationFn:handleUpdateLead})
    return {createLead,getLeads,updateLead}
}

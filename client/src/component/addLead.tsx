import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import { CgSpinner } from "react-icons/cg"
import { useLead } from "../hooks/useLead"
import type { Source, Status } from "../api-services/lead/types"
import { useQueryClient } from "@tanstack/react-query"

type AddLeadModalProps = {
  open: boolean
  onClose: () => void
}
type FormData={
    name:string,
    email:string,
    status:Status,
    source:Source
}
const AddLeadModal = ({
  open,
  onClose,
}: AddLeadModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    status: "new",
    source: "website",
  })
  const {createLead}=useLead()
  const queryClient=useQueryClient()

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()
        createLead.mutate(formData,{onSuccess:()=>{
      toast.success("Lead added successfully")
      queryClient.invalidateQueries({queryKey:['leads']})
      onClose()
        },onError:()=>{
            toast.error("Error while Creating Lead")
        },onSettled:()=>{  setFormData({
        name: "",
        email: "",
        status: "new",
        source: "website",
      })
    }})
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
            }}
            transition={{
              duration: 0.1,
            }}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Add New Lead
                </h2>

                <p className="text-sm text-gray-500">
                  Create a new lead entry
                </p>
              </div>

              <button
                onClick={onClose}
                className="rounded-lg px-2 py-1 text-gray-500 transition hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Name */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Rahul Sharma"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="rahul@gmail.com"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500"
                >
                  <option value="new">
                    New
                  </option>

                  <option value="contacted">
                    Contacted
                  </option>

                  <option value="qualified">
                    Qualified
                  </option>

                  <option value="lost">
                    Lost
                  </option>
                </select>
              </div>

              {/* Source */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Source
                </label>

                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500"
                >
                  <option value="website">
                    Website
                  </option>

                  <option value="instagram">
                    Instagram
                  </option>

                  <option value="referral">
                    Referral
                  </option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <motion.button
                  type="submit"
                  disabled={createLead.isPending}
                  whileHover={{
                    scale: 1.02,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {createLead.isPending ? (
                    <>
                      <CgSpinner className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Lead"
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AddLeadModal
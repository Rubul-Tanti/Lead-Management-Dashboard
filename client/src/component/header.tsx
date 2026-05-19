import  { useState } from "react"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { CgProfile, CgSpinner } from "react-icons/cg"
import { FaChevronDown } from "react-icons/fa";

import { useUserContext } from "../contextProvider"
import { toast } from "react-toastify";
import { useAuthentication } from "../hooks/useAuthentication";
import AddLeadModal from "./addLead";

const Header = () => {
  const { user,setUser } = useUserContext()
  const {logout}=useAuthentication()
  const navigate = useNavigate()
  const [openAddForm,setOpenAddForm]=useState(false)
  const [open, setOpen] = useState(false)

  const handlelogout = () => {
  logout.mutate(undefined, {
    onSuccess: () => {
      setUser({
        isAuthenticated: false,
        role: null,
        userName: null,
        email: null,
        profilePicture: null,
      })
    },
    onError: () => {
      toast.error("error while logout")
    }
  })
}


  return (
    <motion.div
      className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"
      initial={{
        opacity: 0,
        y: -12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Left */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          Smart Leads Dashboard
        </h1>

        <p className="mt-0.5 text-sm text-gray-500">
          Track and manage your sales
          pipeline
        </p>
      </div>

      {/* Right */}
      {user.isAuthenticated ? (
        <div className="flex flex-wrap items-center gap-5">

          <motion.button
            onClick={()=>setOpenAddForm(!openAddForm)}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >+ Add Lead
          </motion.button>

          {/* Profile Dropdown */}
          <div className="relative">
            <motion.button
              onClick={() =>
                setOpen(!open)
              }
              className="flex flex-col items-center justify-center rounded-xl text-xs font-medium text-black transition"
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.97,
              }}
            >
              {user.profilePicture ? (
                <img
                  className="h-9 w-9 rounded-full object-cover"
                  width={20}
                  height={20}
                  src={
                    user.profilePicture
                  }
                  alt="profile"
                />
              ) : (
                <CgProfile
                  color="purple"
                  size={30}
                />
              )}

              <p className="text-zinc-700 flex ">
                {user.userName ||
                  "Profile"} <FaChevronDown className="mt-2 ml-1" />
              </p>
            </motion.button>

            {/* Dropdown */}
            {open && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="absolute right-0 top-14 z-50 w-60 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl"
              >
                {/* User Info */}
                <div className="border-b border-gray-100 pb-3">
                  <p className="font-semibold text-gray-900">
                    {user.userName}
                  </p>

                  <p className="text-sm text-gray-500">
                    {user.email}
                  </p>
                </div>

                {/* Menu */}
                <div className="mt-3 flex flex-col gap-2">
                  {user.role ===
                    "ADMIN" && (
                    <button
                      onClick={() =>
                        navigate(
                          "/admin"
                        )
                      }
                      className="rounded-xl px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100"
                    >
                      Admin Panel
                    </button>
                  )}

                  <button
                    onClick={()=>handlelogout()}
                    className="rounded-xl px-3 py-2 text-left text-sm text-red-500 transition hover:bg-red-50"
                  >{logout.isPending?<CgSpinner className="animate-spin"/>:"Logout"}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      ) : (
        <Link to="/signin">
          <motion.button
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.97,
            }}
          >
            Sign In
          </motion.button>
        </Link>
      )}
      <AddLeadModal open={openAddForm} onClose={()=>{setOpenAddForm(false)}}/>

    </motion.div>
  )
}

export default Header
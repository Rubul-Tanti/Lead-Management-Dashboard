import { useState } from "react"
import {
  motion,
  AnimatePresence,
  type Variants,
} from "framer-motion"
import { toast } from "react-toastify"
import useUser from "../../hooks/useUser"
import { useQueryClient } from "@tanstack/react-query"

const rowVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
    },
  }),
}

const AdminPage = () => {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [userName, setUserName] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [roleDialog, setRoleDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [userToDelete, setUserToDelete] = useState<any>(null)

  const queryClient = useQueryClient()
  const { getUsers, asignUserRole, deleteUser } = useUser()

  const { data, isLoading } = getUsers({ page, limit, userName })

  const assignRoleMutation = asignUserRole()
  const deleteUserMutation = deleteUser()

  const handleSearch = (v: string) => {
    const searchInput = v
    setUserName(searchInput)
    if (searchInput.trim() === userName || searchInput.trim() === "") return
    setPage(1)
    queryClient.invalidateQueries({ queryKey: ["users"] })
  }

  const handleAssignRole = (role: "ADMIN" | "SALE_USERS") => {
    if (!selectedUser) return

    assignRoleMutation.mutate(
      { id: selectedUser._id, role },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["users"] })
          setRoleDialog(false)
          setSelectedUser(null)
        },
      }
    )
  }

  // Opens the confirm-delete dialog
  const handleDeleteClick = (user: any) => {
    setUserToDelete(user)
    setDeleteDialog(true)
  }

  // Called when user confirms deletion
  const handleConfirmDelete = () => {
    if (!userToDelete) return

    deleteUserMutation.mutate(userToDelete._id, {
      onSuccess: () => {
        toast.success("Successfully deleted user")
        queryClient.invalidateQueries({ queryKey: ["users"] })
        setDeleteDialog(false)
        setUserToDelete(null)
      },
      onError: () => {
        toast.error("Failed to delete user")
      },
    })
  }

  const handleCancelDelete = () => {
    setDeleteDialog(false)
    setUserToDelete(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        {/* Header */}
        <div className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">Manage users and roles</p>
          </div>

          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Search by username..."
              value={userName}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["User", "Email", "Role", "Provider", "Status", "Created", "Actions"].map(
                    (header) => (
                      <th
                        key={header}
                        className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                <AnimatePresence mode="popLayout">
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-gray-50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
                            <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
                        </td>
                        <td className="px-5 py-4">
                          <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200" />
                        </td>
                        <td className="px-5 py-4">
                          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                        </td>
                        <td className="px-5 py-4">
                          <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
                        </td>
                        <td className="px-5 py-4">
                          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <div className="h-8 w-16 animate-pulse rounded-lg bg-gray-200" />
                            <div className="h-8 w-16 animate-pulse rounded-lg bg-gray-200" />
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : data?.data.length === 0 ? (
                    <motion.tr>
                      <td colSpan={7} className="py-16 text-center text-sm text-gray-400">
                        No users found
                      </td>
                    </motion.tr>
                  ) : (
                    data?.data.map((user, i) => (
                      <motion.tr
                        key={user._id}
                        custom={i}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        layout
                        className="border-b border-gray-50 transition hover:bg-indigo-50/30"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                user.profilePicture ||
                                "https://ui-avatars.com/api/?name=User"
                              }
                              alt={user.userName}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {user.userName}
                              </p>
                              <p className="text-xs text-gray-400">{user._id.slice(-6)}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">{user.email}</td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              user.role === "ADMIN"
                                ? "bg-indigo-100 text-indigo-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {user.authProvider}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              user.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedUser(user)
                                setRoleDialog(true)
                              }}
                              className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100"
                            >
                              Edit
                            </motion.button>
                            {user.role !== "ADMIN" &&

                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDeleteClick(user)}
                              className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
                            >
                              Delete
                            </motion.button>
}</div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Role Dialog ── */}
      <AnimatePresence>
        {roleDialog && selectedUser && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
            >
              <h2 className="text-xl font-bold text-gray-900">Assign Role</h2>
              <p className="mt-2 text-sm text-gray-500">
                Update role for{" "}
                <span className="font-semibold">{selectedUser.userName}</span>
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleAssignRole("ADMIN")}
                  className="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                >
                  ADMIN
                </button>
                <button
                  onClick={() => handleAssignRole("SALE_USERS")}
                  className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                >
                  SALE_USERS
                </button>
              </div>

              <button
                onClick={() => {
                  setRoleDialog(false)
                  setSelectedUser(null)
                }}
                className="mt-5 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Confirm Delete Dialog ── */}
      <AnimatePresence>
        {deleteDialog && userToDelete && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
            >
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>

              <h2 className="mt-4 text-xl font-bold text-gray-900">Delete User</h2>
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-800">
                  {userToDelete.userName}
                </span>
                ? This action cannot be undone.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleCancelDelete}
                  disabled={deleteUserMutation.isPending}
                  className="flex-1 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
                >
                  Cancel
                </button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleConfirmDelete}
                  disabled={deleteUserMutation.isPending}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                  {deleteUserMutation.isPending ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Deleting…
                    </>
                  ) : (
                    "Delete"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminPage
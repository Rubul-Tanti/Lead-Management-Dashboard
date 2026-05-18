import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { useRef, useState, useEffect } from 'react';
import { useLead } from '../hooks/useLead';
import type { ILead, Source, Status } from '../api-services/lead/types';
import { toast } from 'react-toastify';

type SortOption = "latest" | "oldest"

interface ModalProps {
  open: boolean;
  editLead: ILead | null;
  onClose: () => void;
  onSave: (data: Omit<ILead, "id" | "createdAt">) => void;
}

function LeadModal({ open, editLead, onClose}: ModalProps) {
  const {updateLead}=useLead()
  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [status, setStatus] = useState<Status>("new");
  const [source, setSource] = useState<Source>("website");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editLead) {
      setName(editLead.name);
      setEmail(editLead.email);
      setStatus(editLead.status);
      setSource(editLead.source);
    } else {
      setName(""); setEmail(""); setStatus("new"); setSource("website");
    }
    setErrors({});
  }, [editLead, open]);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    updateLead.mutate({formdata:{name,email,source,status},id:editLead?._id||""},{onSuccess:()=>{
      toast("Lead updated")
    },onError:()=>{
      toast("error while updating")
    }})
    // onSave({ name: name.trim(), email: email.trim(), status, source });
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-base font-semibold text-gray-900">
                {editLead ? "Edit Lead" : "Add New Lead"}
              </h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">Full name *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${errors.name ? "border-red-300" : "border-gray-200"}`}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">Email address *</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul@example.com"
                  type="email"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${errors.email ? "border-red-300" : "border-gray-200"}`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Status)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    {(["new", "contacted", "qualified", "lost"] as Status[]).map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">Source</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value as Source)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    {(["website", "instagram", "referral"] as Source[]).map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t px-6 py-4">
              <button
                onClick={onClose}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <motion.button
                onClick={handleSave}
                className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                whileTap={{ scale: 0.97 }}
              >
                {editLead ? "Save Changes" : "Add Lead"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DeleteToast({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-gray-900 px-5 py-3.5 text-sm text-white shadow-2xl"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      <span>Delete <span className="font-semibold">{name}</span>?</span>
      <button onClick={onConfirm} className="rounded-lg bg-red-500 px-3 py-1 text-xs font-medium transition hover:bg-red-600">Delete</button>
      <button onClick={onCancel} className="rounded-lg bg-white/10 px-3 py-1 text-xs font-medium transition hover:bg-white/20">Cancel</button>
    </motion.div>
  );
}

// ── Use Partial<Record<...>> so "" is not needed as a sentinel key ──
const STATUS_STYLES: Partial<Record<Status, string>> = {
  new:       "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
  contacted: "bg-amber-50  text-amber-700  ring-1 ring-amber-200",
  qualified: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  lost:      "bg-red-50    text-red-700    ring-1 ring-red-200",
};

const STATUS_DOT: Partial<Record<Status, string>> = {
  new:       "bg-indigo-500",
  contacted: "bg-amber-500",
  qualified: "bg-emerald-500",
  lost:      "bg-red-500",
};

const SOURCE_ICON: Partial<Record<Source, string>> = {
  website:   "🌐",
  instagram: "📸",
  referral:  "🤝",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

const AVATAR_COLORS = [
  "from-indigo-400 to-indigo-600",
  "from-emerald-400 to-emerald-600",
  "from-amber-400 to-amber-600",
  "from-pink-400 to-pink-600",
  "from-sky-400 to-sky-600",
  "from-violet-400 to-violet-600",
];

// ── Filter config uses explicit union types per field ──
type FilterItem =
  | { id: "status"; value: Status | ""; setter: (v: Status | "") => void; options: { label: string; value: Status | "" }[] }
  | { id: "source"; value: Source | ""; setter: (v: Source | "") => void; options: { label: string; value: Source | "" }[] }
  | { id: "sort";   value: SortOption;   setter: (v: SortOption) => void;   options: { label: string; value: SortOption }[] };

const LeadTable = () => {
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "">("");
  const [sourceFilter, setSourceFilter] = useState<Source | "">("");
  const [sort, setSort]               = useState<SortOption>("latest");
  const [modalOpen, setModalOpen]     = useState(false);
  const [editTarget, setEditTarget]   = useState<ILead | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ILead | null>(null);
  const [limit, setLimit]             = useState(10);
  const [page, setPage]               = useState(1);

  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  function handleSearch(val: string) {
    setSearch(val);
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => setDebouncedSearch(val), 300);
  }

  const { getLeads } = useLead();
  const { data: Leads, isLoading: leadsLoading } = getLeads({
    limit,
    page,
    search: debouncedSearch,
    sort,
    status: statusFilter,
    source: sourceFilter,
  });

  const totalPages = Leads?.pagination.totalPages ?? 1;
  const safePage   = Math.min(Leads?.pagination?.page ?? 1, totalPages);

  function handleSave(data: Omit<ILead, "id" | "createdAt">) {
    // TODO: wire up create/update mutations from useLead
    setModalOpen(false);
    setEditTarget(null);
    setPage(1);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    // TODO: wire up delete mutation from useLead
    setDeleteTarget(null);
  }

  const rowVariants: Variants = {
    hidden:  { opacity: 0, x: -8 },
    visible: (i: number) => ({ opacity: 1, x: 0, transition: { delay: i * 0.04, duration: 0.3, ease: "easeOut" } }),
    exit:    { opacity: 0, x: 8, transition: { duration: 0.2 } },
  };

  const filters: FilterItem[] = [
    {
      id: "status",
      value: statusFilter,
      setter: (v) => setStatusFilter(v as Status | ""),
      options: [
        { label: "All Status",  value: "" },
        { label: "New",         value: "new" },
        { label: "Contacted",   value: "contacted" },
        { label: "Qualified",   value: "qualified" },
        { label: "Lost",        value: "lost" },
      ],
    },
    {
      id: "source",
      value: sourceFilter,
      setter: (v) => setSourceFilter(v as Source | ""),
      options: [
        { label: "All Sources", value: "" },
        { label: "Website",     value: "website" },
        { label: "Instagram",   value: "instagram" },
        { label: "Referral",    value: "referral" },
      ],
    },
    {
      id: "sort",
      value: sort,
      setter: (v) => setSort(v as SortOption),
      options: [
        { label: "Latest", value: "latest" },
        { label: "Oldest", value: "oldest" },
      ],
    },
  ];

  return (
    <>
      <motion.div
        className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => { handleSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email…"
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {filters.map(({ id, value, setter, options }) => (
          <select
            key={id}
            value={value}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              // Each setter only accepts its own union — cast through unknown is safe
              // because the options array for each filter only contains valid values.
              (setter as (v: string) => void)(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ))}
      </motion.div>

      <motion.div
        className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                {["Name", "Email", "Status", "Source", "Created", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {Leads?.data?.length === 0 ? (
                  <motion.tr key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <td colSpan={6} className="py-16 text-center text-sm text-gray-400">
                      <div className="mb-2 text-3xl">🔍</div>
                      No leads match your filters
                    </td>
                  </motion.tr>
                ) : (
                  Leads?.data?.map((lead, i) => {
                    const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
                    return (
                      <motion.tr
                        key={lead._id}
                        custom={i}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        className="group border-b border-gray-50 transition-colors hover:bg-indigo-50/30"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold text-white ${avatarColor}`}>
                              {getInitials(lead.name)}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{lead.name}</span>
                          </div>
                        </td>

                        <td className="px-5 py-3.5 text-sm text-gray-500">{lead.email}</td>

                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[lead.status] ?? ""}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[lead.status] ?? ""}`} />
                            {lead.status}
                          </span>
                        </td>

                        <td className="px-5 py-3.5">
                          <span className="flex items-center gap-1.5 text-sm text-gray-600">
                            <span>{SOURCE_ICON[lead.source] ?? ""}</span>
                            {lead.source}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 text-sm text-gray-400">{formatDate(lead.createdAt)}</td>

                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2 opacity-0 transition group-hover:opacity-100">
                            <motion.button
                              onClick={() => { setEditTarget(lead); setModalOpen(true); }}
                              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                              whileTap={{ scale: 0.95 }}
                            >
                              Edit
                            </motion.button>
                            <motion.button
                              onClick={() => setDeleteTarget(lead)}
                              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                              whileTap={{ scale: 0.95 }}
                            >
                              Delete
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-100 bg-white px-5 py-3.5 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1.5">
            <motion.button
              disabled={safePage === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm transition hover:bg-gray-50 disabled:opacity-40"
              whileTap={{ scale: 0.95 }}
            >
              Prev
            </motion.button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
              .map((p, idx, arr) => (
                <span key={p} className="flex items-center gap-1.5">
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="text-gray-300">…</span>
                  )}
                  <motion.button
                    onClick={() => setPage(p)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                      p === safePage
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "border border-gray-200 hover:bg-gray-50"
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    {p}
                  </motion.button>
                </span>
              ))}

            <motion.button
              disabled={safePage === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm transition hover:bg-gray-50 disabled:opacity-40"
              whileTap={{ scale: 0.95 }}
            >
              Next
            </motion.button>
            <div className="flex flex-col gap-3 border-t border-gray-100 bg-white px-5 py-3.5 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">

  {/* existing page buttons */}
  <div className="flex items-center gap-1.5">
    {/* ... Prev / page numbers / Next ... */}
  </div>

  {/* NEW: rows per page */}
  <div className="flex items-center gap-2">
    <span className="text-sm text-gray-500">Rows per page</span>
    <select
      value={limit}
      onChange={(e) => {
        setLimit(Number(e.target.value));
        setPage(1);
      }}
      className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
    >
      {[5, 10, 20, 50].map((n) => (
        <option key={n} value={n}>{n}</option>
      ))}
    </select>
  </div>

</div>

          </div>
        </div>
      </motion.div>

      <LeadModal
        open={modalOpen}
        editLead={editTarget}
        onClose={() => { setModalOpen(false); setEditTarget(null); }}
        onSave={handleSave}
      />

      <AnimatePresence>
        {deleteTarget && (
          <DeleteToast
            name={deleteTarget.name}
            onConfirm={confirmDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default LeadTable;
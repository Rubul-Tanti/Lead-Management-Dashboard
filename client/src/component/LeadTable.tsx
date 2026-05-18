import {AnimatePresence, motion, type Variants} from 'framer-motion'
import { useRef, useState,useEffect } from 'react';
import { counts } from './dashboard';
const INITIAL_LEADS: Lead[] = [
  { id: 1,  name: "Rahul Sharma",    email: "rahul@startup.io",   status: "Qualified", source: "Instagram", createdAt: "2025-05-10" },
  { id: 2,  name: "Priya Nair",      email: "priya@techco.in",    status: "New",       source: "Website",   createdAt: "2025-05-12" },
  { id: 3,  name: "Arjun Mehta",     email: "arjun@sales.com",    status: "Contacted", source: "Referral",  createdAt: "2025-05-09" },
  { id: 4,  name: "Sneha Patel",     email: "sneha@design.io",    status: "Lost",      source: "Website",   createdAt: "2025-05-08" },
  { id: 5,  name: "Vikram Das",      email: "vikram@growth.in",   status: "New",       source: "Instagram", createdAt: "2025-05-13" },
  { id: 6,  name: "Meera Joshi",     email: "meera@consult.co",   status: "Qualified", source: "Referral",  createdAt: "2025-05-07" },
  { id: 7,  name: "Karan Singh",     email: "karan@agency.io",    status: "Contacted", source: "Website",   createdAt: "2025-05-11" },
  { id: 8,  name: "Divya Reddy",     email: "divya@market.in",    status: "New",       source: "Instagram", createdAt: "2025-05-14" },
  { id: 9,  name: "Aman Verma",      email: "aman@fintech.io",    status: "Lost",      source: "Website",   createdAt: "2025-05-06" },
  { id: 10, name: "Tanya Kapoor",    email: "tanya@media.com",    status: "Qualified", source: "Referral",  createdAt: "2025-05-05" },
  { id: 11, name: "Rohit Gupta",     email: "rohit@saas.in",      status: "New",       source: "Website",   createdAt: "2025-05-15" },
  { id: 12, name: "Ananya Bose",     email: "ananya@ecom.co",     status: "Contacted", source: "Instagram", createdAt: "2025-05-04" },
  { id: 13, name: "Nikhil Iyer",     email: "nikhil@devs.io",     status: "Qualified", source: "Referral",  createdAt: "2025-05-03" },
  { id: 14, name: "Simran Kaur",     email: "simran@brand.in",    status: "New",       source: "Website",   createdAt: "2025-05-15" },
  { id: 15, name: "Harish Kumar",    email: "harish@logistics.co",status: "Lost",      source: "Instagram", createdAt: "2025-05-02" },
  { id: 16, name: "Pooja Sharma",    email: "pooja@realty.io",    status: "Contacted", source: "Referral",  createdAt: "2025-05-01" },
  { id: 17, name: "Siddharth Roy",   email: "sid@cloud.in",       status: "New",       source: "Website",   createdAt: "2025-04-30" },
  { id: 18, name: "Kavya Menon",     email: "kavya@hr.co",        status: "Qualified", source: "Instagram", createdAt: "2025-04-29" },
  { id: 19, name: "Akash Jain",      email: "akash@fin.io",       status: "Contacted", source: "Website",   createdAt: "2025-04-28" },
  { id: 20, name: "Neha Agarwal",    email: "neha@retail.in",     status: "New",       source: "Referral",  createdAt: "2025-04-27" },
  { id: 21, name: "Manish Rao",      email: "manish@health.co",   status: "Qualified", source: "Website",   createdAt: "2025-04-26" },
  { id: 22, name: "Deepika Pillai",  email: "deepika@edu.io",     status: "Lost",      source: "Instagram", createdAt: "2025-04-25" },
  { id: 23, name: "Suresh Nambiar",  email: "suresh@auto.in",     status: "New",       source: "Referral",  createdAt: "2025-04-24" },
  { id: 24, name: "Riya Chaudhary",  email: "riya@travel.co",     status: "Contacted", source: "Website",   createdAt: "2025-04-23" },
];
type Status = "New" | "Contacted" | "Qualified" | "Lost";
type Source = "Website" | "Instagram" | "Referral";


interface Lead {
  id: number;
  name: string;
  email: string;
  status: Status;
  source: Source;
  createdAt: string;
}
type SortOption = "latest" | "oldest" | "name";

interface ModalProps {
  open: boolean;
  editLead: Lead | null;
  onClose: () => void;
  onSave: (data: Omit<Lead, "id" | "createdAt">) => void;
}

function LeadModal({ open, editLead, onClose, onSave }: ModalProps) {
  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [status, setStatus] = useState<Status>("New");
  const [source, setSource] = useState<Source>("Website");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editLead) {
      setName(editLead.name);
      setEmail(editLead.email);
      setStatus(editLead.status);
      setSource(editLead.source);
    } else {
      setName(""); setEmail(""); setStatus("New"); setSource("Website");
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
    onSave({ name: name.trim(), email: email.trim(), status, source });
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
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
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
              {/* Name */}
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

              {/* Email */}
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

              {/* Status + Source */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Status)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    {(["New", "Contacted", "Qualified", "Lost"] as Status[]).map((s) => (
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
                    {(["Website", "Instagram", "Referral"] as Source[]).map((s) => (
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

// ─── Delete Confirm Toast ─────────────────────────────────────────────────────

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
const STATUS_STYLES: Record<Status, string> = {
  New:       "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
  Contacted: "bg-amber-50  text-amber-700  ring-1 ring-amber-200",
  Qualified: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Lost:      "bg-red-50    text-red-700    ring-1 ring-red-200",
};



const STATUS_DOT: Record<Status, string> = {
  New:       "bg-indigo-500",
  Contacted: "bg-amber-500",
  Qualified: "bg-emerald-500",
  Lost:      "bg-red-500",
};

const SOURCE_ICON: Record<Source, string> = {
  Website:   "🌐",
  Instagram: "📸",
  Referral:  "🤝",
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
const LeadTable=()=>{
  const [leads, setLeads]           = useState<Lead[]>(INITIAL_LEADS);
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatus]   = useState("");
  const [sourceFilter, setSource]   = useState("");
  const [sort, setSort]             = useState("latest");
  const [modalOpen, setModalOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState<Lead | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
const [page, setPage]             = useState(1);
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
    function handleSearch(val: string) {
    setSearch(val);
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => setDebouncedSearch(val), 300);
  }
 const filtered = leads
    .filter((l) => {
      const q = debouncedSearch.toLowerCase();
      const matchQ = !q || l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q);
      const matchSt = !statusFilter || l.status === statusFilter;
      const matchSrc = !sourceFilter || l.source === sourceFilter;
      return matchQ && matchSt && matchSrc;
    })
    .sort((a, b) => {
      if (sort === "latest") return b.createdAt.localeCompare(a.createdAt);
      if (sort === "oldest") return a.createdAt.localeCompare(b.createdAt);
      return a.name.localeCompare(b.name);
    });
  const PER_PAGE = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const pageSlice  = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  leads.forEach((l) => counts[l.status]++);

  // CRUD
  function handleSave(data: Omit<Lead, "id" | "createdAt">) {
    if (editTarget) {
      setLeads((prev) => prev.map((l) => l.id === editTarget.id ? { ...l, ...data } : l));
    } else {
      const newLead: Lead = { id: Date.now(), ...data, createdAt: new Date().toISOString().slice(0, 10) };
      setLeads((prev) => [newLead, ...prev]);
    }
    setModalOpen(false);
    setEditTarget(null);
    setPage(1);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setLeads((prev) => prev.filter((l) => l.id !== deleteTarget.id));
    setDeleteTarget(null);
  }



  // Animation variants

  const rowVariants:Variants = {
    hidden:  { opacity: 0, x: -8 },
    visible: (i: number) => ({ opacity: 1, x: 0, transition: { delay: i * 0.04, duration: 0.3, ease: "easeOut" } }),
    exit:    { opacity: 0, x: 8, transition: { duration: 0.2 } },
  };
    return<>
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

          {[
            { id: "status", value: statusFilter, setter: setStatus, options: ["All Status", "New", "Contacted", "Qualified", "Lost"] },
            { id: "source", value: sourceFilter, setter: setSource, options: ["All Sources", "Website", "Instagram", "Referral"] },
            { id: "sort",   value: sort,         setter: (v: string) => setSort(v as SortOption), options: ["latest", "oldest", "name"], labels: ["Latest", "Oldest", "Name A–Z"] },
          ].map(({ id, value, setter, options, labels }) => (
            <select
              key={id}
              value={value}
              onChange={(e) => { setter(e.target.value); setPage(1); }}
              className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              {options.map((o, idx) => (
                <option key={o} value={o.startsWith("All") ? "" : o}>
                  {labels ? labels[idx] : o}
                </option>
              ))}
            </select>
          ))}
        </motion.div>

        {/* ── Table ── */}
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
                  {pageSlice.length === 0 ? (
                    <motion.tr key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <td colSpan={6} className="py-16 text-center text-sm text-gray-400">
                        <div className="mb-2 text-3xl">🔍</div>
                        No leads match your filters
                      </td>
                    </motion.tr>
                  ) : (
                    pageSlice.map((lead, i) => {
                      const avatarColor = AVATAR_COLORS[lead.id % AVATAR_COLORS.length];
                      return (
                        <motion.tr
                          key={lead.id}
                          custom={i}
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          layout
                          className="group border-b border-gray-50 transition-colors hover:bg-indigo-50/30"
                        >
                          {/* Name */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold text-white ${avatarColor}`}>
                                {getInitials(lead.name)}
                              </div>
                              <span className="text-sm font-medium text-gray-900">{lead.name}</span>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="px-5 py-3.5 text-sm text-gray-500">{lead.email}</td>

                          {/* Status */}
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[lead.status]}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[lead.status]}`} />
                              {lead.status}
                            </span>
                          </td>

                          {/* Source */}
                          <td className="px-5 py-3.5">
                            <span className="flex items-center gap-1.5 text-sm text-gray-600">
                              <span>{SOURCE_ICON[lead.source]}</span>
                              {lead.source}
                            </span>
                          </td>

                          {/* Created */}
                          <td className="px-5 py-3.5 text-sm text-gray-400">{formatDate(lead.createdAt)}</td>

                          {/* Actions */}
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

          {/* ── Pagination ── */}
          <div className="flex flex-col gap-3 border-t border-gray-100 bg-white px-5 py-3.5 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              {filtered.length > 0
                ? `Showing ${(safePage - 1) * PER_PAGE + 1}–${Math.min(safePage * PER_PAGE, filtered.length)} of ${filtered.length} leads`
                : "No results"}
            </p>
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
            </div>
          </div>
        </motion.div>
      <LeadModal
        open={modalOpen}
        editLead={editTarget}
        onClose={() => { setModalOpen(false); setEditTarget(null); }}
        onSave={handleSave}
      />

      {/* ── Delete Confirm Toast ── */}
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
}
export default LeadTable
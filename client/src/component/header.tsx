import {motion} from "framer-motion"

  // CSV Export
  function exportCSV() {
    // const cols = ["Name", "Email", "Status", "Source", "Created"];
    // const rows = leads.map((l) => [l.name, l.email, l.status, l.source, l.createdAt]);
    // const csv  = [cols, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    // const a    = document.createElement("a");
    // a.href     = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    // a.download = "leads-export.csv";
    // a.click();
  }

const Header=()=>{
    return        <motion.div
          className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <h1 className="text-xl font-bold text-gray-900">Smart Leads Dashboard</h1>
            <p className="mt-0.5 text-sm text-gray-500">Track and manage your sales pipeline</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">

            <motion.button
              onClick={exportCSV}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <span>⬇</span> Export CSV
            </motion.button>

            <motion.button
              onClick={() => {  }}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <span>＋</span> Add Lead
            </motion.button>
          </div>
        </motion.div>
}
export default Header
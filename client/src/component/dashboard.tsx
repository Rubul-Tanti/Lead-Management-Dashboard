
import {  useEffect} from "react";
import { motion, useSpring, useTransform, type Variants } from "framer-motion";
import Header from "./header";
import LeadTable from "./LeadTable";

 export const counts = { New: 0, Contacted: 0, Qualified: 0, Lost: 0 };


function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 100, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v).toString());

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
}



export default function SmartLeadsDashboard() {

  // Metrics
  const metrics: { label: string; color: string }[] = [
    { label: "New",       color: "from-indigo-500 to-indigo-600" },
    { label: "Contacted", color: "from-amber-400  to-amber-500"  },
    { label: "Qualified", color: "from-emerald-500 to-emerald-600" },
    { label: "Lost",      color: "from-red-400    to-red-500"    },
  ];


  const cardVariants:Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] } }),
  };
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-5">

        {/* ── Header ── */}
        <Header/>


        {/* ── Metrics ── */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {metrics.map(({ label, color }, i) => (
            <motion.div
              key={label}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              whileHover={{ y: -2 }}
            >
              {/* Subtle gradient accent */}
              <div className={`absolute right-0 top-0 h-1 w-full rounded-t-2xl bg-gradient-to-r ${color} opacity-80`} />
              <div className="flex items-center gap-2 mb-2">
                <span className={`h-2 w-2 rounded-full bg-gradient-to-br ${color}`} />
                <p className="text-xs font-medium text-gray-500">{label}</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                <AnimatedNumber value={counts[label]} />
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── Filters ── */}

          <LeadTable/>
      </div>
      {/* ── Add / Edit Modal ── */}

    </div>
  );
}
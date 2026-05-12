import { motion } from "framer-motion";

export default function MetricCard({ label, value, unit, status, color }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-5 shadow-sm"
    >
      <p className="text-sm text-slate-500">{label}</p>

      <div className="mt-2 flex items-end gap-2">
        <span className="text-3xl font-bold" style={{ color }}>
          {value}
        </span>
        <span className="text-sm text-slate-500">{unit}</span>
      </div>

      <div className="mt-3">
        <span
          className="px-3 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: `${color}20`,
            color: color,
          }}
        >
          {status}
        </span>
      </div>
    </motion.div>
  );
}

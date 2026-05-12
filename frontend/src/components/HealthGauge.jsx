import { motion } from "framer-motion";

export default function HealthGauge({ value = 65, label }) {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      
      {/* BACK RING */}
      <div className="absolute inset-0 rounded-full border-[16px] border-slate-200" />

      {/* PROGRESS RING */}
      <motion.div
        initial={{ rotate: -140 }}
        animate={{ rotate: -140 + value * 2.8 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full border-[16px] border-blue-500 border-t-transparent"
      />

      {/* CENTER */}
      <div className="text-center">
        <div className="text-4xl font-bold text-blue-600">{value}%</div>
        <p className="text-sm text-slate-500 mt-1">{label}</p>
      </div>
    </div>
  );
}

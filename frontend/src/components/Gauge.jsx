import { motion } from "framer-motion";

export default function Gauge({ value = 65 }) {
  return (
    <div className="relative w-56 h-56 flex items-center justify-center">
      <motion.div
        initial={{ rotate: -120 }}
        animate={{ rotate: -120 + value * 2.4 }}
        className="absolute w-full h-full rounded-full border-[14px] border-blue-400 border-t-transparent"
      />
      <div className="text-4xl font-bold text-blue-600">{value}%</div>
    </div>
  );
}

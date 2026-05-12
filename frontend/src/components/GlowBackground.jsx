import { motion } from "framer-motion";

export default function GlowBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute w-[700px] h-[700px] bg-blue-300/40 rounded-full blur-[120px] -top-40 -left-40"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute w-[600px] h-[600px] bg-cyan-300/40 rounded-full blur-[120px] top-1/3 right-[-200px]"
      />
    </div>
  );
}

import { motion } from "framer-motion";

export default function GlassCard({ children }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="
  rounded-3xl p-10 w-full max-w-md
  bg-white/10 backdrop-blur-2xl
  border border-white/20
  shadow-[0_30px_80px_rgba(0,0,0,0.6)]
"

    >
      {children}
    </motion.div>
  );
}

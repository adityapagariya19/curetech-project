import { motion } from "framer-motion";

export default function AnimatedButton({ children, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="px-6 py-3 rounded-xl bg-blue-600 text-white shadow-lg"
    >
      {children}
    </motion.button>
  );
}

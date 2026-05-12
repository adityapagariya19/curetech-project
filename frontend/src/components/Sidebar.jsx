import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const items = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Blood Report", path: "/blood" },
  { name: "Urine Report", path: "/urine" },
];

export default function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 h-full bg-white/70 backdrop-blur-xl border-r border-slate-200 p-6"
    >
      <div className="flex flex-col gap-4">
        {items.map((i) => (
          <Link
            key={i.name}
            to={i.path}
            className="px-4 py-3 rounded-xl hover:bg-blue-100 transition"
          >
            {i.name}
          </Link>
        ))}
      </div>
    </motion.aside>
  );
}

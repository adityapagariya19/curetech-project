import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";

export default function Topbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" className="h-11 w-11" />
          <span className="text-xl font-bold text-slate-900">CureTech</span>
        </Link>

        {/* NAV */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          {["/", "/upload", "/dashboard", "/about"].map((path, i) => (
            <NavLink
              key={i}
              to={path}
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600"
                  : "text-slate-600 hover:text-blue-600"
              }
            >
              {path === "/" ? "Home" :
               path === "/dashboard" ? "Dashboard" :
               path === "/upload" ? "Upload" : "About"}
            </NavLink>
          ))}
        </nav>

        {/* CTA */}
        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm shadow hover:bg-blue-500 transition">
          Log In
        </button>
      </div>
    </motion.header>
  );
}

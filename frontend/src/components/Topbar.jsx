import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Topbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="
        sticky top-0 z-50
        bg-white/85 backdrop-blur-md
        border-b border-slate-200
      "
    >
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">

        {/* LEFT : LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" className="h-11 w-11" alt="CureTech" />
          <span className="text-xl font-semibold tracking-tight text-slate-900">
            CureTech
          </span>
        </Link>

        {/* RIGHT : NAV + ACTIONS */}
        <div className="flex items-center gap-8">

          {/* NAV LINKS */}
          <nav className="flex items-center gap-8 text-[15px] font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600"
                  : "text-slate-700 hover:text-blue-600"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/upload"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600"
                  : "text-slate-700 hover:text-blue-600"
              }
            >
              Upload
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600"
                  : "text-slate-700 hover:text-blue-600"
              }
            >
              About
            </NavLink>
          </nav>

          {/* AUTH / PROFILE */}
          {!isLoggedIn ? (
            <button
              onClick={() => navigate("/auth")}
              className="
                text-[15px] font-medium
                text-slate-700 hover:text-blue-600
              "
            >
              Login / Sign up
            </button>
          ) : (
            <button
              onClick={() => navigate("/profile")}
              className="
                w-10 h-10 rounded-full
                border border-slate-300
                flex items-center justify-center
                text-slate-700 hover:text-blue-600
              "
              title="Profile"
            >
              {/* clean user icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 19a7.5 7.5 0 0115 0"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </motion.header>
  );
}

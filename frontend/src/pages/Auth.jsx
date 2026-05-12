import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= FORM STATE =================
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // ================= CLEAR INPUTS ON MODE CHANGE =================
  useEffect(() => {
    setForm({
      name: "",
      email: "",
      password: "",
    });
  }, [mode]);

  // ================= SUBMIT HANDLER =================
    const handleSubmit = async () => {
    if (
      !form.email ||
      !form.password ||
      (mode === "signup" && !form.name)
    ) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const url =
        mode === "login"
          ? "http://127.0.0.1:8000/auth/login"
          : "http://127.0.0.1:8000/auth/signup";

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Authentication failed");
      }

      // LOGIN → store token
      if (mode === "login") {
        localStorage.setItem("token", data.access_token);
        navigate("/profile");
      }

      // SIGNUP → switch to login
      if (mode === "signup") {
        alert("Signup successful. Please login.");
        setMode("login");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans">

      {/* ================= SHARED PREMIUM BACKGROUND ================= */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#eef4ff] via-white to-[#f6f9ff]" />

      {/* soft blue glow */}
      <motion.div
        className="absolute -top-48 -left-48 w-[900px] h-[900px] rounded-full bg-blue-300/30 blur-[220px]"
        animate={{ scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* soft indigo glow */}
      <motion.div
        className="absolute bottom-[-220px] right-[-220px] w-[750px] h-[750px] rounded-full bg-indigo-200/25 blur-[200px]"
        animate={{ scale: [1.05, 0.95, 1.05] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ================= MAIN GRID ================= */}
      <div className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">

        {/* ================= LEFT : BRAND ================= */}
        <div className="relative flex items-center justify-center px-10 -translate-y-12">

          <svg
            className="absolute inset-0 w-full h-full opacity-[0.3]"
            viewBox="0 0 1440 800"
            fill="none"
          >
            <motion.path
              d="M0 420 C 240 380, 480 460, 720 420 C 960 380, 1200 460, 1440 420"
              stroke="#2563eb"
              strokeWidth="5"
              animate={{ pathLength: [0.65, 1, 0.65] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center"
          >
            <motion.img
              src="/logo.png"
              alt="CureTech"
              className="w-[520px] lg:w-[580px]"
              animate={{
                y: [0, -8, 0],
                scale: [1, 1.03, 1],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="-mt-8 md:-mt-10 lg:-mt-12 text-slate-600 text-sm leading-tight"
            >
              AI-Powered Medical Intelligence
            </motion.p>
          </motion.div>
        </div>

        {/* ================= RIGHT : AUTH ================= */}
        <div className="relative flex items-center justify-start px-6 lg:pr-16">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="
              relative w-full max-w-md
              rounded-[36px]
              px-10 py-8
              bg-white/75 backdrop-blur-2xl
              border border-slate-200/60
              shadow-[0_60px_140px_rgba(37,99,235,0.18)]
            "
          >
            <div className="absolute inset-0 rounded-[36px] bg-gradient-to-br from-white/70 to-transparent pointer-events-none" />

            <div className="relative flex justify-center mb-3">
              <img
                src="/logo.png"
                alt="CureTech"
                className="w-20 drop-shadow-[0_8px_25px_rgba(37,99,235,0.25)]"
              />
            </div>

            <h2 className="relative text-2xl font-semibold text-slate-900 text-center">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>

            <p className="relative text-slate-500 text-center mt-2 mb-6 text-sm">
              {mode === "login"
                ? "Secure access to your health insights"
                : "Understand medical reports clearly"}
            </p>

            {/* ================= INPUTS ================= */}
            <div className="relative flex flex-col gap-4">
              {mode === "signup" && (
                <input
                  placeholder="Full Name"
                  className="auth-ultra-input"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              )}

              <input
                placeholder="Email address"
                className="auth-ultra-input"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="Password"
                className="auth-ultra-input"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>

            {/* ================= BUTTON ================= */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              className="
                relative w-full mt-7 py-3 rounded-full
                bg-blue-600 hover:bg-blue-500
                text-white font-semibold
                shadow-[0_18px_45px_rgba(37,99,235,0.35)]
              "
            >
              {loading
  ? "Please wait..."
  : mode === "login"
  ? "Login Securely"
  : "Create Account"}

            </motion.button>
{error && (
  <p className="mt-4 text-sm text-red-600 text-center">
    {error}
  </p>
)}

            {/* ================= SWITCH ================= */}
            <p className="relative text-center text-sm text-slate-500 mt-6">
              {mode === "login" ? (
                <>
                  Don’t have an account?{" "}
                  <button
                    onClick={() => setMode("signup")}
                    className="text-blue-600 hover:underline"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setMode("login")}
                    className="text-blue-600 hover:underline"
                  >
                    Login
                  </button>
                </>
              )}
            </p>

            <p className="relative text-xs text-slate-400 text-center mt-6">
              🔒 Encrypted • Medical-grade privacy • Data never shared
            </p>
          </motion.div>
        </div>
      </div>

      {/* ================= INLINE INPUT STYLE ================= */}
      <style>{`
        .auth-ultra-input {
          width: 100%;
          padding: 0.7rem 1rem;
          border-radius: 0.9rem;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          color: #0f172a;
          border: 1px solid #e2e8f0;
          outline: none;
          transition: all 0.25s ease;
        }
        .auth-ultra-input::placeholder {
          color: #94a3b8;
        }
        .auth-ultra-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
        }
      `}</style>
    </div>
  );
}

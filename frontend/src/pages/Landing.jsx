import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import GlowBackground from "../components/GlowBackground";
import AnimatedButton from "../components/AnimatedButton";

const technologies = [
  {
    name: "React",
    icon: "⚛️",
    desc: "Frontend framework used to build fast, scalable CureTech interfaces.",
  },
  {
    name: "Tailwind CSS",
    icon: "🎨",
    desc: "Utility-first styling for clean, responsive medical-grade UI.",
  },
  {
    name: "Framer Motion",
    icon: "🌀",
    desc: "Smooth animations for trust-building medical UX.",
  },
  {
    name: "FastAPI",
    icon: "🚀",
    desc: "High-performance Python backend for medical APIs and AI services.",
  },
  {
    name: "Python",
    icon: "🐍",
    desc: "Core language powering AI logic, data processing, and analysis.",
  },
  {
    name: "Machine Learning",
    icon: "🤖",
    desc: "Rule-based + ML models for interpreting medical report values.",
  },
  {
    name: "OCR Extraction",
    icon: "📄",
    desc: "Extracts data from PDFs & images using OCR pipelines.",
  },
  {
    name: "PostgreSQL",
    icon: "🗄️",
    desc: "Secure structured storage for medical report data.",
  },
  {
    name: "Data Visualization",
    icon: "📊",
    desc: "Charts, ranges, and indicators to show report status clearly.",
  },
];


const team = [
  {
    name: "Aditya Pagariya",
    role: "Full Stack Developer & Product Lead",
    email: "aditya@example.com",
    linkedin: "https://linkedin.com",
    contribution:
      "Designed UI architecture, dashboards, animations, and product flow.",
  },
  {
    name: "AI Engineer",
    role: "Medical AI & Logic",
    email: "ai@example.com",
    linkedin: "https://linkedin.com",
    contribution:
      "Built report interpretation logic, thresholds, and AI confidence flow.",
  },
  {
    name: "UI/UX Designer",
    role: "Healthcare UX",
    email: "ui@example.com",
    linkedin: "https://linkedin.com",
    contribution:
      "Designed patient-friendly UX and premium medical visual system.",
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const [activeTech, setActiveTech] = useState(null);
  const [activeMember, setActiveMember] = useState(null);
const [formData, setFormData] = useState({
  name: "",
  email: "",
  message: "",
});
const [loading, setLoading] = useState(false);
const [success, setSuccess] = useState("");
const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://127.0.0.1:8000/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Something went wrong");
      }

      setSuccess(data.message);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <GlowBackground />

      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-32 grid md:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Understand Medical Reports{" "}
            <span className="text-blue-600">Clearly & Visually</span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 max-w-xl">
            CureTech converts complex blood, urine, and lab reports into
            AI-powered visual insights designed for patients and trusted by
            doctors.
          </p>

          <p className="mt-4 text-sm text-slate-500">
            AI-assisted • Educational purpose only • Not a diagnosis
          </p>

          <div className="mt-10 flex gap-4">
            <AnimatedButton onClick={() => navigate("/upload")}>
              Upload Report
            </AnimatedButton>

           <button
  onClick={() => navigate("/About")}
  className="
    px-6 py-3 rounded-xl
    border border-slate-300
    font-heading font-semibold
    text-slate-700
    hover:bg-slate-100
    hover:shadow-md
    transition-all duration-300
  "
>
  Explore About Us
</button>

          </div>
        </motion.div>

        {/* HERO IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative flex justify-center"
        >
          <motion.div
  whileHover={{ scale: 1.03 }}
  transition={{ type: "spring", stiffness: 120 }}
  className="relative"
>
  {/* Glow Pulse */}
  <motion.div
    className="absolute inset-0 rounded-full bg-blue-400/20 blur-3xl"
    animate={{ opacity: [0.3, 0.6, 0.3] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
  />

  {/* Human Image */}
  <motion.img
    src="/hero-human.png"
    alt="AI Medical Human"
    className="relative z-10 max-w-md drop-shadow-2xl"
    animate={{
      y: [0, -14, 0],
      rotate: [0, 0.8, -0.8, 0],
      scale: [1, 1.02, 1],
    }}
    transition={{
      duration: 7,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
</motion.div>

        </motion.div>
      </section>

      {/* ================= REPORT TYPES ================= */}
   {/* ================= REPORT SECTIONS ================= */}
      {/* REPORT ANALYSIS SECTION */}
<section className="py-16 bg-[#f7faff]">
  <div className="max-w-6xl mx-auto px-6 space-y-10">

    <h2 className="text-3xl font-bold text-gray-900 text-center">
      AI Report Analysis
    </h2>
    <p className="text-center text-gray-600 max-w-2xl mx-auto">
      CureTech visually analyzes your medical reports and highlights
      what actually matters — without medical jargon.
    </p>

    <div className="grid md:grid-cols-3 gap-8">

      {/* Blood */}
      <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition">
        <img src="/blood.png" className="w-14 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Blood Report</h3>
        <p className="text-gray-600 text-sm">
          Sugar, Hemoglobin, RBC, WBC, Platelets with risk indicators and
          easy-to-understand explanations.
        </p>
      </div>

      {/* Urine */}
      <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition">
        <img src="/urine.png" className="w-14 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Urine Report</h3>
        <p className="text-gray-600 text-sm">
          Infection markers, protein, glucose, hydration levels with
          lifestyle guidance.
        </p>
      </div>

      {/* Liver */}
      <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition">
        <img src="/liver.png" className="w-14 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Liver Report</h3>
        <p className="text-gray-600 text-sm">
          SGOT, SGPT, bilirubin levels explained visually with severity
          indicators.
        </p>
      </div>

    </div>
  </div>
</section>


      {/* ================= TECHNOLOGIES ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <h2 className="text-4xl font-bold text-center mb-16">
          Technologies Used
        </h2>

        <div className="grid md:grid-cols-5 gap-6">
          {technologies.map((tech) => (
            <motion.div
              key={tech.name}
              whileHover={{ y: -8 }}
              onClick={() => setActiveTech(tech)}
              className="cursor-pointer glass rounded-2xl p-6 text-center"
            >
              <div className="text-5xl mb-4">{tech.icon}</div>
              <p className="font-semibold">{tech.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= TEAM ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <h2 className="text-4xl font-bold text-center mb-16">
          Meet the Team
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {team.map((member) => (
            <motion.div
              key={member.name}
              whileHover={{ scale: 1.05 }}
              onClick={() => setActiveMember(member)}
              className="cursor-pointer glass rounded-3xl p-8 text-center"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-3xl mb-4">
                👤
              </div>
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-slate-500 text-sm">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= MODALS ================= */}
      <AnimatePresence>
        {(activeTech || activeMember) && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setActiveTech(null);
              setActiveMember(null);
            }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              className="bg-white rounded-3xl p-10 max-w-lg shadow-xl"
            >
              {activeTech && (
                <><div className="flex justify-center ">
                  <h3 className="text-2xl font-bold mb-4">
                    {activeTech.name}
                  </h3></div>
                  <p className="text-slate-600">{activeTech.desc}</p>
                </>
              )}

              {activeMember && (
                <><div className="flex justify-center ">
                  <h3 className="text-2xl font-bold">
                    {activeMember.name}
                  </h3></div>
                  <p className="text-slate-500 mb-4">
                    {activeMember.role}
                  </p>
                  <p className="text-slate-600 mb-6">
                    {activeMember.contribution}
                  </p>
                  <div className="flex justify-center gap-6 text-blue-600">
                    <a href={activeMember.linkedin}>LinkedIn</a>
                    <a href={`mailto:${activeMember.email}`}>Email</a>
                  </div>
                </>
              )}
              <div className="flex justify-center "><button
                onClick={() => {
                  setActiveTech(null);
                  setActiveMember(null);
                }}
                className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-full "
              >
                Close
              </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ================= CONTACT ================= */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h3 className="text-4xl font-bold mb-6">Contact Us</h3>
        <p className="text-slate-600 mb-10">
          Collaborate, test CureTech, or support healthcare innovation
        </p>

        <form
  onSubmit={handleSubmit}
  className="bg-white shadow-lg rounded-3xl p-10 space-y-6"
>
          <input
  placeholder="Name"
  className="w-full border rounded-xl px-4 py-3"
  value={formData.name}
  onChange={(e) =>
    setFormData({ ...formData, name: e.target.value })
  }
/>

<input
  placeholder="Email"
  className="w-full border rounded-xl px-4 py-3"
  value={formData.email}
  onChange={(e) =>
    setFormData({ ...formData, email: e.target.value })
  }
/>

<textarea
  rows="4"
  placeholder="Message"
  className="w-full border rounded-xl px-4 py-3"
  value={formData.message}
  onChange={(e) =>
    setFormData({ ...formData, message: e.target.value })
  }
/>

          <button
  disabled={loading}
  className="w-full py-3 bg-blue-600 text-white rounded-full font-semibold disabled:opacity-60"
>
  {loading ? "Sending..." : "Send Message"}
</button>

{success && <p className="text-green-600">{success}</p>}
{error && <p className="text-red-600">{error}</p>}

        </form>
      </section>
    </div>
  );
}
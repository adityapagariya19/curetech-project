import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
} from "recharts";
import { useLocation } from "react-router-dom";

export default function BloodReport() {
  const [data, setData] = useState(null);
  const [active, setActive] = useState(null);
  const location = useLocation();
  const reportId = location.state?.reportId;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://127.0.0.1:8000/reports/${reportId}/blood`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const json = await res.json();
      setData(json);
    };
    fetchData();
  }, [reportId]);

  const selected = data?.parameters.find(p => p.id === active);

  if (!data) return <div className="p-20 text-center">Loading analysis…</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-6 py-12">
  <div className="max-w-7xl mx-auto">

      {/* ===== SUMMARY ===== */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold">Blood Report Analysis</h1>
        <p className="text-gray-600 mt-3">
          Generated using AI-assisted medical interpretation
        </p>
      </div>

      {/* ===== SPEEDOMETER ===== */}
      <div className="flex justify-center mb-6">
  <div className="relative w-[320px] h-[200px]">

    {/* ARC */}
    <svg viewBox="0 0 360 180" className="w-full h-full">
      <defs>
        <linearGradient id="grad">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      <path
        d="M20 160 A160 160 0 0 1 340 160"
        fill="none"
        stroke="url(#grad)"
        strokeWidth="18"
        strokeLinecap="round"
      />
    </svg>

    {/* NEEDLE */}
    <motion.div
      className="absolute left-1/2 bottom-[28px] origin-bottom"
      style={{ width: 4, height: 90, background: "#111" }}
      animate={{ rotate: -90 + data.score * 1.8 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    />

    {/* CENTER DOT */}
    <div className="absolute left-1/2 bottom-[20px] w-4 h-4 bg-black rounded-full -translate-x-1/2" />

    {/* SCORE */}
    <div className="absolute inset-x-0 bottom-[-10px] text-center">
      <div className="text-4xl font-bold">{data.score}</div>
      <div className="text-gray-500">Overall Health</div>
    </div>
  </div>
</div>
<div className="flex justify-center mt-10">
  <a
    href={`http://127.0.0.1:8000/reports/${reportId}/blood/pdf`}
    target="_blank"
    rel="noreferrer"
    className="px-8 py-3 rounded-full bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-500"
  >
    📄 Download Medical PDF Report
  </a>
</div>

      {/* ===== PARAMETER GRID ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        {data.parameters.map(p => (
          <div
            key={p.id}
            onClick={() => setActive(p.id)}
            className={`cursor-pointer bg-white rounded-xl p-5 shadow border-t-4
              ${p.status === "normal" ? "border-green-500" : "border-red-500"}`}
          >
            <div className="font-semibold">{p.name}</div>
            <div className="text-2xl font-bold">
              {p.value} {p.unit}
            </div>
            <div className="text-sm text-gray-500">
              Normal: {p.min} – {p.max}
            </div>
          </div>
        ))}
      </div>

      {/* ===== DETAIL GRAPH ===== */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-20 bg-white rounded-2xl p-10 shadow-xl"
          >
            <h2 className="text-3xl font-bold mb-6">{selected.name}</h2>

            <div className="h-[320px]">
              <ResponsiveContainer>
                <LineChart data={[
                  { x: "Low", user: selected.min },
                  { x: "Result", user: selected.value },
                  { x: "High", user: selected.max },
                ]}>
                  <XAxis dataKey="x" />
                  <YAxis />
                  <Tooltip />
                  <ReferenceArea
                    y1={selected.min}
                    y2={selected.max}
                    fill="#22c55e"
                    fillOpacity={0.12}
                  />
                  <Line
                    dataKey="user"
                    stroke="#2563eb"
                    strokeWidth={4}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <p className="mt-6 text-lg">
              Your value is <strong>{selected.value} {selected.unit}</strong>.
              Normal range is <strong>{selected.min} – {selected.max}</strong>.
            </p>

            <p className="text-gray-600 mt-2">
              {selected.status === "normal"
                ? "This parameter is clinically normal."
                : "This parameter is outside the normal range. Medical advice is recommended."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* ===== AI SUMMARY ===== */}
<div className="bg-white p-6 rounded-2xl shadow mb-10 mt-10">
  <h2 className="text-xl font-bold mb-2">AI Health Summary</h2>
  <p className="text-gray-700">{data.summary}</p>
</div>

{/* ===== RISK RADAR ===== */}
<div className="grid md:grid-cols-3 gap-6 mb-14">
  {data.health_domains.map(risk => (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className="bg-white p-6 rounded-xl shadow border-l-4
        border-yellow-400"
    >
      <h3 className="font-semibold text-lg">{risk.domain}</h3>
      <p className="text-sm text-gray-600">
        Risk Level: <strong>{risk.level}</strong>
      </p>

      <ul className="mt-4 space-y-2">
        {risk.home_care.map(step => (
          <li key={step} className="flex gap-2 text-sm">
            ✅ {step}
          </li>
        ))}
      </ul>

      <p className="mt-3 text-xs text-red-500">
        {risk.doctor_advice}
      </p>
    </motion.div>
  ))}
</div>

    </div>
    </div>
  );
}

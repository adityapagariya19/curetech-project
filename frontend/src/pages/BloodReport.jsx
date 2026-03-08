import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
} from "recharts";

/* ===============================
   STATIC REAL CBC DATA
   =============================== */

const DATA = {
  score: 78,
  summary:
    "CBC parameters are largely stable. Mild elevation in WBC and RDW may suggest inflammation or nutritional imbalance. Maintain hydration and follow-up if symptoms persist.",
  parameters: [
    { id: "hb", name: "Hemoglobin", value: 13.9, min: 12, max: 15, unit: "g/dL" },
    { id: "rbc", name: "RBC Count", value: 4.4, min: 3.8, max: 4.8, unit: "mil/µL" },
    { id: "pcv", name: "PCV (Hematocrit)", value: 41, min: 36, max: 46, unit: "%" },
    { id: "mcv", name: "MCV", value: 92, min: 83, max: 101, unit: "fL" },
    { id: "mch", name: "MCH", value: 31, min: 27, max: 32, unit: "pg" },
    { id: "mchc", name: "MCHC", value: 33.6, min: 31.5, max: 34.5, unit: "g/dL" },
    { id: "rdw", name: "RDW-CV", value: 16.9, min: 11.6, max: 14.5, unit: "%" },
    { id: "wbc", name: "WBC Count", value: 10840, min: 4000, max: 10000, unit: "/µL" },
    { id: "platelet", name: "Platelets", value: 361000, min: 150000, max: 450000, unit: "/µL" },
    { id: "mpv", name: "MPV", value: 7.7, min: 7.2, max: 11.7, unit: "fL" },
  ],
};

const status = (v, min, max) =>
  v < min ? "low" : v > max ? "high" : "normal";

export default function BloodReport() {
  const [active, setActive] = useState(DATA.parameters[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold">Blood Report Analysis</h1>
          <p className="text-gray-600 mt-2">
            Premium AI-style medical dashboard (frontend only)
          </p>
        </div>

        {/* SPEEDOMETER */}
        <div className="flex justify-center mb-16">
          <div className="relative w-[320px] h-[200px]">
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

            <div
              className="absolute left-1/2 bottom-[28px] origin-bottom"
              style={{
                width: 4,
                height: 90,
                background: "#111",
                transform: `rotate(${-90 + DATA.score * 1.8}deg)`,
              }}
            />

            <div className="absolute left-1/2 bottom-[20px] w-4 h-4 bg-black rounded-full -translate-x-1/2" />

            <div className="absolute inset-x-0 bottom-[-12px] text-center">
              <div className="text-4xl font-bold">{DATA.score}</div>
              <div className="text-gray-500">Overall Health Score</div>
            </div>
          </div>
        </div>

        {/* PARAMETER GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {DATA.parameters.map(p => {
            const s = status(p.value, p.min, p.max);
            return (
              <div
                key={p.id}
                onClick={() => setActive(p)}
                className={`cursor-pointer bg-white rounded-xl p-5 shadow border-t-4 transition
                  ${
                    s === "normal"
                      ? "border-green-500"
                      : s === "low"
                      ? "border-yellow-500"
                      : "border-red-500"
                  }`}
              >
                <div className="font-semibold">{p.name}</div>
                <div className="text-2xl font-bold">
                  {p.value} {p.unit}
                </div>
                <div className="text-sm text-gray-500">
                  Normal: {p.min} – {p.max}
                </div>
              </div>
            );
          })}
        </div>

        {/* DETAIL GRAPH */}
        {active && (
          <div className="mt-20 bg-white rounded-2xl p-10 shadow-xl">
            <h2 className="text-3xl font-bold mb-6">{active.name}</h2>

            <div className="h-[320px]">
              <ResponsiveContainer>
                <LineChart
                  data={[
                    { label: "Low", value: active.min },
                    { label: "Your Value", value: active.value },
                    { label: "High", value: active.max },
                  ]}
                >
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <ReferenceArea
                    y1={active.min}
                    y2={active.max}
                    fill="#22c55e"
                    fillOpacity={0.15}
                  />
                  <Line
                    dataKey="value"
                    stroke="#2563eb"
                    strokeWidth={4}
                    dot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <p className="mt-6 text-lg">
              Your value is <strong>{active.value} {active.unit}</strong>. Normal range is{" "}
              <strong>{active.min} – {active.max}</strong>.
            </p>

            <p className="text-gray-600 mt-2">
              {status(active.value, active.min, active.max) === "normal"
                ? "This parameter is clinically normal."
                : "This parameter is outside the normal range. Medical attention may be advised."}
            </p>
          </div>
        )}

        {/* AI SUMMARY */}
        <div className="bg-white p-6 rounded-2xl shadow mt-16">
          <h2 className="text-xl font-bold mb-2">AI Health Summary</h2>
          <p className="text-gray-700">{DATA.summary}</p>
        </div>

      </div>
    </div>
  );
}

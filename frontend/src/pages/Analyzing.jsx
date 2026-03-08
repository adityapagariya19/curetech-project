import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const FOOTER_HEIGHT = 120;

const statusText = (p) => {
  if (p < 15) return "Initializing secure AI pipeline…";
  if (p < 35) return "Parsing medical report structure…";
  if (p < 55) return "Extracting clinical parameters…";
  if (p < 75) return "Evaluating ranges & anomalies…";
  if (p < 95) return "Generating personalized insights…";
  return "Finalizing AI diagnosis…";
};

export default function Analyzing() {
  const navigate = useNavigate();
  const location = useLocation();

  const reportId = location.state?.reportId;
  const reportType = location.state?.reportType || "blood";

  const [progress, setProgress] = useState(0);
  const finishedRef = useRef(false);

  // 🔐 SAFETY
  useEffect(() => {
    if (!reportId) navigate("/upload");
  }, [reportId, navigate]);

  // 🎞️ PROGRESS ANIMATION (ALWAYS RUNS)
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          return 100;
        }
        return p + 1;
      });
    }, 40);

    return () => clearInterval(timer);
  }, []);

  // 🧠 BACKEND ANALYSIS (PARALLEL)
  useEffect(() => {
    const analyze = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/auth");
          return;
        }

        const res = await fetch(
          `http://127.0.0.1:8000/reports/analyze/${reportId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Analysis failed");

        finishedRef.current = true;
      } catch {
        alert("Analysis failed. Please re-upload.");
        navigate("/upload");
      }
    };

    analyze();
  }, [reportId, navigate]);

  // 🚀 FINAL NAVIGATION
  useEffect(() => {
    if (progress === 100 && finishedRef.current) {
      setTimeout(() => {
        navigate(`/${reportType}-report`, {
          state: { reportId },
        });
      }, 800);
    }
  }, [progress, reportId, reportType, navigate]);

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-[#eef6ff] via-[#f8fbff] to-[#edf6ff]"
      style={{
        minHeight: `calc(100vh - ${FOOTER_HEIGHT}px)`,
        paddingBottom: `${FOOTER_HEIGHT}px`,
      }}
    >
      {/* BACKGROUND STREAM */}
      <svg className="absolute inset-0 w-full h-full">
        {[...Array(7)].map((_, i) => (
          <motion.path
            key={i}
            d={`M 0 ${260 + i * 24} C 300 ${220 + i * 18}, 600 ${
              360 + i * 14
            }, 1200 ${280 + i * 20}`}
            fill="none"
            stroke="rgba(56,189,248,0.25)"
            strokeWidth="2"
            strokeDasharray="8 14"
            animate={{ strokeDashoffset: [240, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </svg>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold text-blue-900"
        >
          AI is Analyzing Your Report
        </motion.h1>

        <p className="mt-4 text-blue-700 font-medium">
          {statusText(progress)}
        </p>

        {/* PROGRESS RING */}
        <div className="mt-20 flex justify-center">
          <div className="relative w-48 h-48">
            <svg width="200" height="200">
              <circle
                cx="100"
                cy="100"
                r="78"
                stroke="#e0ecff"
                strokeWidth="14"
                fill="none"
              />
              <motion.circle
                cx="100"
                cy="100"
                r="78"
                stroke="#38bdf8"
                strokeWidth="14"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={490}
                strokeDashoffset={490 - (490 * progress) / 100}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-blue-900">
              {progress}%
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

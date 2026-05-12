import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../utils/api";

const ROUTE_MAP = {
  blood:"/blood-report", urine:"/urine-report",
  liver:"/liver-report", kidney:"/kidney-report", thyroid:"/thyroid-report",
};

const STEPS = [
  { at:0,  label:"Initialising secure pipeline",  icon:"🔐" },
  { at:18, label:"Running OCR on your file",       icon:"📄" },
  { at:36, label:"Parsing medical parameters",     icon:"🔬" },
  { at:54, label:"Comparing with clinical ranges", icon:"📊" },
  { at:72, label:"Generating AI insights",         icon:"🤖" },
  { at:90, label:"Building your dashboard",        icon:"✨" },
];

export default function Analyzing() {
  const navigate  = useNavigate();
  const { state } = useLocation();
  const reportId   = state?.reportId;
  const reportType = state?.reportType || "blood";

  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx]   = useState(0);
  const [error, setError]       = useState("");
  const started = useRef(false);

  // UI progress ticker
  useEffect(() => {
    const iv = setInterval(() => setProgress(p => p >= 93 ? 93 : p + 0.7), 55);
    return () => clearInterval(iv);
  }, []);

  // Track which step label to show
  useEffect(() => {
    const s = [...STEPS].reverse().find(s => progress >= s.at);
    if (s) setStepIdx(STEPS.indexOf(s));
  }, [progress]);

  // Fire backend analysis
  useEffect(() => {
    if (!reportId || started.current) return;
    started.current = true;

    api.analyzeReport(reportId)
      .then(() => {
        setProgress(100);
        setTimeout(() => navigate(ROUTE_MAP[reportType], { state: { reportId } }), 700);
      })
      .catch(err => {
        setError(err.message || "Analysis failed.");
        setProgress(100);
      });
  }, [reportId, reportType, navigate]);

  // Demo mode (no reportId) — just animate then redirect
  useEffect(() => {
    if (reportId) return;
    const t = setTimeout(() => navigate(ROUTE_MAP[reportType] || "/blood-report"), 4200);
    return () => clearTimeout(t);
  }, [reportId, reportType, navigate]);

  const pct = Math.min(100, Math.round(progress));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{background:"linear-gradient(160deg,#f0f6ff 0%,#f8faff 60%,#eef4ff 100%)"}}>

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[["25%","20%","#2563EB"],["65%","60%","#06B6D4"]].map(([t,l,c],i)=>(
          <motion.div key={i} animate={{scale:[1,1.2,1],opacity:[0.2,0.4,0.2]}}
            transition={{duration:6+i*2,repeat:Infinity}}
            className="absolute w-80 h-80 rounded-full"
            style={{top:t,left:l,background:`radial-gradient(circle,${c}22,transparent)`,filter:"blur(60px)"}}/>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md text-center space-y-8">

        <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{duration:0.7}}>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900">
            AI is Analysing<br/>Your Report
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            {reportId ? "Processing through CureTech medical AI pipeline" : "Loading demo analysis…"}
          </p>
        </motion.div>

        {/* Ring */}
        <div className="flex justify-center">
          <div className="relative w-44 h-44">
            <svg width="176" height="176" className="-rotate-90">
              <defs>
                <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2563EB"/>
                  <stop offset="100%" stopColor="#06B6D4"/>
                </linearGradient>
              </defs>
              <circle cx="88" cy="88" r="76" fill="none" stroke="#e2e8f0" strokeWidth="10"/>
              <motion.circle cx="88" cy="88" r="76" fill="none"
                stroke="url(#pg)" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={477}
                animate={{strokeDashoffset: 477 - (477*pct/100)}}
                transition={{duration:0.3}}/>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-900">{pct}%</span>
              <span className="text-2xl mt-0.5">{STEPS[stepIdx]?.icon}</span>
            </div>
          </div>
        </div>

        {/* Current step */}
        <AnimatePresence mode="wait">
          <motion.p key={stepIdx} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
            className="text-blue-600 font-semibold text-sm">
            {STEPS[stepIdx]?.label}…
          </motion.p>
        </AnimatePresence>

        {/* Step grid */}
        <div className="grid grid-cols-3 gap-2">
          {STEPS.map((s,i) => (
            <div key={i} className={`rounded-xl px-2 py-2.5 text-[11px] font-semibold border transition-all text-center ${
              progress >= s.at
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-white border-slate-200 text-slate-300"
            }`}>
              {progress >= s.at ? "✓ " : ""}{s.label.split(" ").slice(0,2).join(" ")}
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
            className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-3">
            <p className="text-red-700 font-bold text-sm">Analysis error</p>
            <p className="text-red-600 text-sm">{error}</p>
            <button onClick={() => navigate("/upload")}
              className="px-5 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition">
              Try Again
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GlowBackground from "../components/GlowBackground";
import { api } from "../utils/api";

const REPORT_TYPES = [
  { id:"blood",   icon:"🩸", title:"Blood / CBC",    desc:"Hemoglobin, WBC, RBC, Platelets" },
  { id:"urine",   icon:"🧪", title:"Urine Analysis", desc:"Protein, Glucose, Nitrite, pH"   },
  { id:"liver",   icon:"🫀", title:"Liver (LFT)",    desc:"SGPT, SGOT, Bilirubin, Albumin"  },
  { id:"kidney",  icon:"🩺", title:"Kidney (KFT)",   desc:"Creatinine, Urea, GFR"           },
  { id:"thyroid", icon:"🧠", title:"Thyroid Panel",  desc:"TSH, T3, T4, TPO Antibodies"     },
];

export default function Upload() {
  const navigate    = useNavigate();
  const [selected, setSelected]   = useState(null);
  const [file, setFile]           = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState("");

  const token = localStorage.getItem("token");

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const ok = ["application/pdf","image/png","image/jpeg","image/jpg"].includes(f.type);
    if (!ok) { setError("Only PDF, PNG, or JPG files accepted."); return; }
    if (f.size > 20 * 1024 * 1024) { setError("File too large — max 20 MB."); return; }
    setError(""); setFile(f);
  };

  const handleAnalyze = async () => {
    if (!file || !selected || uploading) return;
    setError("");

    // Must be logged in — no demo mode for uploads
    if (!token) {
      navigate("/auth", { state: { from: "/upload" } });
      return;
    }

    setUploading(true);
    try {
      const { report_id } = await api.uploadReport(file, selected);
      navigate("/analyzing", { state: { reportId: report_id, reportType: selected } });
    } catch (err) {
      setError(err.message || "Upload failed. Please check your connection and try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6fbff]">
      <GlowBackground />

      {/* Lung background */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.div animate={{scale:[1,1.04,1]}} transition={{duration:5,repeat:Infinity,ease:"easeInOut"}}
          className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full blur-3xl bg-blue-400/20"/>
          <img src="/lungs.png" alt="" className="relative z-10 w-[58vw] max-w-[760px] min-w-[260px] drop-shadow-2xl opacity-50"/>
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-20">

        {/* Heading */}
        <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.7}}
          className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900">
            Upload Your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Medical Report
            </span>
          </h1>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            AI extracts every biomarker from your actual report, compares with clinical ranges,
            and builds your personalised health dashboard.
          </p>

          {/* Login prompt — only shown when NOT logged in */}
          {!token && (
            <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.4}}
              className="mt-6 inline-flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-2xl shadow-lg cursor-pointer hover:bg-blue-700 transition"
              onClick={() => navigate("/auth", { state: { from: "/upload" } })}>
              <span className="text-xl">🔐</span>
              <div className="text-left">
                <div className="font-bold text-sm">Sign in to analyse your report</div>
                <div className="text-blue-200 text-xs">Your results will be saved to your account</div>
              </div>
              <span className="ml-2 font-bold">→</span>
            </motion.div>
          )}
        </motion.div>

        {/* Step 1 */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-slate-800 mb-5">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold mr-2">1</span>
            Choose Report Type
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {REPORT_TYPES.map((r, i) => {
              const active = selected === r.id;
              return (
                <motion.div key={r.id}
                  initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
                  whileHover={{y:-5,scale:1.03}} whileTap={{scale:0.97}}
                  onClick={() => setSelected(r.id)}
                  className={`cursor-pointer rounded-2xl p-5 border-2 transition-all ${
                    active
                      ? "border-blue-500 shadow-xl text-white"
                      : "bg-white/80 border-slate-200 hover:border-blue-300 backdrop-blur-xl"
                  }`}
                  style={active ? {background:"linear-gradient(135deg,#2563EB,#0891b2)"} : {}}>
                  <div className="text-3xl mb-3">{r.icon}</div>
                  <div className={`font-bold text-sm mb-1 ${active?"text-white":"text-slate-800"}`}>{r.title}</div>
                  <div className={`text-xs leading-snug ${active?"text-blue-100":"text-slate-400"}`}>{r.desc}</div>
                  {active && <div className="mt-2 text-[10px] text-blue-200 font-semibold">✓ Selected</div>}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Step 2 — only shown after selecting type */}
        <AnimatePresence>
          {selected && (
            <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={{opacity:0}}
              transition={{duration:0.45}} className="mb-10">
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold mr-2">2</span>
                Upload Your Report File
              </h2>
              <label className="block cursor-pointer">
                <input type="file" hidden accept=".pdf,.png,.jpg,.jpeg" onChange={handleFile}/>
                <motion.div whileHover={{scale:1.01}} whileTap={{scale:0.99}}
                  className={`rounded-3xl p-10 text-center border-2 border-dashed transition-all backdrop-blur-xl ${
                    file
                      ? "border-blue-400 bg-blue-50/60"
                      : "border-slate-300 bg-white/60 hover:border-blue-400 hover:bg-blue-50/30"
                  }`}>
                  <div className="text-5xl mb-3">{file ? "✅" : "📂"}</div>
                  {file ? (
                    <>
                      <p className="text-lg font-bold text-slate-900">{file.name}</p>
                      <p className="text-sm text-slate-400 mt-1">
                        {(file.size/1024/1024).toFixed(2)} MB · Click to change
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-semibold text-slate-700">Click to select PDF or Image</p>
                      <p className="text-sm text-slate-400 mt-1">PDF · PNG · JPG — max 20 MB</p>
                    </>
                  )}
                </motion.div>
              </label>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-medium text-center">
            ⚠️ {error}
          </motion.div>
        )}

        {/* Analyse button */}
        <AnimatePresence>
          {file && selected && (
            <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="flex flex-col items-center gap-3">
              {!token ? (
                <div className="text-center">
                  <p className="text-slate-500 text-sm mb-3">You need to be signed in to analyse your report.</p>
                  <motion.button whileHover={{scale:1.04}} whileTap={{scale:0.97}}
                    onClick={() => navigate("/auth", { state: { from: "/upload" } })}
                    className="px-10 py-4 rounded-full text-white text-base font-bold shadow-xl"
                    style={{background:"linear-gradient(135deg,#2563EB,#06B6D4)"}}>
                    🔐 Sign In to Analyse
                  </motion.button>
                </div>
              ) : (
                <>
                  <motion.button whileHover={{scale:uploading?1:1.04}} whileTap={{scale:uploading?1:0.97}}
                    disabled={uploading} onClick={handleAnalyze}
                    className="px-14 py-4 rounded-full text-white text-lg font-bold shadow-2xl disabled:opacity-60 transition-all"
                    style={{background:"linear-gradient(135deg,#2563EB,#06B6D4)",
                      boxShadow:"0 16px 40px rgba(37,99,235,0.3)"}}>
                    {uploading ? "Uploading…" : "🔬 Analyse My Report"}
                  </motion.button>
                  <p className="text-xs text-slate-400">Results saved to your account</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import GlowBackground from "../components/GlowBackground";
import { useNavigate } from "react-router-dom";

const reportTypes = [
  { id: "blood", title: "Blood Report", icon: "🩸", desc: "CBC, Sugar, Hemoglobin, Platelets" },
  { id: "urine", title: "Urine Report", icon: "🧪", desc: "Infection, Protein, Glucose, Hydration" },
  { id: "liver", title: "Liver Report", icon: "🫀", desc: "SGOT, SGPT, Bilirubin Levels" },
  { id: "kidney", title: "Kidney Report", icon: "🩺", desc: "Creatinine, Urea, GFR Analysis" },
  { id: "thyroid", title: "Thyroid Report", icon: "🧠", desc: "TSH, T3, T4 Hormones" },
];

export default function Upload() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const isValidFile = (file) => {
    if (!file) return false;
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    return allowedTypes.includes(file.type);
  };

  const handleUpload = async () => {
    if (!file || !selectedReport) return;

    if (!isValidFile(file)) {
      alert("Please upload a valid PDF or image file (PNG/JPG).");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/reports/upload?report_type=${selectedReport}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/auth");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Upload failed");
      }

      navigate("/analyzing", {
        state: {
          reportId: data.report_id,
          reportType: selectedReport,
        },
      });
    } catch (err) {
      alert(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6fbff]">
      <GlowBackground />

      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex items-center justify-center"
        >
          <motion.div
            className="absolute inset-0 rounded-full blur-3xl bg-blue-400/30"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          />

          <img
            src="/lungs.png"
            alt="Breathing lungs"
            className="relative z-10 w-[65vw] max-w-[820px] min-w-[320px] drop-shadow-2xl"
          />
        </motion.div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl font-extrabold">
            Upload Your <span className="text-blue-600">Medical Report</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            Select the type of report you’re uploading. CureTech will analyze only
            what’s relevant.
          </p>
        </motion.div>

        {/* STEP 1 */}
        <div className="mb-24">
          <h2 className="text-2xl font-bold mb-8">1️⃣ Choose Report Type</h2>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
            {reportTypes.map((report, index) => {
              const active = selectedReport === report.id;
              return (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -10, scale: 1.03 }}
                  onClick={() => setSelectedReport(report.id)}
                  className={`cursor-pointer rounded-3xl p-6 backdrop-blur-xl transition
                    ${active ? "bg-blue-600 text-white shadow-2xl" : "glass hover:shadow-xl"}`}
                >
                  <div className="text-4xl mb-4">{report.icon}</div>
                  <h3 className="font-semibold text-lg">{report.title}</h3>
                  <p className={`text-sm mt-2 ${active ? "text-blue-100" : "text-slate-500"}`}>
                    {report.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* STEP 2 */}
        <AnimatePresence>
          {selectedReport && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.7 }}
              className="mb-24"
            >
              <h2 className="text-2xl font-bold mb-8">2️⃣ Upload Report File</h2>

              <motion.label className="block glass rounded-3xl p-10 text-center cursor-pointer">
                <input
                  type="file"
                  hidden
                  accept=".pdf,image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <div className="text-5xl mb-6">📄</div>
                <p className="text-lg font-medium">
                  {file ? file.name : "Click to upload PDF / Image"}
                </p>
              </motion.label>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STEP 3 */}
        <AnimatePresence>
          {file && (
            <motion.div className="flex justify-center">
              <motion.button
                whileHover={{ scale: uploading ? 1 : 1.08 }}
                whileTap={{ scale: uploading ? 1 : 0.96 }}
                disabled={uploading}
                onClick={handleUpload}
                className="px-12 py-4 rounded-full bg-blue-600 text-white font-semibold shadow-2xl disabled:opacity-60"
              >
                {uploading ? "Uploading..." : "Analyze My Report"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

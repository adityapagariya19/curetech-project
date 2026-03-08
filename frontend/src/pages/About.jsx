import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const DATA = {
  problem: {
    title: "The Problem",
    image: "/problem.png",
    items: [
      { t: "🧾 Medical language is not patient-friendly", d: "Lab reports use clinical terms and abbreviations designed for professionals, not patients." },
      { t: "🔢 Numbers without context", d: "Patients see values but don’t know if they are safe, borderline, or dangerous." },
      { t: "⏳ Delayed understanding", d: "People wait days just to understand what their reports actually mean." },
      { t: "📄 Reports treated as isolated files", d: "Each report is viewed separately, hiding long-term health trends." },
      { t: "🧠 Cognitive overload", d: "Multiple parameters overwhelm patients and cause anxiety instead of clarity." },
      { t: "❓ No actionable guidance", d: "Reports do not explain what actions, if any, should be taken next." },
      { t: "📉 No severity indication", d: "Abnormal values are not ranked by risk or urgency." },
      { t: "👨‍⚕️ Doctor dependency for basics", d: "Even normal results often require doctor explanation." },
      { t: "📚 Medical education gap", d: "Patients lack basic medical literacy to interpret reports themselves." },
      { t: "🧪 Different labs, different formats", d: "Each lab presents data differently, causing confusion." },
      { t: "📊 No visual explanation", d: "Reports rarely include intuitive charts or comparisons." },
      { t: "⚠️ Panic from minor deviations", d: "Small, harmless deviations often cause unnecessary fear." },
      { t: "🕒 Time-consuming consultations", d: "Doctors spend valuable time explaining numbers instead of care." },
      { t: "📂 Poor report organization", d: "Reports are scattered across apps, emails, and PDFs." },
      { t: "🔍 Hard to spot critical issues", d: "Serious problems can be buried among normal values." },
      { t: "📉 No progress tracking", d: "Patients can’t easily see improvement or deterioration." },
      { t: "🌐 Lack of accessibility", d: "Reports are not optimized for all users or age groups." },
      { t: "🧠 Stress-driven interpretation", d: "Patients Google values and often misinterpret results." },
      { t: "🩺 No preventive insight", d: "Reports focus on diagnosis, not early warning signs." },
      { t: "🔒 Data without intelligence", d: "Raw data exists, but insight does not." }
    ]
  },
  solution: {
    title: "Our Solution",
    image: "/solution.png",
    items: [
      { t: "🤖 AI-powered interpretation", d: "CureTech translates medical data into simple, human-readable language." },
      { t: "🧠 Context-aware explanations", d: "Each value is explained in terms of health impact." },
      { t: "🚦 Risk-level indicators", d: "Results are categorized as normal, attention-needed, or critical." },
      { t: "📊 Visual summaries", d: "Charts and summaries replace dense tables." },
      { t: "🧪 Report-type intelligence", d: "Different medical reports are analyzed using specialized logic." },
      { t: "📈 Trend analysis", d: "Users can track health changes over time." },
      { t: "🧾 Unified report dashboard", d: "All reports live in one organized platform." },
      { t: "🕒 Instant understanding", d: "Users get clarity immediately after upload." },
      { t: "🔍 Highlighted abnormalities", d: "Critical values are surfaced instantly." },
      { t: "🧠 Reduced anxiety", d: "Clear explanations prevent unnecessary panic." },
      { t: "👨‍⚕️ Doctor-supportive insights", d: "Doctors get patients who understand their own reports." },
      { t: "📚 Educational micro-explanations", d: "Users learn what each medical term means." },
      { t: "🧩 Personalized interpretation", d: "Analysis adapts to age, gender, and report type." },
      { t: "🔄 Continuous improvement", d: "AI improves as more reports are analyzed." },
      { t: "⚠️ Early warning alerts", d: "Potential risks are flagged before becoming serious." },
      { t: "📱 Device-friendly experience", d: "Works seamlessly on mobile and desktop." },
      { t: "🧠 Decision support", d: "Users know when to consult a doctor and when not to." },
      { t: "🔒 Secure by design", d: "Medical-grade data security is built in." },
      { t: "📑 Plain-language summaries", d: "Each report ends with a simple takeaway." },
      { t: "🩺 Preventive health focus", d: "CureTech promotes proactive health management." }
    ]
  },

  vision: {
    title: "Our Vision",
    image: "/vision.png",
    items: [
      { t: "🌍 Health clarity for everyone", d: "Medical understanding should not be exclusive to professionals." },
      { t: "🧠 Empowered patients", d: "Informed patients make better health decisions." },
      { t: "⚕️ Preventive-first healthcare", d: "Early understanding leads to early action." },
      { t: "🤝 Stronger doctor-patient collaboration", d: "Clear reports enable meaningful discussions." },
      { t: "📊 Data-driven wellness", d: "Healthcare decisions should be based on insight, not guesswork." },
      { t: "🩺 Reduced healthcare burden", d: "Fewer unnecessary visits free up medical resources." },
      { t: "📚 Medical literacy at scale", d: "Everyone deserves to understand their own body." },
      { t: "🌱 Long-term health awareness", d: "Users learn patterns, not just results." },
      { t: "🔍 Transparency in healthcare AI", d: "AI should explain itself, not act as a black box." },
      { t: "⚖️ Ethical AI usage", d: "Healthcare AI must be responsible and unbiased." },
      { t: "📱 Accessible health intelligence", d: "Medical insight should be available anywhere." },
      { t: "🧠 Confidence, not fear", d: "Understanding replaces anxiety." },
      { t: "🔒 Privacy-first design", d: "Health data must remain personal." },
      { t: "📈 Continuous personal health tracking", d: "Health is a journey, not a snapshot." },
      { t: "🌐 Global health understanding", d: "Medical clarity across cultures and regions." },
      { t: "🧩 Personalized healthcare", d: "No two patients are the same." },
      { t: "⚕️ Support clinical excellence", d: "AI assists doctors, it does not replace them." },
      { t: "📑 Simplified medical communication", d: "Clarity should be standard, not optional." },
      { t: "🧬 Future-ready healthcare", d: "Preparing for AI-integrated medical systems." },
      { t: "💙 Human-centered technology", d: "Technology should serve people, not confuse them." }
    ]
  }
};


export default function About() {
  const [active, setActive] = useState(null);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#eef4ff]">

      {/* ===== BACKGROUND ===== */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/about-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-white/80 backdrop-blur-sm" />

      {/* ===== HERO ===== */}
      <div className="relative max-w-7xl mx-auto px-8 pt-24 pb-12">
        <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 max-w-4xl leading-tight">
          Medical reports are confusing.{" "}
          <span className="text-blue-600">We make them simple.</span>
        </h1>

        {/* DISCLAIMER */}
        <p className="mt-9 text-sm text-slate-500 max-w-3xl">
          ⚠️ Disclaimer: CureTech provides AI-generated interpretations that are approximately <strong>95% accurate</strong>. This does not replace
          professional medical advice.
        </p>

        {/* ===== CARDS ===== */}
        <div className="mt-14 grid md:grid-cols-3 gap-8">
          {["problem", "solution", "vision"].map((k) => (
            <motion.div
              key={k}
              whileHover={{
                y: -8,
                boxShadow: "0 30px 60px rgba(37,99,235,0.25)"
              }}
              transition={{ type: "spring", stiffness: 200 }}
              onClick={() => setActive(k)}
              className="cursor-pointer rounded-2xl bg-white/80 backdrop-blur-xl p-6"
            >
              <div className="w-full h-36 mb-4 rounded-xl bg-slate-100 overflow-hidden">
                <img
                  src={DATA[k].image}
                  alt={DATA[k].title}
                  className="w-full h-full object-contain"
                />
              </div>

              <h3 className="text-lg font-semibold text-slate-900">
                {DATA[k].title}
              </h3>
              <p className="text-slate-600 text-sm mt-2">
                Click to explore in detail
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ===== CENTER MODAL ===== */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center px-6 py-5 border-b">
                <h2 className="text-xl font-semibold text-slate-900">
                  {DATA[active].title}
                </h2>
                <button
                  onClick={() => setActive(null)}
                  className="text-slate-500 hover:text-slate-900 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* CONTENT */}
              <div className="px-6 py-6 max-h-[70vh] overflow-y-auto space-y-6">
                {DATA[active].items.map((it, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <h4 className="font-medium text-slate-900">
                      {i + 1}. {it.t}
                    </h4>
                    <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                      {it.d}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
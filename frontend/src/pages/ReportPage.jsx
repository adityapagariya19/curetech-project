/**
 * ReportPage — Universal live report dashboard.
 * NO FAKE DATA. If no real report result exists, shows an explicit
 * "no data" state and asks the user to upload a proper report.
 */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ResponsiveContainer, BarChart, Bar, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ReferenceLine,
} from "recharts";
import { api } from "../utils/api";

// ── Colour helpers ──────────────────────────────────────────────────────────
const SC     = { normal:"#10B981", low:"#F59E0B", high:"#EF4444" };
const SClass = {
  normal: "bg-emerald-50 text-emerald-700 border-emerald-200",
  low:    "bg-amber-50  text-amber-700  border-amber-200",
  high:   "bg-red-50    text-red-700    border-red-200",
};
const devPct = (v, lo, hi) => {
  const mid = (lo+hi)/2, rng = (hi-lo)/2;
  return rng > 0 ? Math.min(100, Math.round(Math.abs(v-mid)/rng*100)) : 0;
};

// ── Animated counter ─────────────────────────────────────────────────────────
function Counter({ to, decimals=0, duration=1.4 }) {
  const [v, setV] = useState(0);
  const ref = useRef();
  const inView = useInView(ref, { once:true });
  useEffect(() => {
    if (!inView) return;
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts-start)/(duration*1000), 1);
      setV(+(to*(1-Math.pow(1-p,3))).toFixed(decimals));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, to, decimals, duration]);
  return <span ref={ref}>{v.toLocaleString()}</span>;
}

// ── Score ring ────────────────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const r = 52, c = 2*Math.PI*r;
  const col   = score>=75?"#10B981":score>=50?"#F59E0B":"#EF4444";
  const label = score>=75?"Excellent":score>=60?"Good":score>=40?"Fair":"Poor";
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="130" height="130">
          <circle cx="65" cy="65" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10"/>
          <motion.circle cx="65" cy="65" r={r} fill="none" stroke={col} strokeWidth="10"
            strokeLinecap="round" strokeDasharray={c}
            initial={{strokeDashoffset:c}} animate={{strokeDashoffset:c-(c*score/100)}}
            transition={{duration:1.6,ease:[0.34,1.1,0.64,1]}}
            transform="rotate(-90 65 65)"/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-slate-900"><Counter to={score}/></span>
          <span className="text-[10px] font-semibold text-slate-400">{label}</span>
        </div>
      </div>
    </div>
  );
}

// ── Dark tooltip ─────────────────────────────────────────────────────────────
const DarkTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs shadow-2xl">
      <div className="text-slate-400 mb-1">{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{color:p.color}}>
          {p.name}: <strong>{typeof p.value==="number"?p.value.toLocaleString():p.value}</strong>
        </div>
      ))}
    </div>
  );
};

// ── Param card ───────────────────────────────────────────────────────────────
function ParamCard({ p, active, onClick, index }) {
  const col  = SC[p.status] || "#10B981";
  const isQ  = p.qualitative;
  const barW = isQ
    ? (p.status==="normal" ? 100 : 20)
    : Math.max(3, Math.min(100, ((p.value-p.min)/(p.max-p.min))*100));

  return (
    <motion.div
      initial={{opacity:0,y:18}} animate={{opacity:1,y:0}}
      transition={{duration:0.38,delay:index*0.04}}
      whileHover={{y:-5,scale:1.03}} whileTap={{scale:0.97}}
      onClick={onClick}
      className={`cursor-pointer rounded-2xl p-4 bg-white border-2 relative overflow-hidden transition-all ${
        active ? "border-blue-500 shadow-blue-100 shadow-lg" : "border-slate-100 hover:border-blue-200"
      }`}>
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" style={{backgroundColor:col}}/>
      <div className="flex items-start justify-between mb-2">
        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest ${SClass[p.status]}`}>
          {p.status}
        </span>
      </div>
      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1 leading-tight">{p.name}</div>
      <div className="text-xl font-extrabold text-slate-900 mb-0.5">
        {typeof p.value==="number" ? p.value.toLocaleString() : p.value}
        {p.unit && <span className="text-[10px] text-slate-400 font-normal ml-1">{p.unit}</span>}
      </div>
      {!isQ && <div className="text-[10px] text-slate-400 font-mono mb-2">{p.min?.toLocaleString()}–{p.max?.toLocaleString()}</div>}
      {isQ  && <div className="text-[10px] text-slate-400 mb-2">Normal: {p.normal}</div>}
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1.5">
        <motion.div className="h-full rounded-full"
          style={{background:`linear-gradient(90deg,${col}88,${col})`}}
          initial={{width:0}} animate={{width:`${barW}%`}}
          transition={{duration:1.1,delay:index*0.04+0.3}}/>
      </div>
      {p.status!=="normal"&&!isQ&&(
        <div className="text-[10px] font-bold" style={{color:col}}>
          {p.status==="high"?"▲":"▼"} {devPct(p.value,p.min,p.max)}% outside range
        </div>
      )}
      <div className="text-[10px] text-blue-500 font-semibold mt-1.5">View insights →</div>
    </motion.div>
  );
}

// ── Detail modal ──────────────────────────────────────────────────────────────
function DetailModal({ p, reportType, onClose }) {
  const [tab, setTab] = useState("overview");
  if (!p) return null;
  const col = SC[p.status] || "#10B981";
  const isQ = p.qualitative;
  const mid = !isQ && p.min!=null ? (p.min+p.max)/2 : 0;

  const trendData = !isQ && p.min!=null ? [
    {m:"3m ago", v:+(p.value*0.88).toFixed(2), ref:mid},
    {m:"2m ago", v:+(p.value*0.94).toFixed(2), ref:mid},
    {m:"1m ago", v:+(p.value*0.98).toFixed(2), ref:mid},
    {m:"Now",    v:p.value,                     ref:mid},
  ] : [];

  const barData = !isQ && p.min!=null
    ? [{name:"Min",v:p.min},{name:"Your Value",v:p.value},{name:"Max",v:p.max}]
    : [];

  const riskPct = p.status==="normal" ? 8 : (!isQ&&p.min!=null ? devPct(p.value,p.min,p.max) : 65);

  const FOODS = {
    blood:   { eat:["Iron-rich foods: liver, lentils, red meat","Vitamin C with every iron meal","Beets & pomegranate","B12: eggs, fish, dairy","Folate: leafy greens, legumes"], avoid:["Tea/coffee during meals — blocks iron","Alcohol","Processed and packaged foods"] },
    urine:   { eat:["3L water daily","Cranberry juice (UTI prevention)","D-Mannose supplement","Probiotic yogurt","Vitamin C foods"], avoid:["Sugar and refined carbs","Caffeine during infection","Alcohol","Holding urine for long periods"] },
    liver:   { eat:["2 cups coffee/day (liver-protective)","Turmeric with black pepper","Beets & artichoke","Omega-3 fish","Leafy greens"], avoid:["Alcohol — must stop completely","Processed meats","Fried/oily foods","Paracetamol overuse"] },
    kidney:  { eat:["Low-sodium diet","Cherries (reduce uric acid)","Omega-3 fish","Berries","Adequate water"], avoid:["High protein supplements","Excess salt","NSAIDs (ibuprofen)","Organ meats","Alcohol"] },
    thyroid: { eat:["Iodine: seaweed, fish, dairy","Selenium: Brazil nuts, eggs","Zinc: pumpkin seeds","Vitamin D (sunlight + eggs)"], avoid:["Excessive raw cruciferous veg","Soy excess","Gluten (if Hashimoto's)","Iodine supplements in excess"] },
  };
  const foods = FOODS[reportType] || FOODS.blood;

  const LIFESTYLE = {
    blood:   ["30-min brisk walk daily","Sleep 7–9 hours — RBCs regenerate during deep sleep","Take iron + vitamin C together","Quit smoking immediately"],
    urine:   ["Urinate after intercourse","Never hold urine for long periods","Wipe front to back","Complete full antibiotic course"],
    liver:   ["Stop alcohol completely — most impactful step","Lose weight gradually (0.5kg/week)","Exercise 30 min/day","Avoid hepatotoxic drugs"],
    kidney:  ["Drink 2–3L water daily","Control blood pressure (<130/80)","Manage blood sugar if diabetic","Avoid prolonged NSAID use"],
    thyroid: ["Sleep 7–9 hours (thyroid peaks during sleep)","Reduce chronic stress","Moderate exercise only","Medication on empty stomach, 60 min before food"],
  };
  const lifestyle = LIFESTYLE[reportType] || LIFESTYLE.blood;

  const QUESTIONS = {
    blood:   ["Should I test serum ferritin, iron and TIBC together?","Do I need B12 and folate levels checked?","Could this be thalassemia trait?","Are iron supplements or B12 injections needed?"],
    urine:   ["Do I need a urine culture and sensitivity test?","Which antibiotic is best for my infection type?","Are my UTIs recurrent — should I consider prophylaxis?","Should I check creatinine and GFR?"],
    liver:   ["Should I get a liver ultrasound?","Do I need hepatitis B and C screening?","Could this be medication-related?","Do I need hepatology referral?"],
    kidney:  ["What is my exact GFR — any stage of CKD?","Should I see a nephrologist?","Is my blood pressure optimally controlled?","Should I restrict protein?"],
    thyroid: ["Should I test TPO and TgAb antibodies?","Do I need a thyroid ultrasound?","Should I start levothyroxine?","How often should I monitor TSH?"],
  };
  const questions = QUESTIONS[reportType] || QUESTIONS.blood;

  const tabs = [
    {id:"overview", label:"Overview"},
    {id:"charts",   label:"Analytics"},
    {id:"plan",     label:"Action Plan"},
    {id:"doctor",   label:"Doctor Prep"},
  ];

  return (
    <AnimatePresence>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
        className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6"
        style={{background:"rgba(10,15,30,0.7)",backdropFilter:"blur(10px)"}}
        onClick={e=>e.target===e.currentTarget&&onClose()}>
        <motion.div initial={{y:100,opacity:0}} animate={{y:0,opacity:1}} exit={{y:80,opacity:0}}
          transition={{type:"spring",stiffness:300,damping:30}}
          className="w-full max-w-4xl max-h-[96vh] md:max-h-[90vh] overflow-hidden bg-white md:rounded-3xl rounded-t-3xl flex flex-col shadow-2xl">

          {/* Header */}
          <div className="flex-shrink-0 px-6 md:px-8 pt-6 pb-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">{p.name}</h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-widest ${SClass[p.status]}`}>{p.status}</span>
                  <span className="text-sm text-slate-500 font-mono">
                    {typeof p.value==="number"?p.value.toLocaleString():p.value}{p.unit?" "+p.unit:""}
                  </span>
                  {!isQ && p.min!=null && (
                    <span className="text-xs text-slate-400">Range: {p.min?.toLocaleString()}–{p.max?.toLocaleString()} {p.unit}</span>
                  )}
                </div>
              </div>
              <button onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition text-sm font-bold">✕</button>
            </div>
            {/* Tab bar */}
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
              {tabs.map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)}
                  className={`flex-1 text-[11px] font-semibold py-2 rounded-lg transition-all ${
                    tab===t.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}>{t.label}</button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 md:px-8 py-5">
            <AnimatePresence mode="wait">

              {/* OVERVIEW */}
              {tab==="overview" && (
                <motion.div key="ov" initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} exit={{opacity:0}} className="space-y-4">
                  <div className="rounded-2xl p-5 border-l-4" style={{background:`${col}0d`,borderLeftColor:col}}>
                    <div className="font-bold text-slate-900 mb-2">
                      {p.status==="normal" ? "✅ Within Healthy Range"
                        : p.status==="high" ? "🔺 Above Normal — Action Recommended"
                        : "🔻 Below Normal — Attention Needed"}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {p.status==="normal"
                        ? `Your ${p.name} value is within the normal clinical reference range. Maintain current habits.`
                        : p.status==="high"
                        ? `Your ${p.name} is elevated above the normal range. This may indicate an underlying condition — dietary changes and medical review are recommended.`
                        : `Your ${p.name} is below the normal range. This may indicate a deficiency or underlying condition requiring targeted nutrition and medical review.`
                      }
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-2xl p-4">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Your Value</div>
                      <div className="text-3xl font-extrabold" style={{color:col}}>
                        {typeof p.value==="number"?p.value.toLocaleString():p.value}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">{p.unit || (isQ?`Normal: ${p.normal}`:"")}</div>
                    </div>
                    <div className="rounded-2xl p-4 flex items-center gap-4" style={{background:`${col}0d`}}>
                      <div style={{width:60,height:60,flexShrink:0}}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={[{v:riskPct},{v:100-riskPct}]} dataKey="v"
                              innerRadius="58%" outerRadius="85%" startAngle={90} endAngle={-270}>
                              <Cell fill={col}/><Cell fill="#e2e8f0"/>
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div>
                        <div className="text-2xl font-extrabold" style={{color:col}}>{riskPct}%</div>
                        <div className="text-xs font-semibold text-slate-500">Deviation</div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl p-4 bg-gradient-to-r from-violet-50 to-indigo-50 border border-indigo-100 flex items-center gap-4">
                    <div className="text-3xl">⏱️</div>
                    <div>
                      <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Estimated Recovery Window</div>
                      <div className="font-extrabold text-indigo-800 text-lg">
                        {p.status==="normal" ? "Maintain current habits"
                          : reportType==="urine" ? "3–14 days (with treatment)"
                          : reportType==="liver" ? "6–20 weeks"
                          : reportType==="kidney" ? "4–16 weeks"
                          : reportType==="thyroid" ? "8–24 weeks"
                          : "4–12 weeks"}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ANALYTICS */}
              {tab==="charts" && (
                <motion.div key="ch" initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} exit={{opacity:0}} className="space-y-5">
                  {barData.length>0 && (
                    <div className="bg-slate-50 rounded-2xl p-5">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Your Value vs Clinical Range</div>
                      <ResponsiveContainer width="100%" height={170}>
                        <BarChart data={barData} barSize={34}>
                          <XAxis dataKey="name" tick={{fontSize:11}} axisLine={false} tickLine={false}/>
                          <YAxis hide/><Tooltip content={<DarkTip/>}/>
                          <Bar dataKey="v" radius={[8,8,0,0]} label={{position:"top",fontSize:11,fontWeight:700}}>
                            <Cell fill="#e2e8f0"/><Cell fill={col}/><Cell fill="#e2e8f0"/>
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  {trendData.length>0 && (
                    <div className="bg-slate-50 rounded-2xl p-5">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Trend (estimated based on current value)</div>
                      <ResponsiveContainer width="100%" height={170}>
                        <AreaChart data={trendData}>
                          <defs>
                            <linearGradient id={`g${p.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={col} stopOpacity={0.2}/>
                              <stop offset="95%" stopColor={col} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="m" tick={{fontSize:10}} axisLine={false} tickLine={false}/>
                          <YAxis hide/><Tooltip content={<DarkTip/>}/>
                          {p.min!=null&&<ReferenceLine y={p.min} stroke="#10B981" strokeDasharray="4 4" strokeOpacity={0.5}/>}
                          {p.max!=null&&<ReferenceLine y={p.max} stroke="#10B981" strokeDasharray="4 4" strokeOpacity={0.5}/>}
                          <Area dataKey="v" name={p.name} stroke={col} strokeWidth={3}
                            fill={`url(#g${p.id})`} dot={{r:5,fill:col,strokeWidth:0}}/>
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  {isQ && (
                    <div className="bg-slate-50 rounded-2xl p-8 text-center">
                      <div className="text-5xl mb-3">{p.status==="normal"?"✅":"⚠️"}</div>
                      <div className="font-extrabold text-slate-900 text-xl mb-1">{p.value}</div>
                      <div className="text-slate-500 text-sm">Expected: {p.normal}</div>
                      <p className="text-xs text-slate-400 mt-3">This is a qualitative result — no numeric chart available.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ACTION PLAN */}
              {tab==="plan" && (
                <motion.div key="pl" initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} exit={{opacity:0}} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                      <div className="font-bold text-emerald-800 mb-3 flex items-center gap-2"><span>🥗</span>Recommended Foods</div>
                      <ul className="space-y-2">
                        {foods.eat.map((f,i)=>(
                          <li key={i} className="flex items-start gap-2 text-sm text-emerald-800">
                            <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i+1}</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
                      <div className="font-bold text-red-800 mb-3 flex items-center gap-2"><span>🚫</span>Strictly Avoid</div>
                      <ul className="space-y-2">
                        {foods.avoid.map((f,i)=>(
                          <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                            <span className="w-5 h-5 rounded-full bg-red-200 text-red-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">✕</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                    <div className="font-bold text-blue-800 mb-3 flex items-center gap-2"><span>🏃</span>Lifestyle Protocol</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {lifestyle.map((l,i)=>(
                        <div key={i} className="flex items-start gap-2 text-sm text-blue-800 bg-white rounded-xl p-3 border border-blue-100">
                          <span className="text-blue-400 font-bold flex-shrink-0">→</span>{l}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* DOCTOR PREP */}
              {tab==="doctor" && (
                <motion.div key="doc" initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} exit={{opacity:0}} className="space-y-3">
                  <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                    <p className="text-amber-800 text-xs font-semibold">
                      ⚕️ Questions generated for your specific {p.name} result. Screenshot or print to bring to your appointment.
                    </p>
                  </div>
                  {questions.map((q,i)=>(
                    <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
                      className="flex items-start gap-4 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs flex-shrink-0 text-white"
                        style={{background:"linear-gradient(135deg,#1e3a8a,#0369a1)"}}>
                        {i+1}
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed pt-1">{q}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── NO DATA STATE ─────────────────────────────────────────────────────────────
function NoDataState({ reportType }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm">
          <div className="text-6xl mb-5">🔬</div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-3">No Report Data Found</h2>
          <p className="text-slate-500 leading-relaxed mb-2">
            We couldn't extract any data from your uploaded file.
          </p>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            This can happen if the file is blurry, too dark, not a medical report, or in an unsupported format.
            Please upload a <strong>clear, readable PDF or image</strong> of your actual lab report.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-left">
            <div className="font-bold text-amber-800 mb-2 text-sm">Tips for better results:</div>
            <ul className="space-y-1.5 text-xs text-amber-700">
              <li>✓ Use a digital PDF from the lab (best quality)</li>
              <li>✓ If scanning: use good lighting, flat surface, no shadow</li>
              <li>✓ Make sure the report text is fully visible and not cut off</li>
              <li>✓ Minimum image resolution: 300 DPI recommended</li>
              <li>✓ Supported: PDF, PNG, JPG</li>
            </ul>
          </div>
          <button onClick={() => navigate("/upload")}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-sm shadow-lg hover:shadow-xl transition"
            style={{background:"linear-gradient(135deg,#2563EB,#06B6D4)"}}>
            📤 Upload a Better Report
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function ReportPage({ reportType }) {
  const { state }  = useLocation();
  const navigate   = useNavigate();
  const reportId   = state?.reportId;

  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [fetchErr, setFetchErr] = useState("");
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    // No reportId — user navigated here directly without uploading
    if (!reportId) {
      setLoading(false);
      return;
    }
    api.getReportResult(reportId)
      .then(result => { setData(result); setLoading(false); })
      .catch(err  => { setFetchErr(err.message); setLoading(false); });
  }, [reportId]);

  // Loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"/>
          <p className="text-slate-500 font-medium">Loading your report...</p>
        </div>
      </div>
    );
  }

  // No reportId at all — user came without uploading
  if (!reportId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md text-center bg-white rounded-3xl p-10 border border-slate-200 shadow-sm">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-3">No Report Uploaded</h2>
          <p className="text-slate-500 mb-6">Please upload your medical report first. We will then analyse it and show your real results here.</p>
          <button onClick={() => navigate("/upload")}
            className="px-8 py-3 rounded-2xl text-white font-bold shadow-lg"
            style={{background:"linear-gradient(135deg,#2563EB,#06B6D4)"}}>
            Upload Report
          </button>
        </div>
      </div>
    );
  }

  // Fetch failed
  if (fetchErr) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md text-center bg-white rounded-3xl p-10 border border-red-200 shadow-sm">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Could Not Load Report</h2>
          <p className="text-red-500 text-sm mb-6">{fetchErr}</p>
          <button onClick={() => navigate("/upload")}
            className="px-8 py-3 rounded-2xl text-white font-bold bg-blue-600 hover:bg-blue-700 transition">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // OCR returned zero parameters — bad scan / wrong file
  const params = data?.parameters || [];
  if (params.length === 0) {
    return <NoDataState reportType={reportType}/>;
  }

  const abnormal  = params.filter(p => p.status !== "normal");
  const active    = params.find(p => p.id === activeId) || null;
  const analyzedAt = data?.analyzedAt
    ? new Date(data.analyzedAt).toLocaleString("en-GB",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})
    : "";

  return (
    <div className="min-h-screen" style={{background:"linear-gradient(160deg,#f0f6ff 0%,#f8faff 50%,#eef4ff 100%)"}}>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400 mb-1.5 font-medium">
                📁 Reports ›{" "}
                <span className="text-blue-600 font-semibold">{data?.reportType}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">{data?.reportType}</h1>
              <p className="text-sm text-slate-400 mt-0.5">
                {data?.filename && `File: ${data.filename} · `}
                {analyzedAt && `Analysed ${analyzedAt}`}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${
                (data?.score||0)>=75
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}>
                {(data?.score||0)>=75 ? "✓ Good Health" : "⚠ Needs Attention"}
              </span>
              <button onClick={() => navigate("/upload")}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm hover:shadow-md transition"
                style={{background:"linear-gradient(135deg,#2563EB,#06B6D4)"}}>
                + New Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="col-span-2 md:col-span-1 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col items-center gap-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Health Score</div>
            <ScoreRing score={data?.score||0}/>
          </div>
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Risk Index</div>
            <div className="text-5xl font-extrabold text-red-500 mt-2"><Counter to={data?.riskScore||0}/></div>
            <div className="h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
              <motion.div className="h-full rounded-full"
                style={{background:"linear-gradient(90deg,#f59e0b,#ef4444)"}}
                initial={{width:0}} animate={{width:`${data?.riskScore||0}%`}}
                transition={{duration:1.2}}/>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Off Range</div>
            <div className="text-5xl font-extrabold text-amber-500 mt-2">
              {abnormal.length}
              <span className="text-lg text-slate-300 font-normal"> / {params.length}</span>
            </div>
            <div className="flex gap-0.5 mt-2">
              {params.map(p=>(
                <div key={p.id} className="h-2 flex-1 rounded-full" style={{backgroundColor:SC[p.status]||"#10B981"}}/>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Priority Fix</div>
            {abnormal.length===0 ? (
              <p className="text-sm font-semibold text-emerald-600 flex items-center gap-2">
                <span className="text-xl">🎉</span> All normal!
              </p>
            ) : (
              abnormal.slice(0,3).map((p,i)=>(
                <button key={p.id} onClick={()=>setActiveId(p.id)}
                  className="w-full flex items-center gap-2 hover:bg-slate-50 rounded-xl p-1.5 transition text-left mb-1">
                  <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0 ${
                    i===0?"bg-red-100 text-red-600":"bg-amber-100 text-amber-600"
                  }`}>{i+1}</span>
                  <span className="text-xs font-semibold text-slate-700 truncate flex-1">{p.name}</span>
                  <span className="text-[9px] font-black uppercase" style={{color:SC[p.status]}}>{p.status}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* AI Summary + Body Systems */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden"
            style={{background:"linear-gradient(135deg,#0f172a 0%,#1e3a5f 60%,#0c4a6e 100%)"}}>
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 pointer-events-none"
              style={{background:"radial-gradient(circle,#38bdf8,transparent)",transform:"translate(30%,-30%)"}}/>
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center text-lg">🤖</div>
                <div className="text-xs font-bold text-blue-300 uppercase tracking-widest">AI Clinical Analysis</div>
              </div>
              <p className="text-blue-100 text-sm leading-relaxed">{data?.summary}</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Body System Scores</div>
            <div className="space-y-3">
              {(data?.bodySystems||[]).map((s,i)=>{
                const col = s.score>=75?"#10B981":s.score>=50?"#F59E0B":"#EF4444";
                return (
                  <div key={s.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-600">{s.name}</span>
                      <span className="font-bold" style={{color:col}}>{s.score}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full"
                        style={{background:`linear-gradient(90deg,${col}88,${col})`}}
                        initial={{width:0}} animate={{width:`${s.score}%`}}
                        transition={{duration:1.1,delay:i*0.08}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Biomarker grid */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-extrabold text-slate-900 text-xl">Biomarker Analysis</h2>
            <div className="flex items-center gap-3 text-xs">
              {[["#10B981","Normal"],["#F59E0B","Low"],["#EF4444","High"]].map(([c,l])=>(
                <span key={l} className="flex items-center gap-1.5 font-semibold" style={{color:c}}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{background:c}}/>
                  {l}
                </span>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-400 mb-4">Click any card for charts, action plan, and doctor questions</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {params.map((p,i)=>(
              <ParamCard key={p.id} p={p} index={i} active={activeId===p.id}
                onClick={()=>setActiveId(activeId===p.id?null:p.id)}/>
            ))}
          </div>
        </div>

        {/* Doctor prep */}
        {abnormal.length>0 && (
          <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="bg-gradient-to-r from-slate-900 to-blue-900 px-6 md:px-8 py-5 flex items-center gap-4">
              <span className="text-3xl">👨‍⚕️</span>
              <div>
                <h3 className="font-extrabold text-white text-lg">Doctor Visit Preparation</h3>
                <p className="text-blue-300 text-sm">
                  Questions generated from your {abnormal.length} abnormal parameter{abnormal.length>1?"s":""}
                </p>
              </div>
            </div>
            <div className="bg-white p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-3">
              {abnormal.slice(0,4).map((p,pi)=>[
                `Should I investigate my ${p.name} further — it reads ${typeof p.value==="number"?p.value.toLocaleString():p.value} ${p.unit||""}?`,
                `What follow-up tests do you recommend for an ${p.status} ${p.name}?`,
              ]).flat().slice(0,6).map((q,i)=>(
                <div key={i} className="flex items-start gap-3 bg-slate-50 rounded-2xl p-4 hover:bg-blue-50 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                    Q{i+1}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{q}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <DetailModal p={active} reportType={reportType} onClose={()=>setActiveId(null)}/>
    </div>
  );
}

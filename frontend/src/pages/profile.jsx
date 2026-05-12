import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

const BLOOD_GROUPS = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];
const GENDERS = ["Male","Female","Other","Prefer not to say"];

const ROUTE_MAP = {
  blood:   "/blood-report",
  urine:   "/urine-report",
  liver:   "/liver-report",
  kidney:  "/kidney-report",
  thyroid: "/thyroid-report",
};

const STATUS_COLOR = { normal:"bg-emerald-100 text-emerald-700", high:"bg-red-100 text-red-700", low:"bg-amber-100 text-amber-700" };
const TYPE_ICON = { blood:"🩸", urine:"🧪", liver:"🫀", kidney:"🩺", thyroid:"🧠" };

function Avatar({ name }) {
  const initials = name ? name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() : "?";
  return (
    <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white"
      style={{background:"linear-gradient(135deg,#2563EB,#06B6D4)",fontFamily:"Syne,sans-serif"}}>
      {initials}
    </div>
  );
}

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
      <div className="text-3xl">{icon}</div>
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</div>
        <div className="text-xl font-black text-slate-900" style={{fontFamily:"Syne,sans-serif"}}>{value}</div>
        {sub && <div className="text-xs text-slate-400">{sub}</div>}
      </div>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser]         = useState(null);
  const [history, setHistory]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [histLoading, setHistLoading] = useState(true);
  const [edit, setEdit]         = useState(false);
  const [form, setForm]         = useState({});
  const [saving, setSaving]     = useState(false);
  const [saveMsg, setSaveMsg]   = useState("");
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [tab, setTab]           = useState("overview");
  const [error, setError]       = useState("");

  // ── Load profile ──
  useEffect(() => {
    if (!localStorage.getItem("token")) { navigate("/auth"); return; }
    api.getProfile()
      .then(data => { setUser(data); setForm(data); setLoading(false); })
      .catch(() => { localStorage.removeItem("token"); navigate("/auth"); });
  }, [navigate]);

  // ── Load history ──
  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    api.getHistory()
      .then(data => { setHistory(data); setHistLoading(false); })
      .catch(() => setHistLoading(false));
  }, []);

  // ── Save profile ──
  const handleSave = async () => {
    setSaving(true); setError(""); setSaveMsg("");
    try {
      const updated = await api.updateProfile({
        name: form.name, phone: form.phone,
        age: form.age, address: form.address,
        blood: form.blood, gender: form.gender,
      });
      setUser(updated); setEdit(false);
      setSaveMsg("Profile updated successfully ✓");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (e) {
      setError(e.message || "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"/>
          <p className="text-slate-500 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const totalReports = history.length;
  const completedReports = history.filter(r => r.status === "completed").length;
  const avgScore = completedReports > 0
    ? Math.round(history.filter(r => r.score).reduce((a, r) => a + r.score, 0) / completedReports)
    : null;

  const joinDate = user?.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString("en-GB", {day:"numeric",month:"long",year:"numeric"})
    : "Unknown";

  const lastLogin = user?.lastLogin
    ? new Date(user.lastLogin).toLocaleString("en-GB", {day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})
    : "Just now";

  return (
    <div className="min-h-screen" style={{background:"linear-gradient(160deg,#f0f6ff 0%,#f8faff 50%,#eef4ff 100%)"}}>

      {/* ── HEADER ── */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900" style={{fontFamily:"Syne,sans-serif"}}>My Profile</h1>
            <p className="text-sm text-slate-400 mt-0.5">Member since {joinDate}</p>
          </div>
          <button onClick={() => setConfirmLogout(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 text-sm font-semibold hover:bg-red-100 transition-colors">
            ↩ Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-6">

        {/* ── PROFILE HERO ── */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <Avatar name={user?.name}/>
            <div className="flex-1">
              <h2 className="text-2xl font-black text-slate-900" style={{fontFamily:"Syne,sans-serif"}}>
                {user?.name || "—"}
              </h2>
              <p className="text-slate-500 text-sm mt-0.5">{user?.email}</p>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                {user?.blood && (
                  <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-200">
                    🩸 {user.blood}
                  </span>
                )}
                {user?.age && (
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-200">
                    🎂 {user.age} years
                  </span>
                )}
                {user?.gender && (
                  <span className="px-3 py-1 rounded-full bg-violet-50 text-violet-600 text-xs font-bold border border-violet-200">
                    {user.gender}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-2">Last login: {lastLogin}</p>
            </div>
            <div className="flex items-center gap-2">
              {!edit ? (
                <button onClick={() => { setEdit(true); setError(""); }}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm hover:shadow-md transition"
                  style={{background:"linear-gradient(135deg,#2563EB,#06B6D4)"}}>
                  ✏️ Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={handleSave} disabled={saving}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 transition">
                    {saving ? "Saving..." : "✓ Save"}
                  </button>
                  <button onClick={() => { setEdit(false); setForm(user); setError(""); }}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
          {saveMsg && <p className="mt-3 text-sm text-emerald-600 font-semibold">{saveMsg}</p>}
          {error && <p className="mt-3 text-sm text-red-600 font-semibold">{error}</p>}
        </div>

        {/* ── STATS ROW ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon="📋" label="Total Reports" value={totalReports} sub="all time"/>
          <StatCard icon="✅" label="Analyzed" value={completedReports} sub="completed"/>
          <StatCard icon="💯" label="Avg Score" value={avgScore !== null ? `${avgScore}` : "—"} sub="health score"/>
          <StatCard icon="📅" label="Member Since" value={joinDate.split(" ").slice(1).join(" ")} sub={joinDate.split(" ")[0]}/>
        </div>

        {/* ── TABS ── */}
        <div className="flex gap-1 bg-white border border-slate-100 rounded-2xl p-1.5 shadow-sm">
          {[["overview","👤 Details"],["history","📋 Reports"]].map(([id,label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                tab===id?"text-white shadow-sm":"text-slate-500 hover:text-slate-700"
              }`}
              style={tab===id?{background:"linear-gradient(135deg,#2563EB,#06B6D4)"}:{}}>
              {label}
            </button>
          ))}
        </div>

        {/* ── TAB: DETAILS ── */}
        {tab === "overview" && (
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-900 text-lg mb-5" style={{fontFamily:"Syne,sans-serif"}}>Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {key:"name",    label:"Full Name",    type:"text",   placeholder:"Enter your full name"},
                {key:"email",   label:"Email",         type:"email",  placeholder:"—", readonly:true},
                {key:"phone",   label:"Phone Number",  type:"tel",    placeholder:"e.g. +91 98765 43210"},
                {key:"age",     label:"Age",           type:"number", placeholder:"e.g. 28"},
                {key:"address", label:"Address",       type:"text",   placeholder:"City, State, Country"},
              ].map(({key,label,type,placeholder,readonly}) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>
                  {edit && !readonly ? (
                    <input type={type} value={form[key]||""} placeholder={placeholder}
                      onChange={e => setForm({...form,[key]:e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 text-sm font-medium transition-all bg-slate-50 focus:bg-white"/>
                  ) : (
                    <p className="text-slate-800 font-semibold px-4 py-3 bg-slate-50 rounded-xl text-sm">
                      {user[key] || <span className="text-slate-300 italic">Not set</span>}
                    </p>
                  )}
                </div>
              ))}

              {/* Blood Group */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Blood Group</label>
                {edit ? (
                  <select value={form.blood||""} onChange={e => setForm({...form,blood:e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 text-sm font-medium transition-all bg-slate-50 focus:bg-white">
                    <option value="">Select blood group</option>
                    {BLOOD_GROUPS.map(g => <option key={g}>{g}</option>)}
                  </select>
                ) : (
                  <p className="text-slate-800 font-semibold px-4 py-3 bg-slate-50 rounded-xl text-sm">
                    {user.blood || <span className="text-slate-300 italic">Not set</span>}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Gender</label>
                {edit ? (
                  <select value={form.gender||""} onChange={e => setForm({...form,gender:e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 text-sm font-medium transition-all bg-slate-50 focus:bg-white">
                    <option value="">Select gender</option>
                    {GENDERS.map(g => <option key={g}>{g}</option>)}
                  </select>
                ) : (
                  <p className="text-slate-800 font-semibold px-4 py-3 bg-slate-50 rounded-xl text-sm">
                    {user.gender || <span className="text-slate-300 italic">Not set</span>}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── TAB: REPORT HISTORY ── */}
        {tab === "history" && (
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-lg" style={{fontFamily:"Syne,sans-serif"}}>Report History</h3>
              <button onClick={() => navigate("/upload")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white shadow-sm"
                style={{background:"linear-gradient(135deg,#2563EB,#06B6D4)"}}>
                + New Report
              </button>
            </div>

            {histLoading ? (
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"/>
                <p className="text-slate-400 text-sm">Loading reports...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm text-center">
                <div className="text-5xl mb-4">📋</div>
                <h4 className="font-bold text-slate-700 text-lg mb-2">No Reports Yet</h4>
                <p className="text-slate-400 text-sm mb-5">Upload your first medical report to see your analysis history here.</p>
                <button onClick={() => navigate("/upload")}
                  className="px-6 py-3 rounded-xl text-sm font-bold text-white"
                  style={{background:"linear-gradient(135deg,#2563EB,#06B6D4)"}}>
                  Upload First Report
                </button>
              </div>
            ) : (
              history.map((r, i) => {
                const uploadDate = r.uploadedAt
                  ? new Date(r.uploadedAt).toLocaleString("en-GB", {day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})
                  : "—";
                const scoreColor = r.score >= 75 ? "text-emerald-600" : r.score >= 50 ? "text-amber-600" : "text-red-600";
                const isComplete = r.status === "completed";
                return (
                  <motion.div key={r.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}
                    className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">
                          {TYPE_ICON[r.type] || "📋"}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{r.filename || `${r.type} report`}</div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {r.type?.toUpperCase()} · Uploaded {uploadDate}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {r.score !== null && r.score !== undefined && (
                          <div className="text-center">
                            <div className={`text-xl font-black ${scoreColor}`} style={{fontFamily:"Syne,sans-serif"}}>{r.score}</div>
                            <div className="text-[9px] text-slate-400 uppercase tracking-wider">Score</div>
                          </div>
                        )}
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          r.status === "completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                          r.status === "failed"    ? "bg-red-50 text-red-700 border border-red-200" :
                          "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>{r.status}</span>
                        {isComplete && (
                          <button onClick={() => navigate(ROUTE_MAP[r.type]||"/", {state:{reportId:r.id}})}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-white"
                            style={{background:"linear-gradient(135deg,#2563EB,#06B6D4)"}}>
                            View →
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}

      </div>{/* end max-w */}

      {/* ── LOGOUT CONFIRM ── */}
      <AnimatePresence>
        {confirmLogout && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{background:"rgba(10,15,30,0.6)",backdropFilter:"blur(8px)"}}
            onClick={e => e.target===e.currentTarget && setConfirmLogout(false)}>
            <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.9,opacity:0}}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
              <div className="text-4xl mb-4">👋</div>
              <h3 className="text-xl font-black text-slate-900 mb-2" style={{fontFamily:"Syne,sans-serif"}}>Sign out?</h3>
              <p className="text-slate-500 text-sm mb-6">You will need to login again to access your reports and profile.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmLogout(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition text-sm">
                  Cancel
                </button>
                <button onClick={handleLogout}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition text-sm shadow-sm">
                  Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [edit, setEdit] = useState(false);
const navigate = useNavigate();
const [confirmLogout, setConfirmLogout] = useState(false);

const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);


  const reports = [
    { name: "Bloodwork", status: "Normal", color: "green" },
    { name: "Urine Analysis", status: "Attention", color: "yellow" },
    { name: "Liver Panel", status: "High", color: "red" },
  ];
useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/auth");
    return;
  }

  fetch("http://127.0.0.1:8000/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    })
    .then((data) => {
      setUser(data);
      setLoading(false);
    })
    .catch(() => {
      localStorage.removeItem("token");
      navigate("/auth");
    });
}, [navigate]);
if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Loading profile...
    </div>
  );
}

  return (
    <div className="relative min-h-screen text-white">

      {/* ===== FULL PAGE DNA BACKGROUND ===== */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/dna.jpg')" }}
      />
      <div className="fixed inset-0 -z-10 bg-black/70" />

      {/* ===== CONTENT ===== */}
      <div className="max-w-5xl mx-auto px-4 py-20">

        {/* PROFILE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[28px] p-8 bg-white/90 text-black backdrop-blur-2xl shadow-2xl"
        >
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-2xl font-semibold">Profile</h2>

            <button
  onClick={async () => {
  if (edit) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: user.name,
          phone: user.phone,
          age: user.age,
          address: user.address,
          blood: user.blood,
        }),
      });

      if (!res.ok) throw new Error("Update failed");
    } catch (err) {
      alert("Failed to update profile. Try again.");
      return;
    }
  }
  setEdit(!edit);
}}
  className="text-blue-600 font-medium"
>
  {edit ? "Update Profile" : "Edit Profile"}
</button>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* NAME */}
            <div>
              <p className="label">Full Name</p>
              {edit ? (
                <input
                  className="input"
                  value={user.name}
                  onChange={(e) =>
                    setUser({ ...user, name: e.target.value })
                  }
                />
              ) : (
                <p className="value">{user.name}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <p className="label">Email</p>
              <p className="value">{user.email}</p>
            </div>

            {/* PHONE */}
            <div>
              <p className="label">Phone</p>
              {edit ? (
                <input
                  className="input"
                  value={user.phone}
                  onChange={(e) =>
                    setUser({ ...user, phone: e.target.value })
                  }
                />
              ) : (
                <p className="value">{user.phone}</p>
              )}
            </div>

            {/* AGE */}
            <div>
              <p className="label">Age</p>
              {edit ? (
                <input
                  className="input"
                  value={user.age}
                  onChange={(e) =>
                    setUser({ ...user, age: e.target.value })
                  }
                />
              ) : (
                <p className="value">{user.age}</p>
              )}
            </div>

            {/* BLOOD */}
            <div>
              <p className="label">Blood Group</p>
              {edit ? (
                <input
                  className="input"
                  value={user.blood}
                  onChange={(e) =>
                    setUser({ ...user, blood: e.target.value })
                  }
                />
              ) : (
                <p className="value">{user.blood}</p>
              )}
            </div>

            {/* ADDRESS */}
            <div>
              <p className="label">Address</p>
              {edit ? (
                <input
                  className="input"
                  value={user.address}
                  onChange={(e) =>
                    setUser({ ...user, address: e.target.value })
                  }
                />
              ) : (
                <p className="value">{user.address}</p>
              )}
            </div>
          </div>

          <div className="mt-6 text-sm text-slate-500">
  Last Login: {user.lastLogin || "Just now"}
</div>

        </motion.div>
    {/* SIGN OUT BAR */}
<div className="mt-14">
  <button
    onClick={() => setConfirmLogout(true)}
    className="
      w-full py-3 rounded-xl
      bg-red-600 text-white
      font-medium
      hover:bg-red-500 transition
    "
  >
    Sign out
  </button>
</div>
        {/* REPORT HISTORY */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-4">
            Report Analysis History
          </h3>

          {reports.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="mb-3 flex items-center justify-between p-4 rounded-xl bg-white/90 text-black backdrop-blur shadow"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-3 h-3 rounded-full ${
                    r.color === "green"
                      ? "bg-green-500"
                      : r.color === "yellow"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                />
                <div>
                  <p className="font-medium">{r.name}</p>
                  <p className="text-sm text-slate-500">{r.status}</p>
                </div>
              </div>
              <p className="text-sm text-slate-400">Apr 2024</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* STYLES */}
      <style>{`
        .label {
          font-size: 0.75rem;
          color: #64748b;
          margin-bottom: 0.25rem;
        }
        .value {
          font-size: 1rem;
          font-weight: 500;
        }
        .input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.9rem;
          border: 1px solid #e2e8f0;
          outline: none;
        }
        .input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
        }
      `}</style>
      <AnimatePresence>
  {confirmLogout && (
    <motion.div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white text-black rounded-2xl p-6 max-w-sm w-full shadow-xl"
      >
        <h3 className="text-lg font-semibold mb-2">
          Sign out?
        </h3>

        <p className="text-sm text-slate-600 mb-6">
          Are you sure you want to sign out of your account?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setConfirmLogout(false)}
            className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/auth");
            }}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500"
          >
            OK
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </div>
  );
}

const BASE = "https://curetech-project.onrender.com";

function token() { return localStorage.getItem("token"); }

function authHeaders() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${token()}` };
}

async function handle(res) {
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/auth";
    throw new Error("Session expired");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || `Request failed (${res.status})`);
  return data;
}

export const api = {
  signup: (body) =>
    fetch(`${BASE}/auth/signup`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) }).then(handle),

  login: (body) =>
    fetch(`${BASE}/auth/login`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) }).then(handle),

  getProfile: () =>
    fetch(`${BASE}/auth/profile`, { headers: authHeaders() }).then(handle),

  updateProfile: (body) =>
    fetch(`${BASE}/auth/profile`, { method:"PUT", headers: authHeaders(), body: JSON.stringify(body) }).then(handle),

  uploadReport: (file, reportType) => {
    const fd = new FormData();
    fd.append("file", file);
    return fetch(`${BASE}/reports/upload?report_type=${reportType}`, {
      method:"POST", headers:{ Authorization:`Bearer ${token()}` }, body: fd
    }).then(handle);
  },

  analyzeReport: (reportId) =>
    fetch(`${BASE}/reports/analyze/${reportId}`, { method:"POST", headers: authHeaders() }).then(handle),

  getReportStatus: (reportId) =>
    fetch(`${BASE}/reports/status/${reportId}`, { headers: authHeaders() }).then(handle),

  getReportResult: (reportId) =>
    fetch(`${BASE}/reports/result/${reportId}`, { headers: authHeaders() }).then(handle),

  getHistory: () =>
    fetch(`${BASE}/reports/history`, { headers: authHeaders() }).then(handle),

  getOcrStatus: () =>
    fetch(`${BASE}/ocr-status`).then(handle),
};

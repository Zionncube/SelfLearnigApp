const CONFIG = window.APP_CONFIG || {};
let accessToken = "";
let rows = [];
const login = document.getElementById("login");
const dashboard = document.getElementById("dashboard");
const errorBox = document.getElementById("login-error");
const boardError = document.getElementById("board-error");

function api(path, options = {}) {
  return fetch(`${CONFIG.supabaseUrl}${path}`, { ...options, headers: { apikey: CONFIG.supabaseAnonKey, Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json", ...(options.headers || {}) } }).then(async response => {
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.msg || body.message || body.error_description || "The request could not be completed.");
    return body;
  });
}
function number(value) { return value === null || value === undefined ? "-" : Number(value).toFixed(2); }
function chart(label, before, after, maximum) { const beforeWidth = before == null ? 0 : before / maximum * 100; const afterWidth = after == null ? 0 : after / maximum * 100; return `<div class="chart-row"><strong>${label}</strong><div class="bars"><i style="width:${beforeWidth}%"></i><b style="width:${afterWidth}%"></b></div><small>${number(before)} -> ${number(after)} / ${maximum}</small></div>`; }
function renderBoard(summary) {
  document.getElementById("stats").innerHTML = `<div class="stat"><span>Participants</span><strong>${summary.participants || 0}</strong></div><div class="stat"><span>Average experiments</span><strong>${number(summary.average_experiments)}</strong></div><div class="stat"><span>Average reflections</span><strong>${number(summary.average_reflections)}</strong></div>`;
  document.getElementById("charts").innerHTML = chart("Understanding", summary.before_understanding, summary.after_understanding, 2) + chart("Self-observation", summary.before_self_observation, summary.after_self_observation, 2) + chart("Strategy experimentation", summary.before_strategy_experimentation, summary.after_strategy_experimentation, 2) + chart("Reflection", summary.before_reflection, summary.after_reflection, 2) + chart("Confidence", summary.before_confidence, summary.after_confidence, 5);
  document.getElementById("participants").innerHTML = rows.map(row => `<tr><td>${row.participant_code}</td><td>${number(row.before_total)}</td><td>${number(row.after_total)}</td><td>${number(row.before_checkin)}</td><td>${number(row.after_checkin)}</td><td>${row.experiments_count || 0}</td><td>${row.reflections_count || 0}</td></tr>`).join("");
}
async function loadBoard() {
  const summary = await api("/rest/v1/pilot_evidence_summary?select=*");
  rows = await api("/rest/v1/pilot_evidence?select=participant_code,before_checkin,after_checkin,experiments_count,reflections_count,learner_data&order=updated_at.desc");
  rows = rows.map(row => ({ ...row, before_total: row.learner_data?.evaluation?.pre?.total ?? null, after_total: row.learner_data?.evaluation?.post?.total ?? null }));
  renderBoard(summary[0] || {});
}
document.getElementById("login-form").onsubmit = async event => { event.preventDefault(); errorBox.textContent = ""; const form = Object.fromEntries(new FormData(event.currentTarget)); try { const response = await fetch(`${CONFIG.supabaseUrl}/auth/v1/token?grant_type=password`, { method: "POST", headers: { apikey: CONFIG.supabaseAnonKey, "Content-Type": "application/json" }, body: JSON.stringify({ email: form.email, password: form.password }) }); const body = await response.json(); if (!response.ok) throw new Error(body.error_description || body.msg || "Sign-in failed."); accessToken = body.access_token; await loadBoard(); login.classList.add("hidden"); dashboard.classList.remove("hidden"); document.getElementById("sign-out").classList.remove("hidden"); } catch (error) { errorBox.textContent = error.message; } };
document.getElementById("sign-out").onclick = () => { accessToken = ""; dashboard.classList.add("hidden"); login.classList.remove("hidden"); document.getElementById("sign-out").classList.add("hidden"); };
document.getElementById("download-csv").onclick = () => { const header = ["participant_code", "before_total", "after_total", "before_confidence", "after_confidence", "experiments", "reflections"]; const lines = [header, ...rows.map(row => [row.participant_code, row.before_total ?? "", row.after_total ?? "", row.before_checkin ?? "", row.after_checkin ?? "", row.experiments_count || 0, row.reflections_count || 0])].map(line => line.map(value => `"${String(value).replaceAll('"', '""')}"`).join(",")); const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv" })); link.download = "anonymous-learning-evidence.csv"; link.click(); URL.revokeObjectURL(link.href); };
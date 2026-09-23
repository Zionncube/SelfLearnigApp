const STORE = "selfLearningJourney";
const CLOUD = window.APP_CONFIG || {};
let data = JSON.parse(localStorage.getItem(STORE)) || { language: "en", profile: {}, observations: [], experiments: [], reflections: [], gratitude: [], context: {}, evaluation: {} };
if (!data.participantCode) data.participantCode = "P-" + (crypto.randomUUID ? crypto.randomUUID().slice(0, 8).toUpperCase() : Math.random().toString(36).slice(2, 10).toUpperCase());
let page = "home";

const words = {
  en: { home: "Home", brain: "Brain Lab", observe: "Observer", growth: "Journey", welcome: "Welcome", profile: "My Learning Map", context: "Context Map", experiment: "Try a Strategy", reflect: "Reflect & Learn", gratitude: "Gratitude", checkin: "Check-In", teacher: "Teacher Summary", save: "Save", back: "← Back", evidence: "My Evidence Journey" },
  zu: { home: "Ekhaya", brain: "Ilabhorethri Yobuchopho", observe: "Ukubuka", growth: "Uhambo", welcome: "Sawubona", profile: "Imephu Yami Yokufunda", context: "Imephu Yesimo", experiment: "Zama Isu", reflect: "Cabanga Futhi Ufunde", gratitude: "Ukubonga", checkin: "Ukuhlola", teacher: "Isifinyezo Sikathisha", save: "Londoloza", back: "← Emuva", evidence: "Uhambo Lwami Lobufakazi" }
};

const topics = [
  ["Your amazing brain", "Ubuchopho bakho obumangalisayo", "Your brain can change when you practise. This is neuroplasticity: repeated effort strengthens the brain pathways used for a skill.", "Ubuchopho bakho bungashintsha lapho uzijwayeza. Lokhu kubizwa nge-neuroplasticity: ukuzama ngokuphindaphindiwe kuqinisa izindlela zobuchopho ezisetshenziswa yikhono."],
  ["Mistakes are information", "Amaphutha ayimininingwane", "A mistake does not mean you cannot learn. It can show what needs practice or which strategy to change.", "Iphutha alisho ukuthi awukwazi ukufunda. Lingakhombisa okudinga ukuzijwayeza noma isu okumele liguqulwe."],
  ["Focus and attention", "Ukugxila nokunaka", "Attention is affected by your task, energy, feelings, and environment. Test supports such as a quiet place, a timer, or a short break.", "Ukugxila kuthintwa umsebenzi wakho, amandla, imizwa nesimo esikuzungezile. Hlola ukwesekwa njengendawo ethule, isibali-sikhathi noma ikhefu elifushane."],
  ["Stress and rest", "Ukucindezeleka nokuphumula", "When stress is high, thinking can feel harder. Rest, water, sleep, slow breathing, and asking for help can support learning.", "Uma ukucindezeleka kuphezulu, ukucabanga kungaba nzima. Ukuphumula, amanzi, ukulala, ukuphefumula kancane nokucela usizo kungasiza ukufunda."]
];

function t(key) { return words[data.language][key]; }
function save() { localStorage.setItem(STORE, JSON.stringify(data)); void syncEvidence(); }

async function syncEvidence() {
  if (!CLOUD.supabaseUrl || !CLOUD.supabaseAnonKey || !navigator.onLine) return;
  const payload = {
    participant_code: data.participantCode,
    language: data.language,
    observations_count: data.observations.length,
    experiments_count: data.experiments.length,
    reflections_count: data.reflections.length,
    gratitude_count: data.gratitude.length,
    before_checkin: data.evaluation.pre || null,
    after_checkin: data.evaluation.post || null,
    updated_at: new Date().toISOString()
  };
  try {
    await fetch(`${CLOUD.supabaseUrl}/rest/v1/pilot_evidence`, {
      method: "POST",
      headers: {
        "apikey": CLOUD.supabaseAnonKey,
        "Authorization": `Bearer ${CLOUD.supabaseAnonKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.warn("Evidence will remain saved on this device until a connection is available.");
  }
}
function esc(value = "") { return String(value).replace(/[&<>'"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" })[c]); }
function entry(text) { return `<div class="entry">${esc(text)}</div>`; }
function setPage(next) { page = next; render(); }

function render() {
  const content = document.getElementById("content");
  document.documentElement.lang = data.language === "zu" ? "zu" : "en";
  document.getElementById("language-toggle").textContent = data.language === "en" ? "isiZulu" : "English";
  document.getElementById("app-title").textContent = data.language === "en" ? "My Self-Learning Journey" : "Uhambo Lwami Lokuzifundela";
  document.getElementById("subtitle").textContent = data.language === "en" ? "Notice · Try · Reflect · Grow" : "Qaphela · Zama · Cabanga · Khula";
  document.querySelectorAll(".bottom-nav button").forEach(button => { button.textContent = t(button.dataset.page); button.classList.toggle("active", button.dataset.page === page); });
  const views = { home, brain, observe, context, experiment, reflect, gratitude, growth, profile, checkin, teacher };
  content.innerHTML = views[page]();
  bindForms();
}

function home() {
  const name = data.profile.name || (data.language === "en" ? "learner" : "mfundi");
  return `<section class="welcome"><h2>${t("welcome")}, ${esc(name)}!</h2><p>${data.language === "en" ? "Learn a brain principle, step back into Observer View, test a strategy, gather evidence, and choose your next step." : "Funda ngomqondo wobuchopho, zibuke ngokucophelela, zama isu, qoqa ubufakazi, bese ukhetha isinyathelo esilandelayo."}</p></section>
  <div class="grid">
    ${card("profile", "blue", t("profile"), "Know your strengths, needs, and goal.")}
    ${card("brain", "yellow", t("brain"), "Learn practical brain principles.")}
    ${card("observe", "pink", data.language === "en" ? "Observer View" : "Ukubuka Ngokucophelela", "Describe the scene with curiosity.")}
    ${card("context", "green", t("context"), "Map supports and distractions.")}
    ${card("experiment", "blue", t("experiment"), "Test one helpful idea.")}
    ${card("growth", "pink", t("evidence"), "Review patterns and insights.")}
  </div>`;
}
function card(target, color, title, description) { return `<button class="card ${color}" data-go="${target}" type="button">${esc(title)}<span>${esc(description)}</span></button>`; }
function back() { return `<button class="back" data-go="home" type="button">${t("back")}</button>`; }

function brain() { return `${back()}<section class="panel"><h2>${t("brain")}</h2><p>${data.language === "en" ? "Choose an idea. Then use Observer View or an experiment to test what it means in your own life." : "Khetha umbono. Bese usebenzisa Ukubuka Ngokucophelela noma ukuhlola isu ukuze ubone ukuthi kusho ukuthini kuwe."}</p>${topics.map((topic, i) => `<button class="topic-button" data-topic="${i}" type="button">${esc(topic[data.language === "en" ? 0 : 1])}</button>`).join("")}</section>`; }
function topicView(index) { const x = topics[index]; return `${back()}<section class="panel"><h2>${esc(x[data.language === "en" ? 0 : 1])}</h2><p>${esc(x[data.language === "en" ? 2 : 3])}</p><p class="notice">${data.language === "en" ? "Try this: notice one time this idea appears in your learning this week." : "Zama lokhu: qaphela isikhathi esisodwa lapho lo mbono uvela ekufundeni kwakho kuleli sonto."}</p></section>`; }

function observe() { return `${back()}<form id="observation-form" class="panel"><h2>${data.language === "en" ? "Observer View" : "Ukubuka Ngokucophelela"}</h2><p>${data.language === "en" ? "Be a kind scientist, not a judge. Describe what happened before deciding what it means." : "Yiba usosayensi onomusa, hhayi umahluleli. Chaza okwenzekile ngaphambi kokunquma ukuthi kusho ukuthini."}</p>${field("scene", data.language === "en" ? "What would a kind camera have seen you doing?" : "Ikhamera enomusa ibizokubona wenzani?")}${field("signals", data.language === "en" ? "What thoughts, feelings, or body signals did you notice?" : "Yimiphi imicabango, imizwa noma izimpawu zomzimba oziqaphelile?")}${field("context", data.language === "en" ? "What was happening around you?" : "Bekwenzekani eduze kwakho?")}${field("next", data.language === "en" ? "What might this learner need or try next?" : "Lo mfundi angadingani noma angazama ini ngokulandelayo?")}<button class="primary">${t("save")}</button></form>`; }
function context() { return `${back()}<form id="context-form" class="panel"><h2>${t("context")}</h2>${field("helpful", "What conditions help you learn or feel settled?", data.context.helpful)}${field("distractions", "What makes learning harder?", data.context.distractions)}${field("resources", "Which people, spaces, tools, or routines can support you?", data.context.resources)}${field("next", "Which support will you use or create next?", data.context.next)}<button class="primary">${t("save")}</button></form>`; }
function experiment() { return `${back()}<form id="experiment-form" class="panel"><h2>${t("experiment")}</h2>${field("challenge", "What would you like to make easier or improve?")}${select("strategy", "Choose one strategy to test", ["Work in a quieter space", "Use a 15-minute focus timer", "Take a short movement break", "Break the task into smaller steps", "Ask for help"])}${field("prediction", "What do you think might happen?")}${field("result", "What happened after you tried it?")}<button class="primary">${t("save")}</button></form>`; }
function reflect() { return `${back()}<form id="reflection-form" class="panel"><h2>${t("reflect")}</h2>${field("thoughts", "What were you thinking?")}${field("feelings", "What were you feeling?")}${field("lesson", "What did you learn about yourself or your strategy?")}<button class="primary">${t("save")}</button></form>`; }
function gratitude() { return `${back()}<form id="gratitude-form" class="panel"><h2>${t("gratitude")}</h2>${field("message", "What is one person, moment, skill, or thing you appreciate today?")}<button class="primary">${t("save")}</button></form>`; }
function profile() { return `${back()}<form id="profile-form" class="panel"><h2>${t("profile")}</h2>${input("name", "Name", data.profile.name)}${input("age", "Age (10–15)", data.profile.age, "number")}${field("strengths", "What are your learning strengths?", data.profile.strengths)}${field("challenges", "What can feel difficult when you are learning?", data.profile.challenges)}${field("goal", "What is one small learning goal?", data.profile.goal)}<button class="primary">${t("save")}</button></form>`; }
function growth() { const latest = [...data.observations, ...data.experiments, ...data.reflections].slice(-5).reverse(); return `${back()}<section class="panel"><h2>${t("evidence")}</h2><p class="notice">${data.language === "en" ? "This is not a score. It is your record of patterns, strategies, and insights." : "Lokhu akusona isikolo. Kungumlando wamaphethini, amasu nemibono yakho."}</p>${stat("Observations", data.observations.length)}${stat("Strategies tested", data.experiments.length)}${stat("Reflections", data.reflections.length)}${stat("Gratitude entries", data.gratitude.length)}<h3>Recent evidence</h3>${latest.length ? latest.map(x => entry(x.summary)).join("") : "<p>No entries yet.</p>"}<button class="secondary" data-go="checkin">${t("checkin")}</button><button class="secondary" data-go="teacher">${t("teacher")}</button></section>`; }
function checkin() { return `${back()}<form id="checkin-form" class="panel"><h2>${t("checkin")}</h2><p>Rate each statement from 1 (strongly disagree) to 5 (strongly agree).</p>${["I know what helps me concentrate.", "When I get stuck, I can think of a strategy.", "I reflect on what worked after learning.", "I understand that practice can strengthen learning."].map((q,i) => select("q"+i, q, [1,2,3,4,5])).join("")}<button class="primary">Save check-in</button></form>`; }
function teacher() { return `${back()}<section class="panel"><h2>${t("teacher")}</h2><p class="notice">Anonymous participant code: <strong>${esc(data.participantCode)}</strong></p>${stat("Observations", data.observations.length)}${stat("Experiments", data.experiments.length)}${stat("Reflections", data.reflections.length)}${stat("Check-ins", (data.evaluation.pre ? 1 : 0) + (data.evaluation.post ? 1 : 0))}<p class="notice">Use this summary to support the learner, not judge them.</p><button class="primary" id="download-report">Download evidence report</button></section>`; }
function input(name, label, value="", type="text") { return `<label>${esc(label)}<input name="${name}" type="${type}" value="${esc(value)}" required></label>`; }
function field(name, label, value="") { return `<label>${esc(label)}<textarea name="${name}" required>${esc(value)}</textarea></label>`; }
function select(name, label, values) { return `<label>${esc(label)}<select name="${name}">${values.map(v => `<option value="${esc(v)}">${esc(v)}</option>`).join("")}</select></label>`; }
function stat(label, value) { return `<div class="stat"><span>${esc(label)}</span><strong>${value}</strong></div>`; }

function bindForms() {
  document.querySelectorAll("[data-go]").forEach(x => x.onclick = () => setPage(x.dataset.go));
  document.querySelectorAll("[data-topic]").forEach(x => x.onclick = () => { document.getElementById("content").innerHTML = topicView(Number(x.dataset.topic)); bindForms(); });
  const form = document.querySelector("form"); if (!form) { const download = document.getElementById("download-report"); if (download) download.onclick = downloadReport; return; }
  form.onsubmit = event => { event.preventDefault(); const f = Object.fromEntries(new FormData(form)); const now = new Date().toLocaleDateString();
    if (form.id === "profile-form") data.profile = f;
    if (form.id === "context-form") data.context = f;
    if (form.id === "observation-form") data.observations.push({ ...f, summary: `${now}: Scene — ${f.scene}\nSignals — ${f.signals}\nContext — ${f.context}\nNext — ${f.next}` });
    if (form.id === "experiment-form") data.experiments.push({ ...f, summary: `${now}: Strategy — ${f.strategy}\nResult — ${f.result}` });
    if (form.id === "reflection-form") data.reflections.push({ ...f, summary: `${now}: Insight — ${f.lesson}` });
    if (form.id === "gratitude-form") data.gratitude.push({ ...f, summary: `${now}: ${f.message}` });
    if (form.id === "checkin-form") { const score = Object.values(f).reduce((a,b) => a + Number(b), 0) / 4; if (!data.evaluation.pre) data.evaluation.pre = score; else data.evaluation.post = score; }
    save(); setPage(form.id === "profile-form" ? "home" : "growth");
  };
}
function downloadReport() { const text = `SELF-LEARNING APP EVIDENCE REPORT\n\nLearner: ${data.profile.name || "Anonymous"}\nObservations: ${data.observations.length}\nExperiments: ${data.experiments.length}\nReflections: ${data.reflections.length}\nCheck-in before: ${data.evaluation.pre || "Not completed"}\nCheck-in after: ${data.evaluation.post || "Not completed"}\n`; const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([text], { type: "text/plain" })); link.download = "learning-evidence-report.txt"; link.click(); URL.revokeObjectURL(link.href); }
document.getElementById("language-toggle").onclick = () => { data.language = data.language === "en" ? "zu" : "en"; save(); render(); };
document.querySelectorAll(".bottom-nav button").forEach(x => x.onclick = () => setPage(x.dataset.page));
render();

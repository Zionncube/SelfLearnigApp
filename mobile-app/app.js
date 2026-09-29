const STORE = "selfLearningJourney";
const CLOUD = window.APP_CONFIG || {};
let data = JSON.parse(localStorage.getItem(STORE)) || { language: "en", profile: {}, selfUnderstanding: {}, observations: [], experiments: [], reflections: [], gratitude: [], context: {}, evaluation: {}, selectedPrinciple: null };
data.selfUnderstanding = data.selfUnderstanding || {};
data.selectedPrinciple = data.selectedPrinciple || null;
if (!data.participantCode) data.participantCode = "P-" + (crypto.randomUUID ? crypto.randomUUID().slice(0, 8).toUpperCase() : Math.random().toString(36).slice(2, 10).toUpperCase());
if (typeof data.evaluation.pre === "number") data.evaluation.pre = { confidence: data.evaluation.pre, total: null, understanding: null, selfObservation: null, strategyExperimentation: null, reflection: null };
if (typeof data.evaluation.post === "number") data.evaluation.post = { confidence: data.evaluation.post, total: null, understanding: null, selfObservation: null, strategyExperimentation: null, reflection: null };
let page = "home";
let activeLessonSpeechText = "";

const words = {
  en: { home: "Home", brain: "Brain Lab", observe: "Observer", growth: "Journey", welcome: "Welcome", experiment: "Try a Strategy", reflect: "Reflect & Learn", gratitude: "Gratitude", checkin: "Self Check-In", save: "Save", back: "← Back", evidence: "My Evidence Journey" },
  zu: { home: "Ekhaya", brain: "Ilabhorethri Yobuchopho", observe: "Ukubuka", growth: "Uhambo", welcome: "Sawubona", experiment: "Zama Isu", reflect: "Cabanga Futhi Ufunde", gratitude: "Ukubonga", checkin: "Ukuzihlola", save: "Londoloza", back: "← Emuva", evidence: "Uhambo Lwami Lobufakazi" }
};

const topics = [
  ["Your amazing brain", "Ubuchopho bakho obumangalisayo", "Your brain can change when you practise. This is neuroplasticity: repeated effort strengthens the brain pathways used for a skill.", "Ubuchopho bakho bungashintsha lapho uzijwayeza. Lokhu kubizwa nge-neuroplasticity: ukuzama ngokuphindaphindiwe kuqinisa izindlela zobuchopho ezisetshenziswa yikhono."],
  ["Mistakes are information", "Amaphutha ayimininingwane", "A mistake does not mean you cannot learn. It can show what needs practice or which strategy to change.", "Iphutha alisho ukuthi awukwazi ukufunda. Lingakhombisa okudinga ukuzijwayeza noma isu okumele liguqulwe."],
  ["Focus and attention", "Ukugxila nokunaka", "Attention is affected by your task, energy, feelings, and environment. Test supports such as a quiet place, a timer, or a short break.", "Ukugxila kuthintwa umsebenzi wakho, amandla, imizwa nesimo esikuzungezile. Hlola ukwesekwa njengendawo ethule, isibali-sikhathi noma ikhefu elifushane."],
  ["Stress and rest", "Ukucindezeleka nokuphumula", "When stress is high, thinking can feel harder. Rest, water, sleep, slow breathing, and asking for help can support learning.", "Uma ukucindezeleka kuphezulu, ukucabanga kungaba nzima. Ukuphumula, amanzi, ukulala, ukuphefumula kancane nokucela usizo kungasiza ukufunda."]
];

function t(key) { return tr(words[data.language]?.[key] || words.en[key] || key); }
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
    before_checkin: data.evaluation.pre ? data.evaluation.pre.confidence : null,
    after_checkin: data.evaluation.post ? data.evaluation.post.confidence : null,
    before_understanding: data.evaluation.pre ? data.evaluation.pre.understanding : null,
    after_understanding: data.evaluation.post ? data.evaluation.post.understanding : null,
    before_self_observation: data.evaluation.pre ? data.evaluation.pre.selfObservation : null,
    after_self_observation: data.evaluation.post ? data.evaluation.post.selfObservation : null,
    before_strategy_experimentation: data.evaluation.pre ? data.evaluation.pre.strategyExperimentation : null,
    after_strategy_experimentation: data.evaluation.post ? data.evaluation.post.strategyExperimentation : null,
    before_reflection: data.evaluation.pre ? data.evaluation.pre.reflection : null,
    after_reflection: data.evaluation.post ? data.evaluation.post.reflection : null,
    learner_data: {
      age: data.profile.age || null,
      self_understanding: data.selfUnderstanding,
      observations: data.observations,
      experiments: data.experiments,
      reflections: data.reflections,
      gratitude: data.gratitude,
      context: data.context,
      evaluation: data.evaluation
    },
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
function entry(text) { let displayText = text; if (data.language === "zu") { displayText = displayText.replace(/^(\d{1,2}\/\d{1,2}\/\d{4}: )?(Scene|Signals|Context|Next|Usual|Different strategy|Helped more|Insight|Result|Challenge|Strategy|Reflection) —/gm, (match, date, label) => `${date || ""}${tr(label)} —`); } return `<div class="entry">${esc(displayText)}</div>`; }
function setPage(next) { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); page = next; render(); }

function render() {
  const content = document.getElementById("content");
  document.documentElement.lang = data.language === "zu" ? "zu" : "en";
  document.getElementById("language-toggle").textContent = tr(data.language === "en" ? "Switch to isiZulu" : "Switch to English");
  document.getElementById("app-title").textContent = tr("My Self-Learning Journey");
  document.getElementById("subtitle").textContent = tr("Notice · Try · Reflect · Grow");
  document.title = tr("My Self-Learning Journey");
  document.querySelector(".bottom-nav").setAttribute("aria-label", tr("Main navigation"));
  document.querySelectorAll(".bottom-nav button").forEach(button => { button.textContent = t(button.dataset.page); button.classList.toggle("active", button.dataset.page === page); });
  const views = { home, brain, observe, experiment, reflect, gratitude, growth, register, knowmyself, checkin };
  content.innerHTML = views[page]();
  localizeVisibleText(content);
  bindForms();
}

function localizeVisibleText(root) {
  if (data.language !== "zu") return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const translations = Object.entries(ZU_TEXT).sort((a, b) => b[0].length - a[0].length);
  let node;
  while ((node = walker.nextNode())) {
    if (node.parentElement.closest("textarea, input, option, .entry")) continue;
    let localized = node.nodeValue;
    for (const [english, zulu] of translations) localized = localized.replaceAll(english, zulu);
    node.nodeValue = localized;
  }
}

function principleDisplayTitle(title) {
  for (let categoryIndex = 0; categoryIndex < PRINCIPLE_CATEGORIES.length; categoryIndex++) {
    const principleIndex = PRINCIPLE_CATEGORIES[categoryIndex].principles.indexOf(title);
    if (principleIndex >= 0) return localizedCategory(categoryIndex).principles[principleIndex];
  }
  return title;
}

function home() {
  const name = data.profile.name || (data.language === "en" ? "learner" : "mfundi");
  const nextPage = !data.profile.registered ? "register" : !data.selfUnderstanding.completed ? "knowmyself" : !data.evaluation.pre ? "checkin" : !data.experiments.length ? "experiment" : !data.reflections.length ? "reflect" : !data.evaluation.post ? "checkin" : "growth";
  const nextLabel = tr(!data.profile.registered ? "Create my learner profile" : !data.selfUnderstanding.completed ? "Understand myself" : !data.evaluation.pre ? "Begin my self-check" : !data.experiments.length ? "Complete my learning experiment" : !data.reflections.length ? "Complete my reflection" : !data.evaluation.post ? "Complete my after self-check" : "Review my evidence");
  return `<section class="welcome"><h2>${t("welcome")}, ${esc(name)}!</h2><p>${tr("Learn a brain principle, step back into Observer View, test a strategy, gather evidence, and choose your next step.")}</p></section>
  <button class="primary" data-go="${nextPage}" type="button">${nextLabel}</button>
  <div class="grid">
    ${card("knowmyself", "yellow", tr("Understand Myself"), tr("Explore how your interests, attention, feelings, and environment affect learning."))}
    ${card("brain", "yellow", t("brain"), tr("Learn practical brain principles."))}
    ${card("observe", "pink", tr("Observer View"), tr("Describe the scene with curiosity."))}
    ${card("experiment", "blue", t("experiment"), tr("Test one helpful idea."))}
    ${card("reflect", "green", tr("Reflect on My Learning"), tr("Look back at what you noticed, what helped, and what you will try next."))}
    ${card("gratitude", "yellow", t("gratitude"), tr("Notice something good without ignoring what is difficult."))}
    ${card("growth", "pink", t("evidence"), tr("Review patterns and insights."))}
  </div>`;
}
function card(target, color, title, description) { return `<button class="card ${color}" data-go="${target}" type="button">${esc(title)}<span>${esc(description)}</span></button>`; }
function back() { return `<button class="back" data-go="home" type="button">${t("back")}</button>`; }

function brain() { return `${back()}<section class="panel"><h2>${t("brain")}</h2><p>${tr("Reliable information gives you possibilities, not labels. Choose a category, learn one idea in simple words, then observe yourself and try it.")}</p>${PRINCIPLE_CATEGORIES.map((_, i) => { const category = localizedCategory(i); return `<button class="topic-button" data-category="${i}" type="button"><strong>${esc(category.name)}</strong><br><small>${esc(category.description)}</small></button>`; }).join("")}</section>`; }
function categoryView(index) { const category = localizedCategory(index); return `${back()}<section class="panel"><h2>${esc(category.name)}</h2><p>${esc(category.description)}</p>${category.principles.map((title, i) => `<button class="topic-button" data-principle="${i}" data-category="${index}" type="button">${esc(title)}</button>`).join("")}</section>`; }
function principleExample(category, title) { const lower = title.toLowerCase(); if (lower.includes("facts") || lower.includes("assumption") || lower.includes("observation") || lower.includes("interpretation")) return "Example: A task feels difficult. The small observation is 'I stopped after a few minutes'; the conclusion 'I cannot do it' is still only a possibility."; if (category.name === "Know yourself first") return "Example: You notice that drawing a quick picture helps you remember one idea, while talking helps you remember another."; if (category.name === "Brain and neuroplasticity") return "Example: After practising a new word, dance move, game rule, or maths step several times, you notice what you can remember later."; if (category.name === "Observation and scientific thinking") return "Example: You predict that a short break may help, try it once, and record what happens next."; if (category.name === "Understanding learning differences") return "Example: One learner prefers a quiet room, while another understands better while moving or talking. The difference is worth noticing, not judging."; if (category.name === "Mindfulness") return "Example: You notice your attention has wandered during reading, drawing, sport, or a conversation."; if (category.name === "Emotional awareness") return "Example: A difficult task brings frustration, and you notice whether a pause, encouragement, or help changes the next attempt."; if (category.name === "Gratitude") return "Example: You notice a helpful person, a safe place, a skill, or a small good moment while still remembering that some things are difficult."; if (category.name === "Experimentation and growth") return "Example: You compare doing a task all at once with doing it in two smaller parts."; if (category.name === "Growth mindset") return "Example: A skill is difficult today, and a later attempt gives you one small improvement or a new clue."; if (category.name === "Environment and circumstances") return "Example: The same task feels different at home, in class, in noise, in quiet, when rested, or when tired."; return `Example: During a learning task, you notice one small moment connected with '${lower}'.`; }
function principleLesson(category, title) { if (data.language === "zu") { const categoryIndex = PRINCIPLE_CATEGORIES.indexOf(category); const translated = localizedCategory(categoryIndex); const localTitle = translated.principles[category.principles.indexOf(title)]; const general = `Lo mqondo uthi: “${localTitle}”. Ulwazi luyindlela yokucabanga, hhayi ilebula elichaza ukuthi ungubani. Abantu ababili bangaba namava ahlukene, ngakho qaphela awakho futhi uziqoqele ubufakazi.`; let explanation = title.endsWith("?") ? `Lo ngumbuzo ongawuphenya ngawe. Akunampendulo eyodwa esebenza kubo bonke abantu. Amava akho angakunika izinkomba.` : general; let example = "Isibonelo: Qaphela umzuzu owodwa wokufunda, ubhale okwenzekile, bese ubheka ukuthi yiziphi izincazelo ezingaba khona."; let evidence = "Yini oyiqaphele ngempela? Yini osayiqagelayo? Yibuphi obunye ubufakazi ongabufuna?"; let strategy = "Shintsha into eyodwa encane emsebenzini, bese uqhathanisa okwenzekayo."; if (title === "Separate facts from assumptions") { explanation = "Iqiniso yinto oyiqaphele noma engaqinisekiswa. Ukuqagela yincazelo oyinikeza into ungakabi nobufakazi obanele. Gcina okwenzekile kuhlukile kulokho ocabanga ukuthi kusho kona."; example = "Isibonelo: Umsebenzi uzwakala unzima. Iqiniso: ‘Ngiyekile ngemva kwemizuzu embalwa.’ Ukuqagela: ‘Angikwazi’ noma ‘Ngiyisehluleki.’ Kungenzeka futhi ukuthi imiyalelo ibingacacile, indawo ibinomsindo, ubukhathele noma ulambile, izinto zokufunda bezingekho, noma ubudinga ukwesekwa."; evidence = "Bhala okwenzekile kuqala, bese ubhala incazelo oyicabangile. Funa olunye ulwazi ngaphambi kokuthatha leyo ncazelo njengeqiniso."; strategy = "Zama ukushintsha ukwesekwa okukodwa, njengokucela imiyalelo ecacile, ukuthola indawo ehlukile noma ukusebenzisa ezinye izinto zokufunda. Bese ubhala ukuthi kushintshe ini."; } if (category.name === "Brain and neuroplasticity") { explanation = `Uma uzijwayeza, ukhumbula, ufunda, udweba, uchaza noma uphinda into, ubuchopho bungaqinisa izindlela ezisetshenziswa kulelo khono. Lokhu kungasiza kamuva, kodwa ukuzama kanye akufakazeli ukuthi isu lisebenzela wonke umuntu.`; example = "Isibonelo: Zama ukukhumbula igama elisha, umnyakazo womdanso, umthetho womdlalo noma isinyathelo sezibalo ngemva kokuzijwayeza. Qaphela ukuthi ukhumbule ini."; evidence = "Bhala lokho okuzamile, lokho okwazile ukukwenza noma ukukhumbula, nezimo ebezikhona."; strategy = "Zijwayeze ikhono elincane ngezindlela ezimbili ezahlukene bese uqhathanisa okwenzekile."; } if (category.name === "Environment and circumstances") { explanation = "Ukufunda kuthintwa yizimo ezikuzungezile, hhayi okungaphakathi kuwe kuphela. Umsindo, ukukhanya, ukuphepha, ukudla, ukulala, ulimi, izinsiza, imisebenzi nabantu kungashintsha indlela ukufunda okuzwakala ngayo. Abantu bavela ezimweni nasezizindeni ezingafani."; example = "Isibonelo: Umsebenzi ofanayo ungazwakala uhlukile endaweni ethule, enomsindo, ekhaya noma esikoleni. Izimo nezinsiza azifani kubo bonke abantu."; evidence = "Bhala okwakwenzeka endaweni yakho nokuthi yikuphi ukwesekwa noma isithiyo esasikhona."; strategy = "Khetha ukwesekwa okukodwa okutholakalayo, njengendawo ethule, ikhefu, usizo noma umsebenzi omncane, bese ubhala ukuthi kukusize kanjani."; } if (category.name === "Understanding learning differences") { explanation = "Abantu bangahluka endleleni abanaka, abezwa ngayo ngezinzwa, abaxhumana ngayo, abanyakaza ngayo, abazizwa ngayo nabafunda ngayo. Ukuqaphela into oyizwayo akusho ukuthi unesimo esithile. Ukuxilonga kwenziwa ochwepheshe abafanele; lolu hlelo lukusiza uqaphele amava futhi uthole amasu okweseka ukufunda."; evidence = "Qaphela ukuthi lokhu kwenzeka nini, nini kungaveli, nokuthi yikuphi ukwesekwa okukhona."; } return { explanation, example, evidence, strategy }; } const question = title.endsWith("?"); let explanation = question ? `This is a question you can investigate about yourself. No two people have exactly the same experience, so do not copy someone else's answer. Your own observations can give you clues.` : `${title} This is information to help you think, not a label telling you who you are. ${category.description}`; let example = principleExample(category, title); let evidence = "Notice one small moment connected to this idea and record what happened."; let strategy = "Change one small part of a learning task, then compare what happens."; if (title === "Separate facts from assumptions") { explanation = "A fact is something you noticed or could check. An assumption is a quick meaning your mind adds. The meaning may be right or wrong, so keep it separate from the observation."; example = "Example: A task feels difficult. Fact: 'I stopped after a few minutes.' Assumption: 'I cannot do it' or 'I am a failure.' Other possibilities could include the instructions, the environment, tiredness, hunger, the materials, or needing support."; evidence = "Record the small event first, then record the meaning you gave it. Look for more information before treating the meaning as fact."; strategy = "Change one support, such as the instructions, seat, lighting, materials, or amount of time, and record whether the experience changes."; } if (title === "Observation before judgment" || title === "Know the difference between observation and interpretation.") { explanation = "An observation describes what happened. An interpretation is the meaning someone gives it. Keeping them separate leaves room for more than one explanation."; evidence = "Write one sentence about what happened and one sentence about what it might mean."; } if (category.name === "Brain and neuroplasticity") { explanation = `${title} When you practise, remember, read, draw, explain, or repeat something, the brain can strengthen the pathways used for that skill. That can make the skill easier to find later, but one attempt is not proof and learning is different for each person.`; evidence = "Record what you tried, what you remembered or could do, and what conditions or strategy were present."; strategy = "Practise the same small skill in two different ways and compare your results."; } if (category.name === "Environment and circumstances") { explanation = `${title} Learning is affected by conditions around you, not only by what is inside you. Noise, light, safety, food, sleep, language, resources, responsibilities, and the people around you can change how learning feels. Different backgrounds create different learning conditions.`; evidence = "Record what was happening around you and what support or barrier was present."; strategy = "Choose one environmental support, such as a quieter place, a break, water, help, or a smaller task, and record whether it changes the experience."; } if (category.name === "Understanding learning differences") { explanation = `${title} People can have different ways of paying attention, sensing, communicating, moving, feeling, and learning. Recognizing an experience does not mean you have a condition. Only qualified professionals diagnose conditions; this app helps you notice experiences and find supportive strategies.`; evidence = "Record when the experience happens, when it does not happen, and what support is present."; } return { explanation, example, evidence, strategy }; }
function principleView(categoryIndex, principleIndex) { const category = PRINCIPLE_CATEGORIES[categoryIndex]; const title = category.principles[principleIndex]; const lesson = principleLesson(category, title); const localTitle = localizedCategory(categoryIndex).principles[principleIndex]; const example = lesson.example.replace(/^(Example: |Isibonelo: )/, ""); data.selectedPrinciple = title; activeLessonSpeechText = [localTitle, tr("What this means"), lesson.explanation, tr("Example"), example, tr("Find your evidence"), lesson.evidence, tr("Try it out"), lesson.strategy].join(". "); return `${back()}<section class="panel"><h2>${esc(localTitle)}</h2><div class="speech-controls" role="group" aria-label="${tr("Lesson audio controls")}"><button class="secondary" type="button" data-speech="play">${tr("Listen")}</button><button class="secondary" type="button" data-speech="pause">${tr("Pause")}</button><button class="secondary" type="button" data-speech="resume">${tr("Resume")}</button><button class="secondary" type="button" data-speech="stop">${tr("Stop")}</button></div><p id="speech-status" class="speech-status" role="status" aria-live="polite"></p><h3>${tr("What this means")}</h3><p>${esc(lesson.explanation)}</p><p class="notice"><strong>${tr("Example:")}</strong> ${esc(example)}</p><h3>${tr("Find your evidence")}</h3><p>${esc(lesson.evidence)}</p><h3>${tr("Try it out")}</h3><p>${esc(lesson.strategy)}</p><button class="primary" data-go="experiment" type="button">${tr("Try this in an experiment")}</button></section>`; }

function handleLessonSpeech(action) {
  const status = document.getElementById("speech-status");
  if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
    status.textContent = tr("Audio reading is not supported in this browser.");
    return;
  }
  const speech = window.speechSynthesis;
  if (action === "pause") {
    if (speech.speaking && !speech.paused) speech.pause();
    status.textContent = tr("Audio paused.");
    return;
  }
  if (action === "resume") {
    if (speech.paused) speech.resume();
    status.textContent = tr("Audio resumed.");
    return;
  }
  if (action === "stop") {
    speech.cancel();
    status.textContent = tr("Audio stopped.");
    return;
  }
  speech.cancel();
  const language = data.language === "zu" ? "zu-ZA" : "en-ZA";
  const voices = speech.getVoices();
  const preferredVoice = voices.find(voice => voice.lang.toLowerCase() === language.toLowerCase()) || voices.find(voice => voice.lang.toLowerCase().startsWith(language.slice(0, 2).toLowerCase()));
  if (data.language === "zu" && voices.length && !preferredVoice) {
    status.textContent = tr("No isiZulu voice is available on this device. Add an isiZulu speech voice in device settings.");
    return;
  }
  const utterance = new SpeechSynthesisUtterance(activeLessonSpeechText);
  utterance.lang = language;
  if (preferredVoice) utterance.voice = preferredVoice;
  utterance.onstart = () => { status.textContent = tr("Reading lesson aloud."); };
  utterance.onend = () => { status.textContent = tr("Lesson audio finished."); };
  utterance.onerror = () => { status.textContent = tr("Audio could not be played. Check the speech voices available on this device."); };
  speech.speak(utterance);
}

function register() { return `${back()}<form id="register-form" class="panel"><h2>${tr("Create My Learner Profile")}</h2><p class="notice">${tr("Use a name you are comfortable using in this app. Your name stays on this device and is not sent to the shared evidence database.")}</p>${input("name", "What should we call you?")}${input("age", "How old are you? (10-15)", "", "number")}<button class="primary">${tr("Continue to Understand Myself")}</button></form>`; }

function knowmyself() { return `${back()}<form id="knowmyself-form" class="panel"><h2>${tr("Understand Myself")}</h2><p class="notice">${tr("You are not being diagnosed or judged. You are collecting clues about your own learning so you can investigate what helps.")}</p>${field("important", "What matters to you, and what are you curious about?", data.selfUnderstanding.important)}${field("strengths", "What do you think you may already do well?", data.selfUnderstanding.strengths)}${field("challenges", "What can feel difficult when you learn?", data.selfUnderstanding.challenges)}${field("attention", "When do you focus well, and what usually distracts you?", data.selfUnderstanding.attention)}${field("feelings", "How can your feelings or energy affect your learning?", data.selfUnderstanding.feelings)}${field("conditions", "What place, people, tools, or routines help you learn?", data.selfUnderstanding.conditions)}${field("question", "What do you want to understand better about yourself?", data.selfUnderstanding.question)}<button class="primary">${tr("Save my starting observations")}</button></form>`; }

function observe() { return `${back()}<form id="observation-form" class="panel"><h2>${data.language === "en" ? "Observer View" : "Ukubuka Ngokucophelela"}</h2><p>${data.language === "en" ? "Be a kind scientist, not a judge. Describe what happened before deciding what it means." : "Yiba usosayensi onomusa, hhayi umahluleli. Chaza okwenzekile ngaphambi kokunquma ukuthi kusho ukuthini."}</p>${field("scene", data.language === "en" ? "What would a kind camera have seen you doing?" : "Ikhamera enomusa ibizokubona wenzani?")}${field("signals", data.language === "en" ? "What thoughts, feelings, or body signals did you notice?" : "Yimiphi imicabango, imizwa noma izimpawu zomzimba oziqaphelile?")}${field("context", data.language === "en" ? "What was happening around you?" : "Bekwenzekani eduze kwakho?")}${field("next", data.language === "en" ? "What might this learner need or try next?" : "Lo mfundi angadingani noma angazama ini ngokulandelayo?")}<button class="primary">${t("save")}</button></form>`; }
function experiment() { const principleTitle = data.selectedPrinciple ? principleDisplayTitle(data.selectedPrinciple) : ""; const selected = data.selectedPrinciple ? `<p class="notice">${tr("You chose to investigate:")} <strong>${esc(principleTitle)}</strong><br>${tr("Collect evidence by changing one small thing, observing what happens, and comparing it with your usual approach.")}</p>` : ""; return `${back()}<form id="experiment-form" class="panel"><h2>${t("experiment")}</h2><p class="notice">${tr("Try one task in your usual way, then try it again with a different strategy. Compare what happened.")}</p>${selected}${field("challenge", "What small learning task will you try?", principleTitle)}${field("usualStrategy", "How do you normally approach this task?")}${select("strategy", "Choose a different strategy to test", ["Explain it in your own words", "Recall it without looking", "Draw a concept map", "Break it into smaller parts", "Ask for help"])}${field("prediction", "What do you predict will happen with the different strategy?")}${field("usualResult", "What happened with your usual strategy?")}${field("result", "What happened with the different strategy?")}${select("helped", "Which approach helped more?", ["My usual strategy", "The different strategy", "Both about the same", "I am not sure yet"])}${field("nextStep", "What will you try next time?")}<button class="primary">${t("save")}</button></form>`; }
function reflect() { return `${back()}<form id="reflection-form" class="panel"><h2>${tr("Reflect on My Learning")}</h2><p class="notice">${tr("Reflection is your chance to look back at your evidence, understand what happened, and choose your next step. There are no perfect answers.")}</p>${field("noticed", "What did you notice about yourself as a learner?")}${field("worked", "What helped you learn, remember, concentrate, or continue?")}${field("difficult", "What was difficult, confusing, or unhelpful?")}${field("feelings", "What feelings or body signals did you notice while learning?")}${field("context", "What in your environment helped or made learning harder?")}${field("lesson", "What did you learn about yourself or the strategy you tried?")}${field("next", "What will you try, change, or ask for next time?")}<button class="primary">${tr("Save my reflection")}</button></form>`; }
function gratitude() { return `${back()}<form id="gratitude-form" class="panel"><h2>${t("gratitude")}</h2>${field("message", "What is one person, moment, skill, or thing you appreciate today?")}<button class="primary">${t("save")}</button></form>`; }
function growth() { const latest = [...data.observations, ...data.experiments, ...data.reflections].slice(-5).reverse(); const pre = data.evaluation.pre; const post = data.evaluation.post; const chart = pre && post ? `<h3>My comparison</h3>${bar("Understanding", pre.understanding, post.understanding, 2)}${bar("Self-observation", pre.selfObservation, post.selfObservation, 2)}${bar("Strategy experimentation", pre.strategyExperimentation, post.strategyExperimentation, 2)}${bar("Reflection", pre.reflection, post.reflection, 2)}${bar("Total", pre.total, post.total, 8)}${bar("Confidence", pre.confidence, post.confidence, 5)}` : ""; return `${back()}<section class="panel"><h2>${t("evidence")}</h2><p class="notice">You are the investigator of your own learning. These are your observations, your scores, and your conclusions.</p>${stat("Observations", data.observations.length)}${stat("Experiments compared", data.experiments.length)}${stat("Reflections", data.reflections.length)}${stat("Gratitude entries", data.gratitude.length)}<h3>Before and after</h3>${pre ? stat("Before score", `${pre.total}/8 · confidence ${pre.confidence}/5`) : stat("Before score", "Not completed")}${post ? stat("After score", `${post.total}/8 · confidence ${post.confidence}/5`) : stat("After score", "Not completed")}${pre && post ? `<p class="notice">Your change: ${post.total - pre.total} points and ${post.confidence - pre.confidence} confidence points.</p>` : "<p>Complete the before self-check before using the activities, then complete the after self-check when finished.</p>"}${chart}<h3>Recent evidence</h3>${latest.length ? latest.map(x => entry(x.summary)).join("") : "<p>No entries yet.</p>"}<button class="secondary" data-go="checkin">${t("checkin")}</button><button class="primary" id="download-report">Download my evidence report</button></section>`; }
function checkin() { const phase = data.evaluation.pre ? "post" : "pre"; const label = phase === "pre" ? "My starting self-check" : "My after self-check"; const questions = ["I can explain one thing about how I learn.", "I can notice what helps or distracts me.", "I can choose and try a learning strategy.", "I can explain what happened and decide what to try next."]; const scoreOptions = [{value:0,label:"0 - Not yet"},{value:1,label:"1 - Partly"},{value:2,label:"2 - Clearly"}]; return `${back()}<form id="checkin-form" class="panel" data-phase="${phase}"><h2>${tr(label)}</h2><p>${tr("Choose 0 if you cannot show this yet, 1 if you can partly show it, or 2 if you can clearly show it. This is your own observation, not a diagnosis.")}</p>${questions.map((q,i) => select("q"+i, q, scoreOptions)).join("")}${select("confidence", "How confident are you that you understand how you learn? (1–5)", [1,2,3,4,5])}<button class="primary">${tr(phase === "pre" ? "Save my starting self-check" : "Save my after self-check")}</button></form>`; }
function input(name, label, value="", type="text") { return `<label>${esc(tr(label))}<input name="${name}" type="${type}" value="${esc(value)}" required></label>`; }
function field(name, label, value="") { return `<label>${esc(tr(label))}<textarea name="${name}" required>${esc(value)}</textarea></label>`; }
function select(name, label, values) { return `<label>${esc(tr(label))}<select name="${name}">${values.map(v => { const value = typeof v === "object" ? v.value : v; const labelText = typeof v === "object" ? v.label : v; return `<option value="${esc(value)}">${esc(tr(labelText))}</option>`; }).join("")}</select></label>`; }
function stat(label, value) { return `<div class="stat"><span>${esc(tr(label))}</span><strong>${value}</strong></div>`; }
function bar(label, before, after, maximum) { return `<div class="chart-row"><span>${esc(tr(label))}</span><div class="bars"><i style="width:${before / maximum * 100}%" title="${esc(tr("Before"))}: ${before}"></i><b style="width:${after / maximum * 100}%" title="${esc(tr("After"))}: ${after}"></b></div><small>${before} → ${after}</small></div>`; }

function downloadLocalizedReport() {
  const before = data.evaluation.pre;
  const after = data.evaluation.post;
  const isZulu = data.language === "zu";
  const score = record => record ? `${record.total}/8 (${isZulu ? "ukuqonda" : "understanding"} ${record.understanding}/2, ${isZulu ? "ukuzibuka" : "self-observation"} ${record.selfObservation}/2, ${isZulu ? "ukuhlola isu" : "strategy experimentation"} ${record.strategyExperimentation}/2, ${isZulu ? "ukuzindla" : "reflection"} ${record.reflection}/2; ${isZulu ? "ukuzethemba" : "confidence"} ${record.confidence}/5)` : (isZulu ? "Akuqediwe" : "Not completed");
  const report = isZulu
    ? `UMBiko WOBUFAKAZI BOHAMBO LOKUFUNDA\n\nUmhlanganyeli: ${data.participantCode}\n\nNGAPHAMBI\n${score(before)}\n\nNGEMVA\n${score(after)}\n\nUSHINTSHO\n${before && after ? `Isamba: ${after.total - before.total} amaphuzu\nUkuzethemba: ${after.confidence - before.confidence} amaphuzu` : "Qedela kokubili ukuzihlola ukuze ubale ushintsho."}\n\nUBUFAKAZI BOMSEBENZI\nUkuqaphela: ${data.observations.length}\nUkuhlola amasu: ${data.experiments.length}\nUkuzindla: ${data.reflections.length}\n`
    : `SELF-LEARNING APP EVIDENCE REPORT\n\nParticipant: ${data.participantCode}\n\nBEFORE\n${score(before)}\n\nAFTER\n${score(after)}\n\nCHANGE\n${before && after ? `Total: ${after.total - before.total} points\nConfidence: ${after.confidence - before.confidence} points` : "Complete both tests to calculate change."}\n\nACTIVITY EVIDENCE\nObservations: ${data.observations.length}\nExperiments: ${data.experiments.length}\nReflections: ${data.reflections.length}\n`;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([report], { type: "text/plain" }));
  link.download = "learning-evidence-report.txt";
  link.click();
  URL.revokeObjectURL(link.href);
}

function bindForms() {
  document.querySelectorAll("[data-go]").forEach(x => x.onclick = () => setPage(x.dataset.go));
  document.querySelectorAll("[data-category]").forEach(x => x.onclick = () => { document.getElementById("content").innerHTML = categoryView(Number(x.dataset.category)); bindForms(); });
  document.querySelectorAll("[data-principle]").forEach(x => x.onclick = () => { const categoryIndex = Number(x.dataset.category); const principleIndex = Number(x.dataset.principle); data.selectedPrinciple = PRINCIPLE_CATEGORIES[categoryIndex].principles[principleIndex]; document.getElementById("content").innerHTML = principleView(categoryIndex, principleIndex); bindForms(); });
  document.querySelectorAll("[data-speech]").forEach(button => button.onclick = () => handleLessonSpeech(button.dataset.speech));
  const form = document.querySelector("form"); if (!form) { const download = document.getElementById("download-report"); if (download) download.onclick = downloadLocalizedReport; return; }
  form.onsubmit = event => { event.preventDefault(); const f = Object.fromEntries(new FormData(form)); const now = new Date().toLocaleDateString();
    if (form.id === "register-form") data.profile = { name: f.name, age: f.age, registered: true };
    if (form.id === "knowmyself-form") data.selfUnderstanding = { ...f, completed: true, date: new Date().toISOString() };
    if (form.id === "context-form") data.context = f;
    if (form.id === "observation-form") data.observations.push({ ...f, summary: `${now}: Scene — ${f.scene}\nSignals — ${f.signals}\nContext — ${f.context}\nNext — ${f.next}` });
    if (form.id === "experiment-form") data.experiments.push({ ...f, differentStrategy: true, summary: `${now}: Usual — ${f.usualStrategy}\nDifferent strategy — ${f.strategy}\nHelped more — ${f.helped}\nNext — ${f.nextStep}` });
    if (form.id === "reflection-form") data.reflections.push({ ...f, summary: `${now}: Insight — ${f.lesson}\nNext — ${f.next}` });
    if (form.id === "gratitude-form") data.gratitude.push({ ...f, summary: `${now}: ${f.message}` });
    if (form.id === "checkin-form") { const phase = form.dataset.phase; const record = { understanding: Number(f.q0), selfObservation: Number(f.q1), strategyExperimentation: Number(f.q2), reflection: Number(f.q3), confidence: Number(f.confidence), total: Number(f.q0) + Number(f.q1) + Number(f.q2) + Number(f.q3), date: new Date().toISOString() }; data.evaluation[phase] = record; }
    if (form.id === "experiment-form") data.selectedPrinciple = null;
    save(); setPage(form.id === "register-form" ? "knowmyself" : form.id === "knowmyself-form" ? "checkin" : "growth");
  };
}
function downloadReport() { const pre = data.evaluation.pre; const post = data.evaluation.post; const score = record => record ? `${record.total}/8 (understanding ${record.understanding}/2, self-observation ${record.selfObservation}/2, strategy experimentation ${record.strategyExperimentation}/2, reflection ${record.reflection}/2; confidence ${record.confidence}/5)` : "Not completed"; const text = `SELF-LEARNING APP EVIDENCE REPORT\n\nParticipant: ${data.participantCode}\n\nBEFORE\n${score(pre)}\n\nAFTER\n${score(post)}\n\nCHANGE\n${pre && post ? `Total: ${post.total - pre.total} points\nConfidence: ${post.confidence - pre.confidence} points` : "Complete both tests to calculate change."}\n\nACTIVITY EVIDENCE\nObservations: ${data.observations.length}\nExperiments compared: ${data.experiments.length}\nReflections: ${data.reflections.length}\n`; const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([text], { type: "text/plain" })); link.download = "learning-evidence-report.txt"; link.click(); URL.revokeObjectURL(link.href); }
document.getElementById("language-toggle").onclick = () => { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); data.language = data.language === "en" ? "zu" : "en"; save(); render(); };
document.querySelectorAll(".bottom-nav button").forEach(x => x.onclick = () => setPage(x.dataset.page));
render();

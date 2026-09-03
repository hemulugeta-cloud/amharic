import { AuthProvider } from "./auth.js";
import {
  FIDEL_FAMILIES, FIDEL_LATIN, FIDEL_LATIN_NOTE, WORD_BANK, CHURCH_WORDS, ETHIOPIC_NUMBERS,
  WEEK_DAYS, MONTHS, ANIMALS, FOODS, PEOPLE, BASE_LETTER_GROUPS, BIBLE_TOPICS, BADGE_DEFS,
  SEVEN_MYSTERIES, CHURCH_OBJECTS,
} from "./data-ported.js";
import {
  FEAST_DAYS, SAINTS_FOR_KIDS, NEW_PRAYERS, FUN_FACTS, WEEKLY_VERSES, TEAM_QUIZ_BANK, BIBLE_QUIZ_BANK,
} from "./data-new.js";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const shuffle = arr => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; };

let currentAccount = null;

/* ---------------- Router ---------------- */
const routes = ["home", "fidel", "lab", "pictures", "faith", "progress", "signin"];
function show(route) {
  routes.forEach(r => $("#screen-" + r)?.classList.remove("active"));
  $("#screen-" + route)?.classList.add("active");
  $$(".bottomNav button").forEach(b => b.classList.toggle("active", b.dataset.route === route));
  window.scrollTo(0, 0);
}
window.show = show;

/* ---------------- Auth ---------------- */
function renderAccountBadge() {
  const el = $("#accountBtn");
  el.textContent = currentAccount ? `👤 ${currentAccount.name}` : "👤 Sign in";
}

function mountAuthScreen() {
  const root = $("#screen-signin");
  root.innerHTML = `
    <div class="authShell">
      <div class="card">
        <div class="authTabs">
          <button id="tabSignIn" class="active">Sign In</button>
          <button id="tabSignUp">Create Account</button>
        </div>
        <form id="authForm">
          <div id="nameField" style="display:none">
            <label for="authName">Your name / Parent or teacher name</label>
            <input id="authName" placeholder="e.g. Rahel" />
          </div>
          <label for="authEmail">Email</label>
          <input id="authEmail" type="email" required placeholder="you@example.com" autocomplete="email" />
          <label for="authPassword">Password</label>
          <input id="authPassword" type="password" required minlength="4" placeholder="••••••••" autocomplete="current-password" />
          <div id="ageField" style="display:none">
            <label for="authAge">Age group</label>
            <select id="authAge">
              <option value="little">Little Learners (3–6)</option>
              <option value="children" selected>Children (7–11)</option>
              <option value="youth">Youth (12+)</option>
            </select>
          </div>
          <button class="btn block" id="authSubmit" type="submit">Sign In</button>
        </form>
        <p class="feedback" id="authFeedback"></p>
        <button class="btn secondary block" id="guestBtn" style="margin-top:8px">Continue as Guest</button>
        <p class="privacyNote">This demo stores your account only on this device. It is not a production login system — see the project README for what a real deployment needs (verified email, encrypted storage, parental consent for children's accounts).</p>
      </div>
    </div>`;

  let mode = "signin";
  const setMode = m => {
    mode = m;
    $("#tabSignIn").classList.toggle("active", m === "signin");
    $("#tabSignUp").classList.toggle("active", m === "signup");
    $("#nameField").style.display = m === "signup" ? "block" : "none";
    $("#ageField").style.display = m === "signup" ? "block" : "none";
    $("#authSubmit").textContent = m === "signup" ? "Create Account" : "Sign In";
    $("#authFeedback").textContent = "";
  };
  $("#tabSignIn").onclick = () => setMode("signin");
  $("#tabSignUp").onclick = () => setMode("signup");

  $("#guestBtn").onclick = () => {
    currentAccount = AuthProvider.signInAsGuest();
    onSignedIn();
  };

  $("#authForm").onsubmit = async e => {
    e.preventDefault();
    const feedback = $("#authFeedback");
    feedback.className = "feedback"; feedback.textContent = "";
    try {
      if (mode === "signup") {
        currentAccount = await AuthProvider.signUp({
          name: $("#authName").value.trim() || "Learner",
          email: $("#authEmail").value,
          password: $("#authPassword").value,
          ageGroup: $("#authAge").value,
        });
      } else {
        currentAccount = await AuthProvider.signIn({
          email: $("#authEmail").value,
          password: $("#authPassword").value,
        });
      }
      onSignedIn();
    } catch (err) {
      feedback.classList.add("bad");
      feedback.textContent = err.message;
    }
  };
}

function onSignedIn() {
  renderAccountBadge();
  renderProgress();
  renderHomeStats();
  show("home");
}

$("#accountBtn")?.addEventListener("click", () => {
  if (currentAccount && currentAccount.email) {
    if (confirm("Sign out?")) {
      AuthProvider.signOut();
      currentAccount = null;
      renderAccountBadge();
      show("signin");
    }
  } else {
    show("signin");
  }
});

/* ---------------- Progress / points ---------------- */
function awardPoints(n, type) {
  if (!currentAccount) return;
  const p = currentAccount.profile;
  p.points += n;
  p.types[type] = (p.types[type] || 0) + 1;
  const today = new Date().toISOString().slice(0, 10);
  if (p.lastDay !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    p.streak = p.lastDay === yesterday ? p.streak + 1 : 1;
    p.lastDay = today;
  }
  p.history.unshift({ date: today, type, points: n });
  p.history = p.history.slice(0, 20);
  BADGE_DEFS.forEach(b => { if (b.need(p) && !p.badges.includes(b.name)) p.badges.push(b.name); });
  AuthProvider.saveProfile(currentAccount.email, p);
  renderProgress();
  renderHomeStats();
}

function renderProgress() {
  const root = $("#screen-progress");
  if (!currentAccount) { root.innerHTML = "<p>Sign in to track your progress.</p>"; return; }
  const p = currentAccount.profile;
  root.innerHTML = `
    <h1>🏆 My Progress <span class="helperAmharic">የእኔ እድገት</span></h1>
    <div class="statRow" style="margin-bottom:14px">
      <div class="statBox"><b>${p.points}</b><span>Points</span></div>
      <div class="statBox"><b>${p.streak}</b><span>Day Streak</span></div>
    </div>
    <div class="card">
      <h3>Achievement Badges <span class="helperAmharic">የስኬት ምልክቶች</span></h3>
      <div class="badgeGrid">
        ${BADGE_DEFS.map(b => `<div class="badge ${p.badges.includes(b.name) ? "earned" : ""}">
          <span class="icon">${b.icon}</span>${b.name}</div>`).join("")}
      </div>
    </div>
    <div class="card">
      <h3>Activity History <span class="helperAmharic">የእንቅስቃሴ ታሪክ</span></h3>
      ${p.history.length ? p.history.map(h => `<p>• ${h.date} — +${h.points} pts (${h.type})</p>`).join("")
        : "<p>No activity yet — try a game!</p>"}
    </div>`;
}

/* ---------------- Fidel & Numbers ---------------- */
function mountFidelScreen() {
  const root = $("#screen-fidel");
  root.innerHTML = `
    <h1>ሀ Fidel &amp; Numbers <span class="helperAmharic">ፊደልና ቁጥሮች</span></h1>
    <div class="pillRow" id="fidelTabs">
      <button class="pill active" data-tab="alpha">Alphabets</button>
      <button class="pill" data-tab="nums">Numbers</button>
      <button class="pill" data-tab="cal">Calendar</button>
    </div>
    <div id="fidelBody"></div>`;
  let famIdx = 0;
  let showAll = false;
  const familyRow = (fam, latinRow, big) => `
    <div class="familyRow ${big ? "familyRowBig" : ""}">
      ${fam.map((l, i) => `
        <button class="familyCell" data-letter="${l}" title="Listen">
          <span class="glyphBig">${l}</span>
          <span class="latinTag">${latinRow[i]}</span>
        </button>`).join("")}
    </div>`;
  const wireListens = (root) => {
    $$(".familyCell", root).forEach(btn => btn.onclick = () => speak(btn.dataset.letter));
  };
  const renderAlpha = () => {
    if (showAll) {
      $("#fidelBody").innerHTML = `
        <div class="card">
          <div class="cardTitle"><span class="icon">▦</span><h3>All 34 Fidel Families</h3></div>
          <button class="btn secondary block" id="backToOne" style="margin-bottom:12px">◀ Back to one family at a time</button>
          ${FIDEL_FAMILIES.map((fam, i) => `
            <div class="familyBlock">
              <div class="familyLabel">Family ${i + 1}</div>
              ${familyRow(fam, FIDEL_LATIN[i], false)}
            </div>`).join("")}
          <p class="privacyNote">${FIDEL_LATIN_NOTE}</p>
        </div>`;
      wireListens($("#fidelBody"));
      $("#backToOne").onclick = () => { showAll = false; renderAlpha(); };
      return;
    }
    const fam = FIDEL_FAMILIES[famIdx];
    $("#fidelBody").innerHTML = `
      <div class="card">
        <div class="cardTitle"><h3>Family ${famIdx + 1} of ${FIDEL_FAMILIES.length}</h3></div>
        ${familyRow(fam, FIDEL_LATIN[famIdx], true)}
        <p class="muted" style="text-align:center;margin-top:6px">Tap any letter to hear it</p>
        <div class="btnRow" style="margin-top:10px;justify-content:center">
          <button class="btn secondary" id="prevFam">◀ Previous</button>
          <button class="btn" id="speakFam">🔊 Listen to Family</button>
          <button class="btn secondary" id="nextFam">Next ▶</button>
        </div>
        <button class="btn secondary block" id="viewAllFam" style="margin-top:10px">▦ View All Alphabets</button>
      </div>`;
    wireListens($("#fidelBody"));
    $("#prevFam").onclick = () => { famIdx = (famIdx - 1 + FIDEL_FAMILIES.length) % FIDEL_FAMILIES.length; renderAlpha(); };
    $("#nextFam").onclick = () => { famIdx = (famIdx + 1) % FIDEL_FAMILIES.length; renderAlpha(); };
    $("#speakFam").onclick = () => speak(fam.join(" "));
    $("#viewAllFam").onclick = () => { showAll = true; renderAlpha(); };
  };
  const renderNums = () => {
    $("#fidelBody").innerHTML = `<div class="card"><h3>Ethiopian Numbers <span class="helperAmharic">የኢትዮጵያ ቁጥሮች</span></h3>
      <div class="grid3">${ETHIOPIC_NUMBERS.map(([n, e]) => `<button class="wordCard" onclick="window.__speak('${e}')"><div class="glyph">${e}</div><div class="en">${n}</div></button>`).join("")}</div></div>`;
  };
  const renderCal = () => {
    $("#fidelBody").innerHTML = `
      <div class="card"><h3>📅 Days of the Week <span class="helperAmharic">የሳምንቱ ቀናት</span></h3>
        <div class="grid3">${WEEK_DAYS.map(([a, e]) => `<button class="wordCard" onclick="window.__speak('${a}')"><div class="glyph">${a}</div><div class="en">${e}</div></button>`).join("")}</div></div>
      <div class="card"><h3>📅 Ethiopian Calendar Months <span class="helperAmharic">የኢትዮጵያ 13 ወራት</span></h3>
        <div class="grid3">${MONTHS.map(([a, e]) => `<button class="wordCard" onclick="window.__speak('${a}')"><div class="glyph">${a}</div><div class="en">${e}</div></button>`).join("")}</div></div>`;
  };
  const tabs = { alpha: renderAlpha, nums: renderNums, cal: renderCal };
  $$("#fidelTabs .pill").forEach(btn => btn.onclick = () => {
    $$("#fidelTabs .pill").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    tabs[btn.dataset.tab]();
  });
  renderAlpha();
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  const voice = speechSynthesis.getVoices().find(v => v.lang?.startsWith("am"));
  if (voice) u.voice = voice;
  speechSynthesis.speak(u);
}

function celebrate(el) {
  if (!el) return;
  el.classList.remove("celebrate");
  void el.offsetWidth; // restart animation
  el.classList.add("celebrate");
}

/* ---------------- Fidel Lab (games) ---------------- */
function mountLabScreen() {
  const root = $("#screen-lab");
  root.innerHTML = `
    <h1>📝 Fidel Lab Practice <span class="helperAmharic">የፊደል ልምምድ ላብ</span></h1>
    <div class="pillRow" id="labTabs">
      <button class="pill active" data-tab="missing">Find the Missing Letter</button>
      <button class="pill" data-tab="meaning">Word Meaning Quiz</button>
      <button class="pill" data-tab="choice">Multiple Choice Quiz</button>
      <button class="pill" data-tab="complete">Complete the Word</button>
      <button class="pill" data-tab="builder">Word Builder</button>
      <button class="pill" data-tab="search">Word Search</button>
      <button class="pill" data-tab="row">Unscramble a Family</button>
      <button class="pill" data-tab="group">Order the Letters</button>
      <button class="pill" data-tab="trace">✍️ Letter Tracing</button>
    </div>
    <div id="labBody"></div>`;

  function renderMissing() {
    let score = 0;
    const stage = () => {
      const fam = FIDEL_FAMILIES[Math.floor(Math.random() * FIDEL_FAMILIES.length)];
      const idx = Math.floor(Math.random() * 7);
      const answer = fam[idx];
      const options = shuffle([answer, ...shuffle(fam.filter(x => x !== answer)).slice(0, 2)]);
      $("#labBody").innerHTML = `
        <div class="card game">
          <div class="cardTitle"><span class="icon">🔤</span><h3>Find the Missing Letter</h3></div>
          <p>Score: <b id="mScore">${score}</b></p>
          <div class="wordCard" style="font-size:24px;padding:20px 0">${fam.map((x, i) => i === idx ? "＿" : x).join(" ")}</div>
          <div class="grid3" style="margin-top:10px">
            ${options.map(o => `<button class="btn secondary" data-ans="${o === answer}">${o}</button>`).join("")}
          </div>
          <p class="feedback" id="mFeedback"></p>
        </div>`;
      $$("#labBody [data-ans]").forEach(b => b.onclick = () => {
        const correct = b.dataset.ans === "true";
        $("#mFeedback").className = "feedback " + (correct ? "good" : "bad");
        $("#mFeedback").textContent = correct ? "✔ Correct!" : "✘ Try the next one!";
        if (correct) { score++; awardPoints(5, "missing"); celebrate($("#labBody .card")); }
        setTimeout(stage, 700);
      });
    };
    stage();
  }

  function renderMeaning() {
    let score = 0;
    const bank = [...WORD_BANK, ...CHURCH_WORDS.map(([w, e]) => ({ w, e }))];
    const stage = () => {
      const item = bank[Math.floor(Math.random() * bank.length)];
      const distractors = shuffle(bank.filter(x => x.e !== item.e)).slice(0, 2).map(x => x.e);
      const options = shuffle([item.e, ...distractors]);
      $("#labBody").innerHTML = `
        <div class="card game">
          <div class="cardTitle"><span class="icon">✅</span><h3>Word Meaning Quiz</h3></div>
          <p>Score: <b id="qScore">${score}</b></p>
          <div class="wordCard" style="font-size:24px;padding:20px 0">${item.w}</div>
          <div class="grid2" style="margin-top:10px">
            ${options.map(o => `<button class="btn secondary" data-ans="${o === item.e}">${o}</button>`).join("")}
          </div>
          <p class="feedback" id="qFeedback"></p>
        </div>`;
      $$("#labBody [data-ans]").forEach(b => b.onclick = () => {
        const correct = b.dataset.ans === "true";
        $("#qFeedback").className = "feedback " + (correct ? "good" : "bad");
        $("#qFeedback").textContent = correct ? "✔ Correct!" : `✘ It means "${item.e}"`;
        if (correct) { score++; awardPoints(5, "meaning"); celebrate($("#labBody .card")); }
        setTimeout(stage, 900);
      });
    };
    stage();
  }

  function renderCompleteWord() {
    let score = 0;
    const stage = () => {
      const item = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
      const chars = [...item.w];
      const idx = Math.floor(Math.random() * chars.length);
      const answer = chars[idx];
      const pool = shuffle([...new Set(WORD_BANK.flatMap(x => [...x.w]))].filter(c => c !== answer));
      const options = shuffle([answer, ...pool.slice(0, 2)]);
      $("#labBody").innerHTML = `
        <div class="card game">
          <div class="cardTitle"><span class="icon">🧩</span><h3>Complete the Word</h3></div>
          <p>Clue: <b>${item.e}</b> · Score: <b id="coScore">${score}</b></p>
          <div class="wordCard" style="font-size:24px;padding:20px 0">${chars.map((c, i) => i === idx ? "＿" : c).join("")}</div>
          <div class="grid3" style="margin-top:10px">
            ${options.map(o => `<button class="btn secondary" data-ans="${o === answer}">${o}</button>`).join("")}
          </div>
          <p class="feedback" id="coFeedback"></p>
        </div>`;
      $$("#labBody [data-ans]").forEach(b => b.onclick = () => {
        const correct = b.dataset.ans === "true";
        $("#coFeedback").className = "feedback " + (correct ? "good" : "bad");
        $("#coFeedback").textContent = correct ? "✔ Correct!" : `✘ The word was ${item.w}`;
        if (correct) { score++; awardPoints(5, "complete"); }
        setTimeout(stage, 800);
      });
    };
    stage();
  }

  function renderBuilder() {
    let score = 0;
    const stage = () => {
      const item = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
      const answerChars = [...item.w];
      const decoyPool = shuffle([...new Set(WORD_BANK.flatMap(x => [...x.w]))].filter(c => !answerChars.includes(c)));
      const tiles = shuffle([...answerChars, ...decoyPool.slice(0, 3)]);
      let built = [];
      const used = new Array(tiles.length).fill(false);
      const draw = () => {
        $("#labBody").innerHTML = `
          <div class="card game">
            <div class="cardTitle"><span class="icon">🔡</span><h3>Word Builder</h3></div>
            <p>Build the Amharic word for: <b>${item.e}</b> · Score: <b>${score}</b></p>
            <div class="builtWord" id="buBuilt">${built.length ? built.join("") : "_"}</div>
            <div class="tileRow" id="buTiles">
              ${tiles.map((t, i) => `<button class="tile ${used[i] ? "used" : ""}" data-i="${i}">${t}</button>`).join("")}
            </div>
            <div class="btnRow">
              <button class="btn secondary" id="buClear">↺ Clear</button>
            </div>
            <p class="feedback" id="buFeedback"></p>
          </div>`;
        $$("#buTiles .tile").forEach(btn => btn.onclick = () => {
          const i = Number(btn.dataset.i);
          if (used[i]) return;
          used[i] = true; built.push(tiles[i]);
          if (built.length === answerChars.length) {
            const correct = built.join("") === item.w;
            draw();
            $("#buFeedback").className = "feedback " + (correct ? "good" : "bad");
            $("#buFeedback").textContent = correct ? "✔ Correct!" : `✘ The word was ${item.w}`;
            if (correct) { score++; awardPoints(5, "builder"); }
            setTimeout(stage, 900);
          } else draw();
        });
        $("#buClear").onclick = () => { built = []; used.fill(false); draw(); };
      };
      draw();
    };
    stage();
  }

  function renderWordSearch() {
    const SIZE = 8;
    const alphaPool = FIDEL_FAMILIES.flat();
    let foundCount = 0;
    const stage = () => {
      const targets = shuffle(WORD_BANK.filter(w => w.w.length >= 2 && w.w.length <= 5)).slice(0, 3);
      const grid = Array.from({ length: SIZE }, () => new Array(SIZE).fill(null));
      targets.forEach(t => {
        const row = Math.floor(Math.random() * SIZE);
        const startCol = Math.floor(Math.random() * (SIZE - t.w.length));
        [...t.w].forEach((c, i) => grid[row][startCol + i] = c);
      });
      for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++)
        if (!grid[r][c]) grid[r][c] = alphaPool[Math.floor(Math.random() * alphaPool.length)];

      let selection = [];
      const foundWords = new Set();
      const draw = () => {
        $("#labBody").innerHTML = `
          <div class="card game">
            <div class="cardTitle"><span class="icon">🔎</span><h3>Amharic Word Search</h3></div>
            <p>Find these words: (tap letters in order, then check)</p>
            <div class="targetList">${targets.map(t => `<span class="targetChip ${foundWords.has(t.w) ? "found" : ""}">${t.w} <small>(${t.e})</small></span>`).join("")}</div>
            <div class="searchGrid" style="grid-template-columns:repeat(${SIZE},1fr)">
              ${grid.flatMap((row, r) => row.map((ch, c) => `<button class="searchCell" data-r="${r}" data-c="${c}">${ch}</button>`)).join("")}
            </div>
            <div class="btnRow">
              <button class="btn" id="wsCheck">✓ Check selection</button>
              <button class="btn secondary" id="wsClear">↺ Clear</button>
              <button class="btn secondary" id="wsNew">New Game</button>
            </div>
            <p class="feedback" id="wsFeedback"></p>
          </div>`;
        $$("#labBody .searchCell").forEach(cell => {
          const r = Number(cell.dataset.r), c = Number(cell.dataset.c);
          if (selection.some(s => s.r === r && s.c === c)) cell.classList.add("selected");
          cell.onclick = () => {
            const already = selection.findIndex(s => s.r === r && s.c === c);
            if (already >= 0) selection.splice(already, 1); else selection.push({ r, c });
            draw();
          };
        });
        $("#wsCheck").onclick = () => {
          const word = selection.map(s => grid[s.r][s.c]).join("");
          const hit = targets.find(t => t.w === word && !foundWords.has(t.w));
          $("#wsFeedback").className = "feedback " + (hit ? "good" : "bad");
          if (hit) {
            foundWords.add(hit.w); foundCount++;
            $("#wsFeedback").textContent = `✔ Found "${hit.w}" (${hit.e})!`;
            awardPoints(8, "search");
            if (foundWords.size === targets.length) { selection = []; setTimeout(stage, 1200); }
          } else {
            $("#wsFeedback").textContent = "✘ Not one of the target words yet — keep trying!";
          }
          selection = []; draw();
        };
        $("#wsClear").onclick = () => { selection = []; draw(); };
        $("#wsNew").onclick = () => { selection = []; stage(); };
      };
      draw();
    };
    stage();
  }

  function renderMultipleChoice() {
    let score = 0;
    const bank = [...WORD_BANK, ...CHURCH_WORDS.map(([w, e]) => ({ w, e }))];
    const stage = () => {
      const item = bank[Math.floor(Math.random() * bank.length)];
      const distractors = shuffle(bank.filter(x => x.w !== item.w)).slice(0, 2).map(x => x.w);
      const options = shuffle([item.w, ...distractors]);
      $("#labBody").innerHTML = `
        <div class="card game">
          <div class="cardTitle"><span class="icon">✅</span><h3>Multiple Choice Quiz</h3></div>
          <p>Which word means: <b>"${item.e}"</b>? · Score: <b>${score}</b></p>
          <div class="grid3" style="margin-top:6px">
            ${options.map(o => `<button class="btn secondary" data-ans="${o === item.w}" style="font-family:var(--font-ethiopic);font-size:19px">${o}</button>`).join("")}
          </div>
          <p class="feedback" id="cqFeedback"></p>
        </div>`;
      $$("#labBody [data-ans]").forEach(b => b.onclick = () => {
        const correct = b.dataset.ans === "true";
        $("#cqFeedback").className = "feedback " + (correct ? "good" : "bad");
        $("#cqFeedback").textContent = correct ? "✔ Correct!" : `✘ The answer was ${item.w}`;
        if (correct) { score++; awardPoints(5, "choice"); celebrate($("#labBody .card")); }
        setTimeout(stage, 900);
      });
    };
    stage();
  }

  function renderOrderingGame({ icon, title, hint, pointsType, deck }) {
    // deck: array of arrays-of-strings, each the *correct* order of a group to reconstruct.
    let round = 0, completed = 0;
    const stage = () => {
      if (round >= deck.length) round = 0;
      const correctOrder = deck[round];
      const tiles = shuffle(correctOrder.map((letter, i) => ({ letter, id: i })));
      let built = [];
      const used = new Array(tiles.length).fill(false);
      const draw = () => {
        $("#labBody").innerHTML = `
          <div class="card ethiopian-card game">
            <div class="cardTitle"><span class="icon">${icon}</span><h3>${title}</h3></div>
            <p>${hint} · Completed: <b>${completed}</b></p>
            <div class="builtWord">${built.length ? built.join("") : "_"}</div>
            <div class="tileRow">${tiles.map((t, i) => `<button class="tile ${used[i] ? "used" : ""}" data-i="${i}">${t.letter}</button>`).join("")}</div>
            <div class="btnRow"><button class="btn secondary" id="ordClear">↺ Start Over</button></div>
            <p class="feedback" id="ordFeedback"></p>
          </div>`;
        $$("#labBody .tile").forEach(btn => btn.onclick = () => {
          const i = Number(btn.dataset.i);
          if (used[i]) return;
          used[i] = true; built.push(tiles[i].letter);
          if (built.length === correctOrder.length) {
            const correct = built.join("") === correctOrder.join("");
            draw();
            $("#ordFeedback").className = "feedback " + (correct ? "good" : "bad");
            $("#ordFeedback").textContent = correct ? "✔ Correct order!" : `✘ Correct order was ${correctOrder.join("")}`;
            if (correct) { completed++; round++; awardPoints(8, pointsType); celebrate($("#labBody .card")); }
            setTimeout(stage, 1000);
          } else draw();
        });
        $("#ordClear").onclick = () => { built = []; used.fill(false); draw(); };
      };
      draw();
    };
    stage();
  }
  const renderRowPuzzle = () => renderOrderingGame({
    icon: "🧠", title: "Unscramble a Fidel Family",
    hint: "Tap the seven mixed letters to rebuild the family in its correct order",
    pointsType: "row", deck: FIDEL_FAMILIES,
  });
  const renderGroupPuzzle = () => renderOrderingGame({
    icon: "🔠", title: "Put the Base Letters in Order",
    hint: "The 34 base letters are grouped into sets — put each mixed set back in order",
    pointsType: "group", deck: BASE_LETTER_GROUPS,
  });

  function renderTracing() {
    let famIdx = 0, letterIdx = 0;
    const draw = () => {
      const fam = FIDEL_FAMILIES[famIdx];
      const letter = fam[letterIdx];
      $("#labBody").innerHTML = `
        <div class="card traceWrap">
          <div class="cardTitle"><span class="icon">✍️</span><h3>Letter Tracing</h3></div>
          <p>Family ${famIdx + 1} of ${FIDEL_FAMILIES.length} — tracing <b>${letter}</b> (${FIDEL_LATIN[famIdx][letterIdx]})</p>
          <div class="traceLetterPicker">
            ${fam.map((l, i) => `<button class="${i === letterIdx ? "active" : ""}" data-i="${i}">${l}</button>`).join("")}
          </div>
          <div class="traceCanvasBox"><canvas id="traceCanvas" width="280" height="280"></canvas></div>
          <div class="btnRow" style="justify-content:center;margin-top:12px">
            <button class="btn secondary" id="traceClear">↺ Clear</button>
            <button class="btn secondary" id="traceListen">🔊 Listen</button>
            <button class="btn" id="traceNext">✓ Done &amp; Next Letter</button>
          </div>
        </div>`;
      $$("#labBody .traceLetterPicker button").forEach(b => b.onclick = () => { letterIdx = Number(b.dataset.i); draw(); });
      $("#traceListen").onclick = () => speak(letter);
      $("#traceNext").onclick = () => {
        awardPoints(4, "tracing");
        letterIdx++;
        if (letterIdx >= fam.length) { letterIdx = 0; famIdx = (famIdx + 1) % FIDEL_FAMILIES.length; }
        draw();
      };
      setupTraceCanvas(letter);
    };
    draw();
  }
  function setupTraceCanvas(letter) {
    const canvas = $("#traceCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "220px 'Noto Sans Ethiopic', sans-serif";
    ctx.fillStyle = "#e7e0cd";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(letter, canvas.width / 2, canvas.height / 2 + 10);
    ctx.strokeStyle = "#0f6e5c"; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.lineJoin = "round";
    let drawing = false;
    const pos = e => {
      const r = canvas.getBoundingClientRect();
      const p = e.touches ? e.touches[0] : e;
      return { x: (p.clientX - r.left) * (canvas.width / r.width), y: (p.clientY - r.top) * (canvas.height / r.height) };
    };
    const start = e => { drawing = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); e.preventDefault(); };
    const move = e => { if (!drawing) return; const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); e.preventDefault(); };
    const end = () => { drawing = false; };
    canvas.onmousedown = start; canvas.onmousemove = move; canvas.onmouseup = end; canvas.onmouseleave = end;
    canvas.ontouchstart = start; canvas.ontouchmove = move; canvas.ontouchend = end;
    $("#traceClear").onclick = () => setupTraceCanvas(letter);
  }

  const tabs = {
    missing: renderMissing, meaning: renderMeaning, choice: renderMultipleChoice,
    complete: renderCompleteWord, builder: renderBuilder, search: renderWordSearch,
    row: renderRowPuzzle, group: renderGroupPuzzle, trace: renderTracing,
  };
  $$("#labTabs .pill").forEach(btn => btn.onclick = () => {
    $$("#labTabs .pill").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    tabs[btn.dataset.tab]();
  });
  renderMissing();
}

/* ---------------- Picture Vocabulary ---------------- */
const PICTURE_SETS = {
  animals: { title: "Common Animals", am: "የእንስሳት ስሞች", items: ANIMALS, icon: "🐾" },
  foods: { title: "Foods", am: "የምግብ ስሞች", items: FOODS, icon: "🍎" },
  people: { title: "People &amp; Family", am: "ሰዎችና ቤተሰብ", items: PEOPLE, icon: "👪" },
};

function mountPicturesScreen() {
  const root = $("#screen-pictures");
  root.innerHTML = `
    <h1>🐶 Picture Vocabulary <span class="helperAmharic">የምስል ቃላት</span></h1>
    <div class="pillRow" id="picTabs">
      <button class="pill active" data-tab="animals">🐾 Animals</button>
      <button class="pill" data-tab="foods">🍎 Foods ✨NEW</button>
      <button class="pill" data-tab="people">👪 People ✨NEW</button>
      <button class="pill" data-tab="scramble">🔤 Animal Scramble</button>
    </div>
    <div id="picBody"></div>`;

  const renderCategory = (key) => {
    const set = PICTURE_SETS[key];
    $("#picBody").innerHTML = `
      <div class="card"><h3>${set.title} <span class="helperAmharic">${set.am}</span></h3>
        <div class="grid3">${set.items.map(a => `<button class="wordCard" onclick="window.__speak('${a.am}')">
          <div style="font-size:28px">${a.emoji}</div><div class="glyph" style="font-size:17px">${a.am}</div><div class="en">${a.en}</div></button>`).join("")}
        </div></div>
      <div class="card game" id="matchCard"></div>`;
    mountMatchGame(set.items, set.title);
  };

  const tabs = {
    animals: () => renderCategory("animals"),
    foods: () => renderCategory("foods"),
    people: () => renderCategory("people"),
    scramble: renderAnimalScramble,
  };
  $$("#picTabs .pill").forEach(btn => btn.onclick = () => {
    $$("#picTabs .pill").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    tabs[btn.dataset.tab]();
  });
  renderCategory("animals");
}

function mountMatchGame(items, label) {
  let picks = { name: null, item: null };
  let matched = new Set();
  const stage = () => {
    const set = shuffle(items).slice(0, Math.min(6, items.length));
    const names = shuffle(set);
    picks = { name: null, item: null };
    matched = new Set();
    const draw = () => {
      $("#matchCard").innerHTML = `
        <div class="cardTitle"><span class="icon">🔗</span><h3>Match Each Picture to Its Amharic Name</h3></div>
        <p>Tap a name, then tap its picture.</p>
        <div class="matchGrid">
          <div class="matchCol">${names.map(a => `<button class="matchItem ${matched.has(a.en) ? "matched" : picks.name === a.en ? "picked" : ""}" data-name="${a.en}">${a.am}</button>`).join("")}</div>
          <div class="matchCol">${set.map(a => `<button class="matchItem ${matched.has(a.en) ? "matched" : picks.item === a.en ? "picked" : ""}" data-item="${a.en}" style="font-size:24px">${a.emoji}</button>`).join("")}</div>
        </div>
        <p class="feedback" id="mmFeedback"></p>
        <button class="btn secondary" id="mmNew">New Set</button>`;
      $$("#matchCard [data-name]").forEach(b => b.onclick = () => {
        if (matched.has(b.dataset.name)) return;
        picks.name = b.dataset.name; tryMatch();
      });
      $$("#matchCard [data-item]").forEach(b => b.onclick = () => {
        if (matched.has(b.dataset.item)) return;
        picks.item = b.dataset.item; tryMatch();
      });
      $("#mmNew").onclick = stage;
    };
    const tryMatch = () => {
      if (picks.name && picks.item) {
        const feedback = $("#mmFeedback");
        if (picks.name === picks.item) {
          matched.add(picks.name);
          feedback.className = "feedback good"; feedback.textContent = "✔ Matched!";
          awardPoints(6, "matching");
          celebrate($("#matchCard"));
          if (matched.size === set.length) setTimeout(stage, 1200);
        } else {
          feedback.className = "feedback bad"; feedback.textContent = "✘ Try again!";
        }
        picks = { name: null, item: null };
        setTimeout(draw, 500);
      } else draw();
    };
    draw();
  };
  stage();
}

function renderAnimalScramble() {
  let score = 0;
  const stage = () => {
    const item = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    const answerChars = [...item.am];
    const tiles = shuffle(answerChars.map((c, i) => ({ c, i })));
    let built = [];
    const used = new Array(tiles.length).fill(false);
    const draw = () => {
      $("#picBody").innerHTML = `
        <div class="card game">
          <div class="cardTitle"><span class="icon">🔤</span><h3>Build the Scrambled Animal Name</h3></div>
          <p>What is the Amharic name for: <span style="font-size:22px">${item.emoji}</span> <b>${item.en}</b>? · Score: <b>${score}</b></p>
          <div class="builtWord">${built.length ? built.join("") : "_"}</div>
          <div class="tileRow">${tiles.map((t, i) => `<button class="tile ${used[i] ? "used" : ""}" data-i="${i}">${t.c}</button>`).join("")}</div>
          <div class="btnRow"><button class="btn secondary" id="asClear">↺ Start Over</button></div>
          <p class="feedback" id="asFeedback"></p>
        </div>`;
      $$("#picBody .tile").forEach(btn => btn.onclick = () => {
        const i = Number(btn.dataset.i);
        if (used[i]) return;
        used[i] = true; built.push(tiles[i].c);
        if (built.length === answerChars.length) {
          const correct = built.join("") === item.am;
          draw();
          $("#asFeedback").className = "feedback " + (correct ? "good" : "bad");
          $("#asFeedback").textContent = correct ? "✔ Correct!" : `✘ It was ${item.am}`;
          if (correct) { score++; awardPoints(6, "scramble"); celebrate($("#picBody .card")); }
          setTimeout(stage, 1000);
        } else draw();
      });
      $("#asClear").onclick = () => { built = []; used.fill(false); draw(); };
    };
    draw();
  };
  stage();
}
window.__speak = speak;

/* ---------------- Faith & Bible ---------------- */
function mountFaithScreen() {
  const root = $("#screen-faith");
  root.innerHTML = `
    <h1>📖 Bible &amp; Faith <span class="helperAmharic">መጽሐፍ ቅዱስና እምነት</span></h1>
    <div class="pillRow" id="faithTabs">
      <button class="pill active" data-tab="prayers">Prayers</button>
      <button class="pill" data-tab="words">Church Words</button>
      <button class="pill" data-tab="feasts">Feast Days ✨NEW</button>
      <button class="pill" data-tab="saints">Saints ✨NEW</button>
      <button class="pill" data-tab="stories">Bible Topics</button>
      <button class="pill" data-tab="mysteries">Seven Mysteries</button>
      <button class="pill" data-tab="objects">Church Items</button>
      <button class="pill" data-tab="verse">Weekly Verse ✨NEW</button>
      <button class="pill" data-tab="journal">Prayer Journal</button>
      <button class="pill" data-tab="team">Team Quiz</button>
      <button class="pill" data-tab="biblequiz">📖 Bible Quiz</button>
    </div>
    <div id="faithBody"></div>`;

  const renderPrayers = () => {
    $("#faithBody").innerHTML = NEW_PRAYERS.map(p => `
      <details class="card faithCard">
        <summary><b>${p.title_en}</b> — ${p.title_am}</summary>
        <h3 style="margin-top:10px">ግእዝ</h3><p lang="am">${p.geez}</p>
        <h3>አማርኛ</h3><p lang="am">${p.amharic}</p>
      </details>`).join("") + `<p class="privacyNote">More prayers (the Lord's Prayer, the Creed, the Ave Maria, Gloria Patri) are carried over from the original app content module.</p>`;
  };
  const renderWords = () => {
    $("#faithBody").innerHTML = `<div class="card"><div class="grid2">
      ${CHURCH_WORDS.map(([a, e]) => `<button class="wordCard" onclick="window.__speak('${a}')"><div class="glyph" style="font-size:16px">${a}</div><div class="en">${e}</div></button>`).join("")}
    </div></div>`;
  };
  const renderFeasts = () => {
    $("#faithBody").innerHTML = FEAST_DAYS.map(f => `
      <details class="card faithCard">
        <summary><span class="icon">${f.icon}</span> <b>${f.en}</b> — ${f.am} <small>(${f.date})</small></summary>
        <p style="margin-top:8px">${f.kids}</p>
      </details>`).join("");
  };
  const renderSaints = () => {
    $("#faithBody").innerHTML = SAINTS_FOR_KIDS.map(s => `
      <details class="card faithCard">
        <summary><span class="icon">${s.icon}</span> <b>${s.en}</b> — ${s.am}</summary>
        <p style="margin-top:8px">${s.kids}</p>
      </details>`).join("") + `<p class="privacyNote">For deeper study, ask your parish priest, spiritual father, or a qualified Sunday School teacher — these cards are learning summaries, not a substitute for catechesis.</p>`;
  };
  const renderStories = () => {
    $("#faithBody").innerHTML = `<div class="card"><div class="grid2">
      ${BIBLE_TOPICS.map(t => `<button class="wordCard" onclick="window.__speak('${t.am.split(" / ")[0]}')"><div class="glyph" style="font-size:14px">${t.am}</div><div class="en">${t.en}</div></button>`).join("")}
    </div></div>`;
  };
  const renderMysteries = () => {
    $("#faithBody").innerHTML = SEVEN_MYSTERIES.map(([am, en, amDesc, enDesc]) => `
      <details class="card faithCard">
        <summary><b>${en}</b> — ${am}</summary>
        <p style="margin-top:8px" lang="am">${amDesc}</p>
        <p>${enDesc}</p>
      </details>`).join("");
  };
  const renderObjects = () => {
    $("#faithBody").innerHTML = `<div class="card"><div class="grid2">
      ${CHURCH_OBJECTS.map(([am, en, desc]) => `<button class="wordCard" onclick="window.__speak('${am}')"><div class="glyph" style="font-size:16px">${am}</div><div class="en"><b>${en}</b><br>${desc}</div></button>`).join("")}
    </div></div>`;
  };
  const renderVerse = () => {
    const v = WEEKLY_VERSES[new Date().getDay() % WEEKLY_VERSES.length];
    let step = "read";
    const draw = () => {
      const hide = step === "hide";
      const displayAm = hide ? v.am.split(" ").map(w => w.length > 2 ? "＿".repeat(2) : w).join(" ") : v.am;
      $("#faithBody").innerHTML = `
        <div class="card faithCard">
          <h3>📜 Weekly Memory Verse <span class="helperAmharic">የሳምንቱ የቃል ጥናት</span></h3>
          <p><b>${v.ref}</b></p>
          <div class="wordCard" style="font-size:18px;text-align:left;padding:16px" lang="am">${displayAm}</div>
          <p style="margin-top:8px">${v.en}</p>
          <div class="pillRow" style="margin-top:10px">
            <button class="pill ${step === "read" ? "active" : ""}" data-s="read">1. አንብብ / Read</button>
            <button class="pill ${step === "hide" ? "active" : ""}" data-s="hide">2. ደብቅ / Hide words</button>
            <button class="pill ${step === "recite" ? "active" : ""}" data-s="recite">3. በቃል ተናገር / Recite</button>
          </div>
        </div>`;
      $$("#faithBody [data-s]").forEach(b => b.onclick = () => {
        step = b.dataset.s;
        if (step === "recite") awardPoints(10, "memory");
        draw();
      });
    };
    draw();
  };
  const renderJournal = () => {
    const email = currentAccount?.email;
    const key = email ? "fidelTemari.journal." + email : null;
    $("#faithBody").innerHTML = `
      <div class="card faithCard">
        <h3>📔 Private Prayer Journal <span class="helperAmharic">የጸሎት ማስታወሻ</span></h3>
        <p>${key ? "Saved only on this device, tied to your account." : "You're browsing as a guest — this entry will be lost when you leave the page. Sign in to keep your journal saved."}</p>
        <textarea id="journalText" rows="6" placeholder="ጸሎትዎን ወይም የምስጋና ሐሳብዎን ይጻፉ..."></textarea>
        <button class="btn" id="journalSave">💾 አስቀምጥ / Save</button>
        <span class="feedback good" id="journalSaved"></span>
      </div>`;
    if (key) $("#journalText").value = localStorage.getItem(key) || "";
    $("#journalSave").onclick = () => {
      if (key) localStorage.setItem(key, $("#journalText").value);
      $("#journalSaved").textContent = "Saved ✔";
      awardPoints(3, "prayer");
      setTimeout(() => $("#journalSaved").textContent = "", 1500);
    };
  };
  const renderTeam = () => {
    let scores = { A: 0, B: 0 }, qIndex = 0;
    const deck = shuffle(TEAM_QUIZ_BANK);
    const draw = () => {
      const done = qIndex >= deck.length;
      $("#faithBody").innerHTML = `
        <div class="card faithCard">
          <h3>🏁 Team A vs. Team B — 10 Questions</h3>
          <div class="teamRow">
            <div class="teamBox teamA"><div>Team A</div><div class="teamScore" id="scoreA">${scores.A}</div>
              <div class="btnRow"><button class="btn" data-team="A" data-d="1">+1</button><button class="btn" data-team="A" data-d="-1">−1</button></div></div>
            <div class="teamBox teamB"><div>Team B</div><div class="teamScore" id="scoreB">${scores.B}</div>
              <div class="btnRow"><button class="btn" data-team="B" data-d="1">+1</button><button class="btn" data-team="B" data-d="-1">−1</button></div></div>
          </div>
          ${done
            ? `<p class="feedback good">Class Quiz Complete — Team A: ${scores.A} • Team B: ${scores.B}</p><button class="btn secondary" id="teamRestart">Restart</button>`
            : `<p>${qIndex + 1}/10 — ${deck[qIndex].q}</p>
               <button class="btn secondary" id="teamShow">Show Answer</button>
               <p class="feedback hidden" id="teamAns" style="display:none">${deck[qIndex].a}</p>
               <button class="btn hidden" id="teamNext" style="display:none">Next Question ▶</button>`}
        </div>`;
      $$("#faithBody [data-team]").forEach(b => b.onclick = () => {
        scores[b.dataset.team] += Number(b.dataset.d);
        $("#score" + b.dataset.team).textContent = scores[b.dataset.team];
      });
      if (!done) {
        $("#teamShow").onclick = () => {
          $("#teamAns").style.display = "block";
          $("#teamNext").style.display = "inline-flex";
          $("#teamShow").style.display = "none";
        };
        $("#teamNext").onclick = () => { qIndex++; draw(); };
      } else {
        $("#teamRestart").onclick = () => { scores = { A: 0, B: 0 }; qIndex = 0; draw(); };
      }
    };
    draw();
  };

  const renderBibleQuiz = () => {
    let qIndex = 0, score = 0;
    const deck = shuffle(BIBLE_QUIZ_BANK);
    const draw = () => {
      const total = deck.length;
      if (qIndex >= total) {
        $("#faithBody").innerHTML = `
          <div class="card faithCard">
            <h3>❓ Bible &amp; Faith Quiz</h3>
            <p class="feedback good">Quiz complete! Final score: ${score} / ${total}</p>
            <button class="btn" id="bqRestart">Restart Quiz</button>
          </div>`;
        $("#bqRestart").onclick = renderBibleQuiz;
        return;
      }
      const q = deck[qIndex];
      const total2 = total;
      const options = shuffle(q.options);
      $("#faithBody").innerHTML = `
        <div class="card faithCard">
          <h3>❓ Bible &amp; Faith Quiz</h3>
          <div class="quizMeta"><span>Question ${qIndex + 1}/${total2}</span><span>Score: ${score}</span></div>
          <div class="progressBar"><div class="fill" style="width:${(qIndex / total2) * 100}%"></div></div>
          <p style="font-weight:800;color:var(--ink);margin-top:8px">${q.q}</p>
          <div class="grid2">${options.map(o => `<button class="btn secondary" data-ans="${o === q.a}">${o}</button>`).join("")}</div>
          <p class="feedback" id="bqFeedback"></p>
        </div>`;
      $$("#faithBody [data-ans]").forEach(b => b.onclick = () => {
        const correct = b.dataset.ans === "true";
        $("#bqFeedback").className = "feedback " + (correct ? "good" : "bad");
        $("#bqFeedback").textContent = correct ? "✔ Correct!" : `✘ The answer was ${q.a}`;
        if (correct) { score++; awardPoints(4, "bible"); celebrate($("#faithBody .card")); }
        qIndex++;
        setTimeout(draw, 900);
      });
    };
    draw();
  };

  const tabs = {
    prayers: renderPrayers, words: renderWords, feasts: renderFeasts, saints: renderSaints, stories: renderStories,
    mysteries: renderMysteries, objects: renderObjects, verse: renderVerse, journal: renderJournal, team: renderTeam,
    biblequiz: renderBibleQuiz,
  };
  $$("#faithTabs .pill").forEach(btn => btn.onclick = () => {
    $$("#faithTabs .pill").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    tabs[btn.dataset.tab]();
  });
  renderPrayers();

  // Rotating fun fact ticker on the Home screen
  const fact = FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)];
  const ticker = $("#homeFact");
  if (ticker) ticker.textContent = "✨ Did you know? " + fact;
}

/* ---------------- Home ---------------- */
const MASCOT_SVG = `<svg viewBox="0 0 64 64" class="mascot" aria-hidden="true">
  <circle cx="32" cy="34" r="26" fill="#f7c85c"/>
  <circle cx="32" cy="34" r="26" fill="none" stroke="#c4791f" stroke-width="2"/>
  <circle cx="23" cy="30" r="4" fill="#182623"/>
  <circle cx="41" cy="30" r="4" fill="#182623"/>
  <circle cx="24" cy="29" r="1.3" fill="#fff"/>
  <circle cx="42" cy="29" r="1.3" fill="#fff"/>
  <path d="M21 41c4 5 18 5 22 0" stroke="#182623" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M14 16c4-6 10-9 18-9s14 3 18 9" stroke="#0f6e5c" stroke-width="5" fill="none" stroke-linecap="round"/>
</svg>`;

function mountHome() {
  $("#screen-home").innerHTML = `
    <div class="heroWrap">
      ${MASCOT_SVG}
      <div class="heroText">
        <h2 id="homeGreeting">Selam! 👋</h2>
        <p>Ready to practice today?</p>
      </div>
    </div>
    <button class="statsBar" id="homeStats" style="all:unset;display:flex;gap:10px;margin-bottom:14px;cursor:pointer;width:100%" onclick="show('progress')"></button>
    <div class="factTicker" id="homeFact">Loading a fun fact…</div>
    <div class="hubGrid">
      <button class="hubTile tile1" onclick="show('fidel')"><span class="tileIcon">ሀ</span><span class="tileEn">Fidel &amp; Numbers</span><span class="tileAm">ፊደልና ቁጥሮች</span></button>
      <button class="hubTile tile2" onclick="show('lab')"><span class="tileIcon">📝</span><span class="tileEn">Fidel Lab Practice</span><span class="tileAm">የፊደል ልምምድ ላብ</span></button>
      <button class="hubTile tile3" onclick="show('pictures')"><span class="tileIcon">🐶</span><span class="tileEn">Picture Vocabulary</span><span class="tileAm">የምስል ቃላት</span></button>
      <button class="hubTile tile4" onclick="show('faith')"><span class="tileIcon">📖</span><span class="tileEn">Bible &amp; Faith</span><span class="tileAm">መጽሐፍ ቅዱስና እምነት</span></button>
    </div>`;
  renderHomeStats();
}

function renderHomeStats() {
  const bar = $("#homeStats");
  if (!bar) return;
  const p = currentAccount?.profile;
  bar.innerHTML = `
    <div class="statChip"><b>${p?.points ?? 0}</b><span>⭐ Points</span></div>
    <div class="statChip"><b>${p?.streak ?? 0}</b><span>🔥 Day streak</span></div>
    <div class="statChip"><b>${p?.badges?.length ?? 0}</b><span>🏅 Badges</span></div>`;
  const greet = $("#homeGreeting");
  if (greet) greet.textContent = currentAccount?.name && currentAccount.name !== "Guest"
    ? `Selam, ${currentAccount.name}! 👋` : "Selam! 👋";
}

/* ---------------- Boot ---------------- */
function boot() {
  mountAuthScreen();
  mountHome();
  mountFidelScreen();
  mountLabScreen();
  mountPicturesScreen();
  mountFaithScreen();

  currentAccount = AuthProvider.currentAccount();
  renderAccountBadge();
  if (currentAccount) { renderProgress(); renderHomeStats(); show("home"); }
  else show("signin");

  $$(".bottomNav button[data-route]").forEach(b => b.onclick = () => show(b.dataset.route));

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  }
}
document.addEventListener("DOMContentLoaded", boot);

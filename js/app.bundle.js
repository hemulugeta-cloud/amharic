/* app.bundle.js — auto-generated single-file, non-module bundle of
   auth.js + data-ported.js + data-new.js + app.js, so the app runs by
   double-clicking index.html directly (file://) with no local server
   and no ES-module CORS restriction. Edit the source files in js/ and
   re-run tools/build-bundle.py — do not hand-edit this file. */
(function () {
"use strict";

/* ---- auth.js ---- */
// auth.js — Membership & session management.
//
// IMPORTANT (read this before shipping): this file implements a LOCAL DEMO
// provider only. Accounts are stored in the browser's localStorage on the
// current device — nothing is sent to a server, passwords are not hashed
// with a real KDF, and there is no email verification, password reset, or
// parental-consent flow. This is intentionally built behind the same
// `AuthProvider` interface a production backend would use, so swapping in
// a real provider (Firebase Auth, Supabase Auth, Auth0, or a custom API)
// only requires rewriting this file — no UI or game code needs to change.
//
// See README.md → "Making membership production-ready" for the recommended
// real implementation and child-safety/legal requirements (COPPA, Apple's
// Kids Category, Google Play Families Policy).

const STORAGE_KEY = "fidelTemari.accounts.v1";
const SESSION_KEY = "fidelTemari.session.v1";

function loadAccounts() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}
function saveAccounts(accounts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

// Very small non-cryptographic hash — good enough to avoid storing plaintext
// in this demo, NOT a substitute for bcrypt/argon2 in production.
async function weakHash(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

const AuthProvider = {
  async signUp({ name, email, password, role, ageGroup }) {
    const accounts = loadAccounts();
    const key = email.trim().toLowerCase();
    if (accounts[key]) throw new Error("An account with that email already exists.");
    const passwordHash = await weakHash(password);
    accounts[key] = {
      name, email: key, passwordHash, role: role || "learner",
      ageGroup: ageGroup || "children",
      createdAt: new Date().toISOString(),
      profile: { points: 0, stars: 0, streak: 0, lastDay: "", history: [], types: {}, badges: [] },
      children: [], // for a parent/teacher account managing multiple child profiles
    };
    saveAccounts(accounts);
    this._setSession(key);
    return accounts[key];
  },

  async signIn({ email, password }) {
    const accounts = loadAccounts();
    const key = email.trim().toLowerCase();
    const account = accounts[key];
    if (!account) throw new Error("No account found with that email.");
    const passwordHash = await weakHash(password);
    if (passwordHash !== account.passwordHash) throw new Error("Incorrect password.");
    this._setSession(key);
    return account;
  },

  signInAsGuest() {
    this._setSession(null, true);
    return { name: "Guest", email: null, role: "guest", ageGroup: "children",
      profile: { points: 0, stars: 0, streak: 0, lastDay: "", history: [], types: {}, badges: [] } };
  },

  signOut() {
    localStorage.removeItem(SESSION_KEY);
  },

  currentSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
    catch { return null; }
  },

  currentAccount() {
    const session = this.currentSession();
    if (!session) return null;
    if (session.guest) return this.signInAsGuest();
    const accounts = loadAccounts();
    return accounts[session.email] || null;
  },

  saveProfile(email, profile) {
    if (!email) return; // guest sessions are not persisted across visits
    const accounts = loadAccounts();
    if (!accounts[email]) return;
    accounts[email].profile = profile;
    saveAccounts(accounts);
  },

  _setSession(email, guest = false) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email, guest, since: Date.now() }));
  },
};


/* ---- data-ported.js ---- */
// data-ported.js — content ported from the original prototype (unchanged meaning, reformatted as modules).

const FIDEL_FAMILIES = [
["ሀ","ሁ","ሂ","ሃ","ሄ","ህ","ሆ"],["ለ","ሉ","ሊ","ላ","ሌ","ል","ሎ"],["ሐ","ሑ","ሒ","ሓ","ሔ","ሕ","ሖ"],["መ","ሙ","ሚ","ማ","ሜ","ም","ሞ"],
["ሠ","ሡ","ሢ","ሣ","ሤ","ሥ","ሦ"],["ረ","ሩ","ሪ","ራ","ሬ","ር","ሮ"],["ሰ","ሱ","ሲ","ሳ","ሴ","ስ","ሶ"],["ሸ","ሹ","ሺ","ሻ","ሼ","ሽ","ሾ"],
["ቀ","ቁ","ቂ","ቃ","ቄ","ቅ","ቆ"],["በ","ቡ","ቢ","ባ","ቤ","ብ","ቦ"],["ቨ","ቩ","ቪ","ቫ","ቬ","ቭ","ቮ"],["ተ","ቱ","ቲ","ታ","ቴ","ት","ቶ"],
["ቸ","ቹ","ቺ","ቻ","ቼ","ች","ቾ"],["ኀ","ኁ","ኂ","ኃ","ኄ","ኅ","ኆ"],["ነ","ኑ","ኒ","ና","ኔ","ን","ኖ"],["ኘ","ኙ","ኚ","ኛ","ኜ","ኝ","ኞ"],
["አ","ኡ","ኢ","ኣ","ኤ","እ","ኦ"],["ከ","ኩ","ኪ","ካ","ኬ","ክ","ኮ"],["ኸ","ኹ","ኺ","ኻ","ኼ","ኽ","ኾ"],["ወ","ዉ","ዊ","ዋ","ዌ","ው","ዎ"],
["ዐ","ዑ","ዒ","ዓ","ዔ","ዕ","ዖ"],["ዘ","ዙ","ዚ","ዛ","ዜ","ዝ","ዞ"],["ዠ","ዡ","ዢ","ዣ","ዤ","ዥ","ዦ"],["የ","ዩ","ዪ","ያ","ዬ","ይ","ዮ"],
["ደ","ዱ","ዲ","ዳ","ዴ","ድ","ዶ"],["ጀ","ጁ","ጂ","ጃ","ጄ","ጅ","ጆ"],["ገ","ጉ","ጊ","ጋ","ጌ","ግ","ጎ"],["ጠ","ጡ","ጢ","ጣ","ጤ","ጥ","ጦ"],
["ጨ","ጩ","ጪ","ጫ","ጬ","ጭ","ጮ"],["ጰ","ጱ","ጲ","ጳ","ጴ","ጵ","ጶ"],["ጸ","ጹ","ጺ","ጻ","ጼ","ጽ","ጾ"],["ፀ","ፁ","ፂ","ፃ","ፄ","ፅ","ፆ"],
["ፈ","ፉ","ፊ","ፋ","ፌ","ፍ","ፎ"],["ፐ","ፑ","ፒ","ፓ","ፔ","ፕ","ፖ"]];

// English sound guide for each family, in the same order as FIDEL_FAMILIES.
// Each entry is the consonant base; the 7 forms are built as [Cə,Cu,Ci,Ca,Ce,C,Co].
// null = a vowel-only family (no consonant), where the 7 forms are the bare vowels themselves.
const _BASES = [
  "h","l","h","m","s","r","s","sh","q","b","v","t","ch","h","n","ny",
  null, "k","kh","w", null, "z","zh","y","d","j","g","t’","ch’","p’","ts’","ts’","f","p",
];
function _forms(base) {
  if (base === null) return ["a","u","i","a","e","’","o"]; // pure vowel family (አ / ዐ)
  return [base + "ə", base + "u", base + "i", base + "a", base + "e", base, base + "o"];
}
const FIDEL_LATIN = _BASES.map(_forms);
// Human-readable note shown once under the alphabet screen — several historic Ge'ez
// consonants have merged in spoken Amharic, which is worth telling learners rather
// than hiding.
const FIDEL_LATIN_NOTE =
  "Ge'ez had more distinct consonant sounds than modern spoken Amharic — ሀ/ሐ/ኀ, ሰ/ሠ, and ጸ/ፀ are each pronounced the same way today, but kept as separate letters for historical and religious-text spelling.";

const WORD_BANK = [
{w:"ቤት",e:"House"},{w:"ልጅ",e:"Child"},{w:"እናት",e:"Mother"},{w:"አባት",e:"Father"},{w:"መጽሐፍ",e:"Book"},{w:"ውሃ",e:"Water"},{w:"ፍቅር",e:"Love"},{w:"ሰላም",e:"Peace"},{w:"ደስታ",e:"Joy"},{w:"ጸሎት",e:"Prayer"},{w:"እምነት",e:"Faith"},{w:"በረከት",e:"Blessing"},{w:"መስቀል",e:"Cross"},{w:"እሑድ",e:"Sunday"},{w:"ቤተክርስቲያን",e:"Church"},{w:"መልአክ",e:"Angel"},{w:"ቅዱስ",e:"Holy"},{w:"ወንጌል",e:"Gospel"},{w:"ምሕረት",e:"Mercy"},{w:"ትንሣኤ",e:"Resurrection"},{w:"ጥምቀት",e:"Baptism"},{w:"ቁርባን",e:"Holy Communion"},{w:"ካህን",e:"Priest"},{w:"ዲያቆን",e:"Deacon"},{w:"መቅደስ",e:"Sanctuary"},{w:"ስግደት",e:"Prostration"},{w:"ምስጋና",e:"Praise"},{w:"ይቅርታ",e:"Forgiveness"},{w:"ትሕትና",e:"Humility"},{w:"ትዕግሥት",e:"Patience"},
{w:"ሰማይ",e:"Heaven"},{w:"ምድር",e:"Earth"},{w:"ፀሐይ",e:"Sun"},{w:"ጨረቃ",e:"Moon"},{w:"ኮከብ",e:"Star"},{w:"ብርሃን",e:"Light"},{w:"እንጀራ",e:"Bread"},{w:"ምግብ",e:"Food"},{w:"ትምህርት",e:"Education"},{w:"ትምህርትቤት",e:"School"},{w:"መምህር",e:"Teacher"},{w:"ተማሪ",e:"Student"},{w:"ቤተሰብ",e:"Family"},{w:"ወንድም",e:"Brother"},{w:"እኅት",e:"Sister"},{w:"ጓደኛ",e:"Friend"},{w:"ጤና",e:"Health"},{w:"ጥበብ",e:"Wisdom"},{w:"እውነት",e:"Truth"},{w:"ፍትሕ",e:"Justice"},{w:"ነፍስ",e:"Soul"},{w:"ሕይወት",e:"Life"},{w:"ትእዛዝ",e:"Commandment"},{w:"መንግሥት",e:"Kingdom"},{w:"ክብር",e:"Glory"},{w:"ኃይል",e:"Power"},{w:"ደወል",e:"Bell"},{w:"ጧፍ",e:"Candle"},{w:"ዕጣን",e:"Incense"},{w:"መድኃኒት",e:"Salvation"},
{w:"ዳቦ",e:"Bread loaf"},{w:"ወተት",e:"Milk"},{w:"እንቁላል",e:"Egg"},{w:"ፍራፍሬ",e:"Fruit"},{w:"ፖም",e:"Apple"},{w:"ሙዝ",e:"Banana"},{w:"ብርቱካን",e:"Orange"},{w:"አበባ",e:"Flower"},{w:"ዛፍ",e:"Tree"},{w:"ቅጠል",e:"Leaf"},{w:"ዝናብ",e:"Rain"},{w:"ደመና",e:"Cloud"},{w:"ነፋስ",e:"Wind"},{w:"እሳት",e:"Fire"},{w:"መኪና",e:"Car"},{w:"መንገድ",e:"Road"},{w:"በር",e:"Door"},{w:"መስኮት",e:"Window"},{w:"ወንበር",e:"Chair"},{w:"ጠረጴዛ",e:"Table"},{w:"እርሳስ",e:"Pencil"},{w:"ወረቀት",e:"Paper"},{w:"ቦርሳ",e:"Bag"},{w:"ልብስ",e:"Clothes"},{w:"ጫማ",e:"Shoes"},{w:"እጅ",e:"Hand"},{w:"እግር",e:"Foot"},{w:"ዓይን",e:"Eye"},{w:"ጆሮ",e:"Ear"},{w:"አፍ",e:"Mouth"},{w:"አፍንጫ",e:"Nose"},{w:"ጭንቅላት",e:"Head"},{w:"ቀን",e:"Day"},{w:"ሌሊት",e:"Night"},{w:"ጠዋት",e:"Morning"},{w:"ማታ",e:"Evening"},{w:"ዛሬ",e:"Today"},{w:"ነገ",e:"Tomorrow"},{w:"ትናንት",e:"Yesterday"},{w:"ሥራ",e:"Work"}];

const CHURCH_WORDS = [
["እግዚአብሔር","God"],["አብ","The Father"],["ወልድ","The Son"],["መንፈስ ቅዱስ","Holy Spirit"],["ሥላሴ","Holy Trinity"],["ኢየሱስ ክርስቶስ","Jesus Christ"],["እመቤታችን","Our Lady"],["ቅድስት ድንግል ማርያም","Saint Virgin Mary"],["ተዋሕዶ","Tewahedo / United Nature"],["ቤተ ክርስቲያን","Church"],["መቅደስ","Sanctuary"],["ታቦት","Tabot"],["መስቀል","Cross"],["መጽሐፍ ቅዱስ","Holy Bible"],["ወንጌል","Gospel"],["መዝሙር","Psalm / Hymn"],["ቅዳሴ","Divine Liturgy"],["ጸሎት","Prayer"],["ስግደት","Prostration"],["ጾም","Fasting"],["ጥምቀት","Baptism"],["ቁርባን","Holy Communion"],["ንስሐ","Repentance"],["ካህን","Priest"],["ዲያቆን","Deacon"],["ጳጳስ","Bishop"],["መልአክ","Angel"],["ቅዱስ","Saint / Holy"],["ሰማዕት","Martyr"],["በዓል","Feast"],["ትንሣኤ","Resurrection"],["ልደት","Nativity"],["ጥምቀተ ክርስቶስ","Epiphany / Timket"],["እምነት","Faith"],["ተስፋ","Hope"],["ፍቅር","Love"],["ምሕረት","Mercy"],["በረከት","Blessing"],["ሰላም!","Peace! / Hello!"],["እንደምን አደሩ?","Good morning"],["እንደምን ዋሉ?","Good afternoon"],["እንደምን አመሹ?","Good evening"],["ደኅና እደሩ!","Good night"],["እንኳን ደኅና መጡ!","Welcome!"],["እግዚአብሔር ይመስገን!","Thanks be to God!"],["እግዚአብሔር ይባርክዎ!","May God bless you!"],["መልካም እሑድ!","Happy Sunday!"],["በሰላም ይግቡ!","Enter in peace!"],["በሰላም ይዋሉ!","Have a peaceful day!"],["በሰላም ይመለሱ!","Return in peace!"],["አሜን","Amen"],["ይቅርታ","Forgiveness / Sorry"],["እባክዎ","Please"],["አመሰግናለሁ","Thank you"]];

const ETHIOPIC_NUMBERS = [["1","፩"],["2","፪"],["3","፫"],["4","፬"],["5","፭"],["6","፮"],["7","፯"],["8","፰"],["9","፱"],["10","፲"],["20","፳"],["30","፴"],["40","፵"],["50","፶"],["60","፷"],["70","፸"],["80","፹"],["90","፺"],["100","፻"]];

const WEEK_DAYS = [["ሰኞ","Monday"],["ማክሰኞ","Tuesday"],["ረቡዕ","Wednesday"],["ሐሙስ","Thursday"],["ዓርብ","Friday"],["ቅዳሜ","Saturday"],["እሑድ","Sunday"]];

const MONTHS = [["መስከረም","Meskerem"],["ጥቅምት","Tikimt"],["ኅዳር","Hidar"],["ታኅሣሥ","Tahsas"],["ጥር","Tir"],["የካቲት","Yekatit"],["መጋቢት","Megabit"],["ሚያዝያ","Miyazya"],["ግንቦት","Ginbot"],["ሰኔ","Sene"],["ሐምሌ","Hamle"],["ነሐሴ","Nehase"],["ጳጉሜን","Pagumen"]];

const ANIMALS = [{emoji:'🐶',am:'ውሻ',en:'Dog'},{emoji:'🐱',am:'ድመት',en:'Cat'},{emoji:'🐄',am:'ላም',en:'Cow'},{emoji:'🐑',am:'በግ',en:'Sheep'},{emoji:'🐐',am:'ፍየል',en:'Goat'},{emoji:'🐴',am:'ፈረስ',en:'Horse'},{emoji:'🐔',am:'ዶሮ',en:'Chicken'},{emoji:'🦁',am:'አንበሳ',en:'Lion'},{emoji:'🐘',am:'ዝሆን',en:'Elephant'},{emoji:'🐒',am:'ጦጣ',en:'Monkey'},{emoji:'🐦',am:'ወፍ',en:'Bird'},{emoji:'🐟',am:'ዓሣ',en:'Fish'},{emoji:'🐇',am:'ጥንቸል',en:'Rabbit'},{emoji:'🐖',am:'አሳማ',en:'Pig'},{emoji:'🦆',am:'ዳክዬ',en:'Duck'},{emoji:'🐢',am:'ኤሊ',en:'Turtle'},{emoji:'🐸',am:'እንቁራሪት',en:'Frog'},{emoji:'🐭',am:'አይጥ',en:'Mouse'},{emoji:'🐻',am:'ድብ',en:'Bear'},{emoji:'🐪',am:'ግመል',en:'Camel'}];

const FOODS = [{emoji:'🍞',am:'ዳቦ',en:'Bread'},{emoji:'🥛',am:'ወተት',en:'Milk'},{emoji:'🥚',am:'እንቁላል',en:'Egg'},{emoji:'🍎',am:'ፖም',en:'Apple'},{emoji:'🍌',am:'ሙዝ',en:'Banana'},{emoji:'🍊',am:'ብርቱካን',en:'Orange'},{emoji:'🍯',am:'ማር',en:'Honey'},{emoji:'☕',am:'ቡና',en:'Coffee'},{emoji:'🍲',am:'ወጥ',en:'Stew'},{emoji:'🌶️',am:'ቃሪያ',en:'Pepper'},{emoji:'🧅',am:'ሽንኩርት',en:'Onion'},{emoji:'🍅',am:'ቲማቲም',en:'Tomato'}];

const PEOPLE = [{emoji:'👨',am:'አባት',en:'Father'},{emoji:'👩',am:'እናት',en:'Mother'},{emoji:'👦',am:'ወንድ ልጅ',en:'Boy'},{emoji:'👧',am:'ሴት ልጅ',en:'Girl'},{emoji:'👴',am:'አያት',en:'Grandfather'},{emoji:'👵',am:'ሴት አያት',en:'Grandmother'},{emoji:'🧑‍🏫',am:'መምህር',en:'Teacher'},{emoji:'👫',am:'ጓደኛ',en:'Friend'},{emoji:'👶',am:'ሕፃን',en:'Baby'},{emoji:'🙋',am:'ተማሪ',en:'Student'}];

// Base letters (first form of each family) grouped into 9 sets of 4 (last set of 2),
// for the "put the mixed group back in alphabetical order" puzzle.
const BASE_LETTER_GROUPS = (() => {
  const bases = FIDEL_FAMILIES.map(f => f[0]);
  const groups = [];
  for (let i = 0; i < bases.length; i += 4) groups.push(bases.slice(i, i + 4));
  return groups;
})();


const BIBLE_TOPICS = [{am:'ኖኅ / Noah',en:'Obedience and trust in God'},{am:'ዮሴፍ / Joseph',en:'Forgiveness and God’s providence'},{am:'ሙሴ / Moses',en:'God’s commandments and deliverance'},{am:'ዳዊት / David',en:'Faith and courage'},{am:'ልደት / Nativity',en:'The Incarnation of our Lord'},{am:'ጥምቀት / Timket',en:'The Baptism of Christ'},{am:'መስቀል / Crucifixion',en:'Christ’s saving sacrifice'},{am:'ትንሣኤ / Resurrection',en:'Victory over death'},{am:'ጰራቅሊጦስ / Pentecost',en:'The coming of the Holy Spirit'},{am:'ደጉ ሳምራዊ / Good Samaritan',en:'Mercy toward our neighbor'},{am:'ጾም / Fasting',en:'Prayer, repentance and self-control'},{am:'ቅዳሴ / Divine Liturgy',en:'Worship and Holy Communion'}];

const BADGE_DEFS = [{icon:'🌱',name:'First Step',need:p=>p.points>=10},{icon:'⭐',name:'Rising Star',need:p=>p.points>=100},{icon:'🏆',name:'Fidel Champion',need:p=>p.points>=500},{icon:'🔥',name:'Three-Day Streak',need:p=>p.streak>=3},{icon:'📖',name:'Bible Learner',need:p=>(p.types.bible||0)>=3},{icon:'✍️',name:'Fidel Writer',need:p=>(p.types.tracing||0)>=5},{icon:'🧠',name:'Memory Master',need:p=>(p.types.memory||0)>=3},{icon:'🙏',name:'Prayerful Heart',need:p=>(p.types.prayer||0)>=1}];

const SEVEN_MYSTERIES = [
['1. ምሥጢረ ጥምቀት','Mystery of Baptism','በውኃና በመንፈስ ቅዱስ አዲስ ሕይወት የሚሰጥ፣ ወደ ክርስቲያናዊ ሕይወት መግቢያ የሆነ ምሥጢር ነው።','The sacrament of new birth by water and the Holy Spirit and entry into Christian life.'],
['2. ምሥጢረ ሜሮን','Mystery of Myron / Chrismation','ከጥምቀት በኋላ በቅዱስ ሜሮን ቅብዓት የመንፈስ ቅዱስ ጸጋ የሚሰጥ ምሥጢር ነው።','Following Baptism, the believer is anointed with Holy Myron as a seal of the grace of the Holy Spirit.'],
['3. ምሥጢረ ቁርባን','Mystery of the Eucharist / Holy Communion','ምእመናን በቅዳሴ የጌታችንን ቅዱስ ሥጋና ክቡር ደም የሚቀበሉበት ምሥጢር ነው።','In the Divine Liturgy, the faithful receive the Holy Body and Precious Blood of our Lord Jesus Christ.'],
['4. ምሥጢረ ክህነት','Mystery of Ordination / Holy Orders','ለቤተ ክርስቲያን አገልግሎት የተመረጡ ሰዎች የክህነት ጸጋ የሚቀበሉበት ምሥጢር ነው።','The sacrament through which those chosen for ordained service receive the grace of priestly ministry.'],
['5. ምሥጢረ ተክሊል','Mystery of Holy Matrimony','ወንድና ሴት በቤተ ክርስቲያን በቃል ኪዳን በቅዱስ ትዳር የሚተሳሰሩበት ምሥጢር ነው።','The sacrament in which a man and woman are joined in a holy covenant of marriage in the Church.'],
['6. ምሥጢረ ንስሐ','Mystery of Penance / Confession','ሰው ኃጢአቱን ተጸጽቶ በንስሐ ወደ እግዚአብሔር የሚመለስበትና ይቅርታን የሚፈልግበት ምሥጢር ነው።','Through repentance and confession, the believer turns back to God and seeks forgiveness and spiritual healing.'],
['7. ምሥጢረ ቀንዲል','Mystery of Unction of the Sick','ለታመሙ ሰዎች በጸሎትና በቅብዓት የነፍስና የሥጋ ፈውስ የሚለመንበት ምሥጢር ነው።','A sacrament of prayer and anointing for the sick, asking God for healing of soul and body.']
];

const CHURCH_OBJECTS = [['ጽና','Censer','Used for burning incense during worship.'],['ጽናጽል','Sistrum','A liturgical rhythm instrument used especially in hymn and chant traditions.'],['ከበሮ','Kebero / Drum','A traditional drum used with sacred chant on appropriate services and feasts.'],['መቋሚያ','Prayer Staff','A prayer staff used by chanters for support and rhythm during lengthy services.'],['ጽዋ','Chalice','A sacred vessel associated with the Eucharistic service.'],['የእጅ መስቀል','Ethiopian Orthodox Hand Cross','A hand-held cross used by clergy for blessing and veneration.'],['ዕጣን','Incense','Fragrant incense used in prayer and liturgical worship.'],['ጃንጥላ','Processional Umbrella','A ceremonial umbrella used in processions and feast-day worship.']];


/* ---- data-new.js ---- */
// data-new.js — NEW content added beyond the original prototype.
// Written as respectful, factual, kid/youth-friendly educational summaries about
// the Ethiopian Orthodox Tewahedo Church calendar and tradition. Not a substitute
// for catechesis — every card ends with an invitation to ask a parish priest or
// Sunday School teacher to learn more, matching the tone of the existing app.

const FEAST_DAYS = [
  {
    icon: "🌟",
    am: "ልደት (ገና)",
    en: "Genna — The Nativity of Christ",
    date: "Tahsas 29 (≈ Jan 7)",
    kids: "The joyful celebration of Jesus' birth in Bethlehem. Families attend an all-night church service and share a festive meal afterward. In some regions children and adults play a hockey-like game called genna.",
  },
  {
    icon: "💧",
    am: "ጥምቀት",
    en: "Timket — Epiphany",
    date: "Tir 11 (≈ Jan 19)",
    kids: "Celebrates the Baptism of Christ in the Jordan River. Priests carry the tabot (a replica of the Ark of the Covenant) in a colorful procession, and many people renew their baptismal vows near a pool or river.",
  },
  {
    icon: "✝️",
    am: "መስቀል",
    en: "Meskel — Finding of the True Cross",
    date: "Meskerem 17 (≈ Sept 27)",
    kids: "Remembers the finding of the cross on which Jesus was crucified. Communities light a tall bonfire called a demera, and yellow Meskel daisies bloom around this time of year.",
  },
  {
    icon: "🐑",
    am: "ፋሲካ",
    en: "Fasika — Easter (Resurrection)",
    date: "Movable (after a 55-day fast)",
    kids: "The greatest feast of the Church year, celebrating Christ's resurrection after Golgotha. Families break a 55-day fast together with a special meal after the midnight service.",
  },
  {
    icon: "🕊️",
    am: "ጰራቅሊጦስ",
    en: "Peraqlitos — Pentecost",
    date: "50 days after Fasika",
    kids: "Celebrates the Holy Spirit coming upon the apostles, giving the Church its mission to teach and baptize all nations.",
  },
  {
    icon: "🌸",
    am: "ግንቦት ልደታ",
    en: "Ginbot LeDeta — Feast of Saint Mary",
    date: "Ginbot 1 (≈ May 9)",
    kids: "One of many feast days honoring Saint Mary, the Mother of God, especially celebrated in Addis Ababa with a large gathering at the Kidane Mihret church.",
  },
];

const SAINTS_FOR_KIDS = [
  {
    icon: "🛡️",
    am: "ቅዱስ ጊዮርጊስ",
    en: "Saint George",
    kids: "A soldier-saint known for his courage and steadfast faith. He is honored with a monthly feast day and is a patron of many Ethiopian churches, including the rock-hewn Bete Giyorgis in Lalibela.",
  },
  {
    icon: "📖",
    am: "አቡነ ተክለ ሃይማኖት",
    en: "Abune Tekle Haymanot",
    kids: "A beloved Ethiopian monk and evangelist known for his life of prayer and discipline. Many children learn his story as an example of devotion and perseverance.",
  },
  {
    icon: "👑",
    am: "ቅድስት ማርያም",
    en: "Saint Mary, Mother of God",
    kids: "Honored above all saints for saying 'yes' to God and raising Jesus. She is remembered with more feast days than any other saint in the Ethiopian Orthodox calendar.",
  },
  {
    icon: "🐉",
    am: "ቅዱስ ሚካኤል",
    en: "Saint Michael the Archangel",
    kids: "Chief of the heavenly angels, remembered as a protector and messenger of God. Many Ethiopian churches and children are named in his honor.",
  },
];

const NEW_PRAYERS = [
  {
    title_en: "Grace Before Meals",
    title_am: "የምግብ ጸሎት",
    geez: "አቡነ ዘበሰማያት ባርክ ዘንተ ሲሳየ ዘአስተዳለውከ ለነ በቸርነትከ በስመ አብ ወወልድ ወመንፈስ ቅዱስ አሐዱ አምላክ አሜን።",
    amharic: "አባታችን ሆይ ይህን ምግብ ባርክልን። በአብ በወልድ በመንፈስ ቅዱስ ስም አሜን።",
  },
  {
    title_en: "Prayer of Thanksgiving",
    title_am: "የምስጋና ጸሎት",
    geez: "ንሴብሖ ወንባርኮ ለእግዚአብሔር በእንተ ኵሉ ስጦታቲሁ ዘወሀበነ በሣህሉ ወበምሕረቱ አሜን።",
    amharic: "ስለ ሁሉ በረከቱ እግዚአብሔርን እናመሰግናለን፤ በምሕረቱና በቸርነቱ ስላደረገልን ነገር ሁሉ ምስጋና ይገባዋል። አሜን።",
  },
];

const WEEKLY_VERSES = [
  { ref: "Psalm 23:1", am: "እግዚአብሔር እረኛዬ ነው፤ የሚያሳጣኝም የለም።", en: "The Lord is my shepherd; I shall not want." },
  { ref: "John 3:16", am: "እግዚአብሔር ዓለሙን እጅግ ስለ ወደደ አንድያ ልጁን ሰጠ።", en: "For God so loved the world that he gave his only Son." },
  { ref: "Philippians 4:13", am: "ብርታትን በሚሰጠኝ በክርስቶስ ሁሉን እችላለሁ።", en: "I can do all things through Christ who strengthens me." },
  { ref: "Proverbs 3:5", am: "በፍጹም ልብህ በእግዚአብሔር ታመን፤ በራስህ ማስተዋልም አትደገፍ።", en: "Trust in the Lord with all your heart, and do not lean on your own understanding." },
  { ref: "Matthew 5:9", am: "የሰላም አድራጊዎች የተባረኩ ናቸው፥ የእግዚአብሔር ልጆች ይባላሉና።", en: "Blessed are the peacemakers, for they shall be called children of God." },
];

const TEAM_QUIZ_BANK = [
  { q: "What is the Amharic word for 'church'?", a: "ቤተ ክርስቲያን" },
  { q: "How many months are in the Ethiopian calendar?", a: "13" },
  { q: "What feast celebrates the Baptism of Christ?", a: "Timket / ጥምቀት" },
  { q: "What is the Amharic word for 'prayer'?", a: "ጸሎት" },
  { q: "Who carries the tabot in the Timket procession?", a: "Priests" },
  { q: "What is the Amharic word for 'holy'?", a: "ቅዱስ" },
  { q: "What feast is celebrated with a bonfire called a demera?", a: "Meskel / መስቀል" },
  { q: "What is the Amharic word for 'bread'?", a: "እንጀራ / ዳቦ" },
  { q: "How many Mysteries (Sacraments) does the Church teach?", a: "Seven" },
  { q: "What is the Amharic greeting for 'Good morning'?", a: "እንደምን አደሩ?" },
];

const BIBLE_QUIZ_BANK = [
  { q: "Who built the ark before the great flood?", options: ["Noah", "Moses", "Abraham", "David"], a: "Noah" },
  { q: "Who led the Israelites out of slavery in Egypt?", options: ["Moses", "Joshua", "Solomon", "Elijah"], a: "Moses" },
  { q: "Who was thrown into a den of lions for praying?", options: ["Daniel", "Jonah", "Samuel", "Elijah"], a: "Daniel" },
  { q: "Who was swallowed by a great fish?", options: ["Jonah", "Peter", "Paul", "Jacob"], a: "Jonah" },
  { q: "Who was the mother of Jesus?", options: ["Mary", "Martha", "Elizabeth", "Ruth"], a: "Mary" },
  { q: "In which town was Jesus born?", options: ["Bethlehem", "Nazareth", "Jerusalem", "Jericho"], a: "Bethlehem" },
  { q: "How many disciples did Jesus choose?", options: ["12", "7", "10", "40"], a: "12" },
  { q: "What did Jesus turn water into at a wedding?", options: ["Wine", "Bread", "Honey", "Milk"], a: "Wine" },
  { q: "Who baptized Jesus in the Jordan River?", options: ["John the Baptist", "Peter", "Andrew", "Philip"], a: "John the Baptist" },
  { q: "On which day of the week do Orthodox Christians typically attend the Divine Liturgy?", options: ["Sunday", "Saturday", "Friday", "Wednesday"], a: "Sunday" },
  { q: "What is the Ethiopian feast of Timket also known as?", options: ["Epiphany", "Christmas", "Easter", "Pentecost"], a: "Epiphany" },
  { q: "What does the word 'Tewahedo' refer to?", options: ["The united nature of Christ", "A church building", "A type of fasting", "A saint's name"], a: "The united nature of Christ" },
  { q: "How many Gospels are there in the New Testament?", options: ["4", "3", "5", "12"], a: "4" },
  { q: "Who denied knowing Jesus three times?", options: ["Peter", "John", "James", "Thomas"], a: "Peter" },
  { q: "What is the Amharic word for 'church'?", options: ["ቤተ ክርስቲያን", "መንግሥት", "ትምህርት ቤት", "ገበያ"], a: "ቤተ ክርስቲያን" },
  { q: "What is the Amharic word for 'prayer'?", options: ["ጸሎት", "ምግብ", "ትምህርት", "ቤት"], a: "ጸሎት" },
  { q: "Who was sold into slavery by his own brothers?", options: ["Joseph", "Benjamin", "Reuben", "Judah"], a: "Joseph" },
  { q: "What did God give Moses on Mount Sinai?", options: ["The Ten Commandments", "A crown", "A sword", "A harp"], a: "The Ten Commandments" },
  { q: "Who is remembered for defeating Goliath?", options: ["David", "Saul", "Samson", "Gideon"], a: "David" },
  { q: "What is celebrated at Fasika?", options: ["The Resurrection of Christ", "The birth of Christ", "The Baptism of Christ", "Pentecost"], a: "The Resurrection of Christ" },
];

const FUN_FACTS = [
  "The Ethiopian calendar has 13 months and runs about 7–8 years behind the Gregorian calendar used in most of the world.",
  "Ge'ez, the ancient liturgical language of the Ethiopian Orthodox Tewahedo Church, is also the ancestor of modern Amharic and uses the same Fidel script you're learning.",
  "The rock-hewn churches of Lalibela were carved directly out of solid volcanic rock in the 12th–13th centuries and are still active places of worship today.",
  "Ethiopia is one of the oldest Christian nations in the world — the Kingdom of Aksum adopted Christianity in the 4th century AD.",
  "Fidel is a syllabary, not an alphabet — each character represents a consonant-vowel pair (like 'ha', 'hu', 'hi') rather than a single sound.",
];


/* ---- app.js ---- */
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

})();

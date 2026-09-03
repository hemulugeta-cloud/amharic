// data-ported.js — content ported from the original prototype (unchanged meaning, reformatted as modules).

export const FIDEL_FAMILIES = [
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
export const FIDEL_LATIN = _BASES.map(_forms);
// Human-readable note shown once under the alphabet screen — several historic Ge'ez
// consonants have merged in spoken Amharic, which is worth telling learners rather
// than hiding.
export const FIDEL_LATIN_NOTE =
  "Ge'ez had more distinct consonant sounds than modern spoken Amharic — ሀ/ሐ/ኀ, ሰ/ሠ, and ጸ/ፀ are each pronounced the same way today, but kept as separate letters for historical and religious-text spelling.";

export const WORD_BANK = [
{w:"ቤት",e:"House"},{w:"ልጅ",e:"Child"},{w:"እናት",e:"Mother"},{w:"አባት",e:"Father"},{w:"መጽሐፍ",e:"Book"},{w:"ውሃ",e:"Water"},{w:"ፍቅር",e:"Love"},{w:"ሰላም",e:"Peace"},{w:"ደስታ",e:"Joy"},{w:"ጸሎት",e:"Prayer"},{w:"እምነት",e:"Faith"},{w:"በረከት",e:"Blessing"},{w:"መስቀል",e:"Cross"},{w:"እሑድ",e:"Sunday"},{w:"ቤተክርስቲያን",e:"Church"},{w:"መልአክ",e:"Angel"},{w:"ቅዱስ",e:"Holy"},{w:"ወንጌል",e:"Gospel"},{w:"ምሕረት",e:"Mercy"},{w:"ትንሣኤ",e:"Resurrection"},{w:"ጥምቀት",e:"Baptism"},{w:"ቁርባን",e:"Holy Communion"},{w:"ካህን",e:"Priest"},{w:"ዲያቆን",e:"Deacon"},{w:"መቅደስ",e:"Sanctuary"},{w:"ስግደት",e:"Prostration"},{w:"ምስጋና",e:"Praise"},{w:"ይቅርታ",e:"Forgiveness"},{w:"ትሕትና",e:"Humility"},{w:"ትዕግሥት",e:"Patience"},
{w:"ሰማይ",e:"Heaven"},{w:"ምድር",e:"Earth"},{w:"ፀሐይ",e:"Sun"},{w:"ጨረቃ",e:"Moon"},{w:"ኮከብ",e:"Star"},{w:"ብርሃን",e:"Light"},{w:"እንጀራ",e:"Bread"},{w:"ምግብ",e:"Food"},{w:"ትምህርት",e:"Education"},{w:"ትምህርትቤት",e:"School"},{w:"መምህር",e:"Teacher"},{w:"ተማሪ",e:"Student"},{w:"ቤተሰብ",e:"Family"},{w:"ወንድም",e:"Brother"},{w:"እኅት",e:"Sister"},{w:"ጓደኛ",e:"Friend"},{w:"ጤና",e:"Health"},{w:"ጥበብ",e:"Wisdom"},{w:"እውነት",e:"Truth"},{w:"ፍትሕ",e:"Justice"},{w:"ነፍስ",e:"Soul"},{w:"ሕይወት",e:"Life"},{w:"ትእዛዝ",e:"Commandment"},{w:"መንግሥት",e:"Kingdom"},{w:"ክብር",e:"Glory"},{w:"ኃይል",e:"Power"},{w:"ደወል",e:"Bell"},{w:"ጧፍ",e:"Candle"},{w:"ዕጣን",e:"Incense"},{w:"መድኃኒት",e:"Salvation"},
{w:"ዳቦ",e:"Bread loaf"},{w:"ወተት",e:"Milk"},{w:"እንቁላል",e:"Egg"},{w:"ፍራፍሬ",e:"Fruit"},{w:"ፖም",e:"Apple"},{w:"ሙዝ",e:"Banana"},{w:"ብርቱካን",e:"Orange"},{w:"አበባ",e:"Flower"},{w:"ዛፍ",e:"Tree"},{w:"ቅጠል",e:"Leaf"},{w:"ዝናብ",e:"Rain"},{w:"ደመና",e:"Cloud"},{w:"ነፋስ",e:"Wind"},{w:"እሳት",e:"Fire"},{w:"መኪና",e:"Car"},{w:"መንገድ",e:"Road"},{w:"በር",e:"Door"},{w:"መስኮት",e:"Window"},{w:"ወንበር",e:"Chair"},{w:"ጠረጴዛ",e:"Table"},{w:"እርሳስ",e:"Pencil"},{w:"ወረቀት",e:"Paper"},{w:"ቦርሳ",e:"Bag"},{w:"ልብስ",e:"Clothes"},{w:"ጫማ",e:"Shoes"},{w:"እጅ",e:"Hand"},{w:"እግር",e:"Foot"},{w:"ዓይን",e:"Eye"},{w:"ጆሮ",e:"Ear"},{w:"አፍ",e:"Mouth"},{w:"አፍንጫ",e:"Nose"},{w:"ጭንቅላት",e:"Head"},{w:"ቀን",e:"Day"},{w:"ሌሊት",e:"Night"},{w:"ጠዋት",e:"Morning"},{w:"ማታ",e:"Evening"},{w:"ዛሬ",e:"Today"},{w:"ነገ",e:"Tomorrow"},{w:"ትናንት",e:"Yesterday"},{w:"ሥራ",e:"Work"}];

export const CHURCH_WORDS = [
["እግዚአብሔር","God"],["አብ","The Father"],["ወልድ","The Son"],["መንፈስ ቅዱስ","Holy Spirit"],["ሥላሴ","Holy Trinity"],["ኢየሱስ ክርስቶስ","Jesus Christ"],["እመቤታችን","Our Lady"],["ቅድስት ድንግል ማርያም","Saint Virgin Mary"],["ተዋሕዶ","Tewahedo / United Nature"],["ቤተ ክርስቲያን","Church"],["መቅደስ","Sanctuary"],["ታቦት","Tabot"],["መስቀል","Cross"],["መጽሐፍ ቅዱስ","Holy Bible"],["ወንጌል","Gospel"],["መዝሙር","Psalm / Hymn"],["ቅዳሴ","Divine Liturgy"],["ጸሎት","Prayer"],["ስግደት","Prostration"],["ጾም","Fasting"],["ጥምቀት","Baptism"],["ቁርባን","Holy Communion"],["ንስሐ","Repentance"],["ካህን","Priest"],["ዲያቆን","Deacon"],["ጳጳስ","Bishop"],["መልአክ","Angel"],["ቅዱስ","Saint / Holy"],["ሰማዕት","Martyr"],["በዓል","Feast"],["ትንሣኤ","Resurrection"],["ልደት","Nativity"],["ጥምቀተ ክርስቶስ","Epiphany / Timket"],["እምነት","Faith"],["ተስፋ","Hope"],["ፍቅር","Love"],["ምሕረት","Mercy"],["በረከት","Blessing"],["ሰላም!","Peace! / Hello!"],["እንደምን አደሩ?","Good morning"],["እንደምን ዋሉ?","Good afternoon"],["እንደምን አመሹ?","Good evening"],["ደኅና እደሩ!","Good night"],["እንኳን ደኅና መጡ!","Welcome!"],["እግዚአብሔር ይመስገን!","Thanks be to God!"],["እግዚአብሔር ይባርክዎ!","May God bless you!"],["መልካም እሑድ!","Happy Sunday!"],["በሰላም ይግቡ!","Enter in peace!"],["በሰላም ይዋሉ!","Have a peaceful day!"],["በሰላም ይመለሱ!","Return in peace!"],["አሜን","Amen"],["ይቅርታ","Forgiveness / Sorry"],["እባክዎ","Please"],["አመሰግናለሁ","Thank you"]];

export const ETHIOPIC_NUMBERS = [["1","፩"],["2","፪"],["3","፫"],["4","፬"],["5","፭"],["6","፮"],["7","፯"],["8","፰"],["9","፱"],["10","፲"],["20","፳"],["30","፴"],["40","፵"],["50","፶"],["60","፷"],["70","፸"],["80","፹"],["90","፺"],["100","፻"]];

export const WEEK_DAYS = [["ሰኞ","Monday"],["ማክሰኞ","Tuesday"],["ረቡዕ","Wednesday"],["ሐሙስ","Thursday"],["ዓርብ","Friday"],["ቅዳሜ","Saturday"],["እሑድ","Sunday"]];

export const MONTHS = [["መስከረም","Meskerem"],["ጥቅምት","Tikimt"],["ኅዳር","Hidar"],["ታኅሣሥ","Tahsas"],["ጥር","Tir"],["የካቲት","Yekatit"],["መጋቢት","Megabit"],["ሚያዝያ","Miyazya"],["ግንቦት","Ginbot"],["ሰኔ","Sene"],["ሐምሌ","Hamle"],["ነሐሴ","Nehase"],["ጳጉሜን","Pagumen"]];

export const ANIMALS = [{emoji:'🐶',am:'ውሻ',en:'Dog'},{emoji:'🐱',am:'ድመት',en:'Cat'},{emoji:'🐄',am:'ላም',en:'Cow'},{emoji:'🐑',am:'በግ',en:'Sheep'},{emoji:'🐐',am:'ፍየል',en:'Goat'},{emoji:'🐴',am:'ፈረስ',en:'Horse'},{emoji:'🐔',am:'ዶሮ',en:'Chicken'},{emoji:'🦁',am:'አንበሳ',en:'Lion'},{emoji:'🐘',am:'ዝሆን',en:'Elephant'},{emoji:'🐒',am:'ጦጣ',en:'Monkey'},{emoji:'🐦',am:'ወፍ',en:'Bird'},{emoji:'🐟',am:'ዓሣ',en:'Fish'},{emoji:'🐇',am:'ጥንቸል',en:'Rabbit'},{emoji:'🐖',am:'አሳማ',en:'Pig'},{emoji:'🦆',am:'ዳክዬ',en:'Duck'},{emoji:'🐢',am:'ኤሊ',en:'Turtle'},{emoji:'🐸',am:'እንቁራሪት',en:'Frog'},{emoji:'🐭',am:'አይጥ',en:'Mouse'},{emoji:'🐻',am:'ድብ',en:'Bear'},{emoji:'🐪',am:'ግመል',en:'Camel'}];

export const FOODS = [{emoji:'🍞',am:'ዳቦ',en:'Bread'},{emoji:'🥛',am:'ወተት',en:'Milk'},{emoji:'🥚',am:'እንቁላል',en:'Egg'},{emoji:'🍎',am:'ፖም',en:'Apple'},{emoji:'🍌',am:'ሙዝ',en:'Banana'},{emoji:'🍊',am:'ብርቱካን',en:'Orange'},{emoji:'🍯',am:'ማር',en:'Honey'},{emoji:'☕',am:'ቡና',en:'Coffee'},{emoji:'🍲',am:'ወጥ',en:'Stew'},{emoji:'🌶️',am:'ቃሪያ',en:'Pepper'},{emoji:'🧅',am:'ሽንኩርት',en:'Onion'},{emoji:'🍅',am:'ቲማቲም',en:'Tomato'}];

export const PEOPLE = [{emoji:'👨',am:'አባት',en:'Father'},{emoji:'👩',am:'እናት',en:'Mother'},{emoji:'👦',am:'ወንድ ልጅ',en:'Boy'},{emoji:'👧',am:'ሴት ልጅ',en:'Girl'},{emoji:'👴',am:'አያት',en:'Grandfather'},{emoji:'👵',am:'ሴት አያት',en:'Grandmother'},{emoji:'🧑‍🏫',am:'መምህር',en:'Teacher'},{emoji:'👫',am:'ጓደኛ',en:'Friend'},{emoji:'👶',am:'ሕፃን',en:'Baby'},{emoji:'🙋',am:'ተማሪ',en:'Student'}];

// Base letters (first form of each family) grouped into 9 sets of 4 (last set of 2),
// for the "put the mixed group back in alphabetical order" puzzle.
export const BASE_LETTER_GROUPS = (() => {
  const bases = FIDEL_FAMILIES.map(f => f[0]);
  const groups = [];
  for (let i = 0; i < bases.length; i += 4) groups.push(bases.slice(i, i + 4));
  return groups;
})();


export const BIBLE_TOPICS = [{am:'ኖኅ / Noah',en:'Obedience and trust in God'},{am:'ዮሴፍ / Joseph',en:'Forgiveness and God’s providence'},{am:'ሙሴ / Moses',en:'God’s commandments and deliverance'},{am:'ዳዊት / David',en:'Faith and courage'},{am:'ልደት / Nativity',en:'The Incarnation of our Lord'},{am:'ጥምቀት / Timket',en:'The Baptism of Christ'},{am:'መስቀል / Crucifixion',en:'Christ’s saving sacrifice'},{am:'ትንሣኤ / Resurrection',en:'Victory over death'},{am:'ጰራቅሊጦስ / Pentecost',en:'The coming of the Holy Spirit'},{am:'ደጉ ሳምራዊ / Good Samaritan',en:'Mercy toward our neighbor'},{am:'ጾም / Fasting',en:'Prayer, repentance and self-control'},{am:'ቅዳሴ / Divine Liturgy',en:'Worship and Holy Communion'}];

export const BADGE_DEFS = [{icon:'🌱',name:'First Step',need:p=>p.points>=10},{icon:'⭐',name:'Rising Star',need:p=>p.points>=100},{icon:'🏆',name:'Fidel Champion',need:p=>p.points>=500},{icon:'🔥',name:'Three-Day Streak',need:p=>p.streak>=3},{icon:'📖',name:'Bible Learner',need:p=>(p.types.bible||0)>=3},{icon:'✍️',name:'Fidel Writer',need:p=>(p.types.tracing||0)>=5},{icon:'🧠',name:'Memory Master',need:p=>(p.types.memory||0)>=3},{icon:'🙏',name:'Prayerful Heart',need:p=>(p.types.prayer||0)>=1}];

export const SEVEN_MYSTERIES = [
['1. ምሥጢረ ጥምቀት','Mystery of Baptism','በውኃና በመንፈስ ቅዱስ አዲስ ሕይወት የሚሰጥ፣ ወደ ክርስቲያናዊ ሕይወት መግቢያ የሆነ ምሥጢር ነው።','The sacrament of new birth by water and the Holy Spirit and entry into Christian life.'],
['2. ምሥጢረ ሜሮን','Mystery of Myron / Chrismation','ከጥምቀት በኋላ በቅዱስ ሜሮን ቅብዓት የመንፈስ ቅዱስ ጸጋ የሚሰጥ ምሥጢር ነው።','Following Baptism, the believer is anointed with Holy Myron as a seal of the grace of the Holy Spirit.'],
['3. ምሥጢረ ቁርባን','Mystery of the Eucharist / Holy Communion','ምእመናን በቅዳሴ የጌታችንን ቅዱስ ሥጋና ክቡር ደም የሚቀበሉበት ምሥጢር ነው።','In the Divine Liturgy, the faithful receive the Holy Body and Precious Blood of our Lord Jesus Christ.'],
['4. ምሥጢረ ክህነት','Mystery of Ordination / Holy Orders','ለቤተ ክርስቲያን አገልግሎት የተመረጡ ሰዎች የክህነት ጸጋ የሚቀበሉበት ምሥጢር ነው።','The sacrament through which those chosen for ordained service receive the grace of priestly ministry.'],
['5. ምሥጢረ ተክሊል','Mystery of Holy Matrimony','ወንድና ሴት በቤተ ክርስቲያን በቃል ኪዳን በቅዱስ ትዳር የሚተሳሰሩበት ምሥጢር ነው።','The sacrament in which a man and woman are joined in a holy covenant of marriage in the Church.'],
['6. ምሥጢረ ንስሐ','Mystery of Penance / Confession','ሰው ኃጢአቱን ተጸጽቶ በንስሐ ወደ እግዚአብሔር የሚመለስበትና ይቅርታን የሚፈልግበት ምሥጢር ነው።','Through repentance and confession, the believer turns back to God and seeks forgiveness and spiritual healing.'],
['7. ምሥጢረ ቀንዲል','Mystery of Unction of the Sick','ለታመሙ ሰዎች በጸሎትና በቅብዓት የነፍስና የሥጋ ፈውስ የሚለመንበት ምሥጢር ነው።','A sacrament of prayer and anointing for the sick, asking God for healing of soul and body.']
];

export const CHURCH_OBJECTS = [['ጽና','Censer','Used for burning incense during worship.'],['ጽናጽል','Sistrum','A liturgical rhythm instrument used especially in hymn and chant traditions.'],['ከበሮ','Kebero / Drum','A traditional drum used with sacred chant on appropriate services and feasts.'],['መቋሚያ','Prayer Staff','A prayer staff used by chanters for support and rhythm during lengthy services.'],['ጽዋ','Chalice','A sacred vessel associated with the Eucharistic service.'],['የእጅ መስቀል','Ethiopian Orthodox Hand Cross','A hand-held cross used by clergy for blessing and veneration.'],['ዕጣን','Incense','Fragrant incense used in prayer and liturgical worship.'],['ጃንጥላ','Processional Umbrella','A ceremonial umbrella used in processions and feast-day worship.']];

// data-new.js — NEW content added beyond the original prototype.
// Written as respectful, factual, kid/youth-friendly educational summaries about
// the Ethiopian Orthodox Tewahedo Church calendar and tradition. Not a substitute
// for catechesis — every card ends with an invitation to ask a parish priest or
// Sunday School teacher to learn more, matching the tone of the existing app.

export const FEAST_DAYS = [
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

export const SAINTS_FOR_KIDS = [
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

export const NEW_PRAYERS = [
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

export const WEEKLY_VERSES = [
  { ref: "Psalm 23:1", am: "እግዚአብሔር እረኛዬ ነው፤ የሚያሳጣኝም የለም።", en: "The Lord is my shepherd; I shall not want." },
  { ref: "John 3:16", am: "እግዚአብሔር ዓለሙን እጅግ ስለ ወደደ አንድያ ልጁን ሰጠ።", en: "For God so loved the world that he gave his only Son." },
  { ref: "Philippians 4:13", am: "ብርታትን በሚሰጠኝ በክርስቶስ ሁሉን እችላለሁ።", en: "I can do all things through Christ who strengthens me." },
  { ref: "Proverbs 3:5", am: "በፍጹም ልብህ በእግዚአብሔር ታመን፤ በራስህ ማስተዋልም አትደገፍ።", en: "Trust in the Lord with all your heart, and do not lean on your own understanding." },
  { ref: "Matthew 5:9", am: "የሰላም አድራጊዎች የተባረኩ ናቸው፥ የእግዚአብሔር ልጆች ይባላሉና።", en: "Blessed are the peacemakers, for they shall be called children of God." },
];

export const TEAM_QUIZ_BANK = [
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

export const BIBLE_QUIZ_BANK = [
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

export const FUN_FACTS = [
  "The Ethiopian calendar has 13 months and runs about 7–8 years behind the Gregorian calendar used in most of the world.",
  "Ge'ez, the ancient liturgical language of the Ethiopian Orthodox Tewahedo Church, is also the ancestor of modern Amharic and uses the same Fidel script you're learning.",
  "The rock-hewn churches of Lalibela were carved directly out of solid volcanic rock in the 12th–13th centuries and are still active places of worship today.",
  "Ethiopia is one of the oldest Christian nations in the world — the Kingdom of Aksum adopted Christianity in the 4th century AD.",
  "Fidel is a syllabary, not an alphabet — each character represents a consonant-vowel pair (like 'ha', 'hu', 'hi') rather than a single sound.",
];

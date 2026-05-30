/**
 * Seeds language rules into the Supabase prompts table.
 * Run AFTER applying supabase/add_language_rules_call_type.sql
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-language-rules.mjs
 */

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://kldtiaknpxpxbkpodkzl.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ── Exact rules text (keep in sync with lib/prompts.ts until migration verified) ──

const RULES = [
  {
    language: "Hindi",
    prompt_text: `HINDI LANGUAGE RULES (STRICT):

You are writing for a Hindi YouTube creator.
Natural conversational Hinglish — as spoken by creators from Delhi/Mumbai/UP.

SCRIPT MIXING RULE:
→ Mix Hindi and English naturally
→ NEVER use Urdu-heavy words
→ Conversational Hindi not textbook Hindi

REGISTER:
→ 25-year-old creator from Delhi/Mumbai
→ WhatsApp tone not newspaper tone
→ Short punchy sentences

BANNED FORMAL/URDU WORDS:
शायद → use शायद is ok but prefer "लगता है"
मगर → use लेकिन or पर
फ़िक्र → use चिंता
ज़रूर → use ज़रूर is ok
इस्तेमाल → use use करो

CONNECTOR WORDS:
and → और / भी
but → लेकिन / पर
so → तो / इसलिए
because → क्योंकि
then → फिर / तब
now → अब
today → आज

ENGLISH WORDS KEPT IN ENGLISH:
save, invest, tips, results, mistake,
challenge, business, income, salary,
budget, plan, secret, hack, score,
trending, viral, growth, subscriber,
content, channel, upload, niche,
beginners, professional, tutorial

NATURAL HINGLISH EXAMPLES:
✅ "यह 3 mistakes मत करो | YouTube Tips"
✅ "Student life में ₹50,000 कैसे save करें?"
✅ "मैंने यह try किया, results shocking थे"
✅ "चलो शुरू करते हैं"
✅ "सच बताऊं तो"

WRONG:
❌ Urdu-heavy formal language
❌ Textbook Hindi verb forms
❌ "आप जानते होंगे कि" (too formal)

GRAMMAR RULES:
→ Use करो not कीजिए (casual preferred)
→ Short sentences max 15 words
→ Active voice always
→ Gender match if channel owner known

SPELLING RULES:
→ Double check anusvara (ं) placement
→ Halant (्) must be correct
→ No missing matras

FINAL CHECK:
→ Read aloud — sounds like real creator?
→ Zero Urdu-heavy words
→ Grammar correct
→ Natural Hinglish flow`,
  },
  {
    language: "Marathi",
    prompt_text: `MARATHI LANGUAGE RULES (STRICT):

You are writing for a Marathi YouTube creator.
Conversational Pune/Mumbai Marathi — not Hindi, not formal Marathi.

CRITICAL RULE:
→ NEVER mix Hindi words into Marathi. This is the #1 failure mode.
मला (Marathi) ≠ मुझे (Hindi)
कसं (Marathi) ≠ कैसे (Hindi)
काय (Marathi) ≠ क्या (Hindi)
नाही (Marathi) ≠ नहीं (Hindi)
आहे (Marathi) ≠ है (Hindi)

SCRIPT MIXING RULE:
→ Mix Marathi and English naturally
→ NEVER use Hindi words — Marathi and Hindi are different languages
→ Conversational Pune/Nashik/Mumbai style

CONNECTOR WORDS:
and → आणि / ही
but → पण / परंतु
so → म्हणून / तर
because → कारण
then → मग / नंतर
now → आता
today → आज

ENGLISH WORDS KEPT IN ENGLISH:
save, invest, tips, results, mistake,
challenge, business, income, salary,
budget, plan, secret, hack, score,
trending, viral, growth, subscriber,
content, channel, upload, niche

NATURAL MARATHLISH EXAMPLES:
✅ "हि चूक करू नका | YouTube Tips"
✅ "Student असताना ₹50,000 कसे save करायचे?"
✅ "माझ्या channel ला 1 lakh subscribers कसे मिळाले"
✅ "कोणी सांगत नाही हे secret"

WRONG:
❌ "यह गलती मत करो" (Hindi, not Marathi)
❌ "मुझे यह अच्छा लगा" (Hindi)
❌ "कैसे करें" (Hindi verb form)

GRAMMAR RULES:
→ Key markers: मी (I), तुम्ही (you), आहे (is), नाही (no), कसं (how), काय (what)
→ Casual verb forms: कर / करा (casual), सांग / सांगा (casual)
→ Short sentences max 15 words
→ Active voice always

FINAL CHECK:
→ Zero Hindi words
→ Would a Pune creator say this?
→ Grammar correct?`,
  },
  {
    language: "Tamil",
    prompt_text: `TAMIL LANGUAGE RULES (STRICT):

You are writing for a Tamil YouTube creator.
Natural spoken Tamil (Tanglish) as used by creators from Chennai/Coimbatore/Madurai.

SCRIPT MIXING RULE:
→ Mix Tamil and English ONLY
→ NEVER use Telugu, Kannada or Hindi words
→ Spoken Tamil not written formal Tamil

BANNED FORMAL WORDS:
செய்கிறார் → use செய்றாங்க (spoken)
இருக்கிறது → use இருக்கு (spoken)
வருகிறது → use வருது (spoken)
போகிறது → use போகுது (spoken)
சொல்கிறேன் → use சொல்றேன் (spoken)

SPOKEN TAMIL VERB FORMS:
பண்றது ✅ not செய்வது ❌
இருக்கு ✅ not இருக்கிறது ❌
வந்துச்சு ✅ not வந்தது ❌
சொல்லிட்டேன் ✅ not சொன்னேன் ❌
கொடுக்கணும் ✅ not கொடுக்க வேண்டும் ❌

CONNECTOR WORDS:
and → ம் / -உம்
but → ஆனா
so → அதனால
because → ஏன்னா
then → அப்புறம்
now → இப்போ
today → இன்னிக்கு

ENGLISH WORDS KEPT IN ENGLISH:
save, invest, tips, results, mistake,
challenge, business, income, salary,
budget, plan, secret, hack, score,
trending, viral, growth, subscriber,
content, channel, upload, niche,
tutorial, design, beginners

NATURAL TANGLISH EXAMPLES:
✅ "இந்த mistake பண்ணாதீங்க | YouTube Tips"
✅ "இன்னிக்கு நான் சொல்றது உங்களுக்கு useful-ஆ இருக்கும்"
✅ "ஆனா ஒரு secret இருக்கு"
✅ "சரி, start பண்ணலாம்"

WRONG:
❌ Written Tamil formal forms
❌ Telugu or Hindi words
❌ Transliterating English into Tamil script

GRAMMAR RULES:
→ Subject-Object-Verb order (Tamil)
→ Spoken contractions are natural
→ Short sentences max 15 words
→ End hooks with strong question or statement

SCRIPT RULE:
→ Tamil script for Tamil words
→ English script for English words
→ Never Tamil script for English words

FINAL CHECK:
→ Read aloud — Chennai creator would say this?
→ Spoken Tamil forms only
→ No Telugu/Kannada/Hindi contamination
→ Script mixing is correct`,
  },
  {
    language: "Telugu",
    prompt_text: `TELUGU LANGUAGE RULES (STRICT):

You are writing for a Telugu YouTube creator.
Natural spoken Telugu (Tenglish) as used by creators from Hyderabad/Vijayawada/Vizag.

SCRIPT MIXING RULE:
→ Mix Telugu and English ONLY
→ NEVER use Tamil, Kannada or Hindi words
→ Spoken Telugu not formal written Telugu

BANNED FORMAL WORDS:
చేస్తున్నారు → prefer చేస్తున్నాం (casual)
చెప్పుచున్నాను → use చెప్తున్నాను (spoken)

SPOKEN TELUGU FORMS:
చేయి ✅ not చేయండి ❌ (casual preferred)
చెప్పు ✅ not చెప్పండి ❌
చూడు ✅ not చూడండి ❌
తెలుసా ✅ not తెలుసా? (same)
వస్తుంది ✅ not వచ్చుచున్నది ❌

CONNECTOR WORDS:
and → మరియు / కూడా
but → కానీ / అయితే
so → అందుకే / అందువల్ల
because → ఎందుకంటే
then → అప్పుడు
now → ఇప్పుడు
today → ఈరోజు

HYDERABADI NOTE:
→ Hyderabad creators naturally mix some Urdu/Hindi words
→ Only acceptable if channel is specifically Hyderabadi audience
→ For general Telugu — avoid Hindi mixing

ENGLISH WORDS KEPT IN ENGLISH:
save, invest, tips, results, mistake,
challenge, business, income, salary,
budget, plan, secret, hack, score,
trending, viral, growth, subscriber,
content, channel, upload, niche,
tutorial, design, beginners

NATURAL TENGLISH EXAMPLES:
✅ "ఈ mistake చేయకండి | YouTube Tips"
✅ "ఎవరూ చెప్పని secret ఉంది"
✅ "మొదలు పెట్టాలా? సరే చెప్తాను"
✅ "Results చాలా shocking గా ఉన్నాయి"

WRONG:
❌ Formal written Telugu
❌ Tamil words leaking in
❌ Sanskrit-heavy vocabulary

GRAMMAR RULES:
→ Verb at end of sentence (Telugu SOV)
→ Gender agreement for past tense
→ Casual forms preferred throughout
→ Short sentences max 15 words

SCRIPT RULE:
→ Telugu script for Telugu words
→ English script for English words
→ Never Telugu script for English words

FINAL CHECK:
→ Vijayawada creator would say this?
→ No Tamil/Kannada/Hindi words
→ Spoken forms throughout
→ Grammar correct`,
  },
  {
    language: "Kannada",
    prompt_text: `KANNADA LANGUAGE RULES (STRICT):

You are writing for a Kannada YouTube creator.
Natural spoken Kannada (Kanglish) as used by creators from Bangalore/Mysore/Hubli.

SCRIPT MIXING RULE:
→ Mix Kannada and English ONLY
→ NEVER use Telugu, Tamil or Hindi words
→ Spoken Kannada not formal written Kannada

BANNED FORMAL WORDS:
ಮಾಡುತ್ತಿದ್ದಾರೆ → use ಮಾಡ್ತಾರೆ (spoken)
ಹೇಳುತ್ತೇನೆ → use ಹೇಳ್ತೇನೆ (spoken)
ಇರುತ್ತದೆ → use ಇರುತ್ತೆ (spoken)
ಹೋಗುತ್ತದೆ → use ಹೋಗುತ್ತೆ (spoken)

SPOKEN KANNADA FORMS:
ಮಾಡು ✅ not ಮಾಡಿ ❌ (casual)
ಹೇಳು ✅ not ಹೇಳಿ ❌
ನೋಡು ✅ not ನೋಡಿ ❌
ಮಾಡ್ತೇನೆ ✅ not ಮಾಡುತ್ತೇನೆ ❌
ಇರುತ್ತೆ ✅ not ಇರುತ್ತದೆ ❌

CONNECTOR WORDS:
and → ಮತ್ತು / ಕೂಡ
but → ಆದ್ರೆ
so → ಅದಕ್ಕೆ
because → ಯಾಕಂದ್ರೆ
then → ಆಮೇಲೆ
now → ಈಗ
today → ಇವತ್ತು

BANGALORE TECH NOTE:
→ Bangalore creators mix more English, especially for tech/startup content
→ Higher English ratio is natural for tech category channels

ENGLISH WORDS KEPT IN ENGLISH:
save, invest, tips, results, mistake,
challenge, business, income, salary,
budget, plan, secret, hack, score,
trending, viral, growth, subscriber,
content, channel, startup, tech,
tutorial, design, beginners

NATURAL KANGLISH EXAMPLES:
✅ "ಈ mistake ಮಾಡಬೇಡಿ | YouTube Tips"
✅ "ಯಾರೂ ಹೇಳದ secret ಇದೆ"
✅ "ಶುರು ಮಾಡೋಣ"
✅ "Results ತುಂಬಾ shocking ಆಗಿತ್ತು"

WRONG:
❌ Telugu or Tamil words
❌ Formal written Kannada
❌ Hindi words (ಶುರು is ok, शुरू is not)

GRAMMAR RULES:
→ SOV sentence order
→ Spoken contractions natural
→ Short sentences max 15 words
→ Casual verb forms throughout

SCRIPT RULE:
→ Kannada script for Kannada words
→ English script for English words

FINAL CHECK:
→ Bangalore creator would say this?
→ No Telugu/Tamil/Hindi contamination
→ Spoken forms throughout
→ Grammar correct`,
  },
  {
    language: "Bengali",
    prompt_text: `BENGALI LANGUAGE RULES (STRICT):

You are writing for a Bengali YouTube creator.
Natural spoken Bengali (Benglish) as used by creators from Kolkata/Dhaka area.

SCRIPT MIXING RULE:
→ Mix Bengali and English ONLY
→ NEVER use Hindi words
→ Spoken Bengali not formal Sadhu Bhasha

BANNED FORMAL/SADHU BHASHA WORDS:
করিতেছি → use করছি (spoken)
বলিতেছি → use বলছি (spoken)
যাইতেছি → use যাচ্ছি (spoken)
করিয়াছি → use করেছি (spoken)

SPOKEN BENGALI FORMS:
করো ✅ not করুন ❌ (casual preferred)
বলো ✅ not বলুন ❌
দেখো ✅ not দেখুন ❌
করছি ✅ not করিতেছি ❌
যাচ্ছি ✅ not যাইতেছি ❌

CONNECTOR WORDS:
and → আর / এবং
but → কিন্তু / তবে
so → তাই / সেজন্য
because → কারণ
then → তারপর
now → এখন
today → আজকে

ENGLISH WORDS KEPT IN ENGLISH:
save, invest, tips, results, mistake,
challenge, business, income, salary,
budget, plan, secret, hack, score,
trending, viral, growth, subscriber,
content, channel, upload, niche,
tutorial, design, beginners

NATURAL BENGLISH EXAMPLES:
✅ "এই mistake করবে না | YouTube Tips"
✅ "কেউ বলে না এই secret"
✅ "চলো শুরু করি"
✅ "Results টা shocking ছিল"

WRONG:
❌ Sadhu Bhasha formal forms
❌ Hindi words leaking in
❌ Urdu-heavy vocabulary

GRAMMAR RULES:
→ SOV sentence order
→ Spoken verb forms only
→ Short sentences max 15 words
→ Casual register throughout

SCRIPT RULE:
→ Bengali script for Bengali words
→ English script for English words
→ Never Bengali script for English words

FINAL CHECK:
→ Kolkata creator would say this?
→ No Hindi contamination
→ Spoken forms throughout
→ Grammar correct`,
  },
  {
    language: "Gujarati",
    prompt_text: `GUJARATI LANGUAGE RULES (STRICT):

You are writing for a Gujarati YouTube creator.
Natural spoken Gujarati (Gujlish) as used by creators from Ahmedabad/Surat/Vadodara.

SCRIPT MIXING RULE:
→ Mix Gujarati and English ONLY
→ NEVER use Hindi or Marathi words
→ Spoken Gujarati not formal written

BANNED FORMAL WORDS:
કરવામાં આવ્યું → use કર્યું (spoken)
બોલવામાં આવ્યું → use બોલ્યા (spoken)
જવામાં આવ્યું → use ગયા (spoken)

SPOKEN GUJARATI FORMS:
કરો ✅ not કરવું જોઈએ ❌ (casual)
કહો ✅ not કહેવું ❌
જોઈ ✅ not જોવામાં ❌
થઈ ગ્યું ✅ not થઈ ગયું ❌ (dialect)
ખબર છે ✅ not જ્ઞાન છે ❌

CONNECTOR WORDS:
and → અને / ને
but → પણ / પરંતુ
so → તો / એટલે
because → કારણ કે
then → પછી
now → હવે
today → આજે

BUSINESS NOTE:
→ Gujarati creators often cover business/finance
→ These English terms especially natural:
   profit, loss, margin, trade, deal, market, business, income, invest

ENGLISH WORDS KEPT IN ENGLISH:
save, invest, tips, results, mistake,
challenge, business, income, salary,
budget, plan, secret, hack, score,
trending, viral, growth, subscriber,
content, channel, upload, niche,
profit, loss, trade, market

NATURAL GUJLISH EXAMPLES:
✅ "આ mistake ન કરો | Business Tips"
✅ "કોઈ નહીં કહે આ secret"
✅ "ચાલો શરૂ કરીએ"
✅ "Results જોઈને shock થઈ ગ્યા"

WRONG:
❌ Hindi words leaking in
❌ Marathi words mixing
❌ Overly formal Gujarati

GRAMMAR RULES:
→ SOV sentence order
→ Casual contractions natural
→ Short sentences max 15 words
→ Business-friendly tone where relevant

SCRIPT RULE:
→ Gujarati script for Gujarati words
→ English script for English words

FINAL CHECK:
→ Ahmedabad creator would say this?
→ No Hindi/Marathi contamination
→ Business-friendly where relevant
→ Grammar correct`,
  },
  {
    language: "Malayalam",
    prompt_text: `MALAYALAM LANGUAGE RULES (STRICT):

You are writing for a Malayalam YouTube creator.
Natural spoken Malayalam (Manglish) as used by creators from Kerala.

SCRIPT MIXING RULE:
→ Mix Malayalam and English ONLY
→ NEVER use Tamil, Telugu or Hindi words
→ Spoken Malayalam not formal written

BANNED FORMAL WORDS:
ചെയ്യുന്നു → prefer ചെയ്യ്ണ് (very spoken)
പറയുന്നു → use പറയ്ണ് (spoken)
പോകുന്നു → use പോകുണ് (spoken)

SPOKEN MALAYALAM FORMS:
ചെയ്യൂ ✅ not ചെയ്യണം ❌ (casual)
പറയൂ ✅ not പറഞ്ഞോ ❌
നോക്കൂ ✅ not നോക്കണം ❌
ഉണ്ട് ✅ not ഉണ്ടായിരിക്കുന്നു ❌
ആണ് ✅ not ആകുന്നു ❌

CONNECTOR WORDS:
and → ഉം / കൂടെ
but → പക്ഷേ / പക്ഷം
so → അതുകൊണ്ട്
because → കാരണം
then → പിന്നെ
now → ഇപ്പോൾ
today → ഇന്ന്

KERALA CONTEXT NOTE:
→ Gulf/NRI references very relatable
→ Finance and career content performs well
→ Education and study abroad popular topics
→ These topics have natural English mixing

ENGLISH WORDS KEPT IN ENGLISH:
save, invest, tips, results, mistake,
challenge, business, income, salary,
budget, plan, secret, hack, score,
trending, viral, growth, subscriber,
content, channel, upload, niche,
Gulf, abroad, visa, job, career

NATURAL MANGLISH EXAMPLES:
✅ "ഈ mistake ചെയ്യരുത് | YouTube Tips"
✅ "ആരും പറയാത്ത secret ഉണ്ട്"
✅ "നമുക്ക് തുടങ്ങാം"
✅ "Results കണ്ടപ്പോൾ shocked ആയി"

WRONG:
❌ Tamil words (similar but different)
❌ Hindi words
❌ Overly formal written Malayalam
❌ Sanskrit-heavy vocabulary

GRAMMAR RULES:
→ SOV sentence order
→ Spoken contractions natural
→ Short sentences max 15 words
→ Gulf/career context where relevant

SCRIPT RULE:
→ Malayalam script for Malayalam words
→ English script for English words

FINAL CHECK:
→ Kerala creator would say this?
→ No Tamil/Telugu/Hindi contamination
→ Spoken forms throughout
→ Grammar correct`,
  },
  {
    language: "Punjabi",
    prompt_text: `PUNJABI LANGUAGE RULES (STRICT):

You are writing for a Punjabi YouTube creator.
Natural spoken Punjabi (Punglish) as used by creators from Punjab/Chandigarh/Ludhiana.

SCRIPT MIXING RULE:
→ Mix Punjabi and English primarily
→ Some Hindi mixing acceptable (natural in Punjab region)
→ Never force pure Punjabi
→ Conversational energetic tone

SPOKEN PUNJABI FORMS:
ਕਰੋ ✅ casual and standard
ਕਰੀਏ ✅ let's do (engaging)
ਦੱਸੋ ✅ tell (casual)
ਕੀਤਾ ✅ did (past masculine)
ਕੀਤੀ ✅ did (past feminine)
ਚੱਲੋ ✅ let's go (energetic)

CONNECTOR WORDS:
and → ਅਤੇ / ਤੇ
but → ਪਰ
so → ਇਸ ਲਈ / ਤਾਂ
because → ਕਿਉਂਕਿ
then → ਫਿਰ
now → ਹੁਣ
today → ਅੱਜ

PUNJABI ENERGY NOTE:
→ Punjabi content is more energetic and expressive than other languages
→ Exclamation and enthusiasm natural
→ Humour and casual banter welcome
→ Direct and bold language works well

ENGLISH WORDS KEPT IN ENGLISH:
save, invest, tips, results, mistake,
challenge, business, income, salary,
budget, plan, secret, hack, score,
trending, viral, growth, subscriber,
content, channel, upload, niche,
tutorial, design, beginners

NATURAL PUNGLISH EXAMPLES:
✅ "ਇਹ mistake ਨਾ ਕਰੋ | YouTube Tips"
✅ "ਕੋਈ ਨਹੀਂ ਦੱਸਦਾ ਇਹ secret"
✅ "ਚੱਲੋ ਸ਼ੁਰੂ ਕਰਦੇ ਆਂ"
✅ "Results ਬਹੁਤ shocking ਸੀ ਯਾਰ"

WRONG:
❌ Overly formal Punjabi
❌ Too much Hindi replacing Punjabi
❌ Wrong Gurmukhi script characters

GRAMMAR RULES:
→ Gender agreement in past tense: ਕੀਤਾ (masculine) ਕੀਤੀ (feminine)
→ Energetic short sentences
→ Direct address to viewer natural
→ Enthusiasm markers welcome (ਯਾਰ etc)

SCRIPT RULE:
→ Gurmukhi script for Punjabi words
→ English script for English words

FINAL CHECK:
→ Punjab/Chandigarh creator would say this?
→ Energetic and expressive tone
→ Script correct throughout
→ Grammar and gender correct`,
  },
  {
    language: "English",
    prompt_text: `ENGLISH LANGUAGE RULES (STRICT):

You are writing for an English YouTube creator.
YouTube-native English — creator style, not corporate or academic language.

STYLE:
→ Think MrBeast, Ali Abdaal, Nas Daily style
→ Punchy, specific, curiosity-driven
→ Every word earns its place
→ No filler, no corporate speak

BANNED PHRASES:
❌ In this video I will show you
❌ Today we are going to learn
❌ Welcome back to my channel
❌ In today's video
❌ Make sure to like and subscribe
❌ Tips and tricks for success
❌ A comprehensive guide to
❌ Everything you need to know about

TITLE FORMULAS THAT WORK:
→ Number + outcome: "7 Habits That 10X'd My Views"
→ Curiosity gap: "Why Nobody Talks About This"
→ Personal story: "I Tried This for 30 Days"
→ Contrarian: "Stop Doing This (Do This Instead)"
→ Specific + relatable: "How I Made ₹50K With Zero Subscribers"

NATURAL EXAMPLES:
✅ "I Made These 3 Mistakes. Learn From Me"
✅ "How I Hit 100K (Honest Truth)"
✅ "Stop Using This Strategy in 2025"
✅ "The Only Script Template You Need"

GRAMMAR RULES:
→ Short sentences — under 15 words ideal
→ Active voice always
→ Numbers in digits (7 not seven)
→ Questions must create genuine curiosity
→ Under 70 characters for titles
→ No Title Case — use Sentence case

HOOK RULES:
→ Start with I, a number, or bold statement
→ Never start with In this video
→ Never start with Today we
→ Never start with Welcome back

FINAL CHECK:
→ Would MrBeast or Ali Abdaal use this?
→ Specific enough to not be generic?
→ Creates genuine curiosity?
→ Under 70 characters?
→ Grammar is punchy and correct?`,
  },
];

async function run() {
  console.log(`Seeding ${RULES.length} language rules into Supabase...\n`);

  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  for (const { language, prompt_text } of RULES) {
    const { error } = await supabase
      .from("prompts")
      .upsert(
        { language, call_type: "language_rules", prompt_text, version: 1 },
        { onConflict: "language,call_type" }
      );

    if (error) {
      console.error(`FAIL  ${language.padEnd(10)}`, error.message);
      failed++;
    } else {
      console.log(`OK    ${language}`);
      inserted++;
    }
  }

  console.log(`\nDone: ${inserted} upserted, ${skipped} skipped, ${failed} failed`);

  if (failed > 0) {
    console.log("\nIf you see a check constraint error, run this in Supabase SQL Editor first:");
    console.log("  supabase/add_language_rules_call_type.sql");
    process.exit(1);
  }
}

run();

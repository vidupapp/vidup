// ── Interfaces ────────────────────────────────────────────────

export interface AnalysisResult {
  // existing
  title_patterns: string[];
  emotional_triggers: string[];
  content_gaps: string[];
  audience_level: string;
  niche_language: string[];
  thumbnail_patterns: string[];
  hook_style: string;
  what_is_working: string;
  // new
  title_formula: string[];
  performance_ratio: string[];
  dominant_trigger: string;
  content_gap_specific: string;
  thumbnail_formula: string;
  best_performing_title: string;
}

export interface TitleItem {
  text: string;
  type: string;
  why: string;
  click_score: number;
}

export interface HookItem {
  opening_line: string;
  tension_builder: string;
  payoff_promise: string;
  full_script: string;
  psychological_trigger: string;
}

export interface ThumbnailItem {
  layout: string;
  face_emotion?: string;
  emotion?: string;           // backward compat with old packs
  text_overlay: string;
  color_mood: string;
  why_it_works?: string;
  why?: string;               // backward compat with old packs
  canva_url?: string;
}

export interface PackResult {
  titles: TitleItem[];
  hook: HookItem;
  thumbnails: ThumbnailItem[];
}

export interface ChannelContext {
  channel_name: string;
  subscriber_count: number;
  avg_views: number;
  content_category: string | null;
  target_audience: string | string[];
  upload_frequency: string;
  recent_video_titles: string[];
}

// ── Utilities ─────────────────────────────────────────────────

export function extractJSON(raw: string): string {
  return raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function formatAudience(raw: string | string[]): string {
  if (Array.isArray(raw)) return raw.join(", ");
  return raw;
}

// ── Language rules per language ───────────────────────────────

const LANGUAGE_RULES: Record<string, string> = {
  Hindi: `HINDI LANGUAGE RULES (STRICT):

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

  Marathi: `MARATHI LANGUAGE RULES (non-negotiable):

You are writing for a Marathi YouTube creator. Conversational Pune/Mumbai Marathi.

→ CRITICAL: NEVER mix Hindi words into Marathi. This is the #1 failure mode.
   मला (Marathi) ≠ मुझे (Hindi)
   कसं (Marathi) ≠ कैसे (Hindi)
   काय (Marathi) ≠ क्या (Hindi)
   नाही (Marathi) ≠ नहीं (Hindi)
   आहे (Marathi) ≠ है (Hindi)
→ Mix Marathi and English naturally. Think like a creator from Pune/Nashik/Mumbai.
→ NEVER use Hindi words. Marathi and Hindi are different languages.
→ English words that always stay in English: save, invest, tips, results, mistake, challenge, business, income, salary, budget, plan, secret, hack, score, trending, viral, growth, subscriber, content, channel, niche

✅ Correct Marathlish style:
"हि चूक करू नका | YouTube Growth Tips"
"Student असताना ₹50,000 कसे save करायचे?"
"माझ्या channel ला 1 lakh subscribers कसे मिळाले"
"कोणी सांगत नाही हे secret | Income tips"

❌ WRONG — Hindi words leaked in:
"यह गलती मत करो" (Hindi, not Marathi)
"मुझे यह अच्छा लगा" (Hindi)
"कैसे करें" (Hindi verb form)

Grammar rules:
→ Use conversational verb forms: कर / करा (casual), सांग / सांगा (casual)
→ Key markers: मी (I), तुम्ही (you), आहे (is), नाही (no), कसं (how), काय (what)
→ FINAL CHECK: Zero Hindi words. Would a Pune creator say this? Grammar correct?`,

  Tamil: `TAMIL LANGUAGE RULES (STRICT):

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

  Telugu: `TELUGU LANGUAGE RULES (STRICT):

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

  Kannada: `KANNADA LANGUAGE RULES (STRICT):

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
✅ "ಶುರು ಮಾಡೋಣ" (not शुरू)
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

  Bengali: `BENGALI LANGUAGE RULES (STRICT):

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

  Gujarati: `GUJARATI LANGUAGE RULES (STRICT):

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

  Malayalam: `MALAYALAM LANGUAGE RULES (STRICT):

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

  Punjabi: `PUNJABI LANGUAGE RULES (STRICT):

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

  English: `ENGLISH LANGUAGE RULES (STRICT):

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
};

// ── Template interpolation (used when prompts are fetched from Supabase) ──

export function interpolateAnalysis(template: string, videosJson: string): string {
  return template.replace(/\{\{VIDEOS_JSON\}\}/g, videosJson);
}

export function interpolateGeneration(
  template: string,
  topic: string,
  style: string,
  language: string,
  analysis: AnalysisResult,
  channel?: ChannelContext,
  languageRules?: string
): string {
  const resolvedRules = languageRules ??
    LANGUAGE_RULES[language] ??
    `LANGUAGE: Write in ${language}. Natural, conversational, creator-native style. No formal or academic language.`;

  const category = channel?.content_category ?? "general";
  const audienceStr = channel ? formatAudience(channel.target_audience) : "general audience";
  const calibration = channel
    ? `a ${formatCount(channel.subscriber_count)} subscriber channel`
    : "this creator's level";

  const channelSection = channel ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CREATOR'S CHANNEL — calibrate EVERYTHING to this creator:
Channel: ${channel.channel_name}
Subscribers: ${formatCount(channel.subscriber_count)}
Avg Views (recent 10 videos): ${formatCount(channel.avg_views)}
Content Category: ${channel.content_category ?? "Not specified"}
Target Audience: ${audienceStr}
Upload Frequency: ${channel.upload_frequency}

Study these recent video titles from this creator carefully:
${channel.recent_video_titles.slice(0, 5).map((t, i) => `  ${i + 1}. ${t}`).join("\n")}

Your output must feel like the natural NEXT VIDEO from this channel. Match:
→ The energy and tone of their existing titles
→ The vocabulary level of their audience
→ Content depth appropriate for ${formatCount(channel.subscriber_count)} subscribers
→ The style their ${formatCount(channel.avg_views)} average-view audience responds to

CRITICAL: Do NOT produce titles that sound bigger, more polished, or more viral than this creator's current content. A 10K channel sounds different from a 1M channel. Authenticity beats aspiration.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
` : "";

  return template
    .replace(/\{\{TOPIC\}\}/g, topic)
    .replace(/\{\{STYLE\}\}/g, style)
    .replace(/\{\{LANGUAGE\}\}/g, language)
    .replace(/\{\{CATEGORY\}\}/g, category)
    .replace(/\{\{CHANNEL_SECTION\}\}/g, channelSection)
    .replace(/\{\{LANGUAGE_RULES\}\}/g, resolvedRules)
    .replace(/\{\{ANALYSIS_JSON\}\}/g, JSON.stringify(analysis, null, 2))
    .replace(/\{\{DOMINANT_TRIGGER\}\}/g, analysis.dominant_trigger ?? "Curiosity")
    .replace(/\{\{CHANNEL_CALIBRATION\}\}/g, calibration);
}

// ── Call 1: Analysis Prompt ───────────────────────────────────

export function buildAnalysisPrompt(videosJson: string): string {
  return `You are a YouTube growth strategist who has studied 10,000 viral videos. Analyze these 3 competitor videos with surgical precision.

Videos data:
${videosJson}

Extract the following and return ONLY a valid JSON object — no explanation, no markdown:

{
  "title_patterns": ["patterns found across titles — structure, length, word choice"],
  "emotional_triggers": ["specific emotions or psychological hooks used"],
  "content_gaps": ["topics these videos don't cover that a new video could exploit"],
  "audience_level": "beginner or intermediate or advanced",
  "niche_language": ["specific words, phrases, or terminology this niche uses"],
  "thumbnail_patterns": ["visual or text patterns based on titles and context"],
  "hook_style": "one sentence describing how these videos typically open",
  "what_is_working": "1-2 sentence summary of what makes these videos perform",
  "title_formula": ["for each video, identify the formula: Number list / Question / How-to / Story / Contrarian / Curiosity gap / Personal story — one entry per video"],
  "performance_ratio": ["for each video: views ÷ channel_subscriber_count — label as overperforming (>0.3) / average (0.1-0.3) / underperforming (<0.1) — if subscriber count unavailable, write 'data unavailable'"],
  "dominant_trigger": "single strongest emotional trigger across all 3 videos — choose ONE: Fear / Curiosity / Aspiration / FOMO / Validation / Shock / Inspiration",
  "content_gap_specific": "complete this sentence precisely: 'None of these videos cover [specific angle] for [specific audience type]' — be precise, not generic",
  "thumbnail_formula": "identify the dominant visual formula across these videos — choose ONE: Face with reaction / Text only / Before and after / Number overlay / Comparison / Shocking image + text",
  "best_performing_title": "which of the 3 titles is strongest AND exactly why in one sentence — be specific about the psychological mechanism"
}`;
}

// Exported so the generate route can use it as a fallback
export { LANGUAGE_RULES };

// ── Call 2: Generation Prompt ─────────────────────────────────

export function buildGenerationPrompt(
  topic: string,
  style: string,
  language: string,
  analysis: AnalysisResult,
  channel?: ChannelContext,
  languageRules?: string
): string {
  const resolvedRules = languageRules ??
    LANGUAGE_RULES[language] ??
    `LANGUAGE: Write in ${language}. Natural, conversational, creator-native style. No formal or academic language.`;


  const category = channel?.content_category ?? "general";
  const audienceStr = channel ? formatAudience(channel.target_audience) : "general audience";

  const channelSection = channel ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CREATOR'S CHANNEL — calibrate EVERYTHING to this creator:
Channel: ${channel.channel_name}
Subscribers: ${formatCount(channel.subscriber_count)}
Avg Views (recent 10 videos): ${formatCount(channel.avg_views)}
Content Category: ${channel.content_category ?? "Not specified"}
Target Audience: ${audienceStr}
Upload Frequency: ${channel.upload_frequency}

Study these recent video titles from this creator carefully:
${channel.recent_video_titles.slice(0, 5).map((t, i) => `  ${i + 1}. ${t}`).join("\n")}

Your output must feel like the natural NEXT VIDEO from this channel. Match:
→ The energy and tone of their existing titles
→ The vocabulary level of their audience
→ Content depth appropriate for ${formatCount(channel.subscriber_count)} subscribers
→ The style their ${formatCount(channel.avg_views)} average-view audience responds to

CRITICAL: Do NOT produce titles that sound bigger, more polished, or more viral than this creator's current content. A 10K channel sounds different from a 1M channel. Authenticity beats aspiration.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
` : "";

  return `You are a YouTube content strategist who has grown 50 channels past 100K subscribers. You specialize in ${language} content for ${category} creators. You know exactly what makes a ${language}-speaking audience click and watch.

TOPIC: ${topic}
VIDEO STYLE: ${style}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT LANGUAGE: ${language} — NON-NEGOTIABLE
Every word of output — titles, hook script, thumbnail text overlays — MUST be in ${language}.
Competitor videos may be in any language. Extract PATTERNS only, not their language.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${channelSection}
${resolvedRules}

COMPETITOR ANALYSIS — use these patterns to calibrate output (language is still ${language}):
${JSON.stringify(analysis, null, 2)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TITLE QUALITY TEST — every title must pass ALL of these:
→ Is it specific? (no vague words like "amazing", "best", "ultimate")
→ Does it create genuine curiosity OR promise a clear, specific benefit?
→ Would a real ${language} creator in this niche actually publish this?
→ Is it under 70 characters?
→ Does it use the dominant trigger identified: "${analysis.dominant_trigger}"?
If any title fails these — rewrite it before returning.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HOOK SCRIPT — write actual spoken words, not an outline:
The hook must NOT start with:
❌ "In this video..."
❌ "Today we are going to..."
❌ "Welcome back..."
❌ "Hi everyone..."

The hook MUST start with one of:
✅ A shocking statement or specific fact
✅ A specific number
✅ A direct provocative question
✅ A personal story moment in mid-action

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STRICT RULES:
→ "titles" array: EXACTLY 3 items
→ "thumbnails" array: EXACTLY 3 items
→ thumbnail text_overlay: maximum 3 words, in ${language}
→ Return ONLY valid JSON. No explanation, no markdown.

Generate the JSON now:
{
  "titles": [
    {
      "text": "title in ${language}",
      "type": "Curiosity Gap",
      "why": "specific psychological reason this title gets clicks",
      "click_score": 8
    },
    {
      "text": "title in ${language}",
      "type": "Emotional Trigger",
      "why": "specific psychological reason this title gets clicks",
      "click_score": 8
    },
    {
      "text": "title in ${language}",
      "type": "SEO Optimised",
      "why": "specific psychological reason this title gets clicks",
      "click_score": 7
    }
  ],
  "hook": {
    "opening_line": "first 1-2 sentences — max 15 words — immediate tension or curiosity — in ${language}",
    "tension_builder": "2-3 sentences expanding the tension, making viewer need to know more — in ${language}",
    "payoff_promise": "1 sentence telling viewer exactly what they will learn or get — in ${language}",
    "full_script": "complete 30-45 second hook as one flowing spoken script, paste-ready, in ${language}",
    "psychological_trigger": "name of the main trigger e.g. Curiosity Gap, Fear of Missing Out, Social Proof, Aspiration"
  },
  "thumbnails": [
    {
      "layout": "one line — visual arrangement e.g. 'Face left, bold text right' or 'Full face reaction, text overlay bottom third'",
      "face_emotion": "exact emotion if person shown: shocked / proud / confused / excited / curious / disappointed — or 'No face needed'",
      "text_overlay": "max 3 words in ${language} — the actual bold text on the thumbnail",
      "color_mood": "2-3 specific colors and why — e.g. 'Red + white — urgency and clarity against dark background'",
      "why_it_works": "one sentence psychological reason this thumbnail drives clicks",
      "canva_url": "https://www.canva.com/search/templates?q=[3-4 word search like 'youtube thumbnail shocked face' URL encoded]"
    },
    {
      "layout": "one line visual arrangement",
      "face_emotion": "exact emotion or 'No face needed'",
      "text_overlay": "max 3 words in ${language}",
      "color_mood": "specific colors and why",
      "why_it_works": "one sentence psychological reason",
      "canva_url": "https://www.canva.com/search/templates?q=[URL encoded search term]"
    },
    {
      "layout": "one line visual arrangement",
      "face_emotion": "exact emotion or 'No face needed'",
      "text_overlay": "max 3 words in ${language}",
      "color_mood": "specific colors and why",
      "why_it_works": "one sentence psychological reason",
      "canva_url": "https://www.canva.com/search/templates?q=[URL encoded search term]"
    }
  ]
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUALITY GATE — before returning JSON, check:
→ Do all titles sound like they are from a real ${language} YouTube creator?
→ Is the hook genuinely compelling, or does it sound generic?
→ Are all thumbnail text overlays in ${language} and max 3 words?
→ Does everything feel calibrated to ${channel ? `a ${formatCount(channel.subscriber_count)} subscriber channel` : "this creator's level"}?
→ Would a top ${language} creator be proud to use any of this output?

If anything feels generic, templated, or like something ChatGPT would produce — rewrite it before returning.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
}

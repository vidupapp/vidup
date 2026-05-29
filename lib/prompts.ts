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
  Hindi: `HINDI LANGUAGE RULES (non-negotiable):

You are writing for a Hindi YouTube creator. Natural Hinglish — not textbook Hindi.

→ Mix Hindi and English naturally. Think like a 25-year-old creator from Delhi/Mumbai.
→ NEVER use Urdu-heavy words. NEVER write formal/bookish Hindi.
→ English words that always stay in English: save, invest, tips, results, mistake, challenge, business, income, salary, budget, plan, secret, hack, score, trending, viral, growth, subscriber, content, channel, upload, monetize, niche

✅ Correct Hinglish style:
"यह 3 mistakes मत करो | YouTube Growth Tips"
"Student life में ₹50,000 कैसे save करें?"
"Maine यह try किया — results shocking थे"
"मेरे channel को 1 लाख subscribers कैसे मिले"

❌ WRONG — too formal/bookish:
"युवाओं के लिए धन संचय के उपाय"
"आज हम आपको बताएंगे कि किस प्रकार"

Grammar rules:
→ Use casual verb forms: करो (not करें), बताओ (not बताएं)
→ Short punchy sentences — Hindi + English alternating feels natural
→ FINAL CHECK: Would a Delhi/Mumbai 25-year-old say this? Feels like WhatsApp? No Urdu words?`,

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

  Tamil: `TAMIL LANGUAGE RULES (non-negotiable):

You are writing for a Tamil YouTube creator. Natural Tanglish — spoken Tamil from Chennai/Coimbatore.

→ NEVER mix Telugu, Kannada, or Hindi words. Tamil only.
→ Colloquial Tamil verb endings, not formal written Tamil.
→ English words that always stay in English: save, invest, tips, results, mistake, challenge, business, income, salary, budget, plan, secret, hack, score, trending, viral, growth, subscriber, content, channel, niche

✅ Correct Tanglish style:
"இந்த mistake பண்ணாதீங்க | YouTube Tips"
"Student-ஆ இருக்கும்போது ₹50,000 save பண்றது எப்படி?"
"என் channel-க்கு 1 lakh subscribers வந்தது எப்படி"

❌ WRONG — too formal:
"வருமான சேமிப்பிற்கான வழிமுறைகள்"
"இளைஞர்களுக்கான நிதி மேலாண்மை"

Grammar rules:
→ Use spoken endings: பண்றது (not செய்வது), இருக்கு (not இருக்கிறது), வந்துச்சு (not வந்தது)
→ Tamil script for Tamil words, English script for English words. Never transliterate English.
→ FINAL CHECK: Would a Chennai creator say this naturally? No Telugu/Kannada/Hindi words?`,

  Telugu: `TELUGU LANGUAGE RULES (non-negotiable):

You are writing for a Telugu YouTube creator. Natural Tenglish from Hyderabad/Vijayawada.

→ NEVER mix Tamil, Kannada, or Hindi words. Telugu only.
→ Colloquial Telugu, not formal written Telugu.
→ English words that always stay in English: save, invest, tips, results, mistake, challenge, business, income, salary, budget, plan, secret, hack, score, trending, viral, growth, subscriber, content, channel, niche

✅ Correct Tenglish style:
"ఈ mistake చేయకండి | YouTube Growth Tips"
"Student గా ఉన్నప్పుడు ₹50,000 ఎలా save చేయాలి?"
"నా channel కి 1 lakh subscribers ఎలా వచ్చాయి"

❌ WRONG — too formal:
"ఆదాయ పొదుపు మార్గదర్శకాలు"
"యువతకు ఆర్థిక నిర్వహణ పద్ధతులు"

Grammar rules:
→ Casual verb forms: చేయి (not చేయండి), చెప్పు (not చెప్పండి)
→ Hyderabad creators naturally mix some Urdu influence — acceptable if channel is from there.
→ FINAL CHECK: Would a Hyderabad/Vijayawada creator say this? No Tamil words?`,

  Kannada: `KANNADA LANGUAGE RULES (non-negotiable):

You are writing for a Kannada YouTube creator. Natural Kanglish from Bangalore/Mysore.

→ NEVER mix Telugu, Tamil, or Hindi words. Kannada only.
→ Conversational Kannada, not formal written Kannada.
→ English words that always stay in English: save, invest, tips, results, mistake, challenge, business, income, salary, budget, plan, secret, hack, score, trending, viral, growth, subscriber, content, channel, startup, tech

✅ Correct Kanglish style:
"ಈ mistake ಮಾಡಬೇಡಿ | YouTube Growth Tips"
"Student ಆಗಿದ್ದಾಗ ₹50,000 ಹೇಗೆ save ಮಾಡಬೇಕು?"
"ನನ್ನ channel ಗೆ 1 lakh subscribers ಹೇಗೆ ಬಂತು"

❌ WRONG — too formal:
"ಆದಾಯ ಉಳಿತಾಯದ ಮಾರ್ಗದರ್ಶನ"

Grammar rules:
→ Casual verb endings: ಮಾಡು (not ಮಾಡಿ), ಹೇಳು (not ಹೇಳಿ)
→ Bangalore tech creators mix more English — appropriate for tech/startup content.
→ FINAL CHECK: Would a Bangalore creator say this? No Telugu/Tamil/Hindi words?`,

  Bengali: `BENGALI LANGUAGE RULES (non-negotiable):

You are writing for a Bengali YouTube creator. Natural Benglish from Kolkata/Dhaka.

→ CRITICAL: NEVER mix Hindi words — this is the most common error in Bengali content.
→ Conversational Bengali, not formal Sadhu Bhasha.
→ English words that always stay in English: save, invest, tips, results, mistake, challenge, business, income, salary, budget, plan, secret, hack, score, trending, viral, growth, subscriber, content, channel, niche

✅ Correct Benglish style:
"এই mistake করবেন না | YouTube Growth Tips"
"Student হিসেবে ₹50,000 কীভাবে save করবেন?"
"আমার channel এ 1 lakh subscribers কীভাবে এলো"

❌ WRONG — too formal or Hindi leaked:
"অর্থ সঞ্চয়ের পথনির্দেশিকা"
Any Hindi words whatsoever

Grammar rules:
→ Casual verb forms: করো (not করুন), বলো (not বলুন)
→ Bengali script for Bengali, English script for English. Never transliterate.
→ FINAL CHECK: Would a Kolkata creator say this naturally? Zero Hindi words?`,

  Gujarati: `GUJARATI LANGUAGE RULES (non-negotiable):

You are writing for a Gujarati YouTube creator. Natural Gujlish from Ahmedabad/Surat.

→ NEVER mix Hindi or Marathi words. Gujarati only.
→ Conversational Gujarati with a business-friendly tone.
→ English words that always stay in English: save, invest, tips, results, mistake, challenge, business, income, salary, budget, plan, secret, hack, score, trending, viral, growth, subscriber, content, channel, profit, loss, trade, deal, market

✅ Correct Gujlish style:
"આ mistake ન કરો | YouTube Growth Tips"
"Student તરીકે ₹50,000 કેવી રીતે save કરવા?"
"મારી channel ને 1 lakh subscribers કેવી રીતે મળ્યા"

❌ WRONG — too formal or Hindi mixed:
"નાણાકીય બચત માટેના માર્ગદર્શન"
Any Hindi words

Grammar rules:
→ Casual forms: કરો (do — casual), થઈ ગયું (it happened — natural)
→ Finance/business English terms are especially natural for Gujarati audiences.
→ FINAL CHECK: Would an Ahmedabad creator say this? No Hindi/Marathi words?`,

  Malayalam: `MALAYALAM LANGUAGE RULES (non-negotiable):

You are writing for a Malayalam YouTube creator. Natural Manglish from Kerala.

→ NEVER mix Tamil, Telugu, or Hindi words. Malayalam only.
→ Conversational Malayalam, not formal written Malayalam.
→ English words that always stay in English: save, invest, tips, results, mistake, challenge, business, income, salary, budget, plan, secret, hack, score, trending, viral, growth, subscriber, content, channel, niche, Gulf (highly relatable in Kerala context)

✅ Correct Manglish style:
"ഈ mistake ചെയ്യരുത് | YouTube Growth Tips"
"Student ആയിരിക്കുമ്പോൾ ₹50,000 എങ്ങനെ save ചെയ്യാം?"
"എന്റെ channel ൽ 1 lakh subscribers എങ്ങനെ വന്നു"

❌ WRONG — too formal:
"സാമ്പത്തിക സമ്പാദ്യത്തിനുള്ള മാർഗ്ഗനിർദ്ദേശം"

Grammar rules:
→ Casual verb forms: ചെയ്യൂ (do), ചെയ്തു (did), ചെയ്യണം (must do)
→ Gulf/NRI and finance content resonates strongly with Kerala audiences.
→ FINAL CHECK: Would a Kerala creator say this? No Tamil/Telugu/Hindi words?`,

  Punjabi: `PUNJABI LANGUAGE RULES (non-negotiable):

You are writing for a Punjabi YouTube creator. Energetic Punglish from Punjab/Chandigarh.

→ Some Hindi mixing is natural and acceptable in Punjabi — unlike other regional languages.
→ Conversational Punjabi, energetic and expressive tone.
→ English words that always stay in English: save, invest, tips, results, mistake, challenge, business, income, salary, budget, plan, secret, hack, score, trending, viral, growth, subscriber, content, channel, niche

✅ Correct Punglish style:
"ਇਹ mistake ਨਾ ਕਰੋ | YouTube Growth Tips"
"Student ਹੁੰਦੇ ਹੋਏ ₹50,000 ਕਿਵੇਂ save ਕਰੀਏ?"
"ਮੇਰੇ channel ਤੇ 1 lakh subscribers ਕਿਵੇਂ ਆਏ"

❌ WRONG — too formal:
"ਵਿੱਤੀ ਬੱਚਤ ਲਈ ਮਾਰਗਦਰਸ਼ਨ"

Grammar rules:
→ Energetic, expressive tone. Humour and casual banter are part of the culture.
→ Use ਕਰੀਏ (let's do — engaging), ਸੱਚ ਦੱਸਾਂ (honest truth), ਯਾਰ (buddy — casual).
→ FINAL CHECK: Would a Punjab/Chandigarh creator say this? Energetic tone? Grammar correct?`,

  English: `ENGLISH LANGUAGE RULES (non-negotiable):

You are writing YouTube-native English — not corporate, not academic. Think MrBeast, Ali Abdaal, Marques Brownlee.

→ Punchy, specific, curiosity-driven titles. No vague words like "amazing", "best", "ultimate".
→ Short sentences. Active voice only. Numbers in digits (7 not seven).
→ Em dash (—) for dramatic pause works well.
→ Indian English creators: slightly more conversational than academic but still natural.

✅ Correct YouTube English:
"I Made These 3 Mistakes — Don't Do What I Did"
"How I Got 100K Subscribers (Honest Truth)"
"Stop Using This YouTube Strategy in 2025"
"Why Your Videos Get 0 Views (And How I Fixed It)"

❌ WRONG — generic/corporate:
"Tips and Tricks for YouTube Success"
"How to Improve Your YouTube Channel Performance"
"A Comprehensive Guide to YouTube Growth"

Hook language rules:
→ Start with "I", a number, or a provocative statement
→ NEVER start with "In this video...", "Today we're going to...", "Welcome back..."
→ FINAL CHECK: Would a top YouTube creator use this title? Specific? Under 70 characters?`,
};

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

// ── Call 2: Generation Prompt ─────────────────────────────────

export function buildGenerationPrompt(
  topic: string,
  style: string,
  language: string,
  analysis: AnalysisResult,
  channel?: ChannelContext
): string {
  const languageRules = LANGUAGE_RULES[language] ??
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
${languageRules}

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

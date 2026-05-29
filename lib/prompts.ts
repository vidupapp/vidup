export interface AnalysisResult {
  title_patterns: string[];
  emotional_triggers: string[];
  content_gaps: string[];
  audience_level: string;
  niche_language: string[];
  thumbnail_patterns: string[];
  hook_style: string;
  what_is_working: string;
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
  emotion: string;
  text_overlay: string;
  color_mood: string;
  why: string;
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
  content_category: string;
  target_audience: string;
  upload_frequency: string;
  recent_video_titles: string[];
}

// Strip markdown code fences Claude sometimes wraps JSON in
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

export function buildAnalysisPrompt(videosJson: string): string {
  return `You are a YouTube content analyst. Analyze these competitor videos and extract patterns that make them successful.

Videos data:
${videosJson}

Return ONLY a valid JSON object with exactly these fields — no explanation, no markdown:
{
  "title_patterns": ["array of patterns found in titles"],
  "emotional_triggers": ["emotions or psychological hooks used"],
  "content_gaps": ["topics or angles these videos don't cover that a new video could exploit"],
  "audience_level": "beginner or intermediate or advanced",
  "niche_language": ["specific words, phrases, or terminology this niche uses"],
  "thumbnail_patterns": ["visual or text patterns in thumbnails based on titles"],
  "hook_style": "one sentence describing how these videos typically open",
  "what_is_working": "1-2 sentence summary of what makes these videos perform"
}`;
}

export function buildGenerationPrompt(
  topic: string,
  style: string,
  language: string,
  analysis: AnalysisResult,
  channel?: ChannelContext
): string {
  const indianLanguages = [
    "Hindi", "Marathi", "Tamil", "Telugu", "Kannada",
    "Bengali", "Gujarati", "Malayalam", "Punjabi",
  ];
  const isIndian = indianLanguages.includes(language);

  const languageRules = isIndian
    ? `
LANGUAGE AUTHENTICITY RULES — ${language.toUpperCase()}:
→ Never use formal or bookish vocabulary
→ Use natural code-switching — mix English words the way creators actually speak
→ These English words always stay in English: save, invest, business, tips, results, secret, hack, mistake, challenge, score, job, salary, budget, plan, fail, win, strategy, content, growth
→ Use ${language} for emotions, connectors, and storytelling words
→ Think like a 25-year-old creator from a major city — NOT a textbook or news anchor
→ Titles must feel like a WhatsApp message, not a newspaper headline
→ Hook script must be natural spoken ${language} with English words mixed in naturally
→ Test: would a real creator say this out loud to camera? If not — rewrite it`
    : `LANGUAGE: Write in punchy, creator-style English. No corporate language. Sound like a real person talking to their audience.`;

  const channelSection = channel
    ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CREATOR'S CHANNEL CONTEXT — calibrate everything to this creator:
Channel: ${channel.channel_name}
Subscribers: ${formatCount(channel.subscriber_count)}
Avg Views (recent): ${formatCount(channel.avg_views)}
Content Category: ${channel.content_category}
Target Audience: ${channel.target_audience}
Upload Frequency: ${channel.upload_frequency}
Recent Video Titles: ${channel.recent_video_titles.slice(0, 5).join(" | ")}

Use this to:
→ Match the vocabulary and energy of their existing content
→ Set click score expectations appropriate for this channel size
→ Titles and hooks should feel like a natural next video for THIS creator
→ Don't overreach — a 10K channel sounds different from a 1M channel
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`
    : "";

  return `You are a YouTube content strategist. Generate a complete pre-production pack for a creator.

TOPIC: ${topic}
VIDEO STYLE: ${style}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT LANGUAGE: ${language}
This is NON-NEGOTIABLE. Every single word of output — titles, hook script,
thumbnail text overlays — MUST be in ${language}.
The competitor videos may be in Hindi, English, or any other language.
That does NOT matter. You are extracting PATTERNS only (structure, triggers,
hooks), NOT copying their language.
Do NOT output anything in Hindi, English, or any language other than ${language}
unless it falls under the code-switching rules below.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${channelSection}
${languageRules}

COMPETITOR ANALYSIS (patterns to calibrate — language of output is still ${language}):
${JSON.stringify(analysis, null, 2)}

STRICT RULES:
→ OUTPUT LANGUAGE IS ${language}. Not Hindi. Not English. ${language}.
→ The "titles" array must contain EXACTLY 3 items. Not 4, not 5. Exactly 3.
→ The "thumbnails" array must contain EXACTLY 3 items.
→ Return ONLY valid JSON. No explanation, no markdown, no extra text before or after.

Generate the JSON object now:
{
  "titles": [
    {
      "text": "title in ${language}",
      "type": "Curiosity Gap",
      "why": "one line — why this title will get clicks",
      "click_score": 8
    },
    {
      "text": "title in ${language}",
      "type": "Emotional Trigger",
      "why": "one line — why this title will get clicks",
      "click_score": 8
    },
    {
      "text": "title in ${language}",
      "type": "SEO Optimised",
      "why": "one line — why this title will get clicks",
      "click_score": 7
    }
  ],
  "hook": {
    "opening_line": "first 1-2 sentences that immediately stop the scroll — in ${language}",
    "tension_builder": "3-4 sentences that build curiosity and keep them watching — in ${language}",
    "payoff_promise": "clear statement of what they will learn or get — in ${language}",
    "full_script": "complete 30-45 second hook script, paste-ready, in ${language}",
    "psychological_trigger": "name of the main trigger used e.g. Curiosity Gap, Fear of Missing Out, Social Proof"
  },
  "thumbnails": [
    {
      "layout": "detailed visual layout — what is shown, where, how",
      "emotion": "emotion shown on face if a person appears",
      "text_overlay": "max 3 words in ${language}",
      "color_mood": "specific colors and why they work for this niche",
      "why": "psychological reason this thumbnail will get clicked"
    },
    {
      "layout": "detailed visual layout — what is shown, where, how",
      "emotion": "emotion shown on face if a person appears",
      "text_overlay": "max 3 words in ${language}",
      "color_mood": "specific colors and why they work for this niche",
      "why": "psychological reason this thumbnail will get clicked"
    },
    {
      "layout": "detailed visual layout — what is shown, where, how",
      "emotion": "emotion shown on face if a person appears",
      "text_overlay": "max 3 words in ${language}",
      "color_mood": "specific colors and why they work for this niche",
      "why": "psychological reason this thumbnail will get clicked"
    }
  ]
}`;
}

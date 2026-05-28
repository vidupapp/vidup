# VIDUP — Complete Project Context
> Read this file at the start of every session before writing any code.
> Update this file at the end of every session with what was built and any new decisions made.

---

## What Is VidUp

VidUp is a web-based SaaS tool for YouTube creators that generates a complete pre-production pack in one click — 3 title options, 1 hook script, and 3 thumbnail ideas — based on real competitor video analysis.

The tool gets smarter over time by collecting performance data (views, CTR, AVD) from creators after 30 days and using it to improve future generations for all users anonymously.

**Tagline:** One click. Viral ready.

**Live Domain:** vidup.in
**Staging URL:** vidup-git-staging-vidup-s-projects.vercel.app
**GitHub:** github.com/vidupapp/vidup

---

## Core Problem Being Solved

YouTube creators waste hours before filming — stuck on what to title the video, how to open it, and what the thumbnail should look like. These three things determine 80% of a video's success. Most creators either guess or copy — both hurt growth.

---

## Target Audience

- YouTube creators globally
- Primary focus: growing creators (10K–100K subscribers)
- Indian market first, then global
- Not limited to any language or region

---

## The Generation Form (User Input)

Four fields:

1. **Video Topic** — 1-2 lines describing what the video is about
2. **Video Style** — dropdown: Educational / Story / Opinion / Entertainment
3. **Language** — dropdown (10 options, listed below)
4. **Three Competitor YouTube Links** — URLs of similar videos

### Supported Languages
- Hindi
- Marathi
- Tamil
- Telugu
- Kannada
- Bengali
- Gujarati
- Malayalam
- Punjabi
- English

**Language Rule:** Output language auto-matches selected language. Analysis, titles, hook script, and thumbnail text all generated in the creator's chosen language. For Indian languages, use natural code-switching (Hinglish style) — never formal/bookish language.

**Important:** Competitor videos can be in any language (e.g. user selects Marathi but pastes Hindi links). The competitor analysis is for PATTERN extraction only — the output language is always the selected language, not the language of the competitor videos. This is enforced with a hard rule at the top of the generation prompt.

---

## The Output (One Credit = One Pack)

### Titles (3 options)
Each title includes:
- Title text in selected language
- Type label (Curiosity Gap / Emotional Trigger / SEO Optimised / Story / Controversial)
- Why it works (1 line explanation)
- Click score (out of 10)

### Hook Script (1 option)
- Opening line (must stop scroll)
- Tension builder (3-4 sentences)
- Payoff promise (what viewer will get)
- Full script (30-45 seconds, paste-ready)
- Psychological trigger used

### Thumbnail Concepts (3 options)
Each concept includes:
- Visual layout description
- Emotion on face (if person shown)
- Text overlay (max 3 words)
- Color mood (specific colors and why)
- Why it works (psychological reason)
- Specific enough to execute on Canva without guesswork

---

## AI Architecture — 2 API Calls Per Generation

### Call 1 — Analysis (YouTube competitor data)
**Model:** claude-haiku-4-5-20251001
**Input:** Metadata from 3 YouTube links (title, views, description, like count, comment count, publish date, channel name)
**Output:** JSON object containing:
```json
{
  "title_patterns": [],
  "emotional_triggers": [],
  "content_gaps": [],
  "audience_level": "",
  "niche_language": [],
  "thumbnail_patterns": [],
  "hook_style": "",
  "what_is_working": ""
}
```

### Call 2 — Generation
**Model:** claude-haiku-4-5-20251001
**Input:** Topic + style + language + analysis JSON
**Output:** Full pack JSON (titles + hook + thumbnails)

### Critical Language Rules (in prompt)
```
Hard rule at top of generation prompt:
OUTPUT LANGUAGE: [language] — NON-NEGOTIABLE
Competitor videos may be in any language — patterns only, never copy their language.
All output must be in the selected language.

LANGUAGE AUTHENTICITY RULES FOR INDIAN LANGUAGES:
→ Never use formal/bookish vocabulary
→ Use natural code-switching — mix English words the way creators actually speak
→ English words always kept in English: save, invest, business, tips, results,
   secret, hack, mistake, challenge, score, job, salary, budget, plan, fail, win
→ Regional words for emotions and connecting language
→ Think like a 25 year old creator from Mumbai/Pune, not a Hindi textbook
→ Titles should feel like WhatsApp messages, not newspaper headlines
→ Test: would a real creator say this out loud? If not — rewrite it
```

### Prompt Storage
Prompts are currently hardcoded in `lib/prompts.ts` (not yet in Supabase). The functions are `buildAnalysisPrompt()` and `buildGenerationPrompt()`. Moving to Supabase-stored prompts is a future task — the architecture supports it.

### API Safety
- Title count enforced at prompt level AND sliced to 3 in the API route as a hard safety net
- Thumbnail count enforced the same way

---

## The Learning Engine

### How It Works
Every generation and result is stored. After 30 days:
- User pastes their live YouTube video link
- YouTube Data API automatically pulls: views, CTR, average view duration, like count, comment count
- Data stored against the original pack
- Feeds two layers:

**Layer 1 — User Personal Layer**
- Their own history of what works
- After 5+ results: personalized insights appear on dashboard
- Example: "In your niche, opinion-style titles average 2x higher CTR than list titles"

**Layer 2 — Global Anonymous Layer**
- Aggregated across all users
- No personal data visible to anyone
- Feeds back into generation engine
- Improves output for everyone silently

### 30-Day Result Collection Flow
- 30 days after pack generation → status tag changes color on history card (visual nudge only, no email)
- Banner appears on pack card: "Your video should be live by now. Paste your YouTube link to see how it performed."
- User pastes YouTube link → API pulls all data automatically
- User sees performance snapshot vs similar videos in niche
- Status updates to "Results In"

**Not yet built — Month 3 item.**

---

## Credit System

| Tier | Price | Credits | Notes |
|---|---|---|---|
| Free | ₹0 | 2 credits/month | Resets on signup anniversary date, does NOT carry forward |
| Starter | ₹79 | 25 credits | One-time purchase, never expires |
| Creator | ₹149 | 55 credits | One-time purchase, never expires |
| Pro | ₹299 | 120 credits | One-time purchase, never expires |

**1 credit = 1 full pack (3 titles + 1 hook + 3 thumbnail ideas)**

### Credit Rules
- Free credits reset monthly on signup anniversary date (per-user, not global reset)
- Purchased credits never expire
- Credits stack if multiple packs purchased
- Referral credits never expire

### Referral Program
- Every user gets a unique referral link on dashboard
- Reward triggers ONLY on first purchase (not signup)
- Referrer gets 5 credits when friend buys any paid pack
- Friend gets 5 credits added to their account
- Total cost per referral = 10 credits = ~₹15 at Haiku API rates
- Still profitable on every referred sale

**Not yet built — Month 3 item.**

---

## Unit Economics

| | Cost | Notes |
|---|---|---|
| Claude Haiku per generation | ~₹0.59 | 2 API calls total |
| YouTube API per generation | ₹0 | Free tier (10,000 units/day) |
| Cashfree per transaction | 2% | Variable |

| Tier | Revenue/credit | Cost/credit | Margin |
|---|---|---|---|
| Starter ₹79/25cr | ₹3.16 | ₹0.59 | 81% |
| Creator ₹149/55cr | ₹2.71 | ₹0.59 | 78% |
| Pro ₹299/120cr | ₹2.49 | ₹0.59 | 76% |

---

## User Flow

```
1. Sign up → 2 free credits added automatically
2. Click "New Pack" → fill 4-field form → click Generate → 1 credit deducted
3. System: YouTube API pulls competitor metadata → Claude analyzes → Claude generates
4. Output displayed → pack auto-saved to history → status: "Generated"
5. 30 days later → banner on pack card → user pastes YouTube link (NOT YET BUILT)
6. API pulls performance data → stored → status: "Results In" (NOT YET BUILT)
7. When credits run low → Buy Credits → Cashfree → credits added instantly
```

---

## History Dashboard

Every pack ever generated auto-saved. Each card shows:
- Topic (16px / 600 weight)
- Date generated + language tag + style tag
- Status badge: Generated / Video Live / Results In
- Left red border accent (#E8192C)
- Click → goes to /dashboard/pack/[id] for full output

---

## Payment Flow (Cashfree)

1. User visits `/dashboard/credits` → sees 3 pack cards
2. Clicks "Buy [Pack]" → `BuyButton` calls `/api/payment/create-order`
3. Server saves pending transaction (UUID = idempotency key), creates Cashfree order with UUID in `order_note`
4. Cashfree JS SDK opens checkout → user pays
5. Cashfree redirects to `/dashboard/credits/success?order_id=XXX`
6. Server verifies with Cashfree → finds transaction by UUID in `order_note` → marks success → adds credits via admin client
7. `revalidatePath` + `router.refresh()` updates sidebar balance instantly

**Idempotency:** If success page is loaded twice, the transaction status check prevents double-crediting.

---

## Database Structure (Supabase)

### Tables

**USERS**
```
user_id, email, credits_balance, free_credits_used,
signup_date, monthly_reset_date, referral_code,
referred_by, created_at
```

**PACKS**
```
pack_id, user_id, topic, style, language,
links[3], titles[3], hook, thumbnails[3],
created_at, credit_used, status
```

**RESULTS**
```
result_id, pack_id, user_id, youtube_link,
views_30d, ctr, avg_view_duration, like_count,
comment_count, submitted_at
```

**LEARNING_DATA** (aggregated, anonymous)
```
niche, style, language, title_type, avg_ctr,
avg_avd, sample_size, updated_at
```

**PROMPTS**
```
prompt_id, language, call_type (analysis/generation),
prompt_text, version, updated_at
```

**TRANSACTIONS**
```
transaction_id, user_id, pack_type, amount,
credits_added, payment_gateway, status, created_at
```

---

## Key Files (codebase map)

```
app/
  page.tsx                          → Landing page
  layout.tsx                        → Root layout (Inter font)
  globals.css                       → Global styles, animations
  (auth)/
    login/page.tsx                  → Login page
    signup/page.tsx                 → Redirects to login
  (dashboard)/
    layout.tsx                      → Sidebar layout wrapper (fetches credits)
    DashboardSidebar.tsx            → Sidebar client component (active states)
    dashboard/
      page.tsx                      → Dashboard + pack history list
      new/
        page.tsx                    → New Pack page (credit check)
        NewPackForm.tsx             → Generation form + API call + loading overlay
      pack/[id]/
        page.tsx                    → Output page (titles, hook, thumbnails)
        CopyButton.tsx              → Copy to clipboard client component
      credits/
        page.tsx                    → Buy credits (3 pack cards)
        BuyButton.tsx               → Cashfree checkout client component
        CashfreeScript.tsx          → Loads Cashfree SDK once at page level
        success/
          page.tsx                  → Payment verification + credit addition
          SuccessRefresh.tsx        → router.refresh() after 800ms delay
  api/
    generate/route.ts               → Full generation pipeline
    payment/
      create-order/route.ts         → Creates Cashfree order + pending transaction
  components/
    AuthForm.tsx                    → Email/password auth form
lib/
  youtube.ts                        → Video ID extraction + YouTube Data API v3
  prompts.ts                        → Analysis + generation prompt builders
  supabase/
    server.ts                       → Cookie-based server client
    client.ts                       → Browser client
    admin.ts                        → Service role client (bypasses RLS)
    types.ts                        → Generated DB types
```

---

## Tech Stack

| Layer | Tool | Notes |
|---|---|---|
| Frontend | Next.js 16 + Tailwind CSS v4 | App Router, TypeScript, React 19 |
| Database + Auth | Supabase | ap-northeast-1 region |
| AI | Claude Haiku 4.5 (claude-haiku-4-5-20251001) | 2 calls per generation |
| YouTube Data | YouTube Data API v3 | Google Cloud Console |
| Payments | Cashfree | Live, credentials in Vercel env vars |
| Email | Resend | vidup.in domain connected |
| Hosting | Vercel | Hobby plan |
| Version Control | GitHub | github.com/vidupapp/vidup |

---

## Environment Variables (Vercel — all set)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY
YOUTUBE_API_KEY
CASHFREE_APP_ID
CASHFREE_SECRET_KEY
NEXT_PUBLIC_CASHFREE_ENV=production
RESEND_API_KEY
```

---

## Infrastructure Setup

| Service | Status | Details |
|---|---|---|
| Domain | ✅ Live | vidup.in on Hostinger |
| Professional email | ✅ Live | connect@vidup.in on Hostinger |
| GitHub | ✅ Live | github.com/vidupapp |
| Vercel | ✅ Live | Connected to GitHub, auto-deploy |
| Supabase | ✅ Live | Project: vidup, all tables + RLS in place |
| Anthropic Console | ✅ Live | Credits added, key in Vercel |
| Google Cloud | ✅ Live | YouTube Data API v3 enabled |
| Resend | ✅ Live | vidup.in domain connected |
| Cashfree | ✅ Live | Credentials in Vercel env vars |
| VS Code | ✅ Installed | Mac |
| Node.js | ✅ Installed | v24.16.0 |
| Git | ✅ Installed | v2.50.1 |
| Claude Code | ✅ Installed | Terminal app |

---

## Git Workflow

```
Main branch    → production → vidup.in (real users)
Staging branch → preview → vidup-git-staging-vidup-s-projects.vercel.app

Always build on staging.
Only merge to main when tested and ready.
```

### End of Session Command
```
"Update VIDUP_CONTEXT.md with everything built today,
 push to main, go live, bring me back to staging"
```

---

## Development Roadmap

### Month 1 — Core Pipeline ✅ Complete
- [x] Landing page (full premium design — dark hero, stats bar, pricing, footer watermark)
- [x] Authentication (email/password via Supabase)
- [x] Dashboard (sidebar layout, pack history, empty state)
- [x] Generation form (4 fields, YouTube link validation)
- [x] Credit system (free tier enforcement, balance in sidebar)
- [x] Supabase schema setup (all tables, RLS, indexes, auto-create user trigger)

### Month 2 — AI Intelligence ✅ Complete
- [x] YouTube Data API integration (3 link analysis — views, likes, comments, description)
- [x] Claude Haiku Call 1 — competitor analysis → structured JSON
- [x] Claude Haiku Call 2 — pack generation with language rules
- [x] Output display page (titles + hook + thumbnails, copy buttons, left red border)
- [x] Pack auto-save to history
- [x] Cashfree payment integration (create order, verify, idempotent credit add)
- [x] Credit purchase flow (/dashboard/credits with 3 pack cards)

### Month 3 — Learning Engine + Launch ⏳ Next
- [ ] 30-day result collection system (banner on pack card after 30 days)
- [ ] YouTube API result pull (views, CTR, AVD on paste)
- [ ] Learning data aggregation (anonymous, feeds generation)
- [ ] Dashboard insights (after 5+ results: personal performance patterns)
- [ ] Referral program (unique links, 5 credits each side)
- [ ] Landing page SEO (meta, og images, structured data)
- [ ] Move prompts from hardcoded to Supabase table
- [ ] Beta testing with 20 creators
- [ ] Launch

---

## Important Decisions Log

| Decision | Choice | Reason |
|---|---|---|
| Regional vs Global | Global | Larger market, not limited by language |
| Language output | Auto-match selected language | Simplest UX for V1 |
| Subscription vs Credits | Credit packs | Lower commitment barrier for new users |
| Credit expiry | Paid never expire, free resets monthly | Fairness + breakage benefit |
| Free tier | 2 credits/month | Enough to experience, protects margins |
| Result collection | YouTube link paste (not form) | Less friction, API pulls data automatically |
| Result incentive | No credit reward | Value comes from better output, not bribe |
| Referral reward | 5 credits each (referrer + friend) | Both sides happy, cost controlled |
| AI model | Claude Haiku 4.5 | Best Indian language output, 81% margin |
| Prompt storage | Hardcoded in lib/prompts.ts for now | Ship faster; Supabase migration is Month 3 |
| Hindi style | Hinglish (natural code-switching) | How creators actually speak |
| Payment gateway | Cashfree (primary) | Already verified account |
| Staging setup | Separate Vercel preview branch | Professional workflow |
| WordPress | Rejected | Wrong architecture for SaaS |
| Language enforcement | Hard rule at top of generation prompt | Competitor video language was overriding selected language |
| Cashfree SDK loading | Page-level Script, not per-button | Per-button caused onReady to only fire on first instance |
| Credit balance caching | noStore() + revalidatePath + 800ms delay | Three-layer fix needed for reliable instant update |
| Admin client | Service role Supabase client | RLS has no INSERT policy on transactions; admin needed post-payment |
| Customer phone (Cashfree) | Placeholder 9999999999 | Cashfree requires it; collect real number in future |

---

## Competitive Landscape

| Tool | Titles | Hooks | Thumbnails | Price | Link Analysis |
|---|---|---|---|---|---|
| TitleHook | ✅ | ❌ | ❌ | Free (25/day) | ❌ |
| VidIQ | ✅ | ❌ | ✅ | $19–299/mo | ❌ |
| CreatorHooks Pro | ✅ | ✅ | ❌ | Paid | ❌ |
| **VidUp** | ✅ | ✅ | ✅ | ₹79–299 | ✅ 3 links |

**VidUp's unique position:** Only tool that does all three (title + hook + thumbnail) in one generation, calibrated to competitor link analysis, with multilingual Indian language support and a learning engine that improves from real video performance data.

---

## Revenue Projections

| Paid Users | Est. Monthly Revenue | Est. Monthly Cost | Net Profit |
|---|---|---|---|
| 50 | ₹5,450 | ₹2,224 | ₹3,226 |
| 100 | ₹9,900 | ₹3,500 | ₹6,400 |
| 200 | ₹19,800 | ₹5,800 | ₹14,000 |
| 500 | ₹49,500 | ₹11,000 | ₹38,500 |

---

## Google Cloud — Important Reminder
⚠️ After confirming vidup.in is fully stable:
Go to Google Cloud Console → Vidup YT data extractor API key → change Application Restrictions from None to Websites → add vidup.in and *.vidup.in

---

*Last updated: 2026-05-29 — Full product live. Month 1 + Month 2 complete. Generation pipeline, payment flow, history, output page all working. Month 3 (learning engine, referrals, SEO) is next.*

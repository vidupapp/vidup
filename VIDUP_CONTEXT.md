# VIDUP — Complete Project Context
> Read this file at the start of every session before writing any code.
> Update this file at the end of every session with what was built and any new decisions made.

---

## What Is VidUp

VidUp is a web-based SaaS tool for YouTube creators that generates a complete pre-production pack in one click — 3 title options, 1 hook script, and 3 thumbnail ideas — based on real competitor video analysis.

The tool gets smarter over time by silently collecting video performance data from creators after 7 days and using it to improve future generations anonymously.

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

**Language Rule:** Output language auto-matches selected language. For Indian languages, natural code-switching rules are injected per language from `lib/prompts.ts` (LANGUAGE_RULES map). Full rules for all 10 languages live in `VIDUP_LANGUAGE_PROMPTS.md`.

**Important:** Competitor videos can be in any language. The competitor analysis is for PATTERN extraction only — the output language is always the selected language. Enforced with a hard rule at the top of the generation prompt.

---

## The Output (One Credit = One Pack)

### Titles (3 options)
Each title includes:
- Title text in selected language
- Type label (Curiosity Gap / Emotional Trigger / SEO Optimised / Story / Controversial)
- Why it works (1 line)
- Click score (out of 10)

### Hook Script (1 option)
- Opening line (max 15 words, must create immediate tension)
- Tension builder (2-3 sentences)
- Payoff promise (what viewer will get)
- Full script (30-45 seconds, paste-ready)
- Psychological trigger used

Hook must NOT start with: "In this video...", "Today we are going to...", "Welcome back...", "Hi everyone..."
Must start with: shocking statement, specific number, direct question, or personal story moment.

### Thumbnail Concepts (3 options)
Each concept includes:
- Layout (one line visual arrangement)
- Face emotion (exact emotion if person shown, or "No face needed")
- Text overlay (max 3 words in selected language) — displayed as large bold preview on dark background
- Color mood (specific colors + why)
- Why it works (psychological reason)
- Canva URL (search link to closest Canva template) — "Open in Canva" button on output page

---

## AI Architecture — 2 API Calls Per Generation

### Call 1 — Analysis
**Model:** claude-haiku-4-5-20251001
**Max tokens:** 2048
**Role:** "YouTube growth strategist who has studied 10,000 viral videos"
**Input:** Metadata from 3 YouTube links
**Output JSON fields:**
```
title_patterns, emotional_triggers, content_gaps, audience_level,
niche_language, thumbnail_patterns, hook_style, what_is_working,
title_formula, performance_ratio, dominant_trigger,
content_gap_specific, thumbnail_formula, best_performing_title
```

### Call 2 — Generation
**Model:** claude-haiku-4-5-20251001
**Max tokens:** 4096
**Role:** "YouTube content strategist who has grown 50 channels past 100K subscribers. Specialises in [LANGUAGE] content for [CATEGORY] creators."
**Prompt includes:**
- Language-specific rules (full per-language rules for all 10 languages, hardcoded in `lib/prompts.ts`)
- Channel context block (name, subscribers, avg views, category, audience, recent titles)
- Competitor analysis JSON from Call 1
- Title quality gate (5-point test: specific, curiosity/benefit, real creator would use, under 70 chars, uses dominant_trigger)
- Hook "must NOT start with" / "must start with" rules
- Quality gate at end of prompt (self-review before returning)

### Prompt Storage
Hardcoded in `lib/prompts.ts`. Functions: `buildAnalysisPrompt()` and `buildGenerationPrompt()`. Full language rules in `VIDUP_LANGUAGE_PROMPTS.md`. Moving to Supabase-stored prompts is Month 3.

### API Safety
- Title count enforced at prompt level AND sliced to 3 in the API route
- Thumbnail count enforced the same way

---

## Channel System

### How It Works
- User adds up to 2 YouTube channels
- Channel data is auto-fetched from YouTube API on add (no manual dropdowns)
- Channel context is injected into every pack generation
- Selected channel stored in `vidup_channel` httpOnly cookie (1 year)

### Add Channel Form — 2 Fields Only
1. **YouTube Channel URL** — validated in real-time (green/red border)
2. **Target Audience** — multi-select pills, max 3, 10 options with age ranges

Everything else auto-fetched from YouTube:
- Channel name, subscriber count, total videos, avg views
- Content category (from YouTube's `topicDetails.topicCategories` → Wikipedia URL → human-readable name)
- Upload frequency (calculated from publish dates of last 10 videos)
- Avatar URL (channel thumbnail)

### Auto-Refresh
Every visit to `/dashboard/channels` silently refreshes any channel whose `last_fetched_at` is older than 7 days. Fire-and-forget, user never sees it.

### Channel Card
Shows: avatar (48px circle, initial fallback), channel name, content category badge, upload frequency badge, audience pills, stats row (subscribers / avg views / videos), last fetched / added dates.
Actions: Select, Edit (pencil), Delete (trash with confirmation dialog).

### Edit Channel
Only target_audience is editable. Channel URL is locked forever. Everything else auto-refreshes from YouTube.

### Target Audience Options
```
Students (School) — 10-16 years
Students (College) — 17-22 years
Young Professionals — 22-30 years
Working Professionals — 30-45 years
Entrepreneurs — any age
Parents — 28-45 years
Homemakers — 25-50 years
Senior Professionals — 45+
General Audience — all ages
Kids — under 12
```

---

## Learning Engine

### How It Works (7-day flow — LIVE)
1. User generates a pack → status: **Generated**
2. User uploads video → clicks "Help VidUp learn →" on pack page
3. Modal: "Make your next pack smarter" — user pastes YouTube video URL
4. `POST /api/packs/mark-used` saves `video_url`, `video_submitted_at`, flips status to **Video Live**
5. Vercel cron runs daily at 06:00 UTC → `GET /api/fetch-results`
6. Finds packs where: `status = Video Live AND video_submitted_at <= now() - 7 days AND results_fetched_at IS NULL`
7. Fetches YouTube stats (views, likes, comments) for each video
8. Saves to `results` table, updates pack to **Results In**, sets `results_fetched_at`
9. Performance data **never shown to user** — stored internally for learning engine only

### Social Proof Sentences (on pack output page)
Two conditions based on platform total pack count (`total_packs`):

**total_packs < 50 (personal-only messaging):**
- N=0, first pack: "Your first pack is ready — add your video link after uploading and VidUp will make the next one more accurate for you."
- N=0, not first: "Pack generated using your [channel] data — add your video link after uploading so VidUp can learn what works for your audience."
- N=1–4: "Generated using your channel data and [N] of your real videos — your packs are getting more accurate every time."
- N=5–9: "[N] of your videos have trained this pack — VidUp is learning what your [subscribers] [language] audience responds to."
- N=10+: "Built from [N] of your real videos — this pack reflects what your audience actually clicks and watches."

**total_packs >= 50 (blend personal + platform data):**
- N=0, first pack: "Your first pack is ready — generated using patterns from [total]+ packs on VidUp. Add your video link after uploading to make yours even more personalised."
- N=0, not first: "Pack generated using your [channel] data and patterns from [total] packs across VidUp — add your video link after uploading so VidUp can learn what works specifically for your audience."
- N=1–4: "Generated using [N] of your real videos and patterns from [total] packs on VidUp — getting more accurate every time."
- N=5–9: "[N] of your videos have trained this pack alongside [total] packs across VidUp — VidUp knows what your [subscribers] [language] audience responds to."
- N=10+: "Built from [N] of your real videos — this pack reflects what your audience actually clicks and watches."

N = count of results this user has submitted. Fetched in parallel with userPackCount and totalPacks on the server.

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

### Referral Program
- Every user gets a unique referral link on dashboard
- Reward triggers ONLY on first purchase (not signup)
- Referrer gets 5 credits when friend buys any paid pack
- Friend gets 5 credits added to their account

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
2. Add YouTube channel → VidUp fetches all channel data from YouTube API
3. Click "New Pack" → fill 4-field form → click Generate → 1 credit deducted
4. System: YouTube API pulls competitor metadata → Claude Call 1 (analysis) → Claude Call 2 (generation)
5. Output displayed → pack auto-saved to history → status: "Generated"
6. User uploads video → clicks "Help VidUp learn →" → pastes video URL
7. 7 days later → Vercel cron fetches YouTube stats → status: "Results In" (internal only)
8. When credits run low → Buy Credits → Cashfree → credits added instantly
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

1. User opens Buy Credits modal (from credits page or TopBar hover) → sees 3 pack cards
2. Clicks "Buy for ₹XX" → `BuyButton` calls `/api/payment/create-order`
3. Server saves pending transaction (UUID = idempotency key), creates Cashfree order with UUID in `order_note`
4. Cashfree JS SDK opens checkout → user pays
5. Cashfree redirects to `/dashboard/credits/success?order_id=XXX`
6. Server verifies with Cashfree → finds transaction by UUID in `order_note` → marks success → updates `purchased_credits` via admin client → inserts into `credit_transactions`
7. Balance re-fetched fresh from DB (not computed from pre-update values) → displayed on success page
8. `SuccessRefresh` client component calls `router.refresh()` after 800ms → sidebar balance updates

**Idempotency:** If success page is loaded twice, the transaction status check prevents double-crediting.
**Cashfree SDK:** Loaded in `TopBar.tsx` (runs on all dashboard pages) — required since Buy Credits modal can open from anywhere.

---

## Database Structure (Supabase)

### Tables

**USERS**
```
user_id, email,
free_credits (resets monthly, default 2),
purchased_credits (never expires, default 0),
referral_credits (never expires, default 0),
free_credits_reset_date,
onboarding_dismissed,
signup_date, monthly_reset_date, referral_code,
referred_by, created_at
```
Legacy column `credits_balance` still exists in DB but is unused — all code reads/writes the 3 new columns.

**CREDIT_TRANSACTIONS**
```
id, user_id,
type: 'purchase' | 'free_reset' | 'referral' | 'bonus' | 'generation' | 'expired',
credits (positive = added, negative = used),
amount_paid (rupees, 0 for non-purchases),
description, created_at
```
RLS: SELECT + INSERT for own rows. Admin client used for all server-side inserts.
Trigger: `handle_new_user` inserts a `bonus` row (+2) on every new signup.

**PACKS**
```
pack_id, user_id, channel_id (FK → channels),
topic, style, language, links[3], titles[3], hook, thumbnails[3],
created_at, credit_used, status,
video_url, video_submitted_at, results_fetched_at
```
Status values: `Generated` → `Video Live` → `Results In`

**CHANNELS**
```
channel_id, user_id, channel_url, youtube_channel_id,
channel_name, subscriber_count, total_videos, avg_views,
recent_video_titles (jsonb), upload_frequency, content_category,
target_audience (jsonb — string array), avatar_url,
primary_language, last_fetched_at, created_at
```
Max 2 channels per user enforced by DB trigger.

**RESULTS**
```
result_id, pack_id, user_id, youtube_link,
views_30d, ctr, avg_view_duration, like_count,
comment_count, submitted_at
```
CTR and AVD not available via YouTube API — only views, likes, comments populated.
Data internal only — never surfaced to creator.

**LEARNING_DATA** (aggregated, anonymous — not yet built)
```
niche, style, language, title_type, avg_ctr,
avg_avd, sample_size, updated_at
```

**PROMPTS** (not yet used — Month 3)
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
  page.tsx                              → Landing page
  layout.tsx                            → Root layout (Inter font)
  globals.css                           → Global styles, animations
  (auth)/
    login/page.tsx                      → Login page
    signup/page.tsx                     → Redirects to login
  (dashboard)/
    layout.tsx                          → Sidebar layout wrapper (fetches credits + selected channel)
    DashboardSidebar.tsx                → Sidebar client component (Lucide icons, active states)
    BuyCreditsModal.tsx                 → Shared buy credits modal (pack cards, how it works, referral nudge)
                                          Opened from TopBar hover AND credits page button
    dashboard/
      page.tsx                          → Dashboard + pack history list
      new/
        page.tsx                        → New Pack page (credit check, channel check)
        NewPackForm.tsx                 → Generation form + API call + loading overlay
      pack/[id]/
        page.tsx                        → Output page (titles, hook, thumbnails, social proof)
        CopyButton.tsx                  → Copy to clipboard client component
        MarkAsUsedButton.tsx            → "Help VidUp learn" flow (modal + submission states)
      credits/
        page.tsx                        → Credits page (balance card + Buy Credits / Credit History buttons)
        CreditsTabs.tsx                 → Two modal-opening buttons + Credit History modal
        BuyButton.tsx                   → Cashfree checkout client component
        CashfreeScript.tsx              → Loads Cashfree SDK (imported by TopBar, not this page)
        TransactionHistory.tsx          → Pill filters + 10-per-page pagination
        success/
          page.tsx                      → Payment verification + credit addition + credit_transactions insert
          SuccessRefresh.tsx            → router.refresh() after 800ms delay
      channels/
        page.tsx                        → Channel list (silent 7-day auto-refresh)
        ChannelCard.tsx                 → Client component: avatar, edit, delete dialog
        new/
          page.tsx                      → Add channel page
          AddChannelForm.tsx            → 2-field form: URL (live validation) + audience pills
        edit/[id]/
          page.tsx                      → Edit channel page
          EditChannelForm.tsx           → Locked URL + editable audience pills
  api/
    generate/route.ts                   → Full generation pipeline (2 Claude calls)
    payment/
      create-order/route.ts             → Creates Cashfree order + pending transaction
    channels/
      add/route.ts                      → Auth + YouTube fetch + DB insert
      delete/route.ts                   → Delete channel + associated packs
      refresh/route.ts                  → Silent background refresh of channel data
      update/route.ts                   → Update target_audience
    packs/
      mark-used/route.ts                → Save video_url, flip to Video Live
    fetch-results/route.ts              → Daily cron: fetch YouTube stats, flip to Results In
  components/
    AuthForm.tsx                        → Email/password auth form
lib/
  youtube.ts                            → Video + channel data from YouTube Data API v3
                                          Includes: fetchChannelData (topicDetails, uploadFrequency)
  prompts.ts                            → Analysis + generation prompt builders
                                          LANGUAGE_RULES map (all 10 languages, full rules)
  supabase/
    server.ts                           → Cookie-based server client
    client.ts                           → Browser client
    admin.ts                            → Service role client (bypasses RLS)
    types.ts                            → DB types (manually maintained)
vercel.json                             → Cron: GET /api/fetch-results at 06:00 UTC daily
VIDUP_LANGUAGE_PROMPTS.md               → Full per-language prompt rules (reference doc)
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
| Icons | Lucide React | 100% throughout app — no emojis |
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
CRON_SECRET                             → Vercel cron authorization header
```

---

## Infrastructure Setup

| Service | Status | Details |
|---|---|---|
| Domain | ✅ Live | vidup.in on Hostinger |
| Professional email | ✅ Live | connect@vidup.in on Hostinger |
| GitHub | ✅ Live | github.com/vidupapp |
| Vercel | ✅ Live | Connected to GitHub, auto-deploy, cron configured |
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

### Month 2.5 — Channel System + Generation v2 + Learning Engine ✅ Complete (2026-05-30)
- [x] Channel system: add/edit/delete, up to 2 channels per user
- [x] YouTube auto-fetch: category, frequency, avatar, subscriber count, avg views
- [x] Channel context injected into every generation
- [x] Generation pipeline v2: new role, 6 new analysis fields, per-language rules, quality gates
- [x] Thumbnail improvements: face_emotion, why_it_works, Canva URL
- [x] Lucide React icons throughout entire app (no emojis anywhere)
- [x] "Help VidUp learn" flow: 7-day result collection (internal only, never shown to user)
- [x] Vercel cron job: daily fetch-results at 06:00 UTC
- [x] Social proof sentences: 5 states × 2 conditions (personal vs platform blended)

### Credits System Overhaul ✅ Complete (2026-05-30)
- [x] DB migration: users table gains free_credits / purchased_credits / referral_credits / free_credits_reset_date / onboarding_dismissed columns
- [x] credit_transactions table: full history log with type, credits, amount_paid, description; SELECT + INSERT RLS policies
- [x] handle_new_user trigger updated to insert bonus row (+2) on every new signup
- [x] All code migrated from legacy credits_balance to 3-column system
- [x] Credits page renamed to "Credits" in sidebar (was "Buy Credits")
- [x] Credits page: balance card always visible, two buttons open modals (Buy Credits / Credit History)
- [x] BuyCreditsModal: shared component, opens from TopBar hover AND credits page
- [x] TopBar: credits pill converts to hover popover (free / purchased / referral / total + Buy Credits button); credit details removed from profile dropdown
- [x] CashfreeScript moved to TopBar (available on all dashboard pages)
- [x] TransactionHistory: pill filters (All / Added / Used / Purchases / Referrals) + 10-per-page pagination
- [x] Credit pack cards redesigned: large credits number, no tier names, per-credit price, pill buy buttons
- [x] All button arrows (→) removed across entire app
- [x] Bug fixes: void→await on all credit_transactions inserts, success page balance re-fetched fresh from DB, amount_paid stored in rupees not paise, generate route uses admin client for inserts

### Month 3 — Growth + Launch ⏳ Next
- [ ] Learning data aggregation (anonymous, feeds generation engine)
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
| Result collection timing | 7 days (not 30) | Faster feedback loop, more actionable |
| Performance data visibility | Internal only, never shown to creator | Framed as "learning" not "tracking" — less pressure on creator |
| Channel form fields | 2 only (URL + audience) | Everything else auto-fetched from YouTube — less friction |
| YouTube categories | Use YouTube's own as-is | No mapping needed, always accurate |
| Upload frequency | Auto-calculated from last 10 video dates | More accurate than user self-reporting |
| Result incentive | No credit reward | Value comes from better output, not bribe |
| Referral reward | 5 credits each (referrer + friend) | Both sides happy, cost controlled |
| AI model | Claude Haiku 4.5 | Best Indian language output, 81% margin |
| Prompt storage | Hardcoded in lib/prompts.ts for now | Ship faster; Supabase migration is Month 3 |
| Language rules | Full per-language rules in LANGUAGE_RULES map | Prevents Marathi/Hindi leakage, Tamil formality issues etc. |
| Icons | 100% Lucide React, zero emojis | Consistent, professional, scalable |
| Payment gateway | Cashfree (primary) | Already verified account |
| Staging setup | Separate Vercel preview branch | Professional workflow |
| Cashfree SDK loading | Page-level Script, not per-button | Per-button caused onReady to only fire on first instance |
| Credit balance caching | noStore() + router.refresh() + 800ms delay | revalidatePath during render is illegal; client-side router.refresh() is the correct pattern |
| Admin client | Service role Supabase client | Used for all credit_transactions inserts — bypasses RLS, safe for server-side only |
| credit_transactions inserts | Always await, never void | Vercel serverless kills unresolved promises when response is sent |
| Balance display on success | Re-fetch fresh DB row after all writes | Computing from pre-update values is unreliable; fresh fetch is authoritative |
| amount_paid in credit_transactions | Stored in rupees | Cashfree stores order amount in paise; divide by 100 before inserting |
| Buy Credits modal | Shared BuyCreditsModal component | Modal triggered from TopBar hover and credits page — one source of truth |
| CashfreeScript location | TopBar.tsx | Needs to load on all dashboard pages since Buy Credits modal can open from anywhere |
| Customer phone (Cashfree) | Placeholder 9999999999 | Cashfree requires it; collect real number in future |
| CRON_SECRET | Vercel env var, checked in fetch-results route | Prevents unauthorized triggering of cron job |

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

*Last updated: 2026-05-30 — Credits system overhauled: 3-column credit DB, full transaction history, TopBar hover popover, shared BuyCreditsModal, redesigned pack cards (no tier names), pill filters + pagination on history, all bug fixes (void→await, fresh balance fetch, paise→rupees). Month 3 (learning aggregation, referrals, SEO, launch) is next.*

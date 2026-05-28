# VIDUP — UI/UX Design System
> Read this file alongside VIDUP_CONTEXT.md before building any screen or component.
> Every UI decision must follow these guidelines strictly. No exceptions.
> Reference products: Taskvora, SyncHarbor, Elevate AI (see uploaded images)

---

## Design Philosophy

VidUp should feel like a **premium modern SaaS tool** — clean, airy, confident, and creator-native. Think warm whites, bold typography, generous spacing, and one strong accent color used purposefully. Every screen should feel intentional — nothing random, nothing cluttered.

```
Premium = breathing room + bold type + purposeful color
Not premium = cramped, generic, too many colors, too many effects
```

---

## Visual Personality

```
Warm        → off-white backgrounds, not cold pure white
Bold        → heavy headlines that command attention
Airy        → generous whitespace, sections breathe
Confident   → one strong accent, used sparingly
Creator-native → talks like YouTube, not like enterprise software
```

---

## Color System

### Primary Palette
```
Brand Red       → #E8192C   (primary CTA, accents, highlights)
Warm White      → #FAFAF8   (primary page background — warm, not cold)
Pure White      → #FFFFFF   (cards, input fields, nav)
Off White       → #F5F2EC   (section backgrounds, alternating sections)
Cream           → #F0EBE0   (subtle section tints, warm areas)
Near Black      → #0D0D0D   (hero section background, dark CTA section)
True Black      → #111111   (headlines, primary text)
Dark Gray       → #3D3D3D   (body text, descriptions)
Mid Gray        → #888888   (placeholder text, captions, secondary labels)
Light Gray      → #E8E8E8   (borders, dividers, input backgrounds)
Gradient Blob   → radial-gradient(ellipse, rgba(232,25,44,0.12), transparent)
                  (subtle red blob for hero background accent)
```

### Accent Usage Rules
```
Red #E8192C   → CTA buttons, active nav states, badges,
                section label text, progress bars, 
                hover underlines, icons on feature cards
                NEVER as large background fill

Near Black    → hero section, footer dark section,
                bottom CTA section

Off White     → alternating section backgrounds
                (every other section to create rhythm)

Gradient Blob → hero background only
                subtle, not loud
                adds depth without distraction
```

### What To Avoid
```
❌ Pure cold white (#FFFFFF) as page background — too clinical
❌ Multiple competing accent colors
❌ Dark mode for main app (light mode only for V1)
❌ Heavy gradients on buttons
❌ Neon or saturated background colors
❌ Yellow (removed from brand)
```

---

## Typography

### Font Stack
```
Primary   → Inter (Google Fonts)
Fallback  → -apple-system, BlinkMacSystemFont, sans-serif
```

### Type Scale
```
Display       → 64px / 800 weight / -3px letter spacing
               (hero headline only — make it massive)

H1            → 48px / 700 weight / -2px letter spacing
H2            → 36px / 700 weight / -1px letter spacing
H3            → 24px / 600 weight / -0.3px letter spacing
H4            → 20px / 600 weight / 0px letter spacing

Body Large    → 18px / 400 weight / 0px letter spacing
Body          → 16px / 400 weight / 0px letter spacing
Body Small    → 14px / 400 weight / 0px letter spacing

Label         → 12px / 600 weight / 1px letter spacing
               UPPERCASE for section eyebrow labels
Caption       → 11px / 400 weight / 0.3px letter spacing
Stat Number   → 48px / 800 weight (for trust stats section)
```

### Two-Tone Headlines (from Elevate AI reference)
```
Use on select headings:
First part    → #111111 (black)
Second part   → #888888 (gray) or red #E8192C

Example:
"One click." → black
"Viral ready." → red

Example 2:
"Built for creators" → black  
"who are serious" → gray
```

### Typography Rules
```
→ Line height: 1.6 for body, 1.15 for display/H1, 1.3 for H2-H4
→ Max line width: 640px for body paragraphs (readability)
→ Headlines: center aligned in landing page sections
→ Body text: left aligned always (never center body paragraphs)
→ Section eyebrow labels: centered, uppercase, red, letter-spaced
→ Never use more than 2 font weights on one screen
→ Stat numbers: massive, bold, left aligned in grid
```

---

## Spacing System

Multiples of 4px — strictly:
```
4px   → xs   (icon gaps, tight internal)
8px   → sm   (between related inline elements)
12px  → md   (small internal padding)
16px  → base (standard internal padding)
24px  → lg   (card padding, field gaps)
32px  → xl   (between components)
48px  → 2xl  (between sections — mobile)
64px  → 3xl  (between sections — tablet)
96px  → 4xl  (between sections — desktop)
128px → 5xl  (hero top/bottom padding)
```

---

## Background Blobs (from Taskvora + Elevate AI reference)

Used only on hero section and select dark sections:

```css
/* Red blob — hero background */
background: 
  radial-gradient(ellipse 60% 50% at 30% 40%, 
    rgba(232,25,44,0.10) 0%, transparent 70%),
  radial-gradient(ellipse 40% 40% at 70% 60%, 
    rgba(232,25,44,0.06) 0%, transparent 70%),
  #0D0D0D;

/* Warm blob — light sections */
background:
  radial-gradient(ellipse 50% 60% at 80% 20%,
    rgba(232,25,44,0.05) 0%, transparent 60%),
  #FAFAF8;
```

Rules:
```
→ Blobs are subtle — opacity max 12%
→ Never on white card backgrounds
→ Only hero and alternating warm sections
→ No hard edges, always radial gradient fading to transparent
```

---

## Component Library

### Buttons

**Primary CTA Button**
```
Background    → #E8192C
Text          → #FFFFFF
Font          → 15px / 600 weight
Padding       → 14px 28px
Border radius → 100px (pill shape — from references)
Border        → none
Hover         → background #C41523, translateY(-1px)
Active        → scale(0.97)
Transition    → all 150ms ease
Icon          → optional arrow → after text (from SyncHarbor)
Shadow        → 0 4px 16px rgba(232,25,44,0.25) on hover
```

**Secondary Button**
```
Background    → transparent
Text          → #111111
Font          → 15px / 500 weight
Padding       → 14px 28px
Border radius → 100px (pill)
Border        → 1.5px solid #E8E8E8
Hover         → border #111111, background #F5F5F5
Transition    → all 150ms ease
```

**Ghost / Text Button**
```
Background    → transparent
Text          → #3D3D3D
Font          → 14px / 500 weight
Padding       → 8px 16px
Border        → none
Hover         → text #111111
Underline     → on hover, red #E8192C
```

**Button Rules**
```
→ Pill shape (border-radius 100px) for hero + landing CTAs
→ Rounded rect (border-radius 8px) for form submits + dashboard
→ Arrow icon (→) on primary hero CTA buttons
→ Loading: spinner replaces text, button stays same size
→ Disabled: 40% opacity
```

---

### Cards

**Standard Card**
```
Background    → #FFFFFF
Border        → 1px solid #F0F0F0
Border radius → 16px
Padding       → 28px
Shadow        → 0 2px 8px rgba(0,0,0,0.04),
                0 8px 32px rgba(0,0,0,0.04)
Hover         → shadow 0 8px 32px rgba(0,0,0,0.10),
                translateY(-3px)
Transition    → all 250ms ease
```

**Frosted Glass Card (from Taskvora reference)**
```
Background    → rgba(255,255,255,0.7)
Backdrop blur → blur(12px)
Border        → 1px solid rgba(255,255,255,0.5)
Border radius → 16px
Shadow        → 0 4px 24px rgba(0,0,0,0.06)
Use for       → floating UI mockup overlays in hero
                stat cards floating on sections
```

**Feature Card**
```
Background    → #FFFFFF
Border radius → 16px
Padding       → 32px 28px
Border        → 1px solid #F0F0F0
Icon area     → 44px × 44px, red background #FFF0F0,
                red icon #E8192C, border-radius 10px
Hover         → border color #E8192C (subtle)
Shadow        → standard card shadow
```

**Pricing Card**
```
Standard:
Background    → #FFFFFF
Border        → 1px solid #E8E8E8
Border radius → 20px
Padding       → 32px

Best Value (Creator):
Background    → #FFFFFF
Border        → 2px solid #E8192C
Border radius → 20px
Padding       → 32px
Transform     → scale(1.03) — slightly larger
Shadow        → 0 8px 40px rgba(232,25,44,0.15)
Badge         → "Best Value" pill, red background, 
                white text, positioned top center
```

**Output Pack Card (titles/hook/thumbnails)**
```
Background    → #FFFFFF
Border        → 1px solid #F0F0F0
Border radius → 16px
Padding       → 24px
Left border   → 3px solid #E8192C (accent left stripe)
Shadow        → standard
Copy button   → ghost style, top right of each section
```

---

### Inputs

**Standard Input**
```
Background    → #FFFFFF
Border        → 1.5px solid #E8E8E8
Border radius → 10px
Padding       → 13px 16px
Font          → 15px / 400 / #111111
Placeholder   → #AAAAAA
Height        → 46px

Focus:
Border        → 1.5px solid #111111
Shadow        → 0 0 0 3px rgba(0,0,0,0.06)
Background    → #FFFFFF

Error:
Border        → 1.5px solid #E8192C
Shadow        → 0 0 0 3px rgba(232,25,44,0.10)
```

**Textarea**
```
Same as input
Min height    → 96px
Resize        → vertical only
```

**Select / Dropdown**
```
Same as input
Custom styled → no browser default
Chevron icon  → right side, #888888
```

**URL Input (YouTube links)**
```
Same as input
Prepend       → YouTube icon left, #AAAAAA
Success state → green checkmark right #16A34A
Error state   → red X right #E8192C
```

**Input Label**
```
Font          → 14px / 500 / #111111
Margin bottom → 8px
Required      → red dot or asterisk
```

---

### Section Eyebrow Labels (from all 3 references)

Every section has a small label above the heading:

```
Style:
- Pill shaped badge
- Background: #FFF0F0 (light red tint)
- Text: #E8192C
- Font: 12px / 600 / uppercase / 0.5px letter spacing
- Padding: 6px 14px
- Border radius: 100px
- Display: inline-flex, centered above heading

Examples:
"HOW IT WORKS"
"WHAT YOU GET"
"PRICING"
"LANGUAGES"
```

---

### Stats Section (from SyncHarbor + Elevate AI reference)

Add a trust-building stats row between hero and features:

```
Layout        → 4 columns, centered
Each stat:
  Number      → 48px / 800 weight / #111111
  Label       → 14px / 400 / #888888 below number
  Divider     → 1px vertical line between stats

Examples for VidUp:
"10+" → Languages supported
"3"   → Outputs per generation  
"30s" → Average generation time
"₹0"  → To get started
```

---

### Navigation

**Landing Page Nav**
```
Height        → 64px
Background    → rgba(255,255,255,0.85)
Backdrop blur → blur(12px)
Border bottom → 1px solid rgba(0,0,0,0.06)
Position      → sticky top-0, z-index 100
Padding       → 0 48px

Logo          → left, 18px / 700 / #111111
               red dot or icon accent before text
Nav links     → center, 14px / 500 / #3D3D3D
               Hover → #111111
               Active → #111111
CTA           → right, Primary pill button small
               "Get Started Free →"
```

**Dashboard Nav / Sidebar**
```
Sidebar width → 240px
Background    → #FFFFFF
Border right  → 1px solid #F0F0F0
Padding       → 24px 16px

Logo area     → top, with credit balance below

Nav item:
Padding       → 10px 14px
Border radius → 10px
Font          → 14px / 500 / #3D3D3D
Icon          → 18px Lucide, same color

Active:
Background    → #FFF0F0
Color         → #E8192C
Icon          → #E8192C
Font weight   → 600

Hover:
Background    → #F5F5F5
```

---

### Badges and Tags

**Status Badge**
```
Font          → 12px / 600 / uppercase
Padding       → 4px 12px
Border radius → 100px
```

Status colors:
```
Generated     → background #F5F5F5, text #3D3D3D
Video Live    → background #FFF0F0, text #E8192C  
Results In    → background #F0FFF4, text #16A34A
```

**Language Tag**
```
Background    → #F5F5F5
Text          → #3D3D3D
Font          → 13px / 500
Padding       → 8px 16px
Border radius → 100px (pill)
Border        → 1px solid #E8E8E8
Hover         → background #111111, text #FFFFFF,
                border #111111
Transition    → 150ms ease
```

**Credit Balance (nav)**
```
Background    → #FFF0F0
Text          → #E8192C
Font          → 13px / 700
Padding       → 6px 12px
Border radius → 100px
Prefix icon   → ⚡ or lightning bolt
Example       → "⚡ 24 credits"
```

---

### Testimonial Cards (from SyncHarbor reference)

```
Background    → #FFFFFF
Border radius → 16px
Padding       → 28px
Border        → 1px solid #F0F0F0
Shadow        → standard card shadow

Quote mark    → large " in red #E8192C, 
                48px, top left of card
Quote text    → 16px / 400 / #3D3D3D / italic
Author photo  → 40px circle, real photo
Author name   → 14px / 600 / #111111
Author title  → 12px / 400 / #888888
```

---

## Landing Page Section Structure

### 1. Navigation
Sticky, frosted glass, pill CTA button

### 2. Hero Section
```
Background    → #0D0D0D with red gradient blobs
Min height    → 90vh
Padding       → 128px 48px
Text align    → center

Elements (top to bottom):
→ Small pill badge: "NOW IN BETA" or "YOUTUBE CREATORS"
  red background, white text
→ Display headline (two-tone)
  "One click." black → "Viral ready." red
→ Subheading: 18px, #888888, max 520px wide, centered
→ Two buttons side by side:
  Primary: "Get Started Free →"
  Secondary ghost: "See how it works"
→ Sub note: "No credit card required · 2 free credits/month"
  12px, #666666
→ Floating UI mockup cards (frosted glass)
  showing sample output titles/hook
  positioned below buttons, subtle
```

### 3. Stats / Trust Bar
```
Background    → #FFFFFF
4 stats in a row
Thin dividers between
Centered
Padding       → 48px
```

### 4. How It Works
```
Background    → #FAFAF8 (warm off-white)
Section label → "HOW IT WORKS" pill badge
Heading       → centered, H2
3 step cards  → numbered 01 02 03
                icon + title + description
                horizontal on desktop
                stacked on mobile
```

### 5. What You Get
```
Background    → #FFFFFF
Section label → "WHAT YOU GET" pill badge
Heading       → centered
3 feature cards in a row:
  → 3 Titles
  → 1 Hook Script
  → 3 Thumbnail Ideas
Each with icon, heading, bullet points
```

### 6. Languages
```
Background    → #FAFAF8
Section label → "LANGUAGES" pill badge
Heading       → "Your language. Your audience."
10 language pill tags → wrap layout, centered
Note below    → "Natural code-switching — the way
                 creators actually speak"
```

### 7. Pricing
```
Background    → #FFFFFF
Section label → "PRICING" pill badge
Heading       → "Simple, one-time pricing"
Subheading    → "No subscriptions. Credits never expire."

Part 1 — Free vs Paid comparison
2 column layout, simple bullets

Part 2 — 3 credit pack cards
₹79 / ₹149 (Best Value, elevated) / ₹299
Clarification line below

```

### 8. Testimonials (add later when real reviews exist)
```
Background    → #FAFAF8
2-3 cards in a row
Real creator photos + quotes
```

### 9. Footer CTA Section
```
Background    → #0D0D0D
Red blob accent
Centered heading + subheading
Primary CTA button
```

### 10. Footer
```
Background    → #0D0D0D
Text          → #888888
Logo + tagline left
Links right
Bottom bar    → copyright + terms + privacy
Large watermark text (VidUp) very subtle in background
               opacity 3-5%, like Taskvora reference
```

---

## Dashboard Design

### Layout
```
Left sidebar  → 240px, white, nav items
Top bar       → 60px, white, border bottom
               logo left, credit balance + user right
Content area  → padding 32px, #FAFAF8 background
```

### Pack History Cards
```
Layout        → vertical list, full width cards
Each card:
Left          → colored left border (status color)
               topic title (16px/600)
               date + language tag
Right         → status badge + arrow icon
Hover         → shadow increase, cursor pointer
```

### Generation Form
```
Max width     → 680px
Centered in content area
White card wrapper, 32px padding, 20px radius
Each field full width, 24px gaps
Submit        → full width primary button
               "Generate Pack · 1 credit"
Credit note   → "You have X credits remaining"
               13px, #888888, centered below button
```

### Output Page
```
Max width     → 760px, centered
Back button   → top left, ghost style
New Pack      → top right, primary small

3 sections with clear visual separation:
Titles        → stacked cards, left red border
Hook Script   → full width card, subsections
Thumbnails    → stacked cards, left red border

Copy button   → every section, ghost style, top right
```

---

## Micro-Interactions

```
Button press        → scale(0.97) 100ms
Card hover          → translateY(-3px) 250ms + shadow
Input focus         → border + shadow 150ms
Page load           → fade in 200ms
Generating state    → animated gradient on submit button
                      "Generating..." with spinner
Toast notifications → slide in top right, 3s auto dismiss
Tab switches        → smooth underline slide
Language tag select → smooth background fill
```

---

## Loading States

```
Generation loading  → full screen overlay, centered
                      animated VidUp logo or 
                      progress indicator
                      "Analyzing competitors..."
                      "Generating your pack..."
                      (2 stage message)

Content loading     → skeleton screens matching 
                      exact shape of content
                      gray shimmer animation
                      never blank white screens

Button loading      → spinner replaces text
                      button stays same width
```

---

## Mobile Rules

```
Breakpoints:
Mobile   → 0-767px
Tablet   → 768-1023px  
Desktop  → 1024px+

Mobile specific:
→ Nav → hamburger menu, full screen overlay
→ Hero padding → 80px 24px
→ Display font → 40px (not 64px)
→ All multi-column → single column stack
→ Pricing cards → vertical stack
→ Stats → 2×2 grid
→ Sidebar → bottom tab bar (4 icons)
→ Touch targets → minimum 48px × 48px
→ Font never below 14px
```

---

## Professional Checklist (before any screen is done)

```
□ Background is warm (#FAFAF8) not cold white
□ Section has eyebrow pill label above heading
□ Spacing follows 4px grid throughout
□ Colors only from palette above
□ All CTAs are pill shaped on landing page
□ Cards have correct shadow and radius
□ All interactive states exist (hover/focus/active)
□ Mobile responsive at 375px
□ Loading state handled
□ Error state handled
□ No Lorem Ipsum
□ Copy sounds like a creator, not a startup
□ No Supabase/Vercel/third-party branding
□ Eyebrow labels are pill badges, not plain text
□ Stats section present on landing page
□ Gradient blobs only on dark sections
```

---

## What Makes It Look Like The References

```
✅ Warm backgrounds (not cold white)
✅ Pill shaped badges for section labels
✅ Two-tone headlines (black + gray or red)
✅ Massive stat numbers for trust
✅ Frosted glass cards in hero
✅ Subtle gradient blobs in dark sections
✅ Pill CTA buttons with arrow icons
✅ Left border accent on output cards
✅ Real generous whitespace between sections
✅ Large watermark text in footer
✅ Alternating section backgrounds (white/warm)
```

---

*Last updated: Session 2 — Design system rebuilt from premium UI references (Taskvora, SyncHarbor, Elevate AI)*

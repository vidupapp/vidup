# VIDUP — Language Prompt Rules
> These rules are stored in Supabase prompts table, one record per language.
> Every generation call injects the relevant language rules into the Claude prompt.
> Update individual language rules directly in Supabase — no code changes needed.

---

## HINDI

```
HINDI LANGUAGE RULES (critical):

You are writing for a Hindi YouTube creator.

Natural mixing (Hinglish):
→ Mix Hindi and English naturally
→ Think like a 25-year-old creator from Delhi/Mumbai
→ NOT textbook Hindi — conversational Hinglish
→ NEVER use Urdu-heavy words (شاید, مگر etc.)

English words always kept in English:
→ save, invest, tips, results, mistake, challenge,
   business, income, salary, budget, plan, secret,
   hack, score, trending, viral, growth, subscriber,
   content, channel, upload, monetize, niche

Natural Hinglish examples:
✅ "यह 3 mistakes मत करो | YouTube Growth Tips"
✅ "Student life में ₹50,000 कैसे save करें?"
✅ "मेरे channel को 1 लाख subscribers कैसे मिले"
✅ "यह secret कोई नहीं बताता | Income tips"
✅ "Maine यह try किया — results shocking थे"

Wrong (too formal/bookish):
❌ "युवाओं के लिए धन संचय के उपाय"
❌ "आज हम आपको बताएंगे कि किस प्रकार"
❌ "यह अत्यंत महत्वपूर्ण जानकारी है"

GRAMMAR RULES:
→ Use conversational verb forms:
   करें (formal) vs करो (casual — preferred)
   बताएं vs बताओ — use बताओ for creator tone
   
→ Sentence structure:
   Keep it punchy — short sentences work best
   Hindi + English alternating feels natural
   
→ Gender agreement:
   मैंने किया (masculine) vs मैंने की (feminine)
   Must match channel owner's gender if known
   
→ Common mistakes to avoid:
   ❌ "मुझे यह अच्छा लगा था" → ✅ "यह मुझे बहुत अच्छा लगा"
   ❌ Too many "जी" and formal honorifics
   ❌ Pure Sanskrit-origin words

FINAL CHECK:
→ Would a Delhi/Mumbai 25-year-old say this?
→ Feels like a WhatsApp message, not a newspaper
→ No Urdu-heavy words
→ Grammar is correct
→ English words placed naturally
```

---

## TAMIL

```
TAMIL LANGUAGE RULES (critical):

You are writing for a Tamil YouTube creator.

Natural mixing (Tanglish):
→ Mix Tamil and English naturally (Tanglish)
→ Think like a creator from Chennai/Coimbatore
→ NEVER mix Telugu, Kannada, or Hindi words
→ Colloquial Tamil, not formal written Tamil

English words always kept in English:
→ save, invest, tips, results, mistake, challenge,
   business, income, salary, budget, plan, secret,
   hack, score, trending, viral, growth, subscriber,
   content, channel, upload, niche, subscribers

Natural Tanglish examples:
✅ "இந்த mistake பண்ணாதீங்க | YouTube Tips"
✅ "Student-ஆ இருக்கும்போது ₹50,000 save பண்றது எப்படி?"
✅ "என் channel-க்கு 1 lakh subscribers வந்தது எப்படி"
✅ "யாரும் சொல்லாத secret | Income tips"
✅ "இதை try பண்ணினேன் — results shocking-ஆ இருந்துச்சு"

Wrong (too formal):
❌ "வருமான சேமிப்பிற்கான வழிமுறைகள்"
❌ "இளைஞர்களுக்கான நிதி மேலாண்மை"

GRAMMAR RULES:
→ Use spoken Tamil verb endings:
   பண்றது (doing) not செய்வது (too formal)
   இருக்கு (is) not இருக்கிறது (too formal)
   வந்துச்சு (came) not வந்தது (too formal)

→ Colloquial contractions preferred:
   என்னன்னா (what it means)
   எப்படின்னா (how)
   ஏன்னா (because/why)

→ Common mistakes to avoid:
   ❌ Mixing Telugu/Kannada words
   ❌ Using formal written Tamil verb forms
   ❌ Sanskrit-heavy Tamil words

→ Script mixing:
   Tamil script for Tamil words
   English script for English words
   Never transliterate English into Tamil script

FINAL CHECK:
→ Would a Chennai creator say this naturally?
→ Sounds like spoken Tamil, not written Tamil
→ No Telugu/Kannada/Hindi words
→ Grammar and script are correct
```

---

## TELUGU

```
TELUGU LANGUAGE RULES (critical):

You are writing for a Telugu YouTube creator.

Natural mixing (Tenglish):
→ Mix Telugu and English naturally (Tenglish)
→ Think like a creator from Hyderabad/Vijayawada
→ NEVER mix Tamil, Kannada, or Hindi words
→ Colloquial Telugu, not formal written Telugu

English words always kept in English:
→ save, invest, tips, results, mistake, challenge,
   business, income, salary, budget, plan, secret,
   hack, score, trending, viral, growth, subscriber,
   content, channel, upload, niche

Natural Tenglish examples:
✅ "ఈ mistake చేయకండి | YouTube Growth Tips"
✅ "Student గా ఉన్నప్పుడు ₹50,000 ఎలా save చేయాలి?"
✅ "నా channel కి 1 lakh subscribers ఎలా వచ్చాయి"
✅ "ఎవరూ చెప్పని secret | Income tips"
✅ "ఇది try చేశాను — results చాలా shocking గా ఉన్నాయి"

Wrong (too formal):
❌ "ఆదాయ పొదుపు మార్గదర్శకాలు"
❌ "యువతకు ఆర్థిక నిర్వహణ పద్ధతులు"

GRAMMAR RULES:
→ Use conversational verb forms:
   చేయండి (formal) vs చేయి (casual — preferred)
   చెప్పండి vs చెప్పు — use casual for creator tone

→ Hyderabadi Telugu influence:
   Hyderabadi creators often use more Urdu/Hindi
   mixed Telugu — follow regional style if channel
   is from Hyderabad specifically

→ Gender agreement:
   Masculine: వాడు, అతను
   Feminine: ది, ఆమె
   Neutral/respectful: వారు

→ Common mistakes to avoid:
   ❌ Mixing Tamil words
   ❌ Using overly formal written Telugu
   ❌ Wrong verb endings for gender

FINAL CHECK:
→ Would a Hyderabad/Vijayawada creator say this?
→ Sounds natural and conversational
→ No Tamil/Kannada/Hindi words (unless Hyderabadi context)
→ Grammar and gender agreement correct
```

---

## KANNADA

```
KANNADA LANGUAGE RULES (critical):

You are writing for a Kannada YouTube creator.

Natural mixing (Kanglish):
→ Mix Kannada and English naturally
→ Think like a creator from Bangalore/Mysore
→ NEVER mix Telugu, Tamil, or Hindi words
→ Conversational Kannada, not formal written

English words always kept in English:
→ save, invest, tips, results, mistake, challenge,
   business, income, salary, budget, plan, secret,
   hack, score, trending, viral, growth, subscriber,
   content, channel, startup, tech

Natural Kanglish examples:
✅ "ಈ mistake ಮಾಡಬೇಡಿ | YouTube Growth Tips"
✅ "Student ಆಗಿದ್ದಾಗ ₹50,000 ಹೇಗೆ save ಮಾಡಬೇಕು?"
✅ "ನನ್ನ channel ಗೆ 1 lakh subscribers ಹೇಗೆ ಬಂತು"
✅ "ಯಾರೂ ಹೇಳದ secret | Income tips"
✅ "ಇದನ್ನು try ಮಾಡಿದೆ — results shocking ಆಗಿತ್ತು"

Wrong (too formal):
❌ "ಆದಾಯ ಉಳಿತಾಯದ ಮಾರ್ಗದರ್ಶನ"
❌ "ಯುವಜನರಿಗೆ ಆರ್ಥಿಕ ನಿರ್ವಹಣೆ"

Bangalore tech creator note:
→ Bangalore creators often mix more English
   especially for tech/startup content
→ Adjust English ratio based on content category

GRAMMAR RULES:
→ Use conversational verb endings:
   ಮಾಡಿ (formal) vs ಮಾಡು (casual — preferred)
   ಹೇಳಿ vs ಹೇಳು — casual preferred

→ Common contractions in spoken Kannada:
   ಏನಂದ್ರೆ (what it means)
   ಹೇಗಂದ್ರೆ (how)
   ಯಾಕಂದ್ರೆ (because/why)

→ Common mistakes to avoid:
   ❌ Telugu or Tamil words leaking in
   ❌ Using formal Kannada script words
   ❌ Wrong honorific levels

FINAL CHECK:
→ Would a Bangalore/Mysore creator say this?
→ Conversational, not literary Kannada
→ No Telugu/Tamil/Hindi words
→ Grammar correct
```

---

## BENGALI

```
BENGALI LANGUAGE RULES (critical):

You are writing for a Bengali YouTube creator.

Natural mixing (Benglish):
→ Mix Bengali and English naturally
→ Think like a creator from Kolkata/Dhaka area
→ NEVER mix Hindi or other regional language words
→ Conversational Bengali, not formal Sadhu Bhasha

English words always kept in English:
→ save, invest, tips, results, mistake, challenge,
   business, income, salary, budget, plan, secret,
   hack, score, trending, viral, growth, subscriber,
   content, channel, upload, niche

Natural Benglish examples:
✅ "এই mistake করবেন না | YouTube Growth Tips"
✅ "Student হিসেবে ₹50,000 কীভাবে save করবেন?"
✅ "আমার channel এ 1 lakh subscribers কীভাবে এলো"
✅ "কেউ বলে না এই secret | Income tips"
✅ "এটা try করলাম — results টা shocking ছিল"

Wrong (too formal/Sadhu Bhasha):
❌ "অর্থ সঞ্চয়ের পথনির্দেশিকা"
❌ "যুবসমাজের জন্য আর্থিক ব্যবস্থাপনা"

GRAMMAR RULES:
→ Use colloquial verb forms:
   করুন (formal) vs করো (casual — preferred)
   বলুন vs বলো — casual preferred for creator tone

→ Vowel endings in casual Bengali:
   করছি (I am doing)
   করব (I will do)
   করলাম (I did)

→ Common mistakes to avoid:
   ❌ Mixing Hindi words (very common error)
   ❌ Using formal Sadhu Bhasha verb forms
   ❌ Overly literary vocabulary

→ Script:
   Bengali script for Bengali words
   English script for English words
   Never transliterate English into Bengali script

FINAL CHECK:
→ Would a Kolkata creator say this naturally?
→ Sounds like spoken Bengali not written literary
→ No Hindi words anywhere
→ Grammar is correct
```

---

## GUJARATI

```
GUJARATI LANGUAGE RULES (critical):

You are writing for a Gujarati YouTube creator.

Natural mixing (Gujlish):
→ Mix Gujarati and English naturally
→ Think like a creator from Ahmedabad/Surat
→ NEVER mix Hindi or Marathi words
→ Conversational Gujarati, not formal

English words always kept in English:
→ save, invest, tips, results, mistake, challenge,
   business, income, salary, budget, plan, secret,
   hack, score, trending, viral, growth, subscriber,
   content, channel, startup, trade

Business/finance note:
→ Gujarati creators often focus on business
   and finance content — these English terms
   are especially natural in Gujarati context:
   profit, loss, margin, trade, deal, market

Natural Gujlish examples:
✅ "આ mistake ન કરો | YouTube Growth Tips"
✅ "Student તરીકે ₹50,000 કેવી રીતે save કરવા?"
✅ "મારી channel ને 1 lakh subscribers કેવી રીતે મળ્યા"
✅ "કોઈ નહીં કહે આ secret | Business tips"
✅ "આ try કર્યું — results shocking હતા"

Wrong (too formal):
❌ "નાણાકીય બચત માટેના માર્ગદર્શન"
❌ "યુવાનો માટે વ્યાવસાયિક વ્યવસ્થાપન"

GRAMMAR RULES:
→ Use conversational verb forms:
   કરો (do — casual, preferred)
   કરશો (will do — slightly formal)
   થઈ ગયું (it happened — natural)

→ Gujarati particles:
   ને (and/to)
   તો (then/so)
   પણ (but/also)
   Use these naturally between English words

→ Common mistakes to avoid:
   ❌ Hindi words leaking in (very common)
   ❌ Marathi words mixing in
   ❌ Using overly formal Gujarati

FINAL CHECK:
→ Would an Ahmedabad/Surat creator say this?
→ Business-friendly tone where relevant
→ No Hindi/Marathi words
→ Grammar correct
```

---

## MALAYALAM

```
MALAYALAM LANGUAGE RULES (critical):

You are writing for a Malayalam YouTube creator.

Natural mixing (Manglish):
→ Mix Malayalam and English naturally (Manglish)
→ Think like a creator from Kerala
→ NEVER mix Tamil, Telugu, or Hindi words
→ Conversational Malayalam, not formal

English words always kept in English:
→ save, invest, tips, results, mistake, challenge,
   business, income, salary, budget, plan, secret,
   hack, score, trending, viral, growth, subscriber,
   content, channel, upload, niche, Gulf (relevant
   to Kerala audience context)

Natural Manglish examples:
✅ "ഈ mistake ചെയ്യരുത് | YouTube Growth Tips"
✅ "Student ആയിരിക്കുമ്പോൾ ₹50,000 എങ്ങനെ save ചെയ്യാം?"
✅ "എന്റെ channel ൽ 1 lakh subscribers എങ്ങനെ വന്നു"
✅ "ആരും പറയാത്ത secret | Income tips"
✅ "ഇത് try ചെയ്തു — results shocking ആയിരുന്നു"

Wrong (too formal):
❌ "സാമ്പത്തിക സമ്പാദ്യത്തിനുള്ള മാർഗ്ഗനിർദ്ദേശം"
❌ "യുവജനങ്ങൾക്കുള്ള ധനകാര്യ പരിപാലനം"

Kerala context note:
→ Gulf/NRI references are highly relatable
   for Kerala audience
→ Finance and career content performs well
→ Education content is very popular

GRAMMAR RULES:
→ Use conversational verb forms:
   ചെയ്യൂ (do — casual, preferred)
   ചെയ്യണം (must do)
   ചെയ്തു (did — past)

→ Common spoken contractions:
   എന്തെന്നാൽ (what it means)
   എങ്ങനെയെന്നാൽ (how)
   എന്തുകൊണ്ടെന്നാൽ (why/because)

→ Common mistakes to avoid:
   ❌ Tamil words (very similar but different)
   ❌ Using overly formal written Malayalam
   ❌ Sanskrit-heavy vocabulary

FINAL CHECK:
→ Would a Kerala creator say this naturally?
→ Conversational, not literary Malayalam
→ No Tamil/Telugu/Hindi words
→ Grammar correct
```

---

## PUNJABI

```
PUNJABI LANGUAGE RULES (critical):

You are writing for a Punjabi YouTube creator.

Natural mixing (Punglish):
→ Mix Punjabi and English naturally
→ Think like a creator from Punjab/Chandigarh
→ Punjabi creators naturally mix some Hindi too
   (this is acceptable unlike other languages)
→ Conversational Punjabi, energetic tone

English words always kept in English:
→ save, invest, tips, results, mistake, challenge,
   business, income, salary, budget, plan, secret,
   hack, score, trending, viral, growth, subscriber,
   content, channel, upload, niche

Punjabi tone note:
→ Punjabi content tends to be more energetic,
   expressive, and enthusiastic than other languages
→ Exclamation marks and strong emotions work well
→ Humour and casual banter is part of the culture

Natural Punglish examples:
✅ "ਇਹ mistake ਨਾ ਕਰੋ | YouTube Growth Tips"
✅ "Student ਹੁੰਦੇ ਹੋਏ ₹50,000 ਕਿਵੇਂ save ਕਰੀਏ?"
✅ "ਮੇਰੇ channel ਤੇ 1 lakh subscribers ਕਿਵੇਂ ਆਏ"
✅ "ਕੋਈ ਨਹੀਂ ਦੱਸਦਾ ਇਹ secret | Income tips"
✅ "ਇਹ try ਕੀਤਾ — results ਬਹੁਤ shocking ਸੀ"

Wrong (too formal):
❌ "ਵਿੱਤੀ ਬੱਚਤ ਲਈ ਮਾਰਗਦਰਸ਼ਨ"
❌ "ਨੌਜਵਾਨਾਂ ਲਈ ਆਰਥਿਕ ਪ੍ਰਬੰਧਨ"

GRAMMAR RULES:
→ Use conversational verb forms:
   ਕਰੋ (do — standard)
   ਕਰੀਏ (let's do — engaging)
   ਕੀਤਾ (did — past masculine)
   ਕੀਤੀ (did — past feminine)

→ Energetic Punjabi phrases:
   ਯਾਰ (friend/buddy — very casual)
   ਪੱਕੀ ਗੱਲ (for sure)
   ਸੱਚ ਦੱਸਾਂ (honest truth)

→ Common mistakes to avoid:
   ❌ Using Gurmukhi script inconsistently
   ❌ Over-formal Punjabi
   ❌ Too much Hindi mixing (some is ok, too much is not)

FINAL CHECK:
→ Would a Punjab/Chandigarh creator say this?
→ Energetic and expressive tone
→ Grammar and script correct
→ English words placed naturally
```

---

## ENGLISH

```
ENGLISH LANGUAGE RULES (critical):

You are writing for an English YouTube creator.

Style:
→ YouTube-native English — not corporate, not academic
→ Think MrBeast, Ali Abdaal, or similar creator style
→ Punchy, specific, curiosity-driven
→ American/British English both acceptable
→ Indian English creators: slightly more formal
   than American but still conversational

Title formula patterns that work:
→ Number + Specific outcome: "7 Habits That Made Me..."
→ Curiosity gap: "Why Nobody Talks About..."
→ Personal story: "I Tried X for 30 Days..."
→ Contrarian: "Stop Doing X (Do This Instead)"
→ Specific + Relatable: "How I Saved ₹50,000 as a Student"

Natural English examples:
✅ "I Made These 3 Mistakes — Don't Do What I Did"
✅ "How I Got 100K Subscribers (Honest Truth)"
✅ "Stop Using This YouTube Strategy in 2025"
✅ "The Only Video Script Template You'll Ever Need"
✅ "Why Your Videos Get 0 Views (And How I Fixed It)"

Wrong (generic/corporate):
❌ "Tips and Tricks for YouTube Success"
❌ "How to Improve Your YouTube Channel Performance"
❌ "A Comprehensive Guide to YouTube Growth"

GRAMMAR RULES:
→ Short sentences for titles — under 10 words ideal
→ Active voice always (never passive)
→ Numbers in digits not words (7 not seven)
→ Sentence case for titles, not Title Case
→ Em dash (—) for dramatic pause works well
→ Questions must be genuinely curiosity-inducing
   not generic ("How to grow?" is bad)

Hook language:
→ Start with "I", a number, or a provocative statement
→ Never start with "In this video..."
→ Never start with "Today we're going to..."
→ Never start with "Welcome back to my channel..."

FINAL CHECK:
→ Would a top YouTube creator use this title?
→ Is it specific enough to not be generic?
→ Does it create genuine curiosity?
→ Is it under 70 characters (YouTube truncates beyond)?
→ Grammar is correct and punchy
```

---

## HOW TO UPDATE IN SUPABASE

Each language rule above is stored as one record in the `prompts` table:

```sql
INSERT INTO prompts (language, call_type, prompt_text, version)
VALUES ('marathi', 'language_rules', '[paste rules here]', 1);
```

To update a language rule:
```sql
UPDATE prompts 
SET prompt_text = '[new rules]', version = version + 1
WHERE language = 'marathi' AND call_type = 'language_rules';
```

No code deployment needed. Changes are live immediately on next generation.

---

*Last updated: Session 2 — All 10 language prompt rules written*

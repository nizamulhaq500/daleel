# Daleel (دليل) — Hackathon Submission Summary
**The Harvest Anti-Muslim Hate Hackathon 2026**

---

### 🚨 1. Problem
Anti-Muslim hate speech and targeted harassment have grown increasingly sophisticated, transitioning away from overt slurs toward insidious **coded language, historical dog whistles, linguistic obfuscations, and emoji substitutions** designed specifically to bypass standard content moderation algorithms. 

Modern online perpetrators systematically utilize phrases that appear innocuous to keyword filters but carry violent, dehumanizing, or genocidal connotations to in-group audiences:
- **"Remove Kebab"**: A meme originating from the Bosnian War that serves as an explicit dog whistle calling for the mass murder and ethnic cleansing of Muslims worldwide (referenced directly in the 2019 Christchurch terrorist manifesto).
- **"Jizya Conspiracies & Economic Jihad"**: Disinformation campaigns claiming Halal certifications or Muslim-owned small businesses are funding covert takeovers of Western and South Asian economies.
- **"Love Jihad" & "Demographic Jihad"**: Weaponized conspiracy theories alleging deliberate campaigns to alter demographics, triggering real-world lynchings, harassment of interfaith couples, and state-level discriminatory statutes.
- **Emoji Weaponization & Leetspeak**: Spamming `🥓`, `🐷`, and `💣` on Muslim creators' feeds or using `m*slim` and `katwa` to evade automated trust & safety filters.

Victims and civil rights groups face a compounding crisis: by the time high-threat posts are flagged, perpetrators delete evidence or accounts are purged, leaving no forensically verifiable chain of custody for legal accountability or platform escalation.

---

### 🛡️ 2. Solution
**Daleel (دليل)** is a comprehensive, multi-tiered Trust & Safety intelligence pipeline engineered to detect coded anti-Muslim hate, preserve tamper-evident digital evidence, and streamline verified escalation across three synchronized user tiers:

1. **Tier 1 — Community Reporters**: Grassroots victims and monitors ingest suspicious content (text, URLs, images). Daleel applies immediate hybrid analysis (deterministic dictionary matching + Google Gemini AI + Perspective API) to generate instantaneous severity assessments.
2. **Tier 2 — Journalist Validators**: Fact-checkers and media analysts triage incoming flagged reports in a dedicated workspace, cross-referencing a database of 50+ academic counter-narratives, validating evidentiary authenticity, and annotating context.
3. **Tier 3 — Officials & Law Enforcement**: Legal advocates, platform Trust & Safety liaisons, and civil rights attorneys access verified incident dossiers complete with cryptographic timestamps, reviewer audit trails, platform policy violation mappings, and client-side PDF evidence exports.

---

### 💡 3. Innovation
Generic sentiment analysis and automated moderation models (e.g., standard Perspective API) consistently score coded dog whistles as low toxicity because they lack semantic and cultural context. 

Daleel innovates through a **Hybrid Dual-Engine Architecture**:
- **Curated Multi-Lingual Coded Lexicon**: A researched dictionary of 35+ anti-Muslim dog whistles, slurs, and tropes spanning English, Hindi/Urdu, French, and emoji semantics.
- **Deterministic-to-Generative Context Engine**: Instantaneous local pattern recognition immediately flags subtext, which is then fed into **Google Gemini 1.5 / 2.0 Flash** with structured system prompts grounded in Islamic studies, socio-political history, and platform policy frameworks.
- **Context-Aware Disambiguation**: Unlike blunt keyword blockers, Daleel differentiates between legitimate academic discussion/theological discourse and weaponized bigotry, eliminating false positives while catching subtle dog whistles.

---

### 📈 4. Impact
- **Forensic Legal Readiness**: Generates client-side, tamper-resistant PDF dossiers with immutable chain-of-custody logs (timestamp, reviewer signature, original unmanipulated source data, platform policy violations), bridging the gap between social media toxicity and actionable legal evidence.
- **Eliminating False Report Overload**: The 3-tier validation hierarchy prevents spam and malicious reporting from reaching authorities while ensuring high-risk genocidal threats are escalated within minutes.
- **Community Empowerment**: Provides affected individuals with an interactive **FactCheck AI Engine** and 50+ academic counter-narratives to counter misinformation on social media in real time.

---

### ⚖️ 5. Ethics, Privacy & Safety
- **Academic Grounding**: The coded language dictionary and counter-narratives were developed from empirical research published by the **Bridge Initiative (Georgetown University)**, **Tell MAMA (UK)**, and the **Institute for Social Policy and Understanding (ISPU)**.
- **Data Minimization & Anonymous Mode**: Users can submit evidence anonymously without collecting unnecessary PII; raw inputs are stored securely in Google Cloud Firestore with end-to-end encryption at rest.
- **Human-in-the-Loop Safeguards**: AI serves as an intelligence amplifier, never an automated executioner. High-stakes escalations require validation by accredited journalists or officials.
- **Content Warnings & Mental Health**: Sensitive and graphic hate speech is blurred behind opt-in content warning overlays to protect monitors from vicarious trauma.

---

### 🌿 6. Sustainability & Feasibility
- **Ultra-Low Cost Inference**: Leveraging **Google Gemini Flash** (~$0.075 per 1M input tokens) and Firebase Serverless architectures allows Daleel to operate at near-zero marginal cost, supporting tens of thousands of community reports on free/subsidized tiers.
- **Open-Source & Community Extensibility**: Released under the permissive **MIT License**, with plans to decouple the coded language dictionary as an open npm library maintained by global civil rights researchers.
- **Institutional Partnerships**: Ready-to-deploy data interchange format designed to plug into existing intake pipelines at CAIR, Muslim Advocates, the Muslim Public Affairs Council (MPAC), and platform Trusted Flagger portals.

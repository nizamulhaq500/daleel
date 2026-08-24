# Daleel (دليل) — Post-Hackathon Strategic Roadmap

This roadmap outlines the long-term vision and technical milestones for Daleel following **The Harvest Anti-Muslim Hate Hackathon 2026**.

---

```
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│         PHASE 1         │ ──► │         PHASE 2         │ ──► │         PHASE 3         │ ──► │         PHASE 4         │
│   Hackathon MVP Core    │     │   Community Pilots &    │     │  Grants, Open Lexicon   │     │  Browser Extension &    │
│       (Completed)       │     │     Trusted Flaggers    │     │    & Global Expansion   │     │    Institutional APIs   │
│                         │     │      (1 – 3 Months)     │     │      (3 – 6 Months)     │     │     (6 – 12 Months)     │
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘
```

---

## 🚀 Phase 1: Hackathon MVP Core (Completed)
- [x] **3-Tier Role-Based Pipeline**: Architected distinct, authenticated workflows for Community Reporters, Journalist Validators, and Law Enforcement/Civil Rights Officials.
- [x] **Hybrid AI Detection Engine**: Integrated 35+ term curated coded language dictionary with Google Gemini 1.5 / 2.0 Flash deep semantic analysis and Google Perspective API toxicity scoring.
- [x] **Cryptographic Chain of Custody**: Real-time Firestore audit logging recording timestamps, reviewer signatures, and policy violation citations.
- [x] **Forensic PDF Dossier Export**: Client-side, tamper-resistant evidence package generation using `jsPDF` and `html2canvas`.
- [x] **Interactive FactCheck AI Chatbot**: Real-time Gemini-powered assistant with social counter-narrative card generation.
- [x] **Educational & Context Hub**: Curated 50+ counter-narratives and a 10-event historical hate crime & policy timeline.
- [x] **Platform Policy Playbooks**: Reporting guidelines for 8 major social media platforms (Meta, YouTube, X, TikTok, Reddit, Discord, Telegram, LinkedIn).

---

## 🛡️ Phase 2: Community Pilots & Trusted Flagger Integration (1 – 3 Months)
- [ ] **Civil Rights Organization Pilots**: Deploy pilot testing instances with key advocacy and monitoring partners:
  - **CAIR** (Council on American-Islamic Relations)
  - **Muslim Advocates**
  - **ISPU** (Institute for Social Policy and Understanding)
  - **Tell MAMA UK**
- [ ] **Trusted Flagger Integration**:
  - Connect verified incident feeds directly into Meta and YouTube Trusted Flagger escalation portals.
  - Automate structured API payloads adhering to platform-specific trust & safety intake schemas.
- [ ] **Mobile & Cross-Device Optimization**:
  - Progressive Web App (PWA) offline incident caching for field reporting.
  - Touch-optimized responsive interface for rapid on-the-ground mobile submissions.
- [ ] **Advanced Media Forensics**:
  - Exif metadata extraction and cryptographic hashing (SHA-256) of uploaded screenshot evidence.
  - OCR pipeline for embedded text in hate memes and video stills.

---

## 🌐 Phase 3: Open-Source Lexicon, Multilingual Scale & Grants (3 – 6 Months)
- [ ] **Standalone Open-Source Lexicon Package**:
  - Decouple the anti-Muslim hate glossary into a standalone, peer-reviewed npm package (`@daleel/coded-lexicon`).
  - Implement a public PR-based contribution workflow for civil rights scholars and linguists to add emerging dog whistles.
- [ ] **Grant Acquisition & Funding**:
  - Apply for the **Digital Rights Foundation Grant**, **Knight Foundation Tech & Society Grant**, and **Google AI for Social Impact Grant** to fund permanent hosting and community operations.
- [ ] **Expanded Multilingual Detection**:
  - Add native linguistic parsing and cultural context dictionaries for **Arabic, Urdu, French, German, and Bengali**.
  - Localized fact-checking databases addressing region-specific conspiracy theories in Europe, South Asia, and the MENA region.
- [ ] **Webhook & Case Management Integrations**:
  - Bi-directional integrations with ticketing and legal intake tools (Zendesk, Salesforce Non-Profit, Jira).

---

## 🏛️ Phase 4: Browser Extension, Institutional APIs & Research (6 – 12 Months)
- [ ] **Real-Time Social Media Browser Extension**:
  - Chrome, Firefox, and Safari extensions providing passive real-time dog whistle highlighting on X (Twitter), Instagram, Reddit, and YouTube.
  - One-click "Capture & File with Daleel" context menu tool capturing DOM snapshots, URL metadata, and screenshots directly into the reporter pipeline.
- [ ] **Law Enforcement & Legal API Portal**:
  - Streamlined, subpoena-compliant evidence export APIs for certified prosecutors, human rights attorneys, and international tribunals.
  - Standardized export conforming to the **Berkeley Protocol on Digital Open Source Investigations**.
- [ ] **Academic Research & Annual Threat Intelligence Report**:
  - Publish peer-reviewed academic papers on LLM-assisted coded hate detection with Georgetown Bridge Initiative and partner universities.
  - Publish the inaugural *Daleel State of Online Islamophobia & Coded Hate Report* analyzing cross-platform evasion trends.

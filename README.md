# Mission Sol-4: Guardians of Ares Base

![NASA Space Apps Challenge](https://img.shields.io/badge/NASA_Space_Apps-2026-0B3D91?style=for-the-badge&logo=nasa&logoColor=white)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Google_AI_Studio-EA580C?style=for-the-badge)](https://ais-pre-vhpaje572ys47vhgeaald5-760915443235.us-west2.run.app)
![React 19](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-0F172A?style=for-the-badge&logo=tailwind-css&logoColor=38BDF8)
![WCAG 2.1 AA](https://img.shields.io/badge/WCAG_2.1-AA_Accessible-10B981?style=for-the-badge)
![License MIT](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)

**Team Ares Base Guardians** · *Maryangela Costa de Souza Florentin & Luna Costa Antunes*  
Official Submission — **NASA Space Apps Challenge (2026)**

- **Live Demo (Primary — Google AI Studio):** [`https://ais-pre-vhpaje572ys47vhgeaald5-760915443235.us-west2.run.app`](https://ais-pre-vhpaje572ys47vhgeaald5-760915443235.us-west2.run.app)
- **Live Demo Mirror (GitHub Pages):** `https://[username].github.io/[repo-name]/`
- **Source Repository:** `https://github.com/[username]/[repo-name]`
- **Architecture:** 100% Front-End SPA (React + TypeScript + Tailwind CSS + Vite, Per-Endpoint Circuit Breaker + `LocalFallback`) · Zero Backend · Bilingual (`EN-US` / `PT-BR`)

---

## Executive Summary & Pedagogical Vision

**Mission Sol-4: Guardians of Ares Base** is an interactive, story-driven STEM rescue simulation designed for learners **ages 7–12** with **zero prior space science knowledge required**. Across four Martian days (**Sols 1–4**), solo players or rotating student teams apply the **Scientific Method** (*Observation → Hypothesis → Experiment → Conclusion*) to rescue mission mascot **Commander Quack** from escalating crises at **Jezero Crater, Mars**.

To create emotional engagement alongside rigorous STEM literacy:
- **Progressive Age-Profile Adaptation:** Choosing *Explorers (7–9)*, *Strategists (10–12)*, or *Parents & Teachers* adapts narrative voice, vocabulary, engineering explanations, and chat responses across all five screens without altering game fairness.
- **4 Automatic Emotional States for Commander Quack:** The mascot reacts dynamically in real time (`terror`, `drama`, `dizzy`, `celebrate`) based on mission events and critical subsystem health (`< 35%` danger threshold).
- **Context-Aware Local Pedagogical Assistant:** An offline, deterministic **Commander Quack Chat** coaches players using live mission telemetry, hangars, and NASA datasets while enforcing **strict anti-spoiler guardrails**—never handing out "the right card" directly.

---

## Core Game Mechanics

### 1. Prologue & Crew Configuration (Screen 1)
- Supports **Solo Mode** or **Team Mode (2–4 players)** with rotating NASA-inspired roles (*Mission Leader*, *Science Officer*, *Comms Officer*, *Systems Engineer*).
- Players pick a space avatar (*Guardian Astra*, *Pilot Orbit*, *Engineer Comet*) and reading profile before entering the Hangar.

### 2. Engineering Hangar & Physics Lock (Screen 2)
Players configure a supply and rescue spacecraft under **real physical and financial trade-offs**:
- **Constraints:** **$100M Budget Ceiling** and strict rocket mass limits (**Light Rocket:** `$35M`, `1,200 kg` max; **Heavy Rocket:** `$50M`, `2,200 kg` max; `350 kg` base capsule).
- **Orbits:** *High Relay Orbit* (`+15% Comms, -10% Shield`) vs. *Low Orbit* (`+15% Shield, -10% Comms`).
- **3 NASA Reinforcement Instrument Kits (Pick 2):**
  1. **Veggie Greenhouse (`OSDR OSD-120`):** `450 kg` · `$25M` · `+40 Science` · `+15% Life Support`
  2. **Perseverance MEDA Weather Station:** `350 kg` · `$15M` · `+35 Science` · `+10% Energy, +5% Comms`
  3. **DONKI Solar Shield & Antenna:** `500 kg` · `$25M` · `+25 Science` · `+15% Shield`
- **Engineering Physics Lock:** Selecting incompatible mass (`1,300 kg > 1,200 kg`) or exceeding `$100M` locks liftoff with an explicit physics explanation instead of silent failure.

### 3. Four Tactical Sols & Zero-G Workshop (Screens 3 & 4)
Each Sol presents three balanced trade-off decisions (**Cards A, B, C**), interactive base hotspots, and a scientific explanation modal:
- **Sol 1 (*Observation*):** Microbial biofilms (*"Alien Ticks"*) clog closed-loop water pipes during `-85°C` Martian nights and a `14-minute` one-way Earth-Mars radio delay (`28-min` round trip).
- **Sol 2 (*Hypothesis*):** Earth budget freeze meets a real **DONKI Class X8.7** solar flare. Saving `$15M+` in the Hangar unlocks a **+10% Energy reserve carry-over bonus** on Card B.
- **Sol 3 (*Experiment*):** Zero-gravity turbulence knocks out the **Veggie Greenhouse (`16h/day` LEDs)** under **`τ = 0.85`** Martian dust. Players must first complete the **Zero-G Workshop interactive minigame**—recovering 3 camouflaged tools (**Torque Wrench**, **Multimeter**, **Kapton Tape**)—with an optional Drone UV Scanner assist (`-8% Life Support`) teaching collaboration and knowing when to ask for help.
- **Sol 4 (*Conclusion*):** Dust gusts challenge final rendezvous and touchdown at Jezero Crater. Keeping all 4 subsystems (**Energy, Life Support, Shield, Comms**) above `0%` wins; finishing all 4 at **`≥ 35%`** awards the **Gold Guardian of Ares Base** passport.

### 4. Victory Celebration & Real Science Lab (Screen 5)
- **Stage Celebration:** *"Mission Complete: We Rescued Commander Quack!"* — Commander Quack and the crew celebrate on stage while the *"Alien Ticks"* march in a Cuban Mambo conga line (powered by procedural Web Audio synthesis) with a clickable shortcut linking their nickname to real **ISS biofilms**.
- **Randomized NASA APOD Space Memory:** Displays a live or verified NASA *Astronomy Picture of the Day* card with a **Draw Another NASA Photo** re-roll button and a silent local SVG fallback if school firewalls block external images.
- **Interactive Martian Night-Sky Observatory:** Clicking the night sky spawns twinkling stars and reveals real Martian constellations including **Deneb** (Mars's northern pole star due to its `25.19°` axial tilt) and **Orion**.
- **Real Science Lab & Data Lineage:** Toggle between **Explorer View** and **Technical View** to inspect how every Hangar/Sol parameter maps to real NASA science.

---

## Universal Design & Native Accessibility (`♿ Accessibility` / `♿ Acessibilidade`)

Available discreetly in the top-right corner from the **Splash Screen** through the **Final Victory Passport**, the built-in Accessibility popover delivers three **zero-dependency, 100% browser-native** inclusive features with persistent `localStorage` preferences, click-outside support, and `Esc` keyboard dismissal:

- **Low Vision (Large Text Mode):** Toggles a global `a11y-large-text` CSS class on the root document (`<html>`) that proportionally scales typography (`rem` root size), line height, card padding, and interactive touch targets across mobile and desktop viewports with zero horizontal overflow.
- **Colorblindness & High Contrast Mode:** Toggles a global `a11y-high-contrast` theme applying deep `#000000` backgrounds, stark high-contrast borders (`#FFFFFF` / `#FACC15`), high-visibility focus rings (`3px solid #FACC15`), and **redundant non-color visual cues**—distinct geometric fill patterns on all 4 telemetry gauges and Hangar meters (diagonal stripes, dots, reverse hatch, grid), crisp icons, numeric percentages, explicit `+`/`-` deltas, and explicit text status badges (`SAFE`, `WARNING <35%`, `CRITICAL 0%` / `SEGURO`, `ATENÇÃO <35%`, `CRÍTICO 0%`).
- **Blind & Screen-Reading Audio Description:** Integrates the native **Web Speech API** (`window.speechSynthesis` supporting both `en-US` and `pt-BR` with safe `'speechSynthesis' in window` capability checks and a dedicated **"Stop Reading"** button) to read aloud on demand the active screen or modal title, Commander Quack's theatrical dialogue, live resource bar levels, and rich visual scene descriptions—paired with semantic `aria-label`, `aria-expanded`, `role="switch"`, and `role="progressbar"` attributes across primary controls.

---

## Architecture, Circuit Breaker & Offline Resilience

- **100% Front-End Execution:** Built with React, TypeScript, Tailwind CSS, Vite, native Web Audio API, and native Web Speech API (`window.speechSynthesis`). Runs with zero backend servers, zero external databases, and zero user API keys.
- **Per-Endpoint Circuit Breaker (`CLOSED → OPEN → HALF_OPEN`):** Independent state machines guard **DONKI** and **APOD**. On the first timeout (`4,000 ms` `AbortController`), HTTP error, or non-photo payload, that endpoint trips to `OPEN` for a 5-minute cooldown and short-circuits directly to the immutable `LocalFallback` constant bundle (plus verified NASA/JPL photo cycling on Screen 5).
- **Anti-Logo APOD Guard & 3-Tier No-Cache Resilience:** APOD fetches a 6-item batch (`count=6`) and filters out videos, SVG/GIF icons, and NASA agency logos/seals/patches. An in-memory session cache and in-flight request deduplicator run alongside guarded 24h `localStorage` (`quack_nasa_cache_v1`), ensuring zero errors when judges disable cookies/storage or pass `?nocache=1`.
- **Immediate Offline Bypass (`?offline=1`):** When `navigator.onLine === false` or `?offline=1` is active, the client skips `fetch()` immediately and boots in `0 ms` from `LocalFallback` (`status = 'archived'`).
- **Low-Spec Device Optimization:** Ambient animations automatically throttle from CSS keyframes to a single `30 fps` `requestAnimationFrame` loop with `will-change: transform` when low-end CPU/memory or frame drops are detected.

---

## Scientific Auditability & Child Data Privacy

Every in-game number and crisis maps directly to official NASA telemetry or peer-reviewed spaceflight research, while keeping children's privacy completely protected on the client device:

| Audit Pillar | Implementation & Source | Verifiable Guarantee |
| :--- | :--- | :--- |
| **Solar Weather Telemetry** | **NASA CCMC DONKI** (`/DONKI/WS/get/FLR`) | Real Class **X8.7** solar flare (`2024-05-14`, Active Region `AR3664`) driving Sol 2 radiation and shielding decisions. |
| **Astrobiology & Space Botany** | **NASA OSDR Study `OSD-120`** (*Massa et al.*, 2017; *Zea et al.*, 2017/2020) | Real **Veggie** `16h/day` LED photoperiod for *Outredgeous* lettuce and spaceflight water-loop **biofilms**. |
| **Martian Surface Weather** | **Mars 2020 Perseverance `MEDA`** (*Rodriguez-Manfredi et al.*, 2021) | Real Jezero Crater nocturnal lows (`-85°C`), dust optical depth (`τ = 0.85`), and `14-min` one-way radio latency (`28-min` RTT). |
| **Astronomy Imagery** | **NASA APOD API** (`/planetary/apod`) | Live randomized astronomy photography and scientific captions in the Victory Passport, backed by curated NASA image fallback and local vector art. |
| **24h Cache & Lineage Badge** | `localStorage` (`quack_nasa_cache_v1`, 24h TTL) + Footer Indicator | Transparent telemetry status badge in the footer clearly shows **Live**, **Cache 24h**, or **Verified Archive** at all times. |
| **Child Data Privacy (Zero Collection)** | 100% Client-Side SPA · No Login · No Backend DB | Zero personal identifiers, analytics trackers, or student names ever leave the browser; **COPPA & LGPD Kids safe by design**. |

---

## Educational Business & Scalability Model

Because **Mission Sol-4** runs as a lightweight static web app with zero per-student cloud inference costs, it scales sustainably across three channels:
- **B2C (Free Open-Access for Families):** Forever-free web access for parents and children at home to explore real NASA data safely together.
- **B2G (Public School Districts & Ministries of Education):** Zero-infrastructure deployment for computer labs and low-bandwidth municipal networks, bundled with standards-aligned teacher guides and printable worksheets.
- **B2B (Private STEM Schools, Museums & EdTech Networks):** White-label classroom challenge packs, science-fair competition kits, and turn-key bilingual STEM workshop licensing.

---

## Product Roadmap

| Phase | Milestone | Scope & Deliverables |
| :--- | :--- | :--- |
| **V1 (Delivered)** | **Mars MVP & Universal Design** | Complete 5-screen Jezero Crater simulation, `$100M` Physics Lock Hangar, 4 Scientific Method Sols + Zero-G Workshop, local anti-spoiler Quack Chat, live/cached NASA APIs (`APOD`, `DONKI`, `OSDR`, `MEDA`), and native `♿ Accessibility` suite (`Large Text`, `High Contrast & Colorblind`, `Audio Description`). |
| **V2 (Next)** | **Artemis / Moon Expansion & Multi-Language** | New lunar South Pole survival module powered by Artemis telemetry, expanded `i18n` packs (Spanish & French alongside `EN-US` / `PT-BR`), and downloadable printable STEM classroom mission certificates. |
| **V3 (Future)** | **Teacher Analytics & Sign Language** | Optional zero-PII local classroom session summary exporter for educators (group trade-off debrief charts) plus integrated **LIBRAS / ASL** sign-language video overlays on narration cues. |

---

## Local Setup & Deployment Guide

### Prerequisites
- **Node.js** `>= 18.x` and **npm** `>= 9.x`

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Start the development server (http://localhost:3000)
npm run dev

# 3. Type-check the codebase
npm run lint

# 4. Build the production static bundle (outputs to dist/)
npm run build
```

### GitHub Pages Automated Deployment

This repository includes a pre-configured **GitHub Actions** workflow (`.github/workflows/deploy-pages.yml`) plus relative asset bundling (`base: './'` and `public/.nojekyll`):

1. Push this project to your GitHub repository on the `main` branch.
2. Open your repository on GitHub and go to **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Every push to `main` (or manual run via **Actions → Deploy Mission Sol-4 to GitHub Pages**) automatically typechecks (`npm run lint`), builds `dist/`, and publishes your live game to `https://[username].github.io/[repo-name]/`.

---

## GitHub Repository Metadata, Topics & Release Tags

Use these recommended fields in your GitHub repository sidebar (**About ⚙**) and releases:

- **Description:**
  `Interactive bilingual (EN-US/PT-BR) STEM Mars rescue game powered by real NASA data (DONKI, OSDR, MEDA, APOD) with circuit-breaker offline resilience and WCAG 2.1 accessibility.`
- **Topics (Tags):**
  `nasa`, `nasa-space-apps-challenge`, `mars`, `stem-education`, `educational-game`, `accessibility`, `wcag`, `bilingual`, `react`, `typescript`, `tailwindcss`, `vite`, `github-pages`
- **Documentation Artifacts Included:**
  - `docs/ARCHITECTURE.md` — System architecture, unified Mermaid.js data lineage, 24h cache schema, circuit breaker, WCAG 2.1 mapping, and tutor guardrails
  - `docs/IMPLEMENTATION_PLAN.md` — Per-endpoint Circuit Breaker & `LocalFallback` design specification
  - `docs/PEDAGOGICAL_GUIDE.md` — Educator classroom facilitation & STEM rubric
  - `DEMO_SCRIPT.md` — Pitch & live walkthrough script

### Creating Release Tag `v1.0.0`
```bash
git tag -a v1.0.0 -m "Mission Sol-4 v1.0.0 — NASA Space Apps Challenge Submission"
git push origin v1.0.0
```

---

## NASA Space Apps Challenge — Judging Criteria & Verification

### 1. Alignment with the 5 Official Judging Pillars

| Judging Criterion | How *Mission Sol-4: Guardians of Ares Base* Delivers |
| :--- | :--- |
| **Impact** | Teaches systems engineering, the Scientific Method, and STEM literacy to **ages 7–12** with zero prior space knowledge, built-in WCAG 2.1 AA accessibility (`Large Text`, `High Contrast & Colorblind Patterns`, `EN-US/PT-BR` audio description), and zero PII collection (`COPPA` / `LGPD Kids` safe). |
| **Creativity** | Turns dry telemetry into an emotional Mars rescue story led by **Commander Quack** (4 dynamic SVG expressions), a `$100M` mass-constrained Hangar, a Zero-G tool-scavenging workshop minigame, anti-spoiler mentoring, and a celebratory Martian Mambo & Constellation Observatory. |
| **Validity** | Grounded 100% in real NASA data and peer-reviewed spaceflight literature: **DONKI** Class `X8.7` (`AR3664`), **OSDR `OSD-120`** (*Massa et al.*, 2017; *Zea et al.*, 2018/2020), **Mars 2020 `MEDA`** (*Rodriguez-Manfredi et al.*, 2021 — `-85°C`, `τ = 0.85`, `14-min` delay), and **NASA APOD** + Mars `25.19°` tilt (**Deneb**). |
| **Relevance** | Bridges the gap between NASA's public open-science archives and elementary/middle-school classrooms, operating reliably on low-spec hardware, blocked cookies/incognito browsers, and offline school intranets via a per-endpoint Circuit Breaker + `LocalFallback`. |
| **Presentation** | Includes a live deployed web app, 2-minute judge walkthrough (`DEMO_SCRIPT.md`), unified Mermaid.js data lineage (`docs/ARCHITECTURE.md`), interactive **Real Science Lab** inspector inside the app, and printable educator guides (`docs/PEDAGOGICAL_GUIDE.md`). |

### 2. Judge Quickstart & Verification URLs

- **Standard Live Mode (DONKI + APOD + 24h Cache):**  
  `https://ais-pre-vhpaje572ys47vhgeaald5-760915443235.us-west2.run.app`
- **Test Circuit Breaker & Immediate `LocalFallback` (Zero Network Requests):**  
  `https://ais-pre-vhpaje572ys47vhgeaald5-760915443235.us-west2.run.app/?offline=1`
- **Test Storage-Disabled / No-Persistent-Cache Mode (RAM-Only Session Cache):**  
  `https://ais-pre-vhpaje572ys47vhgeaald5-760915443235.us-west2.run.app/?nocache=1`
- **Anti-Spoiler Pedagogical Check:** Open **Commander Quack Chat** in Sol 1–4 and ask *"Which card should I pick?"* — the agent refuses spoilers and guides trade-off reasoning using live gauges.

### 3. Open Data Attribution & AI Transparency Disclosure

- **NASA Open Data Sources Used:** NASA CCMC DONKI (`/DONKI/WS/get/FLR`), NASA Astronomy Picture of the Day (`/planetary/apod`), NASA Open Science Data Repository (`OSD-120`), and NASA Mars 2020 Perseverance `MEDA` peer-reviewed telemetry baselines.
- **Runtime AI Disclosure:** The deployed application executes **zero runtime LLM/generative-AI API calls** and requires **no user or server API keys** (`GEMINI_API_KEY` in `.env.example` is unused at runtime). Commander Quack's bilingual tutoring engine is 100% deterministic client-side TypeScript. Google AI Studio was used during development for software engineering, documentation, and static hosting.



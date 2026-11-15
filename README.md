# Mission Sol-4: Ares Base Guardians

**Team Ares Base Guardians** · *Maryangela Costa de Souza Florentin & Luna Costa Antunes*  
Official Submission — **NASA Space Apps Challenge (2026)**

- **Live Demo:** `https://[username].github.io/mission-sol4`
- **Source Repository:** `https://github.com/[username]/mission-sol4`
- **Architecture:** 100% Front-End SPA (React + TypeScript + Tailwind CSS + Vite) · Zero Backend · Bilingual (`EN-US` / `PT-BR`)

---

## Executive Summary & Pedagogical Vision

**Mission Sol-4: Ares Base Guardians** is an interactive, story-driven STEM rescue simulation designed for learners **ages 7–12** with **zero prior space science knowledge required**. Across four Martian days (**Sols 1–4**), solo players or rotating student teams apply the **Scientific Method** (*Observation → Hypothesis → Experiment → Conclusion*) to rescue mission mascot **Commander Quack** from escalating crises at **Jezero Crater, Mars**.

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

## Architecture, Caching & Offline Resilience

- **100% Front-End Execution:** Built with React, TypeScript, Tailwind CSS, Vite, and native Web Audio API. Zero servers, zero databases, and zero child data collection (COPPA / LGPD safe by design).
- **24-Hour `localStorage` Caching:** Parallel live API calls (`4,000 ms` timeout via `AbortController`) store telemetry in `quack_nasa_cache_v1` with a 24-hour TTL (`86,400,000 ms`), minimizing bandwidth in school computer labs.
- **Deterministic Offline Fallback:** If APIs time out or school networks restrict external traffic, the app seamlessly uses verified NASA datasets (`X8.7` flare, `OSD-120`, `MEDA`, curated NASA photo memories, and local Martian vector art) with zero gameplay interruption.
- **Low-Spec Device Optimization:** Ambient animations automatically throttle from CSS keyframes to a single `30 fps` `requestAnimationFrame` loop with `will-change: transform` when low-end CPU/memory or frame drops are detected.

---

## Official NASA Open Data Lineage & Peer-Reviewed References

| NASA Source | Dataset / Endpoint | Scientific Basis & Mission Integration |
| :--- | :--- | :--- |
| **NASA APOD API** | `/planetary/apod` | Live randomized astronomy imagery & explanations in the Victory Passport (with curated NASA image fallback). |
| **NASA CCMC DONKI** | `/DONKI/WS/get/FLR` | Real Class **X8.7** solar flare telemetry (`2024-05-14`, `AR3664`) driving Sol 2 radiation and shielding decisions. |
| **NASA OSDR** | Study `OSD-120` | **Veggie** `16h/day` LED photoperiod for *Outredgeous* lettuce (*Massa et al.*, 2017) & spaceflight water-loop **biofilms** (*Zea et al.*, 2017/2020). |
| **Mars 2020 Perseverance** | `MEDA` Weather Suite | Real Jezero Crater nocturnal lows (`-85°C`), dust optical depth (`τ = 0.85`), and `14-min` one-way radio latency (*Rodriguez-Manfredi et al.*, 2021). |

---

## Educational Business & Scalability Model

Because **Mission Sol-4** runs as a lightweight static web app with zero per-student cloud inference costs, it scales sustainably across three channels:
- **B2G (Public School Districts & Ministries of Education):** Zero-infrastructure deployment for computer labs and low-bandwidth municipal networks, bundled with standards-aligned teacher guides and printable worksheets.
- **B2B (Private STEM Schools, Museums & EdTech Networks):** White-label classroom challenge packs, science-fair competition kits, and turn-key bilingual STEM workshop licensing.
- **B2C (Free Open-Access for Families):** Forever-free web access for parents and children at home to explore real NASA data safely together.

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

### Static Deployment (GitHub Pages / Netlify / Vercel / School Intranet)
1. Run `npm run build` to generate the self-contained static `dist/` folder.
2. Deploy `dist/` to any static host (e.g., GitHub Pages at `https://[username].github.io/mission-sol4`). No server environment variables or backend secrets are required for core gameplay.

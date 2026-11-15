# System Architecture & Resilience Specification

**Project:** Mission Sol-4: Ares Base Guardians  
**Team:** Ares Base Guardians (*Maryangela Costa de Souza Florentin & Luna Costa Antunes*)  
**Submission Track:** NASA Space Apps Challenge  
**Runtime Model:** 100% Front-End Single Page Application (React · TypeScript · Tailwind CSS · Vite)

---

## 1. React + TypeScript Front-End Architecture

Mission Sol-4 is architected as a **zero-backend, zero-database, zero-LLM-cost Single Page Application (SPA)** so any home device, Chromebook, or bandwidth-constrained public school classroom can run the entire experience safely inside the browser without user accounts, external API keys, or personal data collection (COPPA & LGPD Kids compliant).

### Structural Separation & State Topology

```text
src/
├── App.tsx                       # Root state machine (screen, Sol 1–4, resources, Hangar, a11y, history)
├── types/game.ts                 # Strict TypeScript domain contracts (Resources, HangarConfig, NasaDataBundle)
├── services/nasaApi.ts           # Fault-tolerant NASA client, 4,000 ms timeout & 24h localStorage cache
├── data/
│   ├── missionData.ts            # Immutable Hangar constraints ($100M, mass caps) & Sol physics deltas
│   ├── missionDataEn.ts          # Full EN-US / PT-BR localized scenarios, badges, hotspots, references
│   └── toneCopy.ts               # Age-adaptive copy matrix (explorers, strategists, educators)
├── utils/
│   ├── a11ySpeech.ts             # Bilingual Web Speech API synthesis + declarative scene builder
│   └── sound.ts                  # Procedural Web Audio API synthesizer (SFX + Victory Mambo loop)
├── components/
│   ├── SplashScreen.tsx          # Non-blocking boot intro + top-right Accessibility Menu
│   ├── Screen1Prologue.tsx       # Narrative briefing, Solo/Team (2–4 players), avatar & reading profile
│   ├── Screen2Hangar.tsx         # Pre-launch mass/budget lock ($100M, Light/Heavy rocket, orbit, 2/3 tools)
│   ├── Screen3Command.tsx        # 4 Martian Sols, 4 telemetry gauges, Sol 3 Zero-G Workshop minigame
│   ├── Screen4Modal.tsx          # Educational badge unlock or Post-Failure physics diagnosis modal
│   ├── Screen5Victory.tsx        # Mambo celebration, interactive Martian night sky, Passport & NASA APOD
│   ├── AccessibilityMenu.tsx     # Native ♿ menu (Large Text, High Contrast & Colorblind, Read Aloud)
│   ├── MissionInfoHubModal.tsx   # 4-tab Science & Classroom Hub (Esc-dismissible, narrated)
│   ├── TechnicalLineagePanel.tsx # Interactive SVG lineage explorer & tabular audit view
│   ├── QuackMascot.tsx           # Automatic SVG mascot expressions (terror, drama, dizzy, celebrate)
│   ├── QuackChatWidget.tsx       # Draggable local pedagogical physics assistant with anti-spoiler guard
│   ├── GlossaryButton.tsx        # Inline zero-prior-knowledge Mars/NASA glossary popovers
│   ├── MartianStargazingSky.tsx  # Interactive constellation canvas (Deneb, Orion) + FPS guard
│   ├── SpaceVisuals.tsx          # UFO splash, launch sequence, Mambo parade & timed ET Easter eggs
│   ├── NasaFooter.tsx            # Real-time Live / 24h Cache / Verified Archive status indicator
│   └── ErrorBoundary.tsx         # Root recovery boundary preventing blank-screen classroom crashes
└── index.css                     # Tailwind CSS v4 tokens, motion keyframes & global a11y CSS overrides
```

### Key Front-End Engineering Guarantees

- **Strict State Ownership (`App.tsx`):** Screen progression (`splash` → `prologue` → `hangar` → `command` → `victory`), subsystem percentages (`energy`, `lifeSupport`, `shield`, `comms` clamped strictly to `[0, 100]`), Sol turn recovery snapshots (`solStartResources`), cumulative `choiceHistory`, and automatic mascot moods (`widgetExpression`) live in deterministic React state—no race conditions or server round-trips.
- **Zero-Asset Procedural Audio (`sound.ts`):** Interaction cues, tool pickups, gentle alerts, and the Screen 5 Mambo celebration groove are synthesized mathematically via the browser **Web Audio API**, eliminating external `.mp3`/`.wav` network requests on restricted school Wi-Fi.
- **Adaptive Low-Spec Performance (`MartianStargazingSky.tsx` & `index.css`):** Hardware telemetry hints (`navigator.hardwareConcurrency`, `navigator.deviceMemory`, Chromium `performance.memory`) combined with a 14-frame runtime FPS drop detector automatically downgrade heavy CSS animations into a single throttled `30 fps` `requestAnimationFrame` driver, honoring `prefers-reduced-motion` as well.
- **Resilient Classroom Runtime (`ErrorBoundary.tsx` & `Screen5Victory.tsx`):** Every `setTimeout`/`setInterval` cleans up on unmount, clipboard sharing falls back silently to `document.execCommand('copy')` inside restricted iframes, and remote NASA images enforce a bounded retry counter before swapping cleanly to `LocalMartianSpaceFallbackSvg`.

---

## 2. Unified NASA Data Lineage Flowchart & 24-Hour Cache Schema

The diagram below traces the complete runtime pipeline from official NASA open-science sources through the 24-hour `localStorage` caching layer and the Accessibility Layer into every interactive screen and Commander Quack's local pedagogical engine.

```mermaid
flowchart TD
    subgraph SOURCES["Official NASA Open Data & Curated Science Sources"]
        APOD["NASA APOD API<br/>GET api.nasa.gov/planetary/apod?count=1"]
        DONKI["NASA CCMC DONKI<br/>GET /DONKI/WS/get/FLR"]
        OSDR["NASA OSDR (Curated Baseline)<br/>Study OSD-120 · Massa et al. & Zea et al.<br/>(16h/day LED · ISS Biofilms)"]
        MEDA["Mars 2020 Perseverance MEDA (Curated Baseline)<br/>Rodriguez-Manfredi et al.<br/>(-85°C Night · τ=0.85 Dust · 14m Radio Lag)"]
    end

    subgraph PIPELINE["Fault-Tolerant Client Pipeline (src/services/nasaApi.ts)"]
        BOOT["App Mount -> Initialize Sync Fallback<br/>+ Async loadResilientNasaData()"]
        CHECK{"Fresh Cache in localStorage?<br/>key: quack_nasa_cache_v1<br/>Age < 24h (86,400,000 ms)"}
        CACHE_HIT["Return Cached Bundle<br/>status = 'cache' (🔵 24h Cache)"]
        FETCH["Promise.all([DONKI, APOD])<br/>fetchWithTimeout(4,000 ms) + AbortController"]
        VALIDATE{"HTTP 200 OK &<br/>Valid JSON Schema?"}
        WRITE_CACHE["Persist NasaDataBundle to localStorage<br/>status = 'live' (🟢 Live Data)"]
        FALLBACK["Deterministic Verified Fallback<br/>• FALLBACK_FLARE (Class X8.7, 2024-05-14)<br/>• VERIFIED_NASA_MEMORIES (5 NASA/JPL images)<br/>• CURATED_OSDR & CURATED_MEDA<br/>status = 'archived' (🟡 Verified Archive)"]
    end

    subgraph A11Y["Accessibility Layer (App.tsx + index.css + a11ySpeech.ts)"]
        A11Y_LS["Persisted Browser Flags (localStorage)<br/>• sol4_a11y_large_text -> html.a11y-large-text<br/>• sol4_a11y_high_contrast -> html.a11y-high-contrast"]
        A11Y_MENU["♿ AccessibilityMenu (Splash + Header)<br/>• Low Vision Switch & High Contrast Switch<br/>• Esc Dismissal & Trigger Focus Return"]
        SPEECH["Native Web Speech Engine (a11ySpeech.ts)<br/>window.speechSynthesis (en-US / pt-BR)<br/>Priority: InfoHubModal -> Screen4Modal -> Active Screen<br/>On-Demand Read Current Screen + Stop Reading"]
    end

    subgraph UI["100% Front-End Game Screens, Modals & Local Tutor"]
        STORE["App State Bundle<br/>(nasaData · lang · ageProfile · resources · history)"]
        SPLASH["SplashScreen<br/>Sync Telemetry + Top-Right A11y"]
        HANGAR["Screen 2: Engineering Hangar<br/>($100M Budget & Mass Lock + Patterned Meters)"]
        COMMAND["Screens 3–4: Sols 1–4 + Workshop + Modals<br/>(Gauges + Pattern Fills + SAFE/WARNING/CRITICAL)"]
        HUB["MissionInfoHubModal (4 Tabs)<br/>About · Explorer · Technical · Parents/Teachers"]
        VICTORY["Screen 5: Victory Passport & APOD<br/>Mambo Parade + Martian Sky + Science Lab"]
        IMG_GUARD{"Remote APOD Image<br/>Loads Cleanly?"}
        SVG_FALLBACK["Silent Local SVG Fallback<br/>LocalMartianSpaceFallbackSvg (Jezero Crater)"]
        QUACK["QuackChatWidget (Local Pedagogical Agent)<br/>Telemetry + History + Anti-Spoiler Guardrails"]
        FOOTER["NasaFooter Badge<br/>(🟢 Live / 🔵 24h Cache / 🟡 Archive)"]
    end

    BOOT --> CHECK
    CHECK -- "Yes (< 24h)" --> CACHE_HIT --> STORE
    CHECK -- "No / Expired" --> FETCH

    APOD --> FETCH
    DONKI --> FETCH
    OSDR -. "Merged deterministic baseline" .-> FALLBACK
    MEDA -. "Merged deterministic baseline" .-> FALLBACK

    FETCH --> VALIDATE
    VALIDATE -- "At least 1 live API hit" --> WRITE_CACHE --> STORE
    VALIDATE -- "Timeout / 429 / Firewall / Offline" --> FALLBACK --> STORE

    STORE --> FOOTER
    STORE --> SPLASH --> HANGAR --> COMMAND --> VICTORY
    STORE --> HUB
    STORE --> QUACK

    VICTORY --> IMG_GUARD
    IMG_GUARD -- "onError (bounded 1-retry guard)" --> SVG_FALLBACK

    A11Y_LS --> A11Y_MENU
    STORE --> A11Y_MENU
    A11Y_MENU -- "Applies root CSS classes & patterns" .-> SPLASH
    A11Y_MENU -- "Enlarges targets & contrast pills" .-> HANGAR
    A11Y_MENU -- "Adds fill patterns & text status tags" .-> COMMAND
    A11Y_MENU -- "Darkens tables, tabs & focus rings" .-> HUB
    A11Y_MENU -- "Formats Passport & APOD cards" .-> VICTORY
    A11Y_MENU -- "Read Current Screen / Stop Reading" --> SPEECH
    HUB -. "Highest narration priority" .-> SPEECH
```

### 24-Hour `localStorage` Caching Schema (`quack_nasa_cache_v1`)

To prevent classroom rate-limiting (`HTTP 429`) and repeated network overhead across shared lab sessions, `nasaApi.ts` serializes a single unified `NasaDataBundle` object under `localStorage["quack_nasa_cache_v1"]` with `CACHE_TTL_MS = 86,400,000` (24 hours):

```json
{
  "status": "live | cache | archived",
  "fetchedAt": 1763218500000,
  "donkiFlare": {
    "flrID": "2024-05-14T16:46:00-FLR-001",
    "classType": "X8.7",
    "peakTime": "2024-05-14T16:51Z",
    "sourceLocation": "S18W89 (Active Region AR3664)",
    "isFallback": false
  },
  "apod": {
    "title": "Jezero Crater Delta",
    "url": "https://images-assets.nasa.gov/image/PIA24428/PIA24428~medium.jpg",
    "explanation": "Orbital view of Jezero Crater's ancient river delta explored by Perseverance.",
    "date": "2021-02-18",
    "copyright": "NASA / JPL-Caltech",
    "isFallback": false
  },
  "osdr": {
    "studyId": "OSD-120",
    "title": "Veggie Greenhouse & Microgravity Biofilm Formation",
    "ledHoursPerDay": 16,
    "crop": "Outredgeous Lettuce (Lactuca sativa)",
    "biofilmFinding": "Microorganisms form thick biofilms inside spaceflight water loops (Zea et al., ISS)"
  },
  "meda": {
    "mission": "Mars 2020 Perseverance — MEDA",
    "location": "Jezero Crater, Mars",
    "nightTempC": -85,
    "dustOpacityTau": 0.85,
    "oneWayRadioDelayMin": 14
  }
}
```

#### Deterministic Fallback & Resilience Rules
1. **Zero-Latency Initial Boot:** `App.tsx` initializes synchronously from `getArchivedFallbackBundle()`, so the UI renders immediately without blocking spinners while `loadResilientNasaData()` resolves in the background.
2. **Cache Freshness Resolution:** `readCache()` checks `Date.now() - parsed.fetchedAt < CACHE_TTL_MS`. Fresh entries downgrade `status` from `'live'` to `'cache'` (or `'archived'` if both remote APIs had previously fallen back), strictly avoiding stale or corrupted JSON crashes via `try/catch`.
3. **4,000 ms Timeout Protection:** `fetchWithTimeout()` attaches an `AbortController` signal to every `fetch()` call and clears its timer on resolution or `4,000 ms` expiry, silently degrading to `FALLBACK_FLARE` (`Class X8.7`) and `VERIFIED_NASA_MEMORIES`.
4. **Partial Live Persistence:** `writeCache(bundle)` only persists to `localStorage` when `liveHits > 0`, ensuring transient network outages do not lock a classroom into a 24-hour archived cache once connectivity returns.
5. **Bounded Remote Image Recovery:** In `Screen5Victory.tsx`, broken APOD URLs are tracked in `failedUrlsRef` (`Set<string>`); after at most one verified fallback retry, the card transitions cleanly to `LocalMartianSpaceFallbackSvg` so zero broken-image icons appear.

---

## 3. Accessibility Layer (`a11y-large-text`, `a11y-high-contrast` & `window.speechSynthesis`)

Universal Design is built directly into the core frontend layer with **zero external accessibility widgets or third-party scripts**, keeping the controls lightweight, privacy-safe, and continuously accessible from both the **Splash Screen** (`variant="splash"`) and the persistent sticky **Header** (`variant="header"`).

### A. Root State Management & `localStorage` Persistence (`App.tsx`)

- **Persisted Keys:** `sol4_a11y_large_text` and `sol4_a11y_high_contrast` store `'1'` / `'0'` in `window.localStorage` via guarded `readStoredA11yFlag()` / `writeStoredA11yFlag()` helpers that fail safely in restricted private-browsing contexts.
- **Root DOM Synchronization:** Dedicated `useEffect` hooks synchronize `document.documentElement.classList` on state changes:
  - `html.a11y-large-text`: Scales root font size to `118.75%` (`19px` equivalent base `rem`), expands body and list line-height to `1.65`, adds subtle `0.01em` tracking, increases card/popover padding (`1.35rem`), and enforces a `2.75rem` (`44px`) minimum height on interactive buttons (`button:not(.a11y-compact-btn)`) without introducing horizontal scrollbars.
  - `html.a11y-high-contrast`: Activates a pure black (`#000000` / `#09090b`) surface palette with `#ffffff` crisp `2px` borders, `#facc15` (`#000000` foreground) active CTA buttons, `#fda4af` (`#000000` foreground) active Stop Reading actions, distinct dashed styling for `:disabled` controls (`#18181b` surface, `#cbd5e1` text), clean non-clipped gradient headings (`.bg-clip-text` override), high-contrast table cells (`table`, `th`, `td`), and `3px solid #facc15` `:focus-visible` outlines.
- **Colorblind-Safe Telemetry Differentiation (`Screen2Hangar.tsx`, `Screen3Command.tsx`, `index.css`):** Under `html.a11y-high-contrast`, progress tracks expand (`height: 0.75rem`), expose hidden status badges (`.a11y-hc-only` switching from `none` to `inline-flex` rendering `OK` / `OVER` or `SAFE` / `WARNING <35%` / `CRITICAL 0%`), and pair hues with distinct repeating CSS patterns:
  - **Energy (`a11y-pattern-energy`):** `#facc15` with 45° diagonal hatching
  - **Life Support (`a11y-pattern-lifeSupport`):** `#22d3ee` with repeating radial dot matrix
  - **Shield (`a11y-pattern-shield`):** `#e879f9` with −45° reverse diagonal hatching
  - **Comms (`a11y-pattern-comms`):** `#a3e635` with 90° vertical stripes
  - **Danger `<35%` (`a11y-pattern-danger`):** `#fb7185` with high-contrast 135° dark stripes

### B. On-Demand Web Speech API Engine (`src/utils/a11ySpeech.ts`)

Instead of intrusive auto-play audio when switching views, narration operates strictly **on demand** when the user clicks **"Read Current Screen"** (*"Ler Tela Atual"*), paired with an instant **"Stop Reading"** (*"Parar Leitura"*) control and `aria-live="polite"` status announcements.

1. **Runtime Capability & Lifecycle Safety:** `isSpeechSupported()` verifies `typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined'`. Any active speech utterance is immediately canceled via `stopSpeech()` (`window.speechSynthesis.cancel()`) on language switch (`en` ↔ `pt`), before starting a new narration, or on component unmount.
2. **Bilingual Voice Selection (`en-US` & `pt-BR`):** `speakText()` sets `utterance.lang` to `'en-US'` or `'pt-BR'`, configures a comfortable pedagogical cadence (`rate = 0.98`, `pitch = 1.0`), and selects matching regional or prefix voices from `synth.getVoices()` when available.
3. **Modal-Aware Narration Priority (`buildCurrentScreenNarration`):** To guarantee blind and low-vision users never hear background screen content while a dialog overlays the viewport, narration resolves in strict visual priority order:
   1. **Active Info Hub Modal (`infoHubTab`):** Narrates whichever of the 4 tabs (`about`, `explorer`, `technical`, `parents`) is currently open in `MissionInfoHubModal.tsx`, plus live resource bar statuses and dialog layout cues.
   2. **Active Sol Feedback / Failure Modal (`modalFeedback`):** Narrates badge unlocks, resource deltas, post-failure NASA physics diagnoses, `<35%` danger alerts, and Commander Quack's modal expression.
   3. **Active Base Screen (`splash`, `prologue`, `hangar`, `command`, `victory`):** Narrates the active screen title, Commander Quack's age-adapted quote, live Hangar mass/budget specs or Sol telemetry, Earth transmission latency notes, and a vivid visual description of the Martian scene (including UFO splash animation, Zero-G Workshop state, and the Victory Mambo parade).
4. **Splash Pause & Keyboard Interaction:** Opening the Accessibility menu on `SplashScreen.tsx` pauses the auto-advance progress bar (`pausedByA11y`) so assistive-technology users can configure Large Text, High Contrast, or trigger Read Aloud without time pressure. Pressing `Esc` closes both `AccessibilityMenu` (returning DOM focus to the trigger button via `triggerRef`) and `MissionInfoHubModal`.

---

## 4. WCAG 2.1 Compliance Mapping Table

| WCAG 2.1 Criterion | Level | Compliance Implementation in Mission Sol-4 | Verification Source |
| :--- | :--- | :--- | :--- |
| **1.4.1 Use of Color** | A | Every telemetry bar, Hangar physics lock, and card delta combines color with dedicated Lucide icons, signed numeric percentages (`+15%` / `-8%`), distinct repeating CSS fill patterns (`.a11y-pattern-*`), and explicit status text badges (`SAFE` / `WARNING <35%` / `CRITICAL 0%`; `OK` / `OVER`). | `index.css`, `Screen2Hangar.tsx`, `Screen3Command.tsx` |
| **1.4.3 Contrast (Minimum)** | AA | `a11y-high-contrast` overrides light pastel pills (`bg-slate-200`, `bg-*-50`, `bg-*-100`), table headers/cells, and gradient headings to `#000000`/`#09090b` surfaces with `#ffffff` text/borders, `#facc15` primary CTAs (`#000000` ink), `#fda4af` stop-reading CTAs (`#000000` ink), and legible `#cbd5e1`-on-`#18181b` disabled buttons. | `index.css`, `AccessibilityMenu.tsx`, `TechnicalLineagePanel.tsx` |
| **1.4.4 Resize Text** | AA | `a11y-large-text` scales root `font-size` to `118.75%` across all `rem`-based Tailwind utilities, relaxes line-height to `1.65`, expands container padding (`1.35rem`), and scales responsive grid cards cleanly with zero horizontal clipping. | `index.css`, responsive Tailwind layouts across `Screen1`–`Screen5` |
| **2.1.1 Keyboard** | A | Native `<button>`, `<input>`, and switch controls support full `Tab`/`Shift+Tab` and `Enter`/`Space` activation; `Esc` dismisses both the Accessibility popover (restoring focus to the trigger button) and `MissionInfoHubModal`. | `AccessibilityMenu.tsx`, `MissionInfoHubModal.tsx`, `Screen1Prologue.tsx`–`Screen5Victory.tsx` |
| **2.4.7 Focus Visible** | AA | Interactive controls enforce `focus-visible:outline-2` in default themes and a universal `3px solid #facc15` outline with `2px` offset (`*:focus-visible`) whenever High Contrast mode is active. | `index.css`, `Screen3Command.tsx`, `QuackChatWidget.tsx` |
| **4.1.2 Name, Role, Value** | A | Semantic attributes define state and structure natively: `role="switch"` + `aria-checked`, `aria-expanded` + `aria-haspopup="dialog"`, `role="dialog"` + `aria-modal`, `role="progressbar"` with `aria-valuenow`/`min`/`max`, `role="alert"` on danger/validation banners, and `aria-live="polite"` speech status updates. | `AccessibilityMenu.tsx`, `SplashScreen.tsx`, `Screen2Hangar.tsx`, `Screen3Command.tsx`, `Screen4Modal.tsx` |

---

## 5. Pedagogical Agent Guardrails (`QuackChatWidget`)

Commander Quack's draggable Q&A assistant (`src/components/QuackChatWidget.tsx`) uses a **100% deterministic local rule-and-telemetry engine** instead of an external generative LLM. This eliminates prompt-injection risks, network failures, hallucinations, API costs, and child-privacy exposure while keeping every hint scientifically accurate.

| Guardrail Layer | Implementation Mechanism | Educational & Safety Purpose |
| :--- | :--- | :--- |
| **1. Anti-Spoiler Interception Gate** | `generateSmartQuackReply()` normalizes input (`normalizeText()` folds case and Unicode diacritics) and intercepts answer-seeking queries (*"which card"*, *"what card"*, *"which option"*, *"answer"*, *"a b or c"*, *"qual carta"*, *"qual opcao"*, *"qual eu clico"*, *"qual escolher"*, *"resposta"*) **before** evaluating any other branch. | Refuses to spoil Card A, B, or C; instead identifies the crew's lowest resource gauge and delivers a contextual physics clue for the active Sol (`light` in Sol 1, `magnetism` in Sol 2, `photons` in Sol 3, `momentum` in Sol 4). |
| **2. Zero-Hallucination NASA Grounding** | All numerical assertions inject live runtime fields directly from `nasaData` (`donkiFlare.classType`, `donkiFlare.flrID`, `osdr.studyId`, `osdr.ledHoursPerDay`, `meda.nightTempC`, `meda.dustOpacityTau`, `meda.oneWayRadioDelayMin`, `apod.title`, `apod.date`). | Guarantees 100% alignment with peer-reviewed NASA sources (*Zea et al.*, *Massa et al.*, *Rodriguez-Manfredi et al.*) and real CCMC/APOD records. |
| **3. 6-Domain Age-Profile Scaffolding** | `buildPhysicsPunByProfile()` maps 6 physics concepts (`gravity`, `thermo`, `light`, `magnetism`, `photons`, `momentum`) across 3 reading profiles (`explorers`, `strategists`, `educators`) in both English and Portuguese. | Matches STEM depth to the learner—translating `-85°C` and `3.71 m/s²` into playful duck metaphors for ages 7–10, Tsiolkovsky/Δv trade-offs for teens, and formal radiative/photoperiod coupling for educators. |
| **4. Live Telemetry & History Trace Binding** | `summarizeHistoryContext()` reads `screen`, `currentSol`, `hangarConfig`, `resources`, and `choiceHistory` (`cardTitle`, `category`, `enteredDanger`) on every query, flagging `<35%` danger gauges dynamically. | Grounds scientific feedback in the student's actual mission trace (e.g., warning when a prior move pushed Life Support into danger or noting hybrid engineering strategies). |
| **5. UI, XSS & Lifecycle Hardening** | React JSX text interpolation escapes all output (no `dangerouslySetInnerHTML`); unmatched custom prompts truncate echoed text to `slice(0, 36)`; `messages` cap at the latest 9 entries (`slice(-8)`); `thinkingTimerRef` clears on unmount; `clampPosition()` keeps the draggable widget inside viewport bounds across `resize` and minimize/expand toggles. | Prevents UI overflow, off-screen widget loss on narrow tablets/phones, and React memory leaks during classroom rotations. |

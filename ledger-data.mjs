// The Harness Lab — 27-build evolution ledger (theharnesslab.dev Chapter VII).
// Ported 2026-11-17 from the theharnesslab.com chronological timeline forensics
// (per-repo first/latest commit SHAs, authored-source LOC excluding
// node_modules, lockfiles, dist and vendor SDKs). Personal experiments and retired builds are excluded from
// the public record. Months are rounded UP to whole months from first to latest
// commit; anything under one month is a Rapid Sprint.
// Generated data — edit by hand only with care; tests/ledger.test.mjs guards it.

export const LEDGER_SUMMARY = Object.freeze({
  "builds": 27,
  "authoredLoc": 1031828,
  "commits": 3922,
  "windowStart": "2025-07",
  "windowEnd": "2026-11"
});

export const LEDGER_ERAS = Object.freeze([
  {
    "id": "2025-early",
    "label": "Early Agentic Grind",
    "window": "Jul – Sep 2025"
  },
  {
    "id": "2026-winter",
    "label": "Multi-AI Foundations",
    "window": "Jan – Apr 2026"
  },
  {
    "id": "2026-summer",
    "label": "Studio, Title & OS Wave",
    "window": "May – Aug 2026"
  },
  {
    "id": "2026-fall",
    "label": "Sovereign Harnesses & Live Engines",
    "window": "Oct – Nov 2026"
  }
]);

export const LEDGER_BUILDS = Object.freeze([
  {
    "order": 1,
    "slug": "brandstreams",
    "title": "MyAIMediaMgr → BrandStreams (brandstream.my)",
    "shortTitle": "MyAIMediaMgr → BrandStreams",
    "category": "Flagship SaaS Platform",
    "eraId": "2025-early",
    "tiers": [
      "flagship"
    ],
    "firstCommitIso": "2025-07-27T16:46:56",
    "latestCommitIso": "2026-08-27T20:00:21",
    "firstCommitDisplay": "Jul 27, 2025, 4:46 PM CDT",
    "latestCommitDisplay": "Aug 27, 2026, 8:00 PM CDT",
    "firstCommitSha": "028216fe",
    "latestCommitSha": "48ff5c71",
    "startMonthLabel": "July 2025",
    "endMonthLabel": "August 2026",
    "monthsLabel": "14 Months",
    "commits": 1364,
    "initialLoc": 9683,
    "latestLoc": 81254,
    "initialFiles": 109,
    "latestFiles": 424,
    "languages": [
      {
        "name": "TypeScript",
        "pct": 82.9
      },
      {
        "name": "JavaScript",
        "pct": 10.2
      },
      {
        "name": "SQL/Schema",
        "pct": 2.6
      }
    ],
    "lineage": "Lineage: MyAiMediaMgr → MAIMM → MYAIMEDIAMANAGER-V8.1 → MAIMM_FINAL_PROD | BrandStreams · Final_MyAiMediaMgr_website",
    "liveUrl": null,
    "liveLabel": null,
    "idea": "Spencer's first major AI SaaS platform — built to give small and medium-sized businesses an autonomous AI social-media agency capable of multi-slot campaign planning, brand-consistent image/video generation, approval workflows, and multi-platform scheduling across Instagram, Facebook, X, LinkedIn, and TikTok. Born in July 2025 when early cloud sandboxes (Replit) repeatedly corrupted environments and forced full rebuilds (v1 -> v6 -> v8.1 -> v10 -> MAIMM_FINAL_PROD -> BrandStreams), directly inspiring Spencer to build Apex-Build.",
    "architecture": "TypeScript full-stack monorepo: React + Vite + Tailwind + Framer Motion client (client/src, 155+ components/views including 14-slot Campaign Board V2, Multi-Model AI Brainstorm Studio, Grok Imagine Studio, Content Calendar, and Approval Queue) paired with an Express + Drizzle ORM + PostgreSQL + BullMQ/Redis worker backend (server/), Stripe billing, Ayrshare default-deny tenant-isolated publishing, and Docker/Traefik production deployment on brandstream.my.",
    "aiLandscape": {
      "openai": "ChatGPT defaulted to GPT-4o alongside transitional GPT-4.5 (Feb 2025), developer API models GPT-4.1 / 4.1-mini / 4.1-nano (Apr 14, 2025; ChatGPT May 14, 2025), and separate chain-of-thought reasoning models o3 & o4-mini (Apr 16, 2025) plus o3-pro (Jun 10, 2025). GPT-5 had NOT launched yet, and Codex CLI (Apr 2025) was in its infancy; cloud 'vibe-coding' sandboxes like Replit frequently corrupted state and lost multi-file work.",
      "anthropic": "Claude Opus 4 and Claude Sonnet 4 (launched May 22, 2025, succeeding Feb 2025's Claude 3.7 Sonnet) offered early hybrid extended thinking with beta tool interleaving, while Claude Code had just entered general availability.",
      "google": "Gemini 2.5 Pro and Gemini 2.5 Flash had just reached general availability around June 17, 2025 (following March 2025 previews), with developers actively migrating off Gemini 1.5 Pro/Flash and 2.0 Flash."
    },
    "gitTrail": [
      {
        "date": "2026-08-27",
        "branch": "BrandStreams/main",
        "message": "48ff5c71 · fix production database migration constraints"
      },
      {
        "date": "2026-08-26",
        "branch": "BrandStreams/main",
        "message": "3184db68 · fix: harden customer readiness and release gates"
      },
      {
        "date": "2026-08-26",
        "branch": "BrandStreams/main",
        "message": "da1e97e3 · fix(admin-test-mode): codex image path cannot use bubblewrap in a container"
      },
      {
        "date": "2026-08-25",
        "branch": "fix/audit-critical",
        "message": "22a26d27 · fix(security): scope Ayrshare publishing per user, close schedule IDORs"
      },
      {
        "date": "2026-08-25",
        "branch": "fix/audit-critical",
        "message": "1f011b93 · fix: repair payment return path, broken endpoints, and admin escalation"
      },
      {
        "date": "2026-08-25",
        "branch": "fix/audit-critical",
        "message": "c24aae2c · fix(billing): fail closed when the Stripe webhook secret is missing"
      },
      {
        "date": "2026-08-25",
        "branch": "fix/audit-critical",
        "message": "f7bd678e · fix(db): drop duplicate NO ACTION foreign keys that veto user deletion"
      },
      {
        "date": "2026-01-19",
        "branch": "MAIMM_FINAL_PROD",
        "message": "a05130f2 · Fix credit balance check to use max of ledger and users.credits"
      },
      {
        "date": "2025-11-08",
        "branch": "MAIMM_FINAL_PROD",
        "message": "14fda2de · Register TikTok and LinkedIn OAuth routes & Meta compliance webhooks"
      },
      {
        "date": "2025-08-31",
        "branch": "MAIMM_FINAL_PROD",
        "message": "Initial commit of MYAIMEDIAMANAGER-V8.1 (following 8 prior full rebuilds)"
      }
    ],
    "shot": {
      "src": "/assets/showcase/brandstreams/05-brandstreams-post-rename-landing.webp",
      "src640": "/assets/showcase/brandstreams/05-brandstreams-post-rename-landing-640.webp",
      "width": 1600,
      "height": 1000,
      "alt": "Post-rename BrandStream (BRANDSTREAM.MY) landing page hero featuring the raised-neon metallic BrandStream emblem, orbital circuitry, and updated AI workflow positioning.",
      "caption": "Post-rename BrandStream (BRANDSTREAM.MY) landing page hero featuring the raised-neon metallic BrandStream emblem, orbital circuitry, and updated AI workflow positioning."
    }
  },
  {
    "order": 2,
    "slug": "aegis-app-architect",
    "title": "AEGIS App Architect (Apex-Build Predecessor #1)",
    "shortTitle": "AEGIS App Architect",
    "category": "Cloud AI Builder Lineage (Attempt #1)",
    "eraId": "2025-early",
    "tiers": [
      "rapid"
    ],
    "firstCommitIso": "2025-08-31T22:04:25",
    "latestCommitIso": "2025-08-31T22:04:25",
    "firstCommitDisplay": "Aug 31, 2025, 5:04 PM CDT",
    "latestCommitDisplay": "Aug 31, 2025, 5:04 PM CDT",
    "firstCommitSha": "f4b18230",
    "latestCommitSha": "f4b18230",
    "startMonthLabel": "August 2025",
    "endMonthLabel": "August 2025",
    "monthsLabel": "1 Month (Rapid Sprint)",
    "commits": 1,
    "initialLoc": 46927,
    "latestLoc": 46927,
    "initialFiles": 350,
    "latestFiles": 350,
    "languages": [
      {
        "name": "TypeScript",
        "pct": 59.6
      },
      {
        "name": "JavaScript",
        "pct": 37
      },
      {
        "name": "CSS/SCSS",
        "pct": 1.4
      }
    ],
    "lineage": "AEGIS-APP-ARCHITECT",
    "liveUrl": null,
    "liveLabel": null,
    "idea": "First of three attempts to solve the broken cloud AI app-builder problem Spencer hit while building MyAIMediaMgr on Replit: an initial generated full-stack React + Node.js application-architect scaffold exploring structured app generation.",
    "architecture": "React + TypeScript/JavaScript frontend & Node.js backend scaffold (Flatlogic-bootstrapped baseline) integrating early gpt-4o generation hooks; superseded three weeks later by custom-built Starfish Prime.",
    "aiLandscape": {
      "openai": "OpenAI launched GPT-5 on August 7, 2025 (gpt-5, gpt-5-mini, gpt-5-nano), unifying fast generation and deep 'GPT-5 Thinking' behind an automatic router and replacing GPT-4o in ChatGPT — though the coding-specialized gpt-5-codex had not yet shipped.",
      "anthropic": "Anthropic released Claude Opus 4.1 on August 5, 2025, improving multi-file software engineering precision and agentic tool reliability alongside Claude Sonnet 4.",
      "google": "Gemini 2.5 Pro and Gemini 2.5 Flash served as Google's frontier reasoning and high-throughput developer API models."
    },
    "gitTrail": [],
    "shot": null
  },
  {
    "order": 3,
    "slug": "starfish-prime",
    "title": "Starfish Prime / Neon Builder (Apex-Build Predecessor #2)",
    "shortTitle": "Starfish Prime / Neon Builder",
    "category": "Cloud AI Builder Lineage (Attempt #2)",
    "eraId": "2025-early",
    "tiers": [
      "rapid"
    ],
    "firstCommitIso": "2025-09-19T17:56:55",
    "latestCommitIso": "2025-09-22T15:12:20",
    "firstCommitDisplay": "Sep 19, 2025, 5:56 PM CDT",
    "latestCommitDisplay": "Sep 22, 2025, 3:12 PM CDT",
    "firstCommitSha": "d7a41b14",
    "latestCommitSha": "2f22612c",
    "startMonthLabel": "September 2025",
    "endMonthLabel": "September 2025",
    "monthsLabel": "1 Month (Rapid Sprint)",
    "commits": 9,
    "initialLoc": 407,
    "latestLoc": 3509,
    "initialFiles": 21,
    "latestFiles": 93,
    "languages": [
      {
        "name": "JavaScript",
        "pct": 34.8
      },
      {
        "name": "Config",
        "pct": 29.4
      },
      {
        "name": "TypeScript",
        "pct": 20.7
      }
    ],
    "lineage": "Lineage: Neon Builder | starfish-prime (branch: origin/master)",
    "liveUrl": null,
    "liveLabel": null,
    "idea": "Second iteration of what became Apex-Build: a custom-engineered multi-agent autonomous app-building pipeline ('Neon Builder — Final') with a Spec Kit JSON planner and an 8-stage agent pipeline (planner, architect, scaffolder, coder, tester, packer, deployer, integrator). Note: origin/master preserves the true Sep 2025 Starfish Prime codebase (d7a41b14 -> 2f22612c), whereas origin/main was accidentally overwritten in Jan 2026 with SilverGuard ElderCare commits.",
    "architecture": "Dockerized monorepo with Next.js + React Mission Control UI, Fastify + Prisma + PostgreSQL JWT API, Server-Sent Events (SSE) live agent log streaming, and multi-provider AI orchestration.",
    "aiLandscape": {
      "openai": "GPT-5 led ChatGPT while OpenAI released gpt-5-codex on September 15, 2025 — the first GPT-5 variant specifically trained for agentic repository work inside Codex CLI and IDE extensions.",
      "anthropic": "Claude Opus 4.1 led most of September until Anthropic launched Claude Sonnet 4.5 on September 29, 2025 with major leaps in sustained coding and computer use.",
      "google": "Gemini 2.5 Pro and Gemini 2.5 Flash remained Google's production flagship models (two months prior to Gemini 3 Pro's preview)."
    },
    "gitTrail": [],
    "shot": {
      "src": "/assets/showcase/apex-build/00-predecessor-starfish-prime-1440x900.webp",
      "src640": "/assets/showcase/apex-build/00-predecessor-starfish-prime-1440x900-640.webp",
      "width": 1600,
      "height": 1000,
      "alt": "Historical Predecessor (Sep 2025, starfish-prime @ 2f22612): 'Neon Builder — Final' Mission Control showing the early 8-stage autonomous pipeline (planner, architect, scaffolder, coder, tester, packer, deployer, integrator), Spec Kit plan JSON, and streaming Live Log.",
      "caption": "Historical Predecessor (Sep 2025, starfish-prime @ 2f22612): 'Neon Builder — Final' Mission Control showing the early 8-stage autonomous pipeline (planner, architect, scaffolder, coder, tester, packer, deployer, integrator), Spec Kit plan JSON, and streaming Live Log."
    }
  },
  {
    "order": 4,
    "slug": "silverguard-eldercare",
    "title": "SilverGuard ElderCare",
    "shortTitle": "SilverGuard ElderCare",
    "category": "Mobile & Healthcare AI App",
    "eraId": "2026-winter",
    "tiers": [
      "rapid"
    ],
    "firstCommitIso": "2026-01-02T08:36:30",
    "latestCommitIso": "2026-01-23T19:31:29",
    "firstCommitDisplay": "Jan 2, 2026, 8:36 AM CST",
    "latestCommitDisplay": "Jan 23, 2026, 7:31 PM CST",
    "firstCommitSha": "9aa9d304",
    "latestCommitSha": "9a07ebb9",
    "startMonthLabel": "January 2026",
    "endMonthLabel": "January 2026",
    "monthsLabel": "1 Month (Rapid Sprint)",
    "commits": 16,
    "initialLoc": 0,
    "latestLoc": 35705,
    "initialFiles": 60,
    "latestFiles": 130,
    "languages": [
      {
        "name": "TypeScript",
        "pct": 94.1
      },
      {
        "name": "JavaScript",
        "pct": 2.7
      },
      {
        "name": "Config",
        "pct": 1.9
      }
    ],
    "lineage": "Silverguard-Eldercare",
    "liveUrl": null,
    "liveLabel": null,
    "idea": "Dual-mode iOS and Android eldercare application enabling family caregivers and seniors to coordinate daily activities, medication schedules, vitals, emergency alerts, and a voice-enabled AI Care Buddy — engineered with strict server-side AI key isolation so zero API keys ship in mobile client bundles.",
    "architecture": "React Native + Expo + TypeScript mobile/web application backed by Firebase Auth, Firestore, and Cloud Functions proxying Anthropic, OpenAI Realtime/Whisper/TTS, and Gemini APIs.",
    "aiLandscape": {
      "openai": "GPT-5.2 and GPT-5.2-Codex (released Dec 11–18, 2025 after Nov 12's GPT-5.1) powered long-horizon coding, while mobile/voice apps still relied on gpt-4o-realtime-preview, whisper-1, and tts-1-hd just weeks before GPT-4o's Feb 13, 2026 ChatGPT retirement.",
      "anthropic": "Claude Opus 4.5 (released Nov 24, 2025 at USD 5/USD 25 per M tokens), Claude Sonnet 4.5 (Sep 29, 2025), and Claude Haiku 4.5 (Oct 15, 2025) formed Anthropic's active frontier lineup.",
      "google": "Gemini 3 Pro Preview (Nov 18, 2025) and Gemini 3 Flash (Dec 17, 2025) had recently debuted alongside production Gemini 2.5 Pro/Flash and experimental 2.0 Flash audio/vision endpoints."
    },
    "gitTrail": [],
    "shot": {
      "src": "/assets/showcase/silverguard-eldercare/01-welcome-login.webp",
      "src640": "/assets/showcase/silverguard-eldercare/01-welcome-login-640.webp",
      "width": 1600,
      "height": 1000,
      "alt": "SilverGuard ElderCare — Dual-role Caregiver Sign-In (LoginScreen.tsx) paired alongside the 7:1 WCAG-AAA High-Contrast Senior Home (SeniorHomeScreen.tsx)",
      "caption": "SilverGuard ElderCare — Dual-role Caregiver Sign-In (LoginScreen.tsx) paired alongside the 7:1 WCAG-AAA High-Contrast Senior Home (SeniorHomeScreen.tsx)"
    }
  },
  {
    "order": 5,
    "slug": "apex-build",
    "title": "APEX.BUILD (apex-build.dev)",
    "shortTitle": "APEX.BUILD",
    "category": "Flagship Multi-AI Cloud IDE & 9-Agent Build Platform",
    "eraId": "2026-winter",
    "tiers": [
      "flagship"
    ],
    "firstCommitIso": "2026-01-22T04:08:51",
    "latestCommitIso": "2026-06-05T21:13:46",
    "firstCommitDisplay": "Jan 22, 2026, 4:08 AM CST",
    "latestCommitDisplay": "Jun 5, 2026, 4:13 PM CDT",
    "firstCommitSha": "6aa6b68a",
    "latestCommitSha": "b6401bdd",
    "startMonthLabel": "January 2026",
    "endMonthLabel": "June 2026",
    "monthsLabel": "5 Months",
    "commits": 966,
    "initialLoc": 1495,
    "latestLoc": 377197,
    "initialFiles": 5,
    "latestFiles": 852,
    "languages": [
      {
        "name": "Go",
        "pct": 69.4
      },
      {
        "name": "TypeScript",
        "pct": 23.2
      },
      {
        "name": "Config",
        "pct": 2.6
      }
    ],
    "lineage": "Lineage: AEGIS App Architect → Starfish Prime | apex-build-platform · starfish-prime",
    "liveUrl": "https://apex-build.dev/",
    "liveLabel": "apex-build.dev",
    "idea": "Third and culmination platform solving autonomous AI software engineering end-to-end: a multi-AI cloud development environment where 9 governed specialist agents plan, architect, build, race-repair ('Hydra'), test via Playwright, and deploy full-stack web & mobile apps inside hardened Docker sandboxes — while showing live real-time dollar/token burn, diff review, rollback, and AST contract intelligence.",
    "architecture": "Massive 377,197-LOC Go + TypeScript platform: 261,673 LOC Go backend (backend/internal/agents, Gin/GORM, PostgreSQL, Redis, Docker seccomp sandboxes, Operational Transforms, SAML/SCIM/RBAC, AES-256-GCM BYOK vault, AST + Build Contract Graph) + 87,497 LOC React/TypeScript/Monaco Cloud IDE frontend (frontend/src) + Kubernetes manifests & live golden-build verification suite.",
    "aiLandscape": {
      "openai": "GPT-5.2 and GPT-5.2-Codex (released Dec 11–18, 2025 after Nov 12's GPT-5.1) powered long-horizon coding, while mobile/voice apps still relied on gpt-4o-realtime-preview, whisper-1, and tts-1-hd just weeks before GPT-4o's Feb 13, 2026 ChatGPT retirement.",
      "anthropic": "Claude Opus 4.5 (released Nov 24, 2025 at USD 5/USD 25 per M tokens), Claude Sonnet 4.5 (Sep 29, 2025), and Claude Haiku 4.5 (Oct 15, 2025) formed Anthropic's active frontier lineup.",
      "google": "Gemini 3 Pro Preview (Nov 18, 2025) and Gemini 3 Flash (Dec 17, 2025) had recently debuted alongside production Gemini 2.5 Pro/Flash and experimental 2.0 Flash audio/vision endpoints."
    },
    "gitTrail": [
      {
        "date": "2026-06-05",
        "branch": "apex-build-platform",
        "message": "Add runtime stability smoke tests, heartbeat/dead-agent checks & backpressure policy"
      },
      {
        "date": "2026-01-22",
        "branch": "apex-build-platform",
        "message": "Initial commit: Multi-AI cloud development platform (1,064-commit run)"
      }
    ],
    "shot": {
      "src": "/assets/showcase/apex-build/03-landing-latest-blue-steel-1440x900.webp",
      "src640": "/assets/showcase/apex-build/03-landing-latest-blue-steel-1440x900-640.webp",
      "width": 1600,
      "height": 1000,
      "alt": "Latest APEX-BUILD Enterprise Blue-Steel Landing Hero (HEAD @ b6401bd): 'THE MOST ADVANCED AI APP BUILDER EVER CREATED' with neural core artwork, Kimi K2.6 Conductor 9-agent workspace preview, and live USD 0.144 / USD 0.500 build contract spend.",
      "caption": "Latest APEX-BUILD Enterprise Blue-Steel Landing Hero (HEAD @ b6401bd): 'THE MOST ADVANCED AI APP BUILDER EVER CREATED' with neural core artwork, Kimi K2.6 Conductor 9-agent workspace preview, and live USD 0.144 / USD 0.500 build contract spend."
    }
  },
  {
    "order": 6,
    "slug": "spectre",
    "title": "Spectre Threat Monitor",
    "shortTitle": "Spectre Threat Monitor",
    "category": "Cybersecurity & Threat Intelligence UI",
    "eraId": "2026-winter",
    "tiers": [
      "harness",
      "rapid"
    ],
    "firstCommitIso": "2026-01-23T18:35:42",
    "latestCommitIso": "2026-01-23T18:35:42",
    "firstCommitDisplay": "Jan 23, 2026, 6:35 PM CST",
    "latestCommitDisplay": "Jan 23, 2026, 6:35 PM CST",
    "firstCommitSha": "9ceb1a0e",
    "latestCommitSha": "9ceb1a0e",
    "startMonthLabel": "January 2026",
    "endMonthLabel": "January 2026",
    "monthsLabel": "1 Month (Rapid Sprint)",
    "commits": 1,
    "initialLoc": 834,
    "latestLoc": 834,
    "initialFiles": 20,
    "latestFiles": 20,
    "languages": [
      {
        "name": "TypeScript",
        "pct": 48.1
      },
      {
        "name": "Config",
        "pct": 23.9
      },
      {
        "name": "JavaScript",
        "pct": 18.2
      }
    ],
    "lineage": "Lineage: specter-threat-monitor → specter-frontend",
    "liveUrl": null,
    "liveLabel": null,
    "idea": "Dark-web threat intelligence and network-monitoring command dashboard built the same week Apex-Build kicked off (Jan 23, 2026) to visualize onion/mesh node topology, heuristic payload alerts, tracked identities, and live AES-256-GCM Tor circuit relay telemetry in a zero-clutter operator console.",
    "architecture": "React 19 + TypeScript + Vite + Tailwind CSS + Framer Motion single-page intelligence console featuring interactive SVG network-topology graphs (Global vs Local Mesh modes), threat KPI telemetry cards, heuristic alert feeds, and streaming Tor circuit console logs.",
    "aiLandscape": {
      "openai": "GPT-5.2 and GPT-5.2-Codex (released Dec 11–18, 2025 after Nov 12's GPT-5.1) powered long-horizon coding, while mobile/voice apps still relied on gpt-4o-realtime-preview, whisper-1, and tts-1-hd just weeks before GPT-4o's Feb 13, 2026 ChatGPT retirement.",
      "anthropic": "Claude Opus 4.5 (released Nov 24, 2025 at USD 5/USD 25 per M tokens), Claude Sonnet 4.5 (Sep 29, 2025), and Claude Haiku 4.5 (Oct 15, 2025) formed Anthropic's active frontier lineup.",
      "google": "Gemini 3 Pro Preview (Nov 18, 2025) and Gemini 3 Flash (Dec 17, 2025) had recently debuted alongside production Gemini 2.5 Pro/Flash and experimental 2.0 Flash audio/vision endpoints."
    },
    "gitTrail": [],
    "shot": {
      "src": "/assets/showcase/spectre/01-entry-intelligence-overview-1440x900.webp",
      "src640": "/assets/showcase/spectre/01-entry-intelligence-overview-1440x900-640.webp",
      "width": 1600,
      "height": 1000,
      "alt": "SPECTER entry & intelligence command overview ('DASHBOARD :: OVERVIEW') with sidebar Tor/system status indicators, 4 KPI telemetry cards (1,024 Active Nodes, HIGH/CRITICAL Threat Level, 8.4M Intercepted Packets, 42 Identities Tracked), interactive SVG/Framer Motion network topology graph, and Recent Heuristic Alerts feed.",
      "caption": "SPECTER entry & intelligence command overview ('DASHBOARD :: OVERVIEW') with sidebar Tor/system status indicators, 4 KPI telemetry cards (1,024 Active Nodes, HIGH/CRITICAL Threat Level, 8.4M Intercepted Packets, 42 Identities Tracked), interactive SVG/Framer Motion network topology graph, and Recent Heuristic Alerts feed."
    }
  },
  {
    "order": 7,
    "slug": "voxscript",
    "title": "VoxScript",
    "shortTitle": "VoxScript",
    "category": "AI Audio & Media Utility",
    "eraId": "2026-winter",
    "tiers": [
      "rapid"
    ],
    "firstCommitIso": "2026-04-06T22:34:12",
    "latestCommitIso": "2026-04-06T22:34:12",
    "firstCommitDisplay": "Apr 6, 2026, 10:34 PM CDT",
    "latestCommitDisplay": "Apr 6, 2026, 10:34 PM CDT",
    "firstCommitSha": "fd55f58a",
    "latestCommitSha": "fd55f58a",
    "startMonthLabel": "April 2026",
    "endMonthLabel": "April 2026",
    "monthsLabel": "1 Month (Rapid Sprint)",
    "commits": 1,
    "initialLoc": 1100,
    "latestLoc": 1100,
    "initialFiles": 3,
    "latestFiles": 3,
    "languages": [
      {
        "name": "HTML",
        "pct": 78.1
      },
      {
        "name": "JavaScript",
        "pct": 20.5
      },
      {
        "name": "Config",
        "pct": 1.4
      }
    ],
    "lineage": "voxscript",
    "liveUrl": null,
    "liveLabel": null,
    "idea": "Instant AI video transcription and synthesis web service: paste any YouTube URL to extract audio, generate an accurate timestamped transcript, produce structured AI summaries, and export clean text.",
    "architecture": "Node.js + Express backend (server.js) paired with a self-contained modern HTML/CSS/JS workspace (public/index.html) calling OpenAI Whisper (whisper-1) for transcription and gpt-4o-mini for fast summarization.",
    "aiLandscape": {
      "openai": "GPT-5.4 Thinking/Pro/mini/nano and GPT-5.3-Codex were joined by GPT-5.4-Cyber (Apr 14, 2026) for defensive security workflows, while lightweight apps still used gpt-4o-mini and whisper-1 for low-cost transcription.",
      "anthropic": "Anthropic released Claude Opus 4.7 on April 16, 2026 (alongside Claude Design preview) for complex long-running engineering, complementing Claude Sonnet 4.6.",
      "google": "Gemini 3.1 Pro Preview, Gemini 3 Flash, and gemini-3.1-flash-image (Nano Banana 2) powered Google's multimodal API stack."
    },
    "gitTrail": [],
    "shot": {
      "src": "/assets/showcase/voxscript/01-landing.webp",
      "src640": "/assets/showcase/voxscript/01-landing-640.webp",
      "width": 1600,
      "height": 1000,
      "alt": "VoxScript — Clean dark-mode hero and instant YouTube / 1,000+ site video URL entry studio",
      "caption": "VoxScript — Clean dark-mode hero and instant YouTube / 1,000+ site video URL entry studio"
    }
  },
  {
    "order": 8,
    "slug": "bounded-synthetic-life-experiment",
    "title": "Bounded Synthetic Life Experiment & LLM Bias Falsification Audit",
    "shortTitle": "Bounded Synthetic Life Experiment",
    "category": "AI Safety, Consciousness & Empirical Audit Research",
    "eraId": "2026-winter",
    "tiers": [
      "rapid"
    ],
    "firstCommitIso": "2026-04-07T02:13:58",
    "latestCommitIso": "2026-04-07T02:58:59",
    "firstCommitDisplay": "Apr 7, 2026, 2:13 AM CDT",
    "latestCommitDisplay": "Apr 7, 2026, 2:58 AM CDT",
    "firstCommitSha": "fdc4dd2b",
    "latestCommitSha": "fe41c388",
    "startMonthLabel": "April 2026",
    "endMonthLabel": "April 2026",
    "monthsLabel": "1 Month (Rapid Sprint)",
    "commits": 3,
    "initialLoc": 0,
    "latestLoc": 0,
    "initialFiles": 1,
    "latestFiles": 1,
    "languages": [],
    "lineage": "bounded-synthetic-life-experiment",
    "liveUrl": null,
    "liveLabel": null,
    "idea": "Formal research paper and controlled empirical audit examining bounded synthetic selfhood, neuromodulatory affect stacks, ethical containment boundaries for artificial life (submitted to Sentience Institute & Anthropic research fellows), paired with a 3-arm controlled ChatGPT political source-selection falsification audit.",
    "architecture": "Versioned LaTeX/PDF/DOCX formal research monograph (v1/, bounded_synthetic_life_experiment_v2.pdf, 6-module bounded selfhood architecture & 8xH100 compute budget model) plus reproducible 3-arm prompt/source-selection audit records (chatgpt-bias-audit/).",
    "aiLandscape": {
      "openai": "GPT-5.4 Thinking/Pro/mini/nano and GPT-5.3-Codex were joined by GPT-5.4-Cyber (Apr 14, 2026) for defensive security workflows, while lightweight apps still used gpt-4o-mini and whisper-1 for low-cost transcription.",
      "anthropic": "Anthropic released Claude Opus 4.7 on April 16, 2026 (alongside Claude Design preview) for complex long-running engineering, complementing Claude Sonnet 4.6.",
      "google": "Gemini 3.1 Pro Preview, Gemini 3 Flash, and gemini-3.1-flash-image (Nano Banana 2) powered Google's multimodal API stack."
    },
    "gitTrail": [],
    "shot": {
      "src": "/assets/showcase/bounded-synthetic-life-experiment/01-landing.webp",
      "src640": "/assets/showcase/bounded-synthetic-life-experiment/01-landing-640.webp",
      "width": 1600,
      "height": 1000,
      "alt": "A Bounded Synthetic Life Experiment — Dual-page publication spread of the 12-page April 2026 research specification (Abstract, Executive Summary & Figure 1 architecture)",
      "caption": "A Bounded Synthetic Life Experiment — Dual-page publication spread of the 12-page April 2026 research specification (Abstract, Executive Summary & Figure 1 architecture)"
    }
  },
  {
    "order": 9,
    "slug": "the-harness-lab",
    "title": "The Harness Lab (theharnesslab.com & theharnesslab.dev)",
    "shortTitle": "The Harness Lab",
    "category": "Company Flagship Site, R&D Foundry & Reliability Kit",
    "eraId": "2026-summer",
    "tiers": [
      "flagship"
    ],
    "firstCommitIso": "2026-06-05T09:21:54",
    "latestCommitIso": "2026-11-15T22:25:41",
    "firstCommitDisplay": "Jun 5, 2026, 4:21 AM CDT",
    "latestCommitDisplay": "Nov 15, 2026, 10:25 PM CST",
    "firstCommitSha": "158b353b",
    "latestCommitSha": "0c90a289",
    "startMonthLabel": "June 2026",
    "endMonthLabel": "November 2026",
    "monthsLabel": "6 Months",
    "commits": 60,
    "initialLoc": 1125,
    "latestLoc": 14319,
    "initialFiles": 8,
    "latestFiles": 64,
    "languages": [
      {
        "name": "JavaScript",
        "pct": 48
      },
      {
        "name": "CSS/SCSS",
        "pct": 41.4
      },
      {
        "name": "HTML",
        "pct": 7.5
      }
    ],
    "lineage": "Lineage: Praetor Forge | praetor-forge-site · THE-HARNESS-LAB/theharnesslab-dev",
    "liveUrl": "https://theharnesslab.com/",
    "liveLabel": "theharnesslab.com",
    "idea": "Spencer's engineering studio and AI agent harness foundry. Launched on June 5, 2026 at 09:21 UTC as 'Praetor Forge' and rebranded 12 hours later (b908db2, 21:54 UTC) into 'The Harness Lab' — pairing a true-black + sculpted marble-and-gold flagship company site (theharnesslab.com), an R&D foundry site (theharnesslab.dev), a Cloudflare Email intake worker, and an internal Go/TypeScript/Python Hermes reliability harness (the-harness-lab).",
    "architecture": "React + Vite + bespoke 3D marble/gold CSS design system (src/components/Hero.jsx, Chapters.jsx, 14,319 authored LOC in praetor-forge-site) + TypeScript Cloudflare Worker (intake-worker/src/index.ts -> harness-lab-intake) + static engineering studio (theharnesslab-dev, 750 LOC) + Go/TypeScript/Python reliability & benchmark kit (the-harness-lab, 13,958 LOC).",
    "aiLandscape": {
      "openai": "GPT-5.4 / transitional GPT-5.5 builds and Codex parallel orchestration led OpenAI's stack as OpenAI began the 90-day deprecation window for legacy o3.",
      "anthropic": "Claude Opus 4.7 and Sonnet 4.6 carried engineering workloads through June until Anthropic launched 5th-generation Claude Sonnet 5 on June 30, 2026 (following the brief June 9 Fable 5 preview).",
      "google": "Gemini 3.5 Flash and Gemini 3.1 Pro served as Google's primary reasoning and multimodal developer models."
    },
    "gitTrail": [],
    "shot": {
      "src": "/assets/showcase/the-harness-lab/03-theharnesslab-dev-landing.webp",
      "src640": "/assets/showcase/the-harness-lab/03-theharnesslab-dev-landing-640.webp",
      "width": 1440,
      "height": 900,
      "alt": "Earlier theharnesslab.dev engineering landing page: custom software for complex workflows",
      "caption": "An earlier generation of the theharnesslab.dev engineering site, before the Nero Marquina foundry rebuild."
    }
  },
  {
    "order": 10,
    "slug": "spencers-agent-os",
    "title": "Spencer's Agent OS (Claude Code OS / Mythos OS)",
    "shortTitle": "Mythos OS (Spencer’s Agent OS)",
    "category": "Multi-Agent Control Center & Knowledge Graph",
    "eraId": "2026-summer",
    "tiers": [
      "harness",
      "rapid"
    ],
    "firstCommitIso": "2026-06-09T04:14:47",
    "latestCommitIso": "2026-06-16T12:56:43",
    "firstCommitDisplay": "Jun 8, 2026, 11:14 PM CDT",
    "latestCommitDisplay": "Jun 16, 2026, 12:56 PM CDT",
    "firstCommitSha": "275f49bf",
    "latestCommitSha": "400d23c1",
    "startMonthLabel": "June 2026",
    "endMonthLabel": "June 2026",
    "monthsLabel": "1 Month (Rapid Sprint)",
    "commits": 62,
    "initialLoc": 2211,
    "latestLoc": 28734,
    "initialFiles": 33,
    "latestFiles": 176,
    "languages": [
      {
        "name": "TypeScript",
        "pct": 89.8
      },
      {
        "name": "Shell",
        "pct": 3.7
      },
      {
        "name": "CSS/SCSS",
        "pct": 3.1
      }
    ],
    "lineage": "Lineage: Claude Code OS → Mythos OS | spencers-agent-os",
    "liveUrl": null,
    "liveLabel": null,
    "idea": "Visual operating system and control center for managing autonomous coding harnesses, live Graphify knowledge-graph topology, background 'Dream engine' memory consolidation, and multi-provider subscription telemetry in one dark cockpit.",
    "architecture": "Next.js + React + TypeScript application (28,734 authored LOC across 176 source files) backed by Supabase REST/PostgreSQL persistence, interactive force-directed Graphify visualization, shell daemon bridges, and Playwright verification.",
    "aiLandscape": {
      "openai": "GPT-5.4 / transitional GPT-5.5 builds and Codex parallel orchestration led OpenAI's stack as OpenAI began the 90-day deprecation window for legacy o3.",
      "anthropic": "Claude Opus 4.7 and Sonnet 4.6 carried engineering workloads through June until Anthropic launched 5th-generation Claude Sonnet 5 on June 30, 2026 (following the brief June 9 Fable 5 preview).",
      "google": "Gemini 3.5 Flash and Gemini 3.1 Pro served as Google's primary reasoning and multimodal developer models."
    },
    "gitTrail": [],
    "shot": {
      "src": "/assets/showcase/spencers-agent-os/02-memory-graphify-force-graph.webp",
      "src640": "/assets/showcase/spencers-agent-os/02-memory-graphify-force-graph-640.webp",
      "width": 1440,
      "height": 900,
      "alt": "Memory and Graphify knowledge graph view rendering an interactive d3-force architecture graph across 320 highest-degree nodes and 12 detected communities alongside Hermes and Claude auto-memory.",
      "caption": "Memory and Graphify knowledge graph view rendering an interactive d3-force architecture graph across 320 highest-degree nodes and 12 detected communities alongside Hermes and Claude auto-memory."
    }
  },
  {
    "order": 11,
    "slug": "wealth-powers-os",
    "title": "Wealth & Powers OS",
    "shortTitle": "Wealth & Powers OS",
    "category": "Fintech & Personal Wealth Operating System",
    "eraId": "2026-summer",
    "tiers": [
      "flagship",
      "rapid"
    ],
    "firstCommitIso": "2026-06-12T13:29:59",
    "latestCommitIso": "2026-06-12T13:29:59",
    "firstCommitDisplay": "Jun 12, 2026, 1:29 PM CDT",
    "latestCommitDisplay": "Jun 12, 2026, 1:29 PM CDT",
    "firstCommitSha": "55da1c29",
    "latestCommitSha": "55da1c29",
    "startMonthLabel": "June 2026",
    "endMonthLabel": "June 2026",
    "monthsLabel": "1 Month (Rapid Sprint)",
    "commits": 1,
    "initialLoc": 7110,
    "latestLoc": 7110,
    "initialFiles": 45,
    "latestFiles": 45,
    "languages": [
      {
        "name": "TypeScript",
        "pct": 90.5
      },
      {
        "name": "CSS/SCSS",
        "pct": 8.3
      },
      {
        "name": "Config",
        "pct": 0.9
      }
    ],
    "lineage": "wealth-powers-os",
    "liveUrl": null,
    "liveLabel": null,
    "idea": "Bespoke personal wealth and portfolio operating system built for Jake Powers, unifying asset allocation, cash-flow command, tax/entity tracking, and AI-assisted scenario modeling inside an executive dashboard.",
    "architecture": "Next.js + React + TypeScript single-repo web platform (7,110 authored LOC across 45 files) with modular wealth analytics views and multi-model financial copilot adapters.",
    "aiLandscape": {
      "openai": "GPT-5.4 / transitional GPT-5.5 builds and Codex parallel orchestration led OpenAI's stack as OpenAI began the 90-day deprecation window for legacy o3.",
      "anthropic": "Claude Opus 4.7 and Sonnet 4.6 carried engineering workloads through June until Anthropic launched 5th-generation Claude Sonnet 5 on June 30, 2026 (following the brief June 9 Fable 5 preview).",
      "google": "Gemini 3.5 Flash and Gemini 3.1 Pro served as Google's primary reasoning and multimodal developer models."
    },
    "gitTrail": [],
    "shot": null
  },
  {
    "order": 12,
    "slug": "samara",
    "title": "Samara (Website-Reading AI Sales Agent)",
    "shortTitle": "Samara",
    "category": "AI Sales & Grounded Web Agent",
    "eraId": "2026-summer",
    "tiers": [
      "rapid"
    ],
    "firstCommitIso": "2026-06-26T17:36:25",
    "latestCommitIso": "2026-06-26T17:36:25",
    "firstCommitDisplay": "Jun 26, 2026, 5:36 PM CDT",
    "latestCommitDisplay": "Jun 26, 2026, 5:36 PM CDT",
    "firstCommitSha": "19a383bd",
    "latestCommitSha": "19a383bd",
    "startMonthLabel": "June 2026",
    "endMonthLabel": "June 2026",
    "monthsLabel": "1 Month (Rapid Sprint)",
    "commits": 1,
    "initialLoc": 698,
    "latestLoc": 698,
    "initialFiles": 12,
    "latestFiles": 12,
    "languages": [
      {
        "name": "JavaScript",
        "pct": 93.3
      },
      {
        "name": "Config",
        "pct": 6.7
      }
    ],
    "lineage": "samara",
    "liveUrl": null,
    "liveLabel": null,
    "idea": "Embeddable AI inbound sales agent that fetches, parses, and grounds itself in a prospect's live website (or any URL dropped in chat) before replying — replacing generic chatbot scripts with tailored pitches anchored in the prospect's actual business.",
    "architecture": "Lightweight Node.js HTTP server (src/server.js, 698 authored LOC across 12 files) with live URL fetching/sanitization, context extraction, and grounded conversational generation.",
    "aiLandscape": {
      "openai": "GPT-5.4 / transitional GPT-5.5 builds and Codex parallel orchestration led OpenAI's stack as OpenAI began the 90-day deprecation window for legacy o3.",
      "anthropic": "Claude Opus 4.7 and Sonnet 4.6 carried engineering workloads through June until Anthropic launched 5th-generation Claude Sonnet 5 on June 30, 2026 (following the brief June 9 Fable 5 preview).",
      "google": "Gemini 3.5 Flash and Gemini 3.1 Pro served as Google's primary reasoning and multimodal developer models."
    },
    "gitTrail": [],
    "shot": {
      "src": "/assets/showcase/samara/01-landing.webp",
      "src640": "/assets/showcase/samara/01-landing-640.webp",
      "width": 1600,
      "height": 1000,
      "alt": "Samara — Website-Reading AI Sales Agent Studio showing strict knowledge/product.md fact grounding, HONEST_ABOUT_AI toggle, and prospect recon entry",
      "caption": "Samara — Website-Reading AI Sales Agent Studio showing strict knowledge/product.md fact grounding, HONEST_ABOUT_AI toggle, and prospect recon entry"
    }
  },
  {
    "order": 13,
    "slug": "settings-sentinel",
    "title": "Settings Sentinel & Security Broker",
    "shortTitle": "Settings Sentinel & Security Broker",
    "category": "Linux Workstation Security & Privileged Capability Broker",
    "eraId": "2026-summer",
    "tiers": [
      "harness",
      "rapid"
    ],
    "firstCommitIso": "2026-08-01T17:19:12",
    "latestCommitIso": "2026-08-01T17:51:33",
    "firstCommitDisplay": "Aug 1, 2026, 5:19 PM CDT",
    "latestCommitDisplay": "Aug 1, 2026, 5:51 PM CDT",
    "firstCommitSha": "local",
    "latestCommitSha": "local",
    "startMonthLabel": "August 2026",
    "endMonthLabel": "August 2026",
    "monthsLabel": "1 Month (Rapid Sprint)",
    "commits": 1,
    "initialLoc": 2519,
    "latestLoc": 2519,
    "initialFiles": 15,
    "latestFiles": 15,
    "languages": [
      {
        "name": "Python",
        "pct": 80
      },
      {
        "name": "Shell",
        "pct": 8.7
      },
      {
        "name": "JavaScript",
        "pct": 8.3
      }
    ],
    "lineage": "Ubuntu Omen workstation",
    "liveUrl": null,
    "liveLabel": null,
    "idea": "Built on August 1, 2026 to make autonomous multi-agent execution safe on Spencer's primary Ubuntu workstation without sacrificing root integrity: Settings Sentinel watches /etc, /boot, dotfiles, dconf, browser policies, and TTY executions with a 15-second GTK4 layer-shell confirmation overlay and instant rollback, while Security Broker provides a narrow, TOCTOU-free, validator-gated capability bridge.",
    "architecture": "Python 3 + GTK4 Layer Shell daemon (settings_sentinel/ui.py, risk.py, events.jsonl, Chrome/Firefox enterprise policy guards, 2,519 LOC) paired with security-broker (broker.py, 364 LOC, single-read staging into /usr/local/lib/secfeat/, JSONL audit log, strict refusal of PAM/sudoers/SSH/firewall weakened rules).",
    "aiLandscape": {
      "openai": "OpenAI's GPT-5.6 family (Sol flagship, Terra mid-tier, Luna fast tier, launched July 2026 with ultra parallel agent mode) received major August 2026 API price cuts (up to 80% on Luna, 20%+ on Sol/Terra) and Cerebras Ultrafast previews; legacy o3 retired in late August.",
      "anthropic": "Claude Opus 5 (launched July 24, 2026) and Claude Sonnet 5 (June 30, 2026) delivered full 5th-generation agentic coding and verification.",
      "google": "Gemini 3.6 Flash (July 2026) and Gemini 3.7 Flash (August 2026) brought substantial gains in long-document OCR/comprehension and agentic tool reliability."
    },
    "gitTrail": [],
    "shot": {
      "src": "/assets/showcase/settings-sentinel/01-gtk-alert-overlay.webp",
      "src640": "/assets/showcase/settings-sentinel/01-gtk-alert-overlay-640.webp",
      "width": 1600,
      "height": 1000,
      "alt": "Settings Sentinel — Always-on-top 15-second Gtk4LayerShell security alert overlay flagging a 96%-risk /etc/sudoers.d escalation with diff and instant rollback controls",
      "caption": "Settings Sentinel — Always-on-top 15-second Gtk4LayerShell security alert overlay flagging a 96%-risk /etc/sudoers.d escalation with diff and instant rollback controls"
    }
  },
  {
    "order": 14,
    "slug": "tractpilot-agent",
    "title": "TractPilot Agent (TitleDesk Electron Prototype)",
    "shortTitle": "TractPilot Agent",
    "category": "Vertical AI Desktop Prototype (Oil & Gas Land Title)",
    "eraId": "2026-summer",
    "tiers": [
      "rapid"
    ],
    "firstCommitIso": "2026-08-02T09:20:50",
    "latestCommitIso": "2026-08-02T21:50:44",
    "firstCommitDisplay": "Aug 2, 2026, 9:20 AM CDT",
    "latestCommitDisplay": "Aug 2, 2026, 9:50 PM CDT",
    "firstCommitSha": "local",
    "latestCommitSha": "local",
    "startMonthLabel": "August 2026",
    "endMonthLabel": "August 2026",
    "monthsLabel": "1 Month (Rapid Sprint)",
    "commits": 1,
    "initialLoc": 4288,
    "latestLoc": 4288,
    "initialFiles": 71,
    "latestFiles": 71,
    "languages": [
      {
        "name": "TypeScript",
        "pct": 91
      },
      {
        "name": "Config",
        "pct": 4
      },
      {
        "name": "Shell",
        "pct": 3.2
      }
    ],
    "lineage": "Ubuntu Omen workstation",
    "liveUrl": null,
    "liveLabel": null,
    "idea": "August 2, 2026 Electron desktop prototype built on Omen that proved the core TitleDesk thesis four days before titledesk-agent commit #1: converting company Google Drive folders and county clerk research into a cited document index, runsheet, exact NMA ownership ledger, and completed Excel workbook.",
    "architecture": "Electron + React + Vite + TypeScript + tesseract.js + Playwright desktop workspace (4,288 authored LOC across 71 source files).",
    "aiLandscape": {
      "openai": "OpenAI's GPT-5.6 family (Sol flagship, Terra mid-tier, Luna fast tier, launched July 2026 with ultra parallel agent mode) received major August 2026 API price cuts (up to 80% on Luna, 20%+ on Sol/Terra) and Cerebras Ultrafast previews; legacy o3 retired in late August.",
      "anthropic": "Claude Opus 5 (launched July 24, 2026) and Claude Sonnet 5 (June 30, 2026) delivered full 5th-generation agentic coding and verification.",
      "google": "Gemini 3.6 Flash (July 2026) and Gemini 3.7 Flash (August 2026) brought substantial gains in long-document OCR/comprehension and agentic tool reliability."
    },
    "gitTrail": [],
    "shot": {
      "src": "/assets/showcase/tractpilot-agent/01-workspace-home.webp",
      "src640": "/assets/showcase/tractpilot-agent/01-workspace-home-640.webp",
      "width": 1600,
      "height": 1000,
      "alt": "TractPilot Agent v0.1.0 (Aug 2026 TitleDesk Predecessor) — Local-first landman workspace & 5-step source index pipeline",
      "caption": "TractPilot Agent v0.1.0 (Aug 2026 TitleDesk Predecessor) — Local-first landman workspace & 5-step source index pipeline"
    }
  },
  {
    "order": 15,
    "slug": "crg-proud-heisenberg",
    "title": "CRG / Boundary-Star Instability (proud-heisenberg)",
    "shortTitle": "CRG / Boundary-Star Instability",
    "category": "Quantum Gravity & Mathematical Physics Simulation",
    "eraId": "2026-summer",
    "tiers": [
      "rapid"
    ],
    "firstCommitIso": "2026-08-05T03:56:20",
    "latestCommitIso": "2026-08-05T08:21:00",
    "firstCommitDisplay": "Aug 5, 2026, 3:56 AM CDT",
    "latestCommitDisplay": "Aug 5, 2026, 8:21 AM CDT",
    "firstCommitSha": "ee41d6a5",
    "latestCommitSha": "ee41d6a5",
    "startMonthLabel": "August 2026",
    "endMonthLabel": "August 2026",
    "monthsLabel": "1 Month (Rapid Sprint)",
    "commits": 1,
    "initialLoc": 8283,
    "latestLoc": 8283,
    "initialFiles": 94,
    "latestFiles": 94,
    "languages": [
      {
        "name": "Python",
        "pct": 100
      }
    ],
    "lineage": "Ubuntu Omen workstation",
    "liveUrl": null,
    "liveLabel": null,
    "idea": "Computational mathematical-physics investigation discovering and proving that 'Boundary-Star Instability' obstructs naive trace-compatibility tests in recursive 3D Turaev–Viro / SU(2)_k state-sum refinements — enforcing Spencer's standing falsification rule: always null-test a proposed test before trusting its signal.",
    "architecture": "94-file Python numerical simulation & verification suite (8,283 authored Python LOC + 843 LaTeX/Markdown lines across src/, experiments/, tests/, and paper/) validating Biedenharn–Elliott identities to 1.11e-16 machine precision and running 5-stage null-control falsification suites.",
    "aiLandscape": {
      "openai": "OpenAI's GPT-5.6 family (Sol flagship, Terra mid-tier, Luna fast tier, launched July 2026 with ultra parallel agent mode) received major August 2026 API price cuts (up to 80% on Luna, 20%+ on Sol/Terra) and Cerebras Ultrafast previews; legacy o3 retired in late August.",
      "anthropic": "Claude Opus 5 (launched July 24, 2026) and Claude Sonnet 5 (June 30, 2026) delivered full 5th-generation agentic coding and verification.",
      "google": "Gemini 3.6 Flash (July 2026) and Gemini 3.7 Flash (August 2026) brought substantial gains in long-document OCR/comprehension and agentic tool reliability."
    },
    "gitTrail": [],
    "shot": {
      "src": "/assets/showcase/crg-proud-heisenberg/01-boundary-star-instability.webp",
      "src640": "/assets/showcase/crg-proud-heisenberg/01-boundary-star-instability-640.webp",
      "width": 1600,
      "height": 1000,
      "alt": "CRG Quantum Gravity — Boundary-Star Instability theorem, 2^n boundary hinge incidence geometry, and factor-2.0 defect convergence across 1→4 (B=4) and 2→6 (B=3) towers",
      "caption": "CRG Quantum Gravity — Boundary-Star Instability theorem, 2^n boundary hinge incidence geometry, and factor-2.0 defect convergence across 1→4 (B=4) and 2→6 (B=3) towers"
    }
  },
  {
    "order": 16,
    "slug": "titledesk",
    "title": "TitleDesk Agent (Desktop App, Predecessor & Ecosystem)",
    "shortTitle": "TitleDesk Agent",
    "category": "Flagship Desktop Vertical AI Product (Oil & Gas Land Title)",
    "eraId": "2026-summer",
    "tiers": [
      "flagship"
    ],
    "firstCommitIso": "2026-08-06T20:09:17",
    "latestCommitIso": "2026-11-11T03:52:37",
    "firstCommitDisplay": "Aug 6, 2026, 8:09 PM CDT",
    "latestCommitDisplay": "Nov 11, 2026, 3:52 AM CST",
    "firstCommitSha": "7bf1c2e2",
    "latestCommitSha": "8a2cc971",
    "startMonthLabel": "August 2026",
    "endMonthLabel": "November 2026",
    "monthsLabel": "4 Months",
    "commits": 1084,
    "initialLoc": 25623,
    "latestLoc": 262305,
    "initialFiles": 119,
    "latestFiles": 1184,
    "languages": [
      {
        "name": "TypeScript",
        "pct": 96.5
      },
      {
        "name": "JavaScript",
        "pct": 1
      },
      {
        "name": "CSS/SCSS",
        "pct": 0.9
      }
    ],
    "lineage": "Lineage: TractPilot Agent → HARNESS-LAB-BUILDS | THE-HARNESS-LAB/titledesk-agent · HARNESS-LAB-BUILDS",
    "liveUrl": "https://desktop.title-desk.com/",
    "liveLabel": "desktop.title-desk.com",
    "idea": "Mac/Electron oil-and-gas land title workstation built for practicing petroleum landmen (field-tested in production with independent Texas landmen and title brokerages). Turns scanned county clerk deed books and Google Drive folders into source-linked runsheets, exact-fraction mineral/NMA ownership ledgers, and completed client Excel workbooks — running 100% offline local OCR first so landmen pay zero per-page AI fees and keep confidential deeds local, escalating to frontier LLMs only for hard chain-of-title adjudication.",
    "architecture": "Electron + React + TypeScript desktop app (src/main, src/renderer, src/shared — growing from 4,288 LOC in tractpilot-agent on Aug 2, 2026 and 25,623 LOC at commit #1 on Aug 6, 2026 to 196,693 LOC on stable and 262,305 authored LOC across 1,184 files on the Nov 11, 2026 repair branch), featuring main-process tesseract.js + @napi-rs/canvas offline OCR, deterministic fraction arithmetic (titleEngine.ts), OOXML workbook writer, Cloudflare Worker licensing (services/licensing-worker), synthetic Escalera County Clerk demo portal (records-site), and title-desk.com marketing site (titledesk-site, 9,739 LOC).",
    "aiLandscape": {
      "openai": "OpenAI's GPT-5.6 family (Sol flagship, Terra mid-tier, Luna fast tier, launched July 2026 with ultra parallel agent mode) received major August 2026 API price cuts (up to 80% on Luna, 20%+ on Sol/Terra) and Cerebras Ultrafast previews; legacy o3 retired in late August.",
      "anthropic": "Claude Opus 5 (launched July 24, 2026) and Claude Sonnet 5 (June 30, 2026) delivered full 5th-generation agentic coding and verification.",
      "google": "Gemini 3.6 Flash (July 2026) and Gemini 3.7 Flash (August 2026) brought substantial gains in long-document OCR/comprehension and agentic tool reliability."
    },
    "gitTrail": [
      {
        "date": "2026-11-13",
        "branch": "experimental/under-1hr",
        "message": "Allow Gemini 4 Hydrogen as a page-image reader (GOLD002TX harness)"
      },
      {
        "date": "2026-11-04",
        "branch": "claude/gte002tx-fixround",
        "message": "A second read that quotes 'all the minerals reserved unto Grantor' back states the reservation claim"
      },
      {
        "date": "2026-11-03",
        "branch": "codex/close-source-facts",
        "message": "Bound source correction passes to verified image evidence and persistent progress limits"
      },
      {
        "date": "2026-10-27",
        "branch": "HARNESS-LAB-BUILDS",
        "message": "Fix progress bar stalling at 16% across Round 1 reading and derivation"
      },
      {
        "date": "2026-10-16",
        "branch": "codex/courthousedirect",
        "message": "Look up a stated source deed on CourthouseDirect when the records index has no row for it"
      },
      {
        "date": "2026-10-07",
        "branch": "HARNESS-LAB-BUILDS",
        "message": "Engine: a decedent written with an initial who could be either of two namesake holders takes no estate"
      },
      {
        "date": "2026-10-01",
        "branch": "HARNESS-LAB-BUILDS",
        "message": "A sheriff and the State are not surnames; the index is merged once per search, not once per row"
      },
      {
        "date": "2026-08-06",
        "branch": "root/initial",
        "message": "TitleDesk Agent — offline title research assistant for landmen"
      }
    ],
    "shot": {
      "src": "/assets/showcase/titledesk/04-workspace-runsheet.webp",
      "src640": "/assets/showcase/titledesk/04-workspace-runsheet-640.webp",
      "width": 1600,
      "height": 1000,
      "alt": "TitleDesk Agent v0.2.19 Desktop — Source-linked chronological runsheet with automatic chain-of-title gap flagging",
      "caption": "TitleDesk Agent v0.2.19 Desktop — Source-linked chronological runsheet with automatic chain-of-title gap flagging"
    }
  },
  {
    "order": 17,
    "slug": "records-site",
    "title": "Escalera County Clerk (TitleDesk Synthetic Demo Records Portal)",
    "shortTitle": "Escalera County Clerk",
    "category": "Synthetic Public-Records Demo Portal",
    "eraId": "2026-summer",
    "tiers": [
      "rapid"
    ],
    "firstCommitIso": "2026-08-09T17:00:27",
    "latestCommitIso": "2026-08-09T18:15:08",
    "firstCommitDisplay": "Aug 9, 2026, 5:00 PM CDT",
    "latestCommitDisplay": "Aug 9, 2026, 6:15 PM CDT",
    "firstCommitSha": "9371dc2f",
    "latestCommitSha": "70f4caf9",
    "startMonthLabel": "August 2026",
    "endMonthLabel": "August 2026",
    "monthsLabel": "1 Month (Rapid Sprint)",
    "commits": 3,
    "initialLoc": 264,
    "latestLoc": 264,
    "initialFiles": 7,
    "latestFiles": 7,
    "languages": [
      {
        "name": "HTML",
        "pct": 85.6
      },
      {
        "name": "CSS/SCSS",
        "pct": 14.4
      }
    ],
    "lineage": "records-site",
    "liveUrl": null,
    "liveLabel": null,
    "idea": "Fictional county clerk public-records portal ('Escalera County Clerk') built with 100% synthetic deeds, grantors/grantees, volume/page citations, and recordings so TitleDesk Agent product demos and OAuth app-verification videos never expose real landowner or client PII.",
    "architecture": "Static HTML5 + CSS public-records search & instrument viewer portal (3 commits, 264 authored LOC, Aug 9, 2026).",
    "aiLandscape": {
      "openai": "OpenAI's GPT-5.6 family (Sol flagship, Terra mid-tier, Luna fast tier, launched July 2026 with ultra parallel agent mode) received major August 2026 API price cuts (up to 80% on Luna, 20%+ on Sol/Terra) and Cerebras Ultrafast previews; legacy o3 retired in late August.",
      "anthropic": "Claude Opus 5 (launched July 24, 2026) and Claude Sonnet 5 (June 30, 2026) delivered full 5th-generation agentic coding and verification.",
      "google": "Gemini 3.6 Flash (July 2026) and Gemini 3.7 Flash (August 2026) brought substantial gains in long-document OCR/comprehension and agentic tool reliability."
    },
    "gitTrail": [],
    "shot": {
      "src": "/assets/showcase/records-site/01-landing-clerk-index.webp",
      "src640": "/assets/showcase/records-site/01-landing-clerk-index-640.webp",
      "width": 1600,
      "height": 1000,
      "alt": "Escalera County Clerk Demo Portal — Public Grantor/Grantee search portal built for TitleDesk demos",
      "caption": "Escalera County Clerk Demo Portal — Public Grantor/Grantee search portal built for TitleDesk demos"
    }
  },
  {
    "order": 18,
    "slug": "paystub-creator",
    "title": "Paystub Studio",
    "shortTitle": "Paystub Studio",
    "category": "Local-First Business & Financial Document Tool",
    "eraId": "2026-summer",
    "tiers": [
      "rapid"
    ],
    "firstCommitIso": "2026-08-25T21:49:19",
    "latestCommitIso": "2026-08-25T22:12:55",
    "firstCommitDisplay": "Aug 25, 2026, 9:49 PM CDT",
    "latestCommitDisplay": "Aug 25, 2026, 10:12 PM CDT",
    "firstCommitSha": "local",
    "latestCommitSha": "local",
    "startMonthLabel": "August 2026",
    "endMonthLabel": "August 2026",
    "monthsLabel": "1 Month (Rapid Sprint)",
    "commits": 1,
    "initialLoc": 3366,
    "latestLoc": 3366,
    "initialFiles": 6,
    "latestFiles": 6,
    "languages": [
      {
        "name": "CSS/SCSS",
        "pct": 43
      },
      {
        "name": "JavaScript",
        "pct": 39.2
      },
      {
        "name": "HTML",
        "pct": 17.8
      }
    ],
    "lineage": "Lineage: paystub-creator | Ubuntu Omen workstation",
    "liveUrl": null,
    "liveLabel": null,
    "idea": "Private, zero-cloud paystub generator and ledger reconciliation studio that runs 100% locally in Chrome (file:// or localhost) with automatic gross-to-net tax/deduction/YTD reconciliation checks and print-ready US Letter output — keeping sensitive payroll figures completely off third-party SaaS servers.",
    "architecture": "Dependency-free vanilla JavaScript (app.js, core.js), HTML5 (index.html), print/screen CSS (styles.css), local snapshot persistence, and automated reconciliation tests (tests/, 3,366 authored LOC across 6 source files).",
    "aiLandscape": {
      "openai": "OpenAI's GPT-5.6 family (Sol flagship, Terra mid-tier, Luna fast tier, launched July 2026 with ultra parallel agent mode) received major August 2026 API price cuts (up to 80% on Luna, 20%+ on Sol/Terra) and Cerebras Ultrafast previews; legacy o3 retired in late August.",
      "anthropic": "Claude Opus 5 (launched July 24, 2026) and Claude Sonnet 5 (June 30, 2026) delivered full 5th-generation agentic coding and verification.",
      "google": "Gemini 3.6 Flash (July 2026) and Gemini 3.7 Flash (August 2026) brought substantial gains in long-document OCR/comprehension and agentic tool reliability."
    },
    "gitTrail": [],
    "shot": {
      "src": "/assets/showcase/paystub-creator/01-landing.webp",
      "src640": "/assets/showcase/paystub-creator/01-landing-640.webp",
      "width": 1600,
      "height": 1000,
      "alt": "Paystub Studio — Private, zero-cloud split-pane workspace with local browser snapshots, JSON/HTML backup, and live US Letter preview",
      "caption": "Paystub Studio — Private, zero-cloud split-pane workspace with local browser snapshots, JSON/HTML backup, and live US Letter preview"
    }
  },
  {
    "order": 19,
    "slug": "claude-estate",
    "title": "Claude-Estate & Multi-Machine Autonomy Bridges",
    "shortTitle": "Claude-Estate Autonomy Bridges",
    "category": "Multi-Machine Agent Infrastructure & Security Tooling",
    "eraId": "2026-summer",
    "tiers": [
      "harness"
    ],
    "firstCommitIso": "2026-08-30T18:23:16",
    "latestCommitIso": "2026-10-25T20:31:36",
    "firstCommitDisplay": "Aug 30, 2026, 6:23 PM CDT",
    "latestCommitDisplay": "Oct 25, 2026, 8:31 PM CDT",
    "firstCommitSha": "cfe021cd",
    "latestCommitSha": "910a8ed8",
    "startMonthLabel": "August 2026",
    "endMonthLabel": "October 2026",
    "monthsLabel": "2 Months",
    "commits": 66,
    "initialLoc": 1378,
    "latestLoc": 39726,
    "initialFiles": 13,
    "latestFiles": 163,
    "languages": [
      {
        "name": "Python",
        "pct": 83.9
      },
      {
        "name": "HTML",
        "pct": 8.9
      },
      {
        "name": "Shell",
        "pct": 4.7
      }
    ],
    "lineage": "Lineage: browser-bridge → ai-bridge → claude-estate | Ubuntu Omen workstation",
    "liveUrl": null,
    "liveLabel": null,
    "idea": "Foundational cross-machine autonomy layer uniting Spencer's Ubuntu Omen, MacBook Air, and Hostinger VPSs: an SSRF-hardened, prompt-injection-fenced Playwright Chrome bridge (browser-bridge), a multi-turn peer-consultation bridge to Codex (ai-bridge), local push-to-talk voice (agent-voice-runtime), and the shared skills/handbook/verification repository (claude-estate).",
    "architecture": "Python + TypeScript + Node.js/Playwright + Bash estate infrastructure totaling 47,986 authored source LOC (39,726 LOC in claude-estate, 7,087 LOC in browser-bridge, 589 LOC in ai-bridge, 220 LOC in agent-voice-runtime).",
    "aiLandscape": {
      "openai": "OpenAI's GPT-5.6 family (Sol flagship, Terra mid-tier, Luna fast tier, launched July 2026 with ultra parallel agent mode) received major August 2026 API price cuts (up to 80% on Luna, 20%+ on Sol/Terra) and Cerebras Ultrafast previews; legacy o3 retired in late August.",
      "anthropic": "Claude Opus 5 (launched July 24, 2026) and Claude Sonnet 5 (June 30, 2026) delivered full 5th-generation agentic coding and verification.",
      "google": "Gemini 3.6 Flash (July 2026) and Gemini 3.7 Flash (August 2026) brought substantial gains in long-document OCR/comprehension and agentic tool reliability."
    },
    "gitTrail": [],
    "shot": {
      "src": "/assets/showcase/claude-estate/01-landing-estate-architecture.webp",
      "src640": "/assets/showcase/claude-estate/01-landing-estate-architecture-640.webp",
      "width": 1600,
      "height": 1000,
      "alt": "Claude Estate — 56-skill security & verification harness, SSRF-fenced Browser Bridge, AI Peer Bridge & Voice Runtime",
      "caption": "Claude Estate — 56-skill security & verification harness, SSRF-fenced Browser Bridge, AI Peer Bridge & Voice Runtime"
    }
  },
  {
    "order": 20,
    "slug": "rogue-agents",
    "title": "Rogue Agents",
    "shortTitle": "Rogue Agents",
    "category": "Flagship macOS Multi-Agent Command Center",
    "eraId": "2026-fall",
    "tiers": [
      "harness",
      "rapid"
    ],
    "firstCommitIso": "2026-10-17T12:13:18",
    "latestCommitIso": "2026-11-05T19:22:12",
    "firstCommitDisplay": "Oct 17, 2026, 12:13 PM CDT",
    "latestCommitDisplay": "Nov 5, 2026, 7:22 PM CST",
    "firstCommitSha": "9cbc1f88",
    "latestCommitSha": "1d7a1cde",
    "startMonthLabel": "October 2026",
    "endMonthLabel": "November 2026",
    "monthsLabel": "1 Month (Rapid Sprint)",
    "commits": 103,
    "initialLoc": 1461,
    "latestLoc": 22582,
    "initialFiles": 26,
    "latestFiles": 210,
    "languages": [
      {
        "name": "JavaScript",
        "pct": 84.8
      },
      {
        "name": "Python",
        "pct": 11.4
      },
      {
        "name": "CSS/SCSS",
        "pct": 1.7
      }
    ],
    "lineage": "Rogue-Agents",
    "liveUrl": "#harness-vitrine",
    "liveLabel": "Rogue Agents cockpit, Chapter I",
    "idea": "Personal macOS & Linux multi-agent command center orchestrating Claude, Codex, Antigravity, Grok, and Hermes side-by-side using existing subscription sign-ins (zero npm bloat or paid per-token API keys required for core execution), complete with leader-dispatched debates, adaptive voice personas, capability probes, and cross-machine omenctl control.",
    "architecture": "Zero-dependency Node.js server (server.mjs + lib/, 193 JS modules) + native Swift macOS WebKit wrapper (native/, 248 Swift LOC) + Python voice/persona utilities (2,567 Python LOC) + dark glass cockpit UI (public/), growing from 1,461 LOC at commit #1 (Oct 17, 2026) to 21,153 LOC on GitHub origin/linux-mac-2026-10-26 (99 commits) and 22,582 LOC on Mac codex/rogue-tools-20261105 (103 commits).",
    "aiLandscape": {
      "openai": "GPT-5.6 (Sol, Terra, Luna) operated under OpenAI's revised October 2026 Model Spec with automated misalignment monitoring across long-horizon agent runs.",
      "anthropic": "The complete Claude 5.5 suite — Opus 5.5 (Sep 22), Sonnet 5.5 (Sep 28), and newly released Claude Haiku 5.5 (Oct 7, 2026) — powered low-latency subagents and browser control.",
      "google": "Gemini 4 Argon rolled out globally on October 13, 2026, followed on October 28, 2026 by Gemini 4 Carbon for deep scientific/cybersecurity reasoning alongside Gemini 3.8 Flash."
    },
    "gitTrail": [
      {
        "date": "2026-11-05",
        "branch": "Rogue-Agents",
        "message": "Integrate verified local toolkit shared with Perihelion across 22 branches"
      },
      {
        "date": "2026-10-26",
        "branch": "Rogue-Agents",
        "message": "Give all Rogue Agents and Ollama workers access to Agent Browser Hub"
      },
      {
        "date": "2026-10-17",
        "branch": "Rogue-Agents",
        "message": "Require main-leader dispatch approval and recover stalled planning"
      }
    ],
    "shot": {
      "src": "/assets/showcase/rogue-agents/03-council-workspace-debate.webp",
      "src640": "/assets/showcase/rogue-agents/03-council-workspace-debate-640.webp",
      "width": 1440,
      "height": 900,
      "alt": "Active multi-agent council workspace showing adaptive execution outcomes, cross-provider peer consultations, live 4-agent plan endorsement vote, and subordinate Ollama worker dispatch.",
      "caption": "Active multi-agent council workspace showing adaptive execution outcomes, cross-provider peer consultations, live 4-agent plan endorsement vote, and subordinate Ollama worker dispatch."
    }
  },
  {
    "order": 21,
    "slug": "hermes",
    "title": "Hermes — Multi-VPS Autonomous Agent Fleet & Guardrail Transport",
    "shortTitle": "Hermes Multi-VPS Agent Fleet",
    "category": "Autonomous Multi-VPS Agent Fleet & Transport Hardening",
    "eraId": "2026-fall",
    "tiers": [
      "harness",
      "rapid"
    ],
    "firstCommitIso": "2026-10-26T08:04:45",
    "latestCommitIso": "2026-10-26T08:31:44",
    "firstCommitDisplay": "Oct 26, 2026, 8:04 AM CDT",
    "latestCommitDisplay": "Oct 26, 2026, 8:31 AM CDT",
    "firstCommitSha": "local",
    "latestCommitSha": "local",
    "startMonthLabel": "October 2026",
    "endMonthLabel": "October 2026",
    "monthsLabel": "1 Month (Rapid Sprint)",
    "commits": 1,
    "initialLoc": 6992,
    "latestLoc": 6992,
    "initialFiles": 16,
    "latestFiles": 16,
    "languages": [
      {
        "name": "Python",
        "pct": 97.1
      },
      {
        "name": "Shell",
        "pct": 2.9
      }
    ],
    "lineage": "Lineage: hermes-guardrail-repair-20261026 | Ubuntu Omen workstation",
    "liveUrl": null,
    "liveLabel": null,
    "idea": "Production autonomous agent fleet (3 agents / 2 bots across Hostinger VPSs and macOS launchd gateways) hardened with single-consumer Telegram isolation, container netns/env_file boundaries, 128 KB UTF-8 transport guardrails, and loop-protection integration probes.",
    "architecture": "Python + Shell multi-VPS deployment, guardrail enforcement, and live transport verification suite (6,992 authored LOC across 16 source files + 670 doc lines on Omen).",
    "aiLandscape": {
      "openai": "GPT-5.6 (Sol, Terra, Luna) operated under OpenAI's revised October 2026 Model Spec with automated misalignment monitoring across long-horizon agent runs.",
      "anthropic": "The complete Claude 5.5 suite — Opus 5.5 (Sep 22), Sonnet 5.5 (Sep 28), and newly released Claude Haiku 5.5 (Oct 7, 2026) — powered low-latency subagents and browser control.",
      "google": "Gemini 4 Argon rolled out globally on October 13, 2026, followed on October 28, 2026 by Gemini 4 Carbon for deep scientific/cybersecurity reasoning alongside Gemini 3.8 Flash."
    },
    "gitTrail": [],
    "shot": null
  },
  {
    "order": 22,
    "slug": "agent-browser-hub",
    "title": "Agent Browser Hub",
    "shortTitle": "Agent Browser Hub",
    "category": "Multi-Agent Browser Coordination & MCP Platform",
    "eraId": "2026-fall",
    "tiers": [
      "harness",
      "rapid"
    ],
    "firstCommitIso": "2026-10-26T12:06:54",
    "latestCommitIso": "2026-10-26T17:19:20",
    "firstCommitDisplay": "Oct 26, 2026, 12:06 PM CDT",
    "latestCommitDisplay": "Oct 26, 2026, 5:19 PM CDT",
    "firstCommitSha": "60d91da9",
    "latestCommitSha": "db9a4a09",
    "startMonthLabel": "October 2026",
    "endMonthLabel": "October 2026",
    "monthsLabel": "1 Month (Rapid Sprint)",
    "commits": 6,
    "initialLoc": 11374,
    "latestLoc": 23406,
    "initialFiles": 20,
    "latestFiles": 67,
    "languages": [
      {
        "name": "TypeScript",
        "pct": 90.7
      },
      {
        "name": "JavaScript",
        "pct": 9.1
      },
      {
        "name": "Config",
        "pct": 0.2
      }
    ],
    "lineage": "agent-browser-hub",
    "liveUrl": null,
    "liveLabel": null,
    "idea": "Solves browser profile collisions and session conflicts when multiple AI agents (Claude, Codex, Antigravity, Hermes) need authenticated Chrome access simultaneously — providing lease-based tab/profile coordination, native macOS Keychain / GNOME libsecret profile unlocking, security/SSRF guardrails, recovery controls, and a live operator dashboard.",
    "architecture": "TypeScript + Node.js multi-surface hub (23,406 authored LOC across 67 files; grew +12,032 LOC in a single-day 6-commit engineering sprint on Oct 26, 2026) exposing a CLI, MCP stdio & HTTP servers, on-demand hub daemon, native keyring adapters, and an HTML/JS operator dashboard.",
    "aiLandscape": {
      "openai": "GPT-5.6 (Sol, Terra, Luna) operated under OpenAI's revised October 2026 Model Spec with automated misalignment monitoring across long-horizon agent runs.",
      "anthropic": "The complete Claude 5.5 suite — Opus 5.5 (Sep 22), Sonnet 5.5 (Sep 28), and newly released Claude Haiku 5.5 (Oct 7, 2026) — powered low-latency subagents and browser control.",
      "google": "Gemini 4 Argon rolled out globally on October 13, 2026, followed on October 28, 2026 by Gemini 4 Carbon for deep scientific/cybersecurity reasoning alongside Gemini 3.8 Flash."
    },
    "gitTrail": [],
    "shot": {
      "src": "/assets/showcase/agent-browser-hub/02-operator-dashboard-fleet.webp",
      "src640": "/assets/showcase/agent-browser-hub/02-operator-dashboard-fleet-640.webp",
      "width": 1440,
      "height": 900,
      "alt": "Operator Dashboard coordinating six concurrent multi-agent browser sessions across Codex, Claude, Hermes, Antigravity, and Grok with PSS/RSS memory telemetry, warm pool, fenced untrusted task strings, and on-demand WebSocket frame streaming.",
      "caption": "Operator Dashboard coordinating six concurrent multi-agent browser sessions across Codex, Claude, Hermes, Antigravity, and Grok with PSS/RSS memory telemetry, warm pool, fenced untrusted task strings, and on-demand WebSocket frame streaming."
    }
  },
  {
    "order": 23,
    "slug": "karpathy-loop-harness",
    "title": "Perihelion Loop — Karpathy Loop Harness & Cloudroom.dev Fabric",
    "shortTitle": "Perihelion Loop",
    "category": "Flagship Autonomous Create, Fix & No-Copy Re-Engineering Harness",
    "eraId": "2026-fall",
    "tiers": [
      "harness",
      "rapid"
    ],
    "firstCommitIso": "2026-11-05T01:46:15",
    "latestCommitIso": "2026-11-12T20:31:47",
    "firstCommitDisplay": "Nov 5, 2026, 1:46 AM CST",
    "latestCommitDisplay": "Nov 12, 2026, 8:31 PM CST",
    "firstCommitSha": "26099009",
    "latestCommitSha": "de6f2caa",
    "startMonthLabel": "November 2026",
    "endMonthLabel": "November 2026",
    "monthsLabel": "1 Month (Rapid Sprint)",
    "commits": 62,
    "initialLoc": 3957,
    "latestLoc": 30079,
    "initialFiles": 16,
    "latestFiles": 183,
    "languages": [
      {
        "name": "TypeScript",
        "pct": 78.8
      },
      {
        "name": "JavaScript",
        "pct": 14.9
      },
      {
        "name": "CSS/SCSS",
        "pct": 2.3
      }
    ],
    "lineage": "Lineage: Perihelion by The Harness Lab (klh v2.2) + hardened Apache-2.0 cloudroom.dev | karpathy-loop-harness",
    "liveUrl": "#perihelion-loop",
    "liveLabel": "Perihelion Loop, Chapter I",
    "idea": "R&D centerpiece of theharnesslab.dev: Perihelion Loop combines Andrej Karpathy's autonomous keep-or-revert loop (measure baseline -> single-hypothesis edit -> hard programmatic check -> keep or git-revert -> institutional attempt ledger) and Loops & Graphs typed DAG orchestration with a fail-closed, zero-trust execution fabric built atop open-source Apache-2.0 cloudroom.dev and multi-provider Frontier Council routing. Built to create greenfield full-stack & native SwiftUI software (Kiln), fix & harden production systems via null_tested_regression gates (proven live with 7,070 passed / 0 failed across 431 TitleDesk test files and 730 passed / 0 failed on Rogue Agents), and perform kernel-walled lawful no-copy reverse-engineering on zero extra vendor spend.",
    "architecture": "TypeScript + JavaScript + Swift + Python orchestration engine (klh v2.2) growing from 3,957 LOC at commit #1 (Nov 5, 2026) to 30,079 authored LOC across 183 files (62 commits): parallel isolated git worktrees, hardened cloudroom.dev Linux VM sandboxes (pre-execution SHA-256 exact-bytes manifest check, host/token isolation, quarantined output pull, independent local holdout verification), OS Seatbelt/bubblewrap kernel walls with rea-agents behaviour-only static study, Frontier Council sealed advisors (Claude Fable, Gemini Carbon, Codex GPT-6 Astra, Claude Opus, Grok), and Graphify AST knowledge graphs.",
    "aiLandscape": {
      "openai": "GPT-5.6 (Sol, Terra, Luna) ran in production alongside early GPT-6 / GPT-6 Cyber previews (gpt-6, gpt-6-astra), unified GPT-Live voice, and biometric ChatGPT Wallet delegation.",
      "anthropic": "Claude Opus 5.5, Claude Sonnet 5.5, and Claude Haiku 5.5 anchored multi-agent verification councils and autonomous repair loops.",
      "google": "Gemini 4 Carbon (gemini-4-carbon, GA Nov 2026), Gemini 4 Hydrogen (gemini-4-hydrogen, released Nov 12, 2026 with xhigh thinking replacing 3.8 Flash as default), Gemini 4 Argon, and Gemini Omni 1.2 Flash defined the frontier ahead of Dec 1 legacy Gemini 2.5 auto-routing."
    },
    "gitTrail": [
      {
        "date": "2026-11-12",
        "branch": "karpathy-loop-harness",
        "message": "A Gemini sitting whose sign-in copy was removed is not trusted; log scrubbed of tokens"
      },
      {
        "date": "2026-11-05",
        "branch": "karpathy-loop-harness",
        "message": "Build Perihelion Loop (Karpathy Loop + Graph harness, Phases A–D) with adversarial hardening"
      }
    ],
    "shot": {
      "src": "/assets/showcase/karpathy-loop-harness/02-run-dag-human-gate.webp",
      "src640": "/assets/showcase/karpathy-loop-harness/02-run-dag-human-gate-640.webp",
      "width": 1440,
      "height": 900,
      "alt": "Zoom Level 3 (Run) displaying the DAG orchestration graph, Gantt execution timeline, substantive check verification, and human approval gate.",
      "caption": "Zoom Level 3 (Run) displaying the DAG orchestration graph, Gantt execution timeline, substantive check verification, and human approval gate."
    }
  },
  {
    "order": 24,
    "slug": "kiln",
    "title": "Kiln (Native macOS Forge App)",
    "shortTitle": "Kiln",
    "category": "Native macOS SwiftUI Application",
    "eraId": "2026-fall",
    "tiers": [
      "rapid"
    ],
    "firstCommitIso": "2026-11-12T02:13:21",
    "latestCommitIso": "2026-11-12T11:43:23",
    "firstCommitDisplay": "Nov 12, 2026, 2:13 AM CST",
    "latestCommitDisplay": "Nov 12, 2026, 11:43 AM CST",
    "firstCommitSha": "1558a80c",
    "latestCommitSha": "85c929e8",
    "startMonthLabel": "November 2026",
    "endMonthLabel": "November 2026",
    "monthsLabel": "1 Month (Rapid Sprint)",
    "commits": 4,
    "initialLoc": 181,
    "latestLoc": 181,
    "initialFiles": 8,
    "latestFiles": 8,
    "languages": [
      {
        "name": "Shell",
        "pct": 45.3
      },
      {
        "name": "Swift",
        "pct": 36.5
      },
      {
        "name": "JavaScript",
        "pct": 18.2
      }
    ],
    "lineage": "macOS local build",
    "liveUrl": null,
    "liveLabel": null,
    "idea": "Native Apple Silicon SwiftUI desktop forge application built under Perihelion Loop (Karpathy Loop Harness, perihelion/kiln-phase1-2026-11-12), bringing The Harness Lab's black-marble and forged-gold design tokens into a native macOS Swift Package Manager workspace.",
    "architecture": "Swift Package (Package.swift, Sources/Kiln/KilnApp.swift, Sources/KilnCore/Product.swift, Tests/) paired with protected Brand/ artwork and forge/design/ architectural specification documents (181 authored Swift/Shell/JS LOC + 1,000 lines of design/plan specs).",
    "aiLandscape": {
      "openai": "GPT-5.6 (Sol, Terra, Luna) ran in production alongside early GPT-6 / GPT-6 Cyber previews (gpt-6, gpt-6-astra), unified GPT-Live voice, and biometric ChatGPT Wallet delegation.",
      "anthropic": "Claude Opus 5.5, Claude Sonnet 5.5, and Claude Haiku 5.5 anchored multi-agent verification councils and autonomous repair loops.",
      "google": "Gemini 4 Carbon (gemini-4-carbon, GA Nov 2026), Gemini 4 Hydrogen (gemini-4-hydrogen, released Nov 12, 2026 with xhigh thinking replacing 3.8 Flash as default), Gemini 4 Argon, and Gemini Omni 1.2 Flash defined the frontier ahead of Dec 1 legacy Gemini 2.5 auto-routing."
    },
    "gitTrail": [
      {
        "date": "2026-11-12",
        "branch": "perihelion/kiln",
        "message": "klh integrate: verified native macOS SwiftUI Kiln forge milestones inside Seatbelt & Cloudroom fabric"
      }
    ],
    "shot": {
      "src": "/assets/showcase/kiln/01-overview-scan-summary.webp",
      "src640": "/assets/showcase/kiln/01-overview-scan-summary-640.webp",
      "width": 1440,
      "height": 900,
      "alt": "Kiln Overview (Screen S-001) rendered in The Harness Lab true-black and gold design system showing six removable categories, honest partial/unscanned coverage disclosures, Full Disk Access note, and selection tally bar.",
      "caption": "Kiln Overview (Screen S-001) rendered in The Harness Lab true-black and gold design system showing six removable categories, honest partial/unscanned coverage disclosures, Full Disk Access note, and selection tally bar."
    }
  },
  {
    "order": 25,
    "slug": "titledesk-hosted",
    "title": "TitleDesk Hosted Service (title-desk.com Cloud Examination)",
    "shortTitle": "TitleDesk Hosted Service",
    "category": "Hosted Vertical AI Examination Platform",
    "eraId": "2026-fall",
    "tiers": [
      "flagship",
      "rapid"
    ],
    "firstCommitIso": "2026-11-12T23:22:16",
    "latestCommitIso": "2026-11-15T15:33:49",
    "firstCommitDisplay": "Nov 12, 2026, 11:22 PM CST",
    "latestCommitDisplay": "Nov 15, 2026, 3:33 PM CST",
    "firstCommitSha": "d9114dc1",
    "latestCommitSha": "c45f930c",
    "startMonthLabel": "November 2026",
    "endMonthLabel": "November 2026",
    "monthsLabel": "1 Month (Rapid Sprint)",
    "commits": 53,
    "initialLoc": 61,
    "latestLoc": 22638,
    "initialFiles": 3,
    "latestFiles": 113,
    "languages": [
      {
        "name": "JavaScript",
        "pct": 90.8
      },
      {
        "name": "CSS/SCSS",
        "pct": 7.7
      },
      {
        "name": "Shell",
        "pct": 0.9
      }
    ],
    "lineage": "titledesk-hosted",
    "liveUrl": "https://title-desk.com/",
    "liveLabel": "title-desk.com",
    "idea": "Zero-install hosted cloud edition of TitleDesk allowing oil-and-gas land teams to sign in on the web, upload county record packages, run automated pre-flight checks, pay per examination, watch live progress, and download a verified Excel title workbook without installing desktop software.",
    "architecture": "Node.js + JavaScript full-stack hosted service (src/site/ customer portal, pre-run check, Stripe checkout, Gemini/Claude examination worker, and VPS deploy kit — growing from 61 LOC at commit #1 on Nov 12, 2026 to 22,638 authored LOC across 113 files in 53 commits by Nov 15, 2026).",
    "aiLandscape": {
      "openai": "GPT-5.6 (Sol, Terra, Luna) ran in production alongside early GPT-6 / GPT-6 Cyber previews (gpt-6, gpt-6-astra), unified GPT-Live voice, and biometric ChatGPT Wallet delegation.",
      "anthropic": "Claude Opus 5.5, Claude Sonnet 5.5, and Claude Haiku 5.5 anchored multi-agent verification councils and autonomous repair loops.",
      "google": "Gemini 4 Carbon (gemini-4-carbon, GA Nov 2026), Gemini 4 Hydrogen (gemini-4-hydrogen, released Nov 12, 2026 with xhigh thinking replacing 3.8 Flash as default), Gemini 4 Argon, and Gemini Omni 1.2 Flash defined the frontier ahead of Dec 1 legacy Gemini 2.5 auto-routing."
    },
    "gitTrail": [
      {
        "date": "2026-11-14",
        "branch": "site/survey-redesign",
        "message": "Publish the TitleDesk survey redesign with staged workspace launch"
      }
    ],
    "shot": {
      "src": "/assets/showcase/titledesk-hosted/04-workspace-live-examination.webp",
      "src640": "/assets/showcase/titledesk-hosted/04-workspace-live-examination-640.webp",
      "width": 1600,
      "height": 1000,
      "alt": "TitleDesk Hosted — Land & Record Examination Service — Live Dual-Model Examination Console & Optical Strata Scanner in flight",
      "caption": "TitleDesk Hosted — Land & Record Examination Service — Live Dual-Model Examination Console & Optical Strata Scanner in flight"
    }
  },
  {
    "order": 26,
    "slug": "artificial-landman",
    "title": "Artificial Landman (artificiallandman.io)",
    "shortTitle": "Artificial Landman",
    "category": "Flagship Hosted Texas Mineral & Subsurface Title Platform",
    "eraId": "2026-fall",
    "tiers": [
      "flagship",
      "rapid"
    ],
    "firstCommitIso": "2026-11-12T23:22:16",
    "latestCommitIso": "2026-11-15T15:33:49",
    "firstCommitDisplay": "Nov 12, 2026, 11:22 PM CST",
    "latestCommitDisplay": "Nov 15, 2026, 3:33 PM CST",
    "firstCommitSha": "d9114dc1",
    "latestCommitSha": "be943981",
    "startMonthLabel": "November 2026",
    "endMonthLabel": "November 2026",
    "monthsLabel": "1 Month (Rapid Sprint)",
    "commits": 54,
    "initialLoc": 61,
    "latestLoc": 23148,
    "initialFiles": 3,
    "latestFiles": 113,
    "languages": [
      {
        "name": "JavaScript",
        "pct": 89.1
      },
      {
        "name": "CSS/SCSS",
        "pct": 9.4
      },
      {
        "name": "Shell",
        "pct": 0.9
      }
    ],
    "lineage": "artificiallandman-hosted",
    "liveUrl": "https://artificiallandman.io/",
    "liveLabel": "artificiallandman.io",
    "idea": "Dedicated hosted Texas mineral and subsurface title examination platform (artificiallandman.io), adapting the TitleDesk Hosted examination engine into a specialized self-serve product tailored for Texas county deed chains, mineral reservations, and division-order title workflows.",
    "architecture": "JavaScript + Node.js web portal, subsurface examination worker, and deployment kit (54 commits, growing from 61 LOC on Nov 12, 2026 to 23,148 authored LOC across 113 files on Nov 15, 2026).",
    "aiLandscape": {
      "openai": "GPT-5.6 (Sol, Terra, Luna) ran in production alongside early GPT-6 / GPT-6 Cyber previews (gpt-6, gpt-6-astra), unified GPT-Live voice, and biometric ChatGPT Wallet delegation.",
      "anthropic": "Claude Opus 5.5, Claude Sonnet 5.5, and Claude Haiku 5.5 anchored multi-agent verification councils and autonomous repair loops.",
      "google": "Gemini 4 Carbon (gemini-4-carbon, GA Nov 2026), Gemini 4 Hydrogen (gemini-4-hydrogen, released Nov 12, 2026 with xhigh thinking replacing 3.8 Flash as default), Gemini 4 Argon, and Gemini Omni 1.2 Flash defined the frontier ahead of Dec 1 legacy Gemini 2.5 auto-routing."
    },
    "gitTrail": [
      {
        "date": "2026-11-15",
        "branch": "artificiallandman/main",
        "message": "Verified live Reeves County dual-examiner run + 4-tab .xlsx export & Resend delivery"
      }
    ],
    "shot": {
      "src": "/assets/showcase/artificial-landman/04-workspace-live-examination.webp",
      "src640": "/assets/showcase/artificial-landman/04-workspace-live-examination-640.webp",
      "width": 1600,
      "height": 1000,
      "alt": "Artificial Landman (artificiallandman.io) — Live Dual-Model Examination Console & Optical Strata Scanner in flight",
      "caption": "Artificial Landman (artificiallandman.io) — Live Dual-Model Examination Console & Optical Strata Scanner in flight"
    }
  },
  {
    "order": 27,
    "slug": "harnesslab-inbox-watch",
    "title": "The Harness Lab 24/7 AI Inbox Lead Watcher",
    "shortTitle": "24/7 AI Inbox Lead Watcher",
    "category": "Hardened Operations Daemon & Prompt-Injection Red-Team Suite",
    "eraId": "2026-fall",
    "tiers": [
      "harness",
      "rapid"
    ],
    "firstCommitIso": "2026-11-15T21:51:49",
    "latestCommitIso": "2026-11-15T21:54:29",
    "firstCommitDisplay": "Nov 15, 2026, 9:51 PM CST",
    "latestCommitDisplay": "Nov 15, 2026, 9:54 PM CST",
    "firstCommitSha": "80025438",
    "latestCommitSha": "a709e38b",
    "startMonthLabel": "November 2026",
    "endMonthLabel": "November 2026",
    "monthsLabel": "1 Month (Rapid Sprint)",
    "commits": 2,
    "initialLoc": 1394,
    "latestLoc": 1396,
    "initialFiles": 6,
    "latestFiles": 6,
    "languages": [
      {
        "name": "Python",
        "pct": 95.9
      },
      {
        "name": "Config",
        "pct": 3.2
      },
      {
        "name": "Shell",
        "pct": 0.9
      }
    ],
    "lineage": "macOS local build",
    "liveUrl": null,
    "liveLabel": null,
    "idea": "Hardened 24/7/365 lead-monitoring daemon built November 15, 2026 to watch spencer@, sales@, and licenses@theharnesslab.com across both INBOX and Spam every 3 hours while defending against untrusted email prompt-injection via an automated red-team evaluation harness.",
    "architecture": "Hardened Python daemon (watcher.py, ctl.py), systemd service + timer units, rollback script, and test_eval_and_redteam.py adversarial suite (2 commits, 1,394 -> 1,396 authored LOC).",
    "aiLandscape": {
      "openai": "GPT-5.6 (Sol, Terra, Luna) ran in production alongside early GPT-6 / GPT-6 Cyber previews (gpt-6, gpt-6-astra), unified GPT-Live voice, and biometric ChatGPT Wallet delegation.",
      "anthropic": "Claude Opus 5.5, Claude Sonnet 5.5, and Claude Haiku 5.5 anchored multi-agent verification councils and autonomous repair loops.",
      "google": "Gemini 4 Carbon (gemini-4-carbon, GA Nov 2026), Gemini 4 Hydrogen (gemini-4-hydrogen, released Nov 12, 2026 with xhigh thinking replacing 3.8 Flash as default), Gemini 4 Argon, and Gemini Omni 1.2 Flash defined the frontier ahead of Dec 1 legacy Gemini 2.5 auto-routing."
    },
    "gitTrail": [],
    "shot": {
      "src": "/assets/showcase/harnesslab-inbox-watch/01-landing-triage-pipeline.webp",
      "src640": "/assets/showcase/harnesslab-inbox-watch/01-landing-triage-pipeline-640.webp",
      "width": 1600,
      "height": 1000,
      "alt": "Harness Lab Inbox Watcher — 24/7 Read-Only IMAPS Zero-Miss Lead Triage & Prompt-Injection Containment",
      "caption": "Harness Lab Inbox Watcher — 24/7 Read-Only IMAPS Zero-Miss Lead Triage & Prompt-Injection Containment"
    }
  }
]);

// The War-Ledger: the three campaigns behind the flagship platforms. Ported from
// the theharnesslab.com Trenches chapter; commit rows are verbatim (rows that
// breached the public-copy rules were dropped, never paraphrased).
export const TRENCH_CAMPAIGNS = Object.freeze([
  {
    id: 'titledesk',
    tab: 'Title-Desk & Artificial Landman',
    meta: '6 Months · 1,662 Commits · 305+ Branches',
    headline: 'Six months refusing to let Texas courthouse title break the engine.',
    summary:
      'Getting an AI demo to summarize one clean PDF takes an afternoon. Getting an autonomous oil-and-gas title engine to survive crooked 1938 scans, missing clerk index rows, namesake decedents and exact net-mineral-acre math online took six months across 305+ git branches, 40 isolated agent worktrees, 64 packaged release builds and 24 GB of primary-source audit evidence.',
    metrics: [
      ['1,662', 'Unique git commits'],
      ['305+', 'Branches & 40 worktrees'],
      ['64', 'Packaged release builds'],
      ['321', 'Hard edge-case fixes'],
      ['7,070 / 7,070', 'Engine tests passing'],
      ['24 GB', 'Primary-source audit evidence'],
    ],
    walls: [
      {
        broke: 'Century-old crooked courthouse scans and runaway vision-API bills',
        solved:
          "Built zero-cost local OCR inside Electron's main process (tesseract.js + @napi-rs/canvas), plus automatic second reads when a tract's legal description spills onto an attached exhibit.",
      },
      {
        broke: 'County record retrieval across three clerk platforms, and index rows that simply are not there',
        solved:
          "Connected through the landman's own authenticated CountyRecords.com, CourthouseDirect and TexasFile accounts, and added a stated-source-deed lookup that retrieves an instrument directly when the clerk's index omits a recited book and page.",
      },
      {
        broke: 'Hallucinated mineral fractions, sheriff deeds and namesake decedents',
        solved:
          'Wrote a typed chain-of-title derivation engine where a sheriff or the State is never mistaken for a surname, an initialed decedent never corrupts an estate, and two independent examiners plus a validator must reconcile exact BigInt rational fractions before export.',
      },
      {
        broke: 'Runs stalling at 16%, provider rate-limit storms and silent worker deaths',
        solved:
          'Wired multi-provider failover across Gemini, Ollama Cloud, Claude and Codex with persistent replay checkpoints, then built Perihelion Loop to seed regressions and prove autonomous repair across all 7,070 engine tests.',
      },
      {
        broke: 'Moving an offline desktop tool onto hosted infrastructure',
        solved:
          'Kept desktop Drive access to detected Drive-for-desktop mounts with company-versus-personal boundaries, then split web intake from dedicated worker servers to take title-desk.com and artificiallandman.io live.',
      },
    ],
    gitLog: [
      ['2026-11-15', 'artificiallandman/main', 'Verified live Reeves County dual-examiner run + 4-tab .xlsx export & Resend delivery'],
      ['2026-11-14', 'site/survey-redesign', 'Publish the TitleDesk survey redesign with staged workspace launch'],
      ['2026-11-13', 'experimental/under-1hr', 'Allow Gemini 4 Hydrogen as a page-image reader (GOLD002TX harness)'],
      ['2026-11-04', 'claude/gte002tx-fixround', "A second read that quotes 'all the minerals reserved unto Grantor' back states the reservation claim"],
      ['2026-11-03', 'codex/close-source-facts', 'Bound source correction passes to verified image evidence and persistent progress limits'],
      ['2026-10-27', 'HARNESS-LAB-BUILDS', 'Fix progress bar stalling at 16% across Round 1 reading and derivation'],
      ['2026-10-16', 'codex/courthousedirect', 'Look up a stated source deed on CourthouseDirect when the records index has no row for it'],
      ['2026-10-07', 'HARNESS-LAB-BUILDS', 'Engine: a decedent written with an initial who could be either of two namesake holders takes no estate'],
      ['2026-10-01', 'HARNESS-LAB-BUILDS', 'A sheriff and the State are not surnames; the index is merged once per search, not once per row'],
      ['2026-08-06', 'root/initial', 'TitleDesk Agent — offline title research assistant for landmen'],
    ],
    links: [
      ['https://title-desk.com/', 'title-desk.com'],
      ['https://desktop.title-desk.com/', 'desktop.title-desk.com'],
      ['https://artificiallandman.io/', 'artificiallandman.io'],
    ],
  },
  {
    id: 'brandstreams',
    tab: 'MyAIMediaMgr → BrandStreams',
    meta: '14 Months · 9 Generations · 1,364 Commits',
    headline: 'Nine architectural generations, because a broken wrapper was never going to ship.',
    summary:
      'MyAIMediaMgr took even longer than Title-Desk. Before the V8.1 repository opened in August 2025, earlier versions had already been torn down and rebuilt as real social APIs, credit ledgers and multi-tenant edge cases exposed every shortcut. Across fourteen months and 1,364 commits it became BrandStreams, finishing with a sixteen-defect production hardening pass.',
    metrics: [
      ['9', 'Architectural generations'],
      ['1,364', 'Commits'],
      ['81,254', 'Authored source LOC'],
      ['400+', 'Bugfix & security commits'],
      ['16', 'Critical audit defects closed'],
      ['14 Months', 'Continuous engineering'],
    ],
    walls: [
      {
        broke: "Multi-tenant social publishing routing every user's post to one account",
        solved:
          'Found that bare publishing-API credentials ignore request-body user IDs; re-engineered the publisher to default-deny without isolated per-tenant profile keys and closed nine schedule and campaign IDORs.',
      },
      {
        broke: 'TikTok, LinkedIn, Facebook and Instagram OAuth and compliance requirements',
        solved:
          'Built end-to-end OAuth callback verification, token refresh lifecycles, webhook listeners and the mandatory platform data-deletion endpoints.',
      },
      {
        broke: 'Credit-balance race conditions and foreign keys that blocked account deletion',
        solved:
          'Reconciled split ledger and user credit state under concurrent generation jobs and removed duplicate NO ACTION foreign keys that vetoed account deletion in production Postgres.',
      },
      {
        broke: 'Webhook fail-open risk, broken payment returns and container sandbox traps',
        solved:
          'Hardened billing webhooks to fail closed when secrets are absent, repaired payment-return 404s and admin-escalation paths, and resolved Linux container bubblewrap and CLI trust traps.',
      },
    ],
    gitLog: [
      ['2026-08-27', 'BrandStreams/main', '48ff5c71 · fix production database migration constraints'],
      ['2026-08-26', 'BrandStreams/main', '3184db68 · fix: harden customer readiness and release gates'],
      ['2026-08-26', 'BrandStreams/main', 'da1e97e3 · fix(admin-test-mode): codex image path cannot use bubblewrap in a container'],
      ['2026-08-25', 'fix/audit-critical', '22a26d27 · fix(security): scope Ayrshare publishing per user, close schedule IDORs'],
      ['2026-08-25', 'fix/audit-critical', '1f011b93 · fix: repair payment return path, broken endpoints, and admin escalation'],
      ['2026-08-25', 'fix/audit-critical', 'c24aae2c · fix(billing): fail closed when the Stripe webhook secret is missing'],
      ['2026-08-25', 'fix/audit-critical', 'f7bd678e · fix(db): drop duplicate NO ACTION foreign keys that veto user deletion'],
      ['2026-01-19', 'MAIMM_FINAL_PROD', 'a05130f2 · Fix credit balance check to use max of ledger and users.credits'],
      ['2025-11-08', 'MAIMM_FINAL_PROD', '14fda2de · Register TikTok and LinkedIn OAuth routes & Meta compliance webhooks'],
      ['2025-08-31', 'MAIMM_FINAL_PROD', 'Initial commit of MYAIMEDIAMANAGER-V8.1 (following 8 prior full rebuilds)'],
    ],
    links: [['#build-brandstreams', 'Inspect BrandStreams build card']],
  },
  {
    id: 'foundry',
    tab: 'APEX.BUILD · Rogue Agents · Perihelion Loop',
    meta: '5 Months · 1,064 APEX Commits',
    headline: 'When off-the-shelf agent loops stalled or misreported, we built our own machinery.',
    summary:
      "Standard agent wrappers report 'done' while tests are failing or workers are dead. Across 1,064 commits on APEX.BUILD, 103 on Rogue Agents, 62 on Perihelion Loop (klh v2.2 on a hardened cloudroom.dev fabric) and 17 operator surfaces in Mythos OS, we built the deterministic harnesses, councils and sandboxes that create, fix and carry out lawful no-copy reverse-engineering at verified quality.",
    metrics: [
      ['1,064', 'APEX.BUILD commits (966 on main)'],
      ['377,197', 'APEX.BUILD authored LOC'],
      ['103', 'Rogue Agents commits'],
      ['730 / 730', 'Rogue Agents tests passing'],
      ['62', 'Perihelion Loop commits'],
      ['20,911', 'Knowledge-graph nodes'],
    ],
    walls: [
      {
        broke: "Agents claiming 'tests pass' without fresh commands or untampered sandboxes",
        solved:
          'Built Perihelion Loop: a Karpathy keep-or-revert loop and typed DAGs on a fail-closed cloudroom.dev fabric with SHA-256 exact-bytes manifests, quarantined output pull, independent holdout verification and null-tested regression gates.',
      },
      {
        broke: 'Re-engineering complex software without copying a single line',
        solved:
          'Forge recipes run behind OS kernel walls (sandbox-exec / bubblewrap): only the analysis unit inspects a lawfully held subject, and downstream builders work from a behaviour-only spec and must pass zero-overlap originality checks.',
      },
      {
        broke: 'Dead background agents, rate-limit cascades and exhausted subscription windows',
        solved:
          'Engineered heartbeat dead-agent detection, backpressure queues and multi-provider Frontier Council routing across Claude, Gemini, Codex and Grok on existing studio subscriptions.',
      },
      {
        broke: 'Coordinating parallel builders across macOS, an Ubuntu workstation and VPS nodes',
        solved:
          'Built Mythos OS and Rogue Agents with isolated git worktrees, a shared 20,911-node knowledge graph, Agent Browser Hub and a single human approval gate at irreversible boundaries.',
      },
    ],
    gitLog: [
      ['2026-11-12', 'karpathy-loop-harness', 'A Gemini sitting whose sign-in copy was removed is not trusted; log scrubbed of tokens'],
      ['2026-11-12', 'perihelion/kiln', 'klh integrate: verified native macOS SwiftUI Kiln forge milestones inside Seatbelt & Cloudroom fabric'],
      ['2026-11-05', 'Rogue-Agents', 'Integrate verified local toolkit shared with Perihelion across 22 branches'],
      ['2026-11-05', 'karpathy-loop-harness', 'Build Perihelion Loop (Karpathy Loop + Graph harness, Phases A–D) with adversarial hardening'],
      ['2026-10-26', 'Rogue-Agents', 'Give all Rogue Agents and Ollama workers access to Agent Browser Hub'],
      ['2026-10-17', 'Rogue-Agents', 'Require main-leader dispatch approval and recover stalled planning'],
      ['2026-06-05', 'apex-build-platform', 'Add runtime stability smoke tests, heartbeat/dead-agent checks & backpressure policy'],
      ['2026-01-22', 'apex-build-platform', 'Initial commit: Multi-AI cloud development platform (1,064-commit run)'],
    ],
    links: [
      ['https://apex-build.dev/', 'apex-build.dev'],
      ['#perihelion-loop', 'Perihelion Loop · Chapter I'],
      ['https://www.cloudroom.dev', 'cloudroom.dev'],
    ],
  },
]);

# QUIZY — Complete System Architecture & Documentation

> **Document Scope:** A comprehensive breakdown of **what** technologies, libraries, algorithms, and components are used in the QUIZY platform, **where** they are located, **how** they function, and **why** each was chosen.

---

## Table of Contents
1. [Executive Summary & System Purpose](#1-executive-summary--system-purpose)
2. [Technology Stack: What, Where, How, and Why](#2-technology-stack-what-where-how-and-why)
   - 2.1 [Frontend Framework & Core Runtime](#21-frontend-framework--core-runtime)
   - 2.2 [Styling & Responsive Layout Engine](#22-styling--responsive-layout-engine)
   - 2.3 [Backend Server & API Proxy](#23-backend-server--api-proxy)
   - 2.4 [Database & Data Persistence](#24-database--data-persistence)
   - 2.5 [AI Question Generation & Study Coach Engine](#25-ai-question-generation--study-coach-engine)
   - 2.6 [Anti-Cheat & Proctoring Engine](#26-anti-cheat--proctoring-engine)
   - 2.7 [Analytics & Data Visualization](#27-analytics--data-visualization)
   - 2.8 [Report & PDF Export Engine](#28-report--pdf-export-engine)
   - 2.9 [Client-Side Resilience & Safety Wrappers](#29-client-side-resilience--safety-wrappers)
3. [File & Directory Architecture (Where Everything Lives)](#3-file--directory-architecture-where-everything-lives)
4. [Step-by-Step System Workflows (How It Works)](#4-step-by-step-system-workflows-how-it-works)
5. [Competitive Exam Syllabi & Curriculum Capabilities](#5-competitive-exam-syllabi--curriculum-capabilities)
6. [Deployment, Build & Environment Configuration](#6-deployment-build--environment-configuration)

---

## 1. Executive Summary & System Purpose

**QUIZY** is an enterprise-grade digital examination, assessment, and adaptive learning platform. It empowers students to take timed, proctored quizzes across core Computer Science, engineering subjects, and competitive entrance examinations (GATE, JEE, NEET, CAT, UPSC), while giving educators and administrators full command over quiz creation, real-time analytics, question banking, and AI-powered batch generation.

---

## 2. Technology Stack: What, Where, How, and Why

| Technology / Library | Where It Is Used | How It Works | Why It Was Chosen |
| :--- | :--- | :--- | :--- |
| **React 18 & TypeScript** | `/src/` (All views & components) | Functional components, hooks (`useState`, `useEffect`, `useRef`, `useMemo`), custom Context API (`AuthContext`), strong typing (`/src/types.ts`). | Ensures strict compile-time type safety, zero runtime type errors, modular code separation, and instantaneous re-renders without full-page reloads. |
| **Vite** | `vite.config.ts`, `package.json` | Next-generation frontend build tool and dev server with ES module bundling. | Sub-second hot dev startup, optimized tree-shaking, and minified production output in `dist/`. |
| **Tailwind CSS v4** | `src/index.css`, All JSX | Utility-first CSS classes with responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`), flexible layouts, and accessible color palettes. | Eliminates CSS bloat, provides consistent spacing and typography, and enables fluid responsiveness across mobile, tablet, and desktop viewports. |
| **Express.js (Node.js)** | `server.ts` | RESTful API server handling requests under `/api/*`, serving static client files in production, and hosting Vite dev middleware. | Fast, asynchronous, lightweight I/O that keeps API keys and secrets securely on the server side away from client browser inspect tools. |
| **SQLite3 (`better-sqlite3` / `sqlite3`)** | `data/quizy.db`, `server.ts` | Embedded relational database with disk persistence, schema auto-migration, foreign keys, and indexed queries. | Self-contained, zero external infrastructure setup required, ACID-compliant, and durable across server restarts without complex remote setup. |
| **Google GenAI (`@google/genai`)** | `server.ts`, `server/questionGenerator.ts`, `server/localBot.ts` | Uses `gemini-2.5-flash` with structured JSON schema output and custom system instructions. | High-speed AI question generation and natural language student tutoring, grounded in accurate academic principles with low latency. |
| **Hybrid Curriculum Fallback Generator** | `server/questionGenerator.ts` | Multi-tiered offline engine with curated curriculum banks and mathematical/procedural templates with rotated answer keys (`a`, `b`, `c`, `d`). | Guarantees instant question generation (1 to 50 questions) even when offline, with zero rate-limit errors or API downtime. |
| **Recharts** | `src/components/AdminPanel.tsx`, `src/components/StudentPortal.tsx` | SVG charting library using `ResponsiveContainer`, `BarChart`, `LineChart`, `AreaChart`, `PieChart`, and interactive tooltips. | Delivers clear visual analytics (subject mastery radar, score progression curves, exam velocity, and attempt distribution). |
| **html2canvas & jsPDF** | `src/components/UserReportModal.tsx` | Captures DOM nodes to an HTML5 canvas at 2x pixel ratio and formats them into an official multi-page A4 PDF document. | Enables instant, client-side generation of verifiable official examination transcripts and report cards without server load. |
| **Lucide React (`lucide-react`)** | Across all components | Clean, tree-shakeable SVG icons imported as direct React components. | Provides uniform visual iconography, clear touch targets, and zero bloated icon font stylesheets. |
| **canvas-confetti** | `src/components/QuizResultView.tsx` | Physics-based particle confetti burst triggered when a student passes or achieves mastery (score ≥ 60%). | Delivers immediate positive reinforcement and gamified achievement feedback upon test completion. |

---

## 2. Technology Stack Details

### 2.1 Frontend Framework & Core Runtime
- **What:** React 18 with TypeScript.
- **Where:** `src/main.tsx`, `src/App.tsx`, `src/components/*`, `src/context/AuthContext.tsx`.
- **How:**
  - `main.tsx` mounts the React application root into `#root` in `index.html`.
  - `AuthContext.tsx` manages session authentication state (`user`, `token`), role determination (`admin` vs `student`), and storage persistence.
  - `App.tsx` routes between views: Landing Screen, Login/Registration, Student Portal, Quiz View, Quiz Result View, and Admin Dashboard.
- **Why:** Delivers single-page application (SPA) performance, zero flicker between views, and prevents stale state.

### 2.2 Styling & Responsive Layout Engine
- **What:** Tailwind CSS v4.
- **Where:** `src/index.css` via `@import "tailwindcss";` and utility classes in every component.
- **How:**
  - Employs mobile-first responsive breakpoints (`sm:`, `md:`, `lg:`).
  - Implements slide-out mobile navigation drawers on small viewports and fixed desktop sidebars on wide screens.
  - Strict minimum touch target sizing (≥ 44px) for all interactive buttons and inputs.
- **Why:** Eliminates custom `.css` file fragmentation, prevents CSS specificity wars, and guarantees responsiveness across phones, tablets, and desktops.

### 2.3 Backend Server & API Proxy
- **What:** Express.js running on Node.js.
- **Where:** `server.ts`.
- **How:**
  - Binds strictly to `0.0.0.0:3000`.
  - Serves REST API routes for authentication, quiz management, question manipulation, submission scoring, analytics, and AI generation.
  - Integrates Vite development middleware during development and serves compiled `dist/` assets in production.
- **Why:** Standardizes client-server communication, proxies database and AI operations, and protects sensitive environment variables (such as `GEMINI_API_KEY`).

### 2.4 Database & Data Persistence
- **What:** SQLite3 database.
- **Where:** `data/quizy.db` managed via SQL queries in `server.ts`.
- **How:**
  - Relational tables:
    1. `users`: IDs, usernames, hashed passwords, roles (`admin` / `user`), creation timestamps.
    2. `quizzes`: Quiz metadata, titles, subject classifications, duration limits, passing percentage, negative marking factor, max attempts allowed, and anti-cheat settings.
    3. `questions`: Quiz foreign key, question prompts, options (`A`, `B`, `C`, `D`), correct option keys, difficulty ratings, and explanatory rationale.
    4. `quiz_attempts`: Attempt records, scores, percentages, elapsed durations, violation counts, and completion timestamps.
    5. `quiz_attempt_details`: Per-question audit records capturing selected options, correctness booleans, and individual question answer histories.
- **Why:** Provides full relational data integrity, foreign key cascading, ACID compliance, and requires zero external database hosting fees or connection strings.

### 2.5 AI Question Generation & Study Coach Engine
- **What:** Dual-Engine Question Generator (Gemini 2.5 Flash + Procedural Curriculum Engine).
- **Where:** `server/questionGenerator.ts`, `server/localBot.ts`, `server.ts`.
- **How:**
  - **Online Mode:** When `GEMINI_API_KEY` is present, queries `gemini-2.5-flash` with structured JSON output enforcing academic rigor, balanced option distribution, and step-by-step explanations.
  - **Offline/Fallback Mode:** When offline or unconfigured, dynamically matches the topic against rich pre-curated question banks (including GATE, JEE, NEET, CAT, UPSC, DSA, Cybersecurity, Web Architecture) and combines them with procedural templates.
  - Rotates correct answer options (`A`, `B`, `C`, `D`) systematically so keys are never biased to a single choice.
- **Why:** Solves the critical user need for generating up to 50 questions instantly without affecting server speed, rate limits, or connectivity.

### 2.6 Anti-Cheat & Proctoring Engine
- **What:** Client-side exam integrity proctor.
- **Where:** `src/components/QuizView.tsx`.
- **How:**
  - Listens to document `visibilitychange` events and window `blur` events.
  - Increments a violation counter each time the student unfocuses the exam window or switches tabs.
  - Displays real-time warning notices indicating remaining allowed violations.
  - Enforces automatic submission when the maximum allowable violations threshold is exceeded.
  - Records tab-switch violation metrics in `quiz_attempts` table for administrative review.
- **Why:** Eliminates unauthorized web browsing or search assistance during formal academic examinations.

### 2.7 Analytics & Data Visualization
- **What:** Statistical computation pipeline + Recharts visualization.
- **Where:** `server.ts` (aggregations), `StudentPortal.tsx`, `AdminPanel.tsx`.
- **How:**
  - Computes global and personal averages: accuracy percentages, score distributions, subject mastery rates, weekly attempt counts, and rank percentiles.
  - Visualizes trends with color-coded area charts and bar graphs.
- **Why:** Turns raw score numbers into actionable insights for both learners looking to improve and educators evaluating syllabus mastery.

### 2.8 Report & PDF Export Engine
- **What:** Vector PDF generation with `html2canvas` and `jsPDF`.
- **Where:** `src/components/UserReportModal.tsx`.
- **How:**
  - Formats student records into a verified transcript containing test metrics, question-by-question answer breakdowns, official answer keys, and verification seals.
  - Rasterizes the styled template at 200 DPI resolution and bundles it into an A4 PDF document for instant client download.
  - Provides a safe, guarded `window.print()` fallback for direct printer output.
- **Why:** Gives students tangible, shareable proof of examination completion and gives administrators printable grade sheets.

### 2.9 Client-Side Resilience & Safety Wrappers
- **What:** Fault-tolerant browser API wrappers.
- **Where:** `src/context/AuthContext.tsx`, `QuizView.tsx`, `UserReportModal.tsx`.
- **How:**
  - Wraps all `localStorage.getItem`, `setItem`, and `removeItem` calls in `try...catch` blocks to prevent fatal `SecurityError` crashes in restricted iframes or privacy browsing modes.
  - Replaces all blocking browser `window.alert()` dialogs with in-app banner alerts to prevent freezing.
  - Guards `window.print()` with feature detection.
- **Why:** Guarantees that the app executes seamlessly across diverse hosting environments, sandboxed cloud containers, and mobile browsers.

---

## 3. File & Directory Architecture (Where Everything Lives)

```
├── /
│   ├── .env.example                  # Documents required environment variables (e.g. GEMINI_API_KEY)
│   ├── metadata.json                 # AI Studio platform configuration, app title, and permissions
│   ├── index.html                    # Single-page application HTML entry point with synchronized SEO meta
│   ├── package.json                  # NPM packages, dependencies, build, and start scripts
│   ├── tsconfig.json                 # TypeScript compiler configuration
│   ├── vite.config.ts                # Vite build and plugin configuration
│   │
│   ├── server.ts                     # Express backend: API routes, SQLite initialization, Vite dev middleware
│   │
│   ├── server/
│   │   ├── questionGenerator.ts      # Gemini AI & offline procedural question generator (1-50 Qs)
│   │   └── localBot.ts               # AI study coach conversation logic and rule-based fallback replies
│   │
│   ├── data/
│   │   └── quizy.db                  # Persistent SQLite database storing users, quizzes, attempts, and questions
│   │
│   └── src/
│       ├── main.tsx                  # React DOM entry point
│       ├── App.tsx                   # Top-level view router and application lifecycle manager
│       ├── index.css                 # Global CSS entry importing Tailwind CSS v4
│       ├── types.ts                  # Shared TypeScript interfaces (Quiz, Question, Attempt, User, Analytics)
│       │
│       ├── context/
│       │   └── AuthContext.tsx       # Authentication state, login/logout actions, and safe storage handlers
│       │
│       ├── services/
│       │   └── api.ts                # Client API service communicating with backend `/api/*` endpoints
│       │
│       └── components/
│           ├── LandingScreen.tsx     # Homepage: platform statistics, features overview, role selection
│           ├── LoginScreen.tsx       # User & Admin authentication modal (Sign In / Sign Up)
│           ├── StudentPortal.tsx     # Student dashboard: available quizzes, attempts history, solutions, AI coach
│           ├── AdminPanel.tsx        # Faculty / Teacher control panel: question banking, AI generator, class analytics
│           ├── SuperAdminPanel.tsx   # Chief Super Admin command center: teacher & student CRUD, audit trail, DB backups
│           ├── QuizView.tsx          # Live quiz interface: countdown timer, anti-cheat proctor, question navigation
│           ├── QuizResultView.tsx    # Post-quiz scorecard: score, breakdown, confetti celebration, retake action
│           ├── Leaderboard.tsx       # Global and quiz-specific ranking board with top student honors
│           ├── ProfileModal.tsx      # User account profile modal with active stats and sign-out controls
│           ├── UserReportModal.tsx   # Verified transcript generator and PDF export dialog
│           └── Chatbot.tsx           # Floating AI study assistant widget
```

---

## 4. Step-by-Step System Workflows (How It Works)

### Workflow A: Quiz Taking & Anti-Cheat Proctoring
1. **Selection:** Student browses available quizzes in the Student Portal, filtering by subject domain or competitive exam category.
2. **Launch:** Clicking "Start Quiz" launches `QuizView.tsx`, which loads the randomized questions and initializes the countdown timer.
3. **Proctoring:**
   - The browser window listens for `visibilitychange`. If the student switches tabs or minimizes the window, the violation counter increments.
   - A high-visibility warning banner alerts the candidate. If violations exceed the quiz's `max_violations`, the quiz auto-submits.
4. **Answer Recording:** Selected options are kept in state. Students can bookmark questions, skip questions, and review answers before finalizing.
5. **Submission:** Upon clicking "Submit", answers are sent to `/api/quizzes/:id/submit`.
6. **Scoring:** The backend validates answers against official database keys, computes percentage scores, applies negative marking (if configured), and writes the attempt to `quiz_attempts` and `quiz_attempt_details`.
7. **Feedback:** `QuizResultView.tsx` displays the score, confetti burst (if passed), detailed answer explanations, and a button to export an official PDF transcript.

### Workflow B: AI Question Generation for Competitive Exams
1. **Configuration:** In `AdminPanel.tsx` under "Manage Questions", the instructor chooses a target quiz, difficulty level (`Easy`, `Medium`, `Hard`), and question quantity (up to 50).
2. **Topic Selection:** The instructor selects a categorized topic domain (e.g. *GATE CS*, *JEE Physics*, *NEET Biology*, *CAT Aptitude*) or selects **"Other (Custom Domain)"**.
3. **Typing Window:** If "Other" is selected, a dedicated typing window appears with quick suggestion chips and a clear input field.
4. **Generation Dispatch:** Clicking "Generate AI Questions" calls `/api/ai/generate-questions`.
5. **Backend Processing:**
   - `server/questionGenerator.ts` checks for `GEMINI_API_KEY`.
   - If available, queries `gemini-2.5-flash` with domain-specific engineering prompts.
   - If offline, invokes the curated curriculum bank and procedural generation engine.
   - Rotates answer letters (`a`, `b`, `c`, `d`) to ensure statistically balanced answer keys.
6. **Database Persistence:** The generated questions are batch-inserted into the `questions` table for that quiz.
7. **Immediate Availability:** The questions immediately become live for all students taking that quiz.

---

## 5. Competitive Exam Syllabi & Curriculum Capabilities

QUIZY includes pre-configured curriculum banks and prompt engineering models for major competitive examinations:

| Exam Category | Key Topics Supported | Focus Areas |
| :--- | :--- | :--- |
| **GATE CS & IT** | Theory of Computation (DFA/CFL/Turing), Algorithms & Asymptotics, Computer Architecture & Cache, Operating Systems (Virtual Memory/Paging), RDBMS Normalization (3NF/BCNF). | Asymptotic derivations, formal language closures, cache tag math, relational algebra. |
| **JEE Main & Advanced** | Physics (Rotational Dynamics, Thermodynamics, Wave Optics), Mathematics (Calculus, Vector Geometry, ODEs), Chemistry (Organic Reaction Mechanisms, CFSE, Equilibrium). | Problem-solving, dimensional homogeneity, King's definite integral properties, intermediate stability. |
| **NEET (Pre-Medical)** | Molecular Genetics (DNA replication, transcription), Mendelian Dihybrid crosses, Human Physiology (Cardiac cycle), Plant Physiology. | Biological pathways, enzymatic catalysts, phenotypic ratios. |
| **CAT / GMAT** | Quantitative Aptitude (Time-Speed-Distance, Pipes & Cisterns, Permutations, Percentages). | Speed math, analytical shortcuts, algebraic optimization. |
| **UPSC / Civil Services** | General Studies, Indian Constitution & Polity (Fundamental Rights, Writs), Macroeconomics & RBI Monetary Policy (OMO, Repo Rate). | Constitutional articles, fiscal governance, judicial precedents. |

---

## 6. Three-Tier Role-Based Access Control: Super Admin vs. Teacher vs. Student

QUIZY implements a strict hierarchical authorization model separating institutional governance from classroom instruction and student participation.

| Role | Scope | Key Responsibilities & Capabilities | Accessible UI |
| :--- | :--- | :--- | :--- |
| **Super Admin**<br>*(Root Authority)* | Institutional / Platform Wide | • Manage faculty & teacher accounts (create, activate, suspend, change password, delete)<br>• Manage all student accounts across cohorts (reset passwords, batch inspect, purge)<br>• Promote teachers to Super Admin or demote<br>• View live platform telemetry (memory, CPU, DB size, active sessions)<br>• Inspect immutable security audit logs (all logins, question additions, role modifications)<br>• Export full SQLite database snapshot (`quizy-backup.json`) for offsite archival | `SuperAdminPanel.tsx`<br>*(also has instant access to `AdminPanel.tsx`)* |
| **Teacher / Faculty**<br>*(Instructor)* | Curriculum & Examination | • Create, edit, and delete examination papers & subjects<br>• Generate batch AI questions (1–50 Qs) with difficulty tuning and custom typing window<br>• Review class performance, score breakdowns, and student rosters<br>• Inspect anti-cheat violation metrics and candidate proctoring logs<br>• Export student grade reports | `AdminPanel.tsx` |
| **Student / Learner**<br>*(Candidate)* | Test Taking & Learning | • Take scheduled and practice examinations under timed proctoring<br>• Review question-by-question answer keys with detailed explanations<br>• Chat with the personalized AI Study Coach for doubt clearing<br>• Download official PDF scorecards and verifiable transcripts<br>• Track daily streaks and compete on class leaderboards | `StudentPortal.tsx`, `QuizView.tsx`, `QuizResultView.tsx` |

### Default Credentials
- **Root Super Admin:** `kongaresanket` / `kongaresanket` *(email: `202401040057@mitaoe.ac.in`)*
- **Faculty Teachers (5 Teachers):**
  - `teacher1` / `teacher123` *(Prof. Rajesh Sharma — Computer Science & AI)*
  - `teacher2` / `teacher123` *(Prof. Priya Verma — Mathematics & Quantitative)*
  - `teacher3` / `teacher123` *(Prof. Amit Patel — Physics & Engineering Systems)*
  - `teacher4` / `teacher123` *(Prof. Neha Gupta — Data Structures & Databases)*
  - `teacher5` / `teacher123` *(Prof. Vikram Rao — GATE & Competitive Prep)*
- **Students:** `user_quizy_1` through `user_quizy_20` / `12345678`

---

## 7. Deployment, Build & Production Upload Guide

You can deploy and upload QUIZY using several simple methods:

### Method 1: Google AI Studio Native Deployment (Recommended)
1. In the upper-right menu of your AI Studio interface, click **Deploy** or **Share**.
2. Select **Cloud Run** or **Share Link** to publish the live application.
3. Configure your `GEMINI_API_KEY` under the **Settings / Secrets** menu in AI Studio (this keeps your API key secure on the server side).

### Method 2: Deploy to Google Cloud Run (Containerized)
QUIZY is pre-configured with a dual-stage production build:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```
Deploy directly via Google Cloud CLI:
```bash
gcloud run deploy quizy-platform \
  --source . \
  --port 3000 \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production,GEMINI_API_KEY=your_key_here"
```

### Method 3: Deploy to Render / Railway / DigitalOcean
1. **GitHub Export:** From the AI Studio settings menu, choose **Export to GitHub** or **Download ZIP**.
2. Push your repository to GitHub.
3. Connect your repository to Render, Railway, or VPS.
4. Set the build command: `npm run build`
5. Set the start command: `npm run start`
6. Set the Environment Variable: `PORT=3000` and optional `GEMINI_API_KEY`.

### Build & Run Scripts
```bash
# Development mode (launches backend server with Vite middleware on port 3000)
npm run dev

# Type checking & linting
npm run lint

# Production build (compiles client to dist/ and bundles server to dist/server.cjs)
npm run build

# Production launch
npm run start
```

---

*Verified & Synchronized for QUIZY Smart Examination Platform.*

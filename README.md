# QUIZY — Smart Quiz & Examination Platform

**QUIZY** is a full-stack digital examination, assessment, and adaptive learning platform. It allows students to take timed, proctored quizzes across Computer Science, Engineering, and Competitive Entrance Examinations (GATE, JEE, NEET, CAT, UPSC), with automated scoring, instant solution transcripts, and AI-powered question generation.

---

## 📖 Complete Documentation
For an exhaustive, component-by-component breakdown of what is used, where it is located, how it operates, and why it was chosen, please refer to:
👉 **[DOCUMENTATION.md](./DOCUMENTATION.md)**

---

## 🚀 Quick Start & How to Run

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation & Execution
```bash
# 1. Install dependencies
npm install

# 2. Start development server (Runs backend and Vite on port 3000)
npm run dev
```
Open your browser at `http://localhost:3000`.

### Production Build
```bash
# Compile client assets and bundle production server
npm run build

# Start production server
npm run start
```

---

## 🛠️ Core Technology Stack at a Glance
- **Frontend:** React 18, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend:** Node.js, Express.js (mounted on port 3000)
- **Database:** SQLite3 (`data/quizy.db`) with relational integrity and automatic schema initialization
- **AI & Curriculum Generation:** Google GenAI (`@google/genai`) Gemini 2.5 Flash + Offline Curated Question Banks (up to 50 questions per batch)
- **Analytics & Visualizations:** Recharts (Radar, Area, Bar, and Line charts)
- **Certificates & Transcripts:** jsPDF and html2canvas for instant downloadable PDF reports
- **Anti-Cheat Proctoring:** Real-time window blur & tab-switch tracking with auto-submission thresholds

For deeper architectural details, see [DOCUMENTATION.md](./DOCUMENTATION.md).


# Hawkins Anomaly Nexus (HANex) 🕵️‍♂️🔦

> *A gamified, offline-first Progressive Web App (PWA) for detecting, reporting, and resolving mysterious anomalies in Hawkins.*

## 📖 Overview
HANex is a community-driven platform designed to mobilize citizens in the event of supernatural or systemic anomalies. Inspired by **Stranger Things**, the interface features a retro-futuristic "sci-fi" aesthetic with glitch effects, CRT scanlines, and a dark tactical UI.

The system uses **AI-driven categorization** to route anomaly reports to the correct department:
1.  **🔵 Government (Blue Team):** Security breaches, physical anomalies, containment.
2.  **🟢 Job/Skill (Green Team):** Tech glitches requiring specialized skills (coding, engineering).
3.  **🔴 Health (Red Team):** Biological hazards, symptoms, and medical guidance.

---

## 🚀 Key Features

### 1. 📡 Anomaly Reporting & AI routing
- Users submit text descriptions of strange events.
- **AI Logic** automatically classifies the report:
    - *"I saw a monster"* -> **Government**
    - *"The website is crashing"* -> **Job/Skill**
    - *"I feel dizzy and cold"* -> **Health**

### 2. 🏛️ Government Module (Secure Access)
- **Tactical Map:** Visualizes anomalies on a coordinate grid with "night vision" overlays.
- **Secure Rooms:** Real-time chat channels for specific anomalies.
- **Resolve Protocol:** Authorization to "close" anomalies and award XP.

### 3. 💼 Job & Skill Module (Upskilling)
- **Career Suggestions:** AI suggests roles (e.g., "Frontend Dev") based on the anomaly type.
- **Learning Paths:** Guided curriculum for distinct skills (React, Node.js, Python).
- **Coding Challenges:** Timed, interactive coding tests with syntax validation.
- **Dynamic Interview:** Context-aware mock interviews generated from the original anomaly report.
- **Geek Room:** Exclusive chat channels unlocked by verifying skills.

### 4. 🏥 Health Module (Bio-Safety)
- **Symptom Checker:** Interactive checklist to assess biological threats.
- **Immedate Guidance:** Triage advice (Low/Medium/High urgency).
- **Medical Log:** History of reported symptoms and guidance.

### 5. 🎮 Gamification & Profile
- **XP System:** Earn points for reporting, solving challenges, and resolving anomalies.
- **Badges:** Unlock titles like "Gate Hunter" or "Tech Savant".
- **Agent Profile:** Digital ID card displaying clearance level and stats.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite
- **Styling:** CSS3 (Custom Variables, Animations, Glassmorphism)
- **Backend / Database:** Firebase Firestore (Real-time data)
- **Authentication:** Firebase Anonymous Auth (Quick entry)
- **Routing:** React Router DOM
- **State Management:** React Context API

---

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-repo/hawkins-anomaly-nexus.git
    cd hawkins-anomaly-nexus
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

4.  **Build for Production**
    ```bash
    npm run build
    ```

---

## 🎨 Design System

The UI is built on a "Tactical Sci-Fi" design system:
- **Fonts:** Monospace (Courier Prime, Fira Code) for data; Sans-serif (Inter) for readability.
- **Colors:**
    - `Primary`: Cyan/Blue (Government)
    - `Secondary`: Purple/Violet (Tech/Job)
    - `Danger`: Red/Amber (Health/Threats)
    - `Background`: Deep Navy/Black with grid overlays.
- **Effects:** CSS-only glitch animations, scanlines, and neon glows.

---

## 📂 Project Structure

```
src/
├── components/        # Reusable UI widgets (GeekRoomChat, etc.)
├── context/           # Global State (AuthContext)
├── pages/             # Route Components
│   ├── LandingPage.jsx
│   ├── ReportPage.jsx
│   ├── RoomPage.jsx   # Government Chat
│   ├── ChallengePage.jsx # Coding Tests
│   ├── HealthActionPage.jsx
│   └── ...
├── services/          # Business Logic & API
│   ├── firebase.js    # Config
│   ├── firestoreService.js # DB Operations
│   ├── jobService.js  # Skill/Challenge Logic
│   ├── healthService.js # Medical Logic
│   └── ai.js          # Classification & Generation
└── index.css          # Global Styles & Variables
```

---

*Verified for Field Deployment. Hawkins National Laboratory.* 🔬

# 🎓 EduVerse AI – Your Personal AI Teacher

> **AI Innovation Hackathon 2026 – Round 2 Project**  
> *"AI Teacher: Build a Human-Like AI Educator That Teaches Through Video"*

---

## 🌟 What is EduVerse AI?

**EduVerse AI** is an interactive, adaptive web application that acts like a real human teacher instead of a generic chatbot.

It follows the complete pedagogical teaching cycle:  
**Understand → Plan → Explain → Demonstrate → Question → Evaluate → Adapt → Continue**

Powered by **ARIA** (our AI Teacher Avatar), EduVerse AI delivers voice-synchronized lessons, interactive circuit/math whiteboards, automatic misconception diagnosis (using real-world analogies like water pipes for Ohm's Law), and personalized learning paths.

---

## ✨ Key Features

* **👩‍🏫 AI Teacher Classroom (`/teacher`)**: Realistic animated avatar (ARIA) with natural speech, live audio visualizer, subtitles, and classroom controls (`Ask Question`, `Repeat`, `Explain Simpler`, `Speak to ARIA`).
* **⚡ Interactive Visual Whiteboard**: Dynamic, subject-aware whiteboards (e.g., animated circuit with moving electrons, formula $V = IR$, battery, and resistor).
* **🧠 Cognitive Misconception Detection**: When a student makes a mistake, the AI diagnoses *why* they erred and explains it using intuitive physical analogies before re-testing.
* **⏱️ Time-Adaptive Lesson Planner**: Generates structured lessons tailored to available time (**5 mins**, **20 mins**, **60 mins**, or **7-day** study paths).
* **📄 Document RAG Pipeline**: Upload your own **PDF, DOCX, PPTX, or TXT** files to generate grounded, course-specific lessons.
* **🌐 Multilingual Support**: Learn in **12 languages** (English, Hindi, Hinglish, Spanish, French, Tamil, Telugu, etc.) with preserved lesson progress.
* **🌓 Light & Dark Mode**: Seamlessly switch between dark classroom mode and crisp light mode via Navbar or Settings.

---

## 🥊 Why EduVerse AI is Different

| Feature | Standard AI Chatbot | **EduVerse AI** |
| :--- | :--- | :--- |
| **Format** | Plain text Q&A | **Multimodal video avatar + speech + whiteboard** |
| **Pedagogy** | Single answer monologue | **Interactive loop (Explain → Question → Adapt)** |
| **Wrong Answers** | Just says "Incorrect" | **Diagnoses misconception & gives relatable analogies** |
| **Visuals** | None | **Live animated circuit schematics and formulas** |
| **Curriculum** | Unstructured | **Time-aware structured lesson plans (5m to 7d)** |

---

## 💻 Tech Stack

* **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts
* **Backend**: Node.js, Express.js, Multer, pdf-parse, mammoth
* **AI & Voice**: Configurable LLM API layer (Google Gemini / OpenAI / Built-in fallback) + Web Speech API (TTS & Speech Recognition)
* **Database**: MongoDB with automatic Zero-Config In-Memory fallback

---

## 🚀 Quick Start Guide

### 1. Start Backend
```bash
cd backend
npm install
npm start
```
> Runs at `http://localhost:5000` (Health Check: `http://localhost:5000/api/health`)

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
> Open `http://localhost:5173` in your browser!

---

## 🏆 Quick Demo Flow

1. **Dashboard (`/dashboard`)**: View student stats (12-day streak, 24.5h learned).
2. **Create Lesson (`/create-lesson`)**: Choose **Topic Mode** ("Electricity & Ohm's Law"), select **Beginner**, **20 mins**, and click **Generate Lesson**.
3. **Lesson Plan (`/lesson-plan`)**: Review the AI-generated curriculum and click **Start AI Teacher**.
4. **AI Classroom (`/teacher`)**:
   * Watch ARIA explain the concept with the animated circuit whiteboard.
   * In the **Lesson Assistant**, select **Option A** (*"It increases proportionally"*).
   * Submit to see ARIA detect the misconception and deploy the **Water-Pipe Analogy**.
   * Answer the follow-up question to boost mastery!
5. **Report & Path (`/report`)**: View the 82% score report, weak areas, and the adaptive **Learning Path (`/learning-path`)**.

---

## ⚙️ Environment Variables (Optional)

Create `.env` in `backend/` if you want to connect external APIs:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/eduverse
JWT_SECRET=eduverse_secret_key_2026
AI_API_KEY=your_gemini_or_openai_key
DEMO_MODE=true
```

---

## 📄 License
Created for **AI Innovation Hackathon 2026**. All rights reserved.
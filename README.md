# 🚀 CareerBoard AI – Smart Placement Tracking Dashboard

CareerBoard AI is a full-stack web application built to help students manage their placement journey end-to-end. It provides a centralized dashboard to track job applications, multi-round interview workflows, documents (resumes & JDs), and notes, with a clean, product-style UI. The platform is being built incrementally, starting with a production-ready MVP and evolving towards intelligent automation using email, calendar, OCR, and ML-based insights.

---

## ✨ Features

### ✅ Phase 1 – Core Personal Tracker (Completed)
- Create, view, update, and delete job applications  
- Track overall application status (Applied, OA, Interview, Offer, Rejected)  
- Dashboard with summary cards and recent applications  
- Secure REST APIs with JWT authentication  
- React + Tailwind responsive frontend  
- Real-time API integration with loading/error states  

### ✅ Phase 2 – Job Application Management + Workflow (Completed)
- Multi-round interview workflow per application  
  - Default rounds: Screening, OA, Technical, HR, Offer  
  - Add, update, and delete custom rounds  
  - Per-round status: Pending / Passed / Failed  
- Application details page with two-column layout  
  - Interview rounds timeline UI  
  - Attachments (Resume & JD)  
  - Notes per application  
- Secure document uploads (resume & JD)  
  - File upload via Multer  
  - Server-side storage with static file serving  
  - Replace / delete attachments  
- Product-level UX improvements  
  - In-page modals for uploads  
  - Compact cards and reduced vertical clutter  
  - Mobile-friendly layout and scrollable containers  

---

## 🧱 Tech Stack

**Frontend**
- React (Vite)  
- Tailwind CSS  
- Axios  
- React Router  

**Backend**
- Node.js  
- Express  
- MongoDB Atlas (Mongoose)  
- JWT Authentication  
- Multer (file uploads)  

**Dev & Tooling**
- Git & GitHub  
- dotenv for environment configuration  

---

## 🏗️ Architecture Overview

[ React Frontend ]
|
v
[ Node.js + Express REST API ]
|
v
[ MongoDB Atlas ]
|
v
[ File Storage (/uploads) ]



- Frontend consumes REST APIs for applications, rounds, attachments, and notes  
- Backend enforces authentication, ownership checks, and validation  
- Files are uploaded via Multer and served through protected routes  

---

## 📂 Project Structure

careerBoard-AI/
├── backend/
│ ├── models/
│ ├── routes/
│ ├── controllers/
│ ├── middleware/
│ ├── uploads/
│ └── index.js
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ ├── components/
│ │ ├── services/
│ │ └── App.jsx
│ └── package.json
└── README.md


---

## ⚙️ Getting Started (Local Setup)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Ribhavxyz/careerBoard-AI.git
cd careerBoard-AI
2️⃣ Backend Setup
cd backend
npm install


Create a .env file in backend/:

MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret


Run the backend:

npm run dev
# or
node index.js
Backend runs on: http://localhost:5000

3️⃣ Frontend Setup
bash
Copy code
cd frontend
npm install
npm run dev
Frontend runs on: http://localhost:5173

🧪 API Overview (Sample)

POST /applications – Create application

GET /applications – Fetch all applications

GET /applications/:id – Fetch single application

PUT /applications/:id – Update application

DELETE /applications/:id – Delete application

POST /applications/:id/rounds – Add interview round

PUT /applications/:id/rounds/:roundId – Update round status

DELETE /applications/:id/rounds/:roundId – Delete round

POST /applications/:id/attachments – Upload resume/JD

DELETE /applications/:id/attachments/:attachmentId – Delete attachment

(All routes are JWT protected)

🧭 Roadmap

🔜 Phase 3: Calendar Integration (OA/Interview reminders)

🔜 Phase 4: Email Integration (attach placement emails to applications)

🔜 Phase 5: ML/NLP Email Understanding (auto-update stages)

🔜 Phase 6: OCR from Screenshots (workflow & result extraction)

🔜 Phase 7+: Smart assistant, analytics, and long-term stability

🎯 Motivation

This project was built to solve a real personal problem during placements: tracking multiple applications, interview rounds, documents, and notes across different platforms. CareerBoard AI is designed as a real product rather than a demo app, with a focus on clean architecture, secure APIs, and scalable feature design.

👤 Author

Ribhav Yadav
Final-year CS Student | Full-Stack Developer
GitHub: https://github.com/Ribhavxyz

LinkedIn: https://linkedin.com/in/ribhav-yadav

📌 License

This project is currently for personal use and portfolio purposes. A formal license may be added later.






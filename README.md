# 🧾 Employee Dashboard File Analyzer

An end-to-end full stack app that allows team leads to upload daily interview reports and HR to upload employee records. The backend processes and analyzes the files to identify which new employees were successfully hired.

---

## 📁 Project Structure

```
employee-dashboard/
│
├── frontend/     # Next.js (App Router, Tailwind CSS)
│
└── backend/      # Express + TypeScript + Multer + XLSX
```

---

## 🚀 Features

* 📤 Upload multiple daily interview report files (.xls/.xlsx)
* 🧾 Upload a single employee list file (.xls/.xlsx)
* ❌ Duplicate file check
* 📊 Automatic matching: successful interview → employee table
* 🧮 Backend analysis logic (Node.js + XLSX)
* 📬 Custom toast notifications
* 💅 Styled with Tailwind CSS
* ⚡ Instant deploy with Vercel (frontend) + Render (backend)

---

## 🛠️ Installation

### 1. Clone the repo

```bash
git clone https://github.com/your-username/employee-dashboard.git
cd employee-dashboard
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Create `.env.local` inside `frontend/`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/analyze
```

---

## 🌐 Deployment

### 🔧 Backend (Render)

### 🌍 Frontend (Vercel)

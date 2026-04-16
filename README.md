# Student Performance Tracker 📊

A sophisticated, full-stack student performance and submission tracking system built with the MERN stack. This application features a premium glassmorphic UI, real-time analytics, and seamless data management.

![Student Performance Tracker](https://img.shields.io/badge/Status-Active-brightgreen)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue)
![Vite](https://img.shields.io/badge/Frontend-Vite%20%2B%20React-purple)

## ✨ Features

- **Comprehensive Student Tracking**: Monitor performance across Mid exams, Assignments, ELA, and CBP submissions.
- **Dynamic Dashboard**: Real-time analytics showing total students, average marks, and submission rates.
- **Analytics Charts**: Visual representation of performance trends and submission statuses using Recharts.
- **Student Management**: Full CRUD (Create, Read, Update, Delete) operations for student records.
- **Interactive Table**: Inline editing and status toggling for quick updates.
- **Excel Export**: Download student data and performance metrics to XLSX format.
- **Premium UI/UX**: Modern glassmorphic design with smooth animations powered by Framer Motion and Lucide icons.
- **Responsive Design**: Fully optimized for various screen sizes using Tailwind CSS.

## 🛠️ Technology Stack

### Frontend
- **React 19** (Vite)
- **Tailwind CSS 4.0**
- **Framer Motion** (Animations)
- **Recharts** (Data Visualization)
- **Lucide React** (Icons)
- **Axios** (API Requests)
- **XLSX** (Excel Export)

### Backend
- **Node.js & Express**
- **MongoDB & Mongoose**
- **CORS**
- **Dotenv**

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/advaith1408/wtcbp.git
   cd wtcbp
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`.

## 📂 Project Structure

```text
wtcbp/
├── backend/
│   ├── models/        # Mongoose schemas
│   ├── routes/        # Express API routes
│   └── server.js      # Entry point
├── frontend/
│   ├── src/
│   │   ├── api/       # API integration services
│   │   ├── components/# Reusable UI components
│   │   ├── assets/    # Static assets
│   │   └── App.jsx    # Main application logic
│   └── index.html
└── README.md          # Project documentation
```




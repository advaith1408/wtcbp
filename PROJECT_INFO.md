# Project Information - Student Performance Tracker

## Project Overview
The **Student Performance Tracker** is a full-stack MERN application designed for educational institutions to monitor and analyze student academic performance. It allows teachers to manage student records, track mid-term marks, assignments, and experiential learning activities through a premium, interactive interface.

## Key Functionalities

### 1. Robust Authentication & Data Privacy
- **Secure Signup/Login**: Role-based access for teachers using JWT (JSON Web Token) and Bcrypt password hashing.
- **Data Isolation**: Each teacher is assigned to specific classrooms. Teachers can only view and manage student records belonging to their allocated classrooms, ensuring privacy and data integrity.
- **Password Recovery**: Simple password reset mechanism for account recovery.

### 2. Student Record Management (CRUD)
- **Comprehensive Profiles**: Store student details including Name, Roll Number, Year, Branch, and Section.
- **Mark Tracking**: Inline editing for multiple academic components:
    - Mid-term 1 & 2
    - Assignment 1 & 2
    - ELA 1 & 2 (Experiential Learning)
    - CBP (Continuous Business Project)
- **Submission Monitoring**: Visual indicators for whether a particular task or mark has been submitted.

### 3. Advanced Analytics Dashboard
- **Performance Metrics**: Real-time visualization of class averages, top performers, and overall grade distribution.
- **Submission Trends**: Interactive charts showing submission rates across different academic components.
- **Data-Driven Insights**: Helps teachers identify students who need extra support.

### 4. Professional Features
- **Excel Export**: Download the entire classroom record as a formatted Excel sheet (`.xlsx`) for offline reporting.
- **Dynamic Filtering**: Quickly search and filter students by Year, Branch, or search by Name/Roll Number.
- **Premium UI**: Modern Glassmorphic design with smooth animations (`framer-motion`) and responsive layouts.

## Technology Stack
- **Frontend**: React.js, Tailwind CSS, Lucide Icons, Framer Motion, Recharts.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Atlas) with Mongoose ODM.
- **Security**: JWT, BcryptJS.
- **Tools**: Axios, XLSX.

## Why This Project?
Traditional mark entry systems are often clunky and slow. This project solves that by providing a high-performance, visually stunning interface that makes data entry fast and data analysis intuitive.

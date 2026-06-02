# LearnFlow - LMS Project

This is my LMS (Learning Management System) project built for the Start Turing Academy assignment. I built this using the MERN stack - MongoDB, Express, React, and Node.js.

---

## What this project does

Basically it's a platform where:
- **Admin** can create courses, add lessons (with video upload or YouTube link), and manage students
- **Students** can browse courses, enroll, watch lessons, track their progress, and leave comments

---

## Tech Stack

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT for authentication
- Multer for file uploads
- bcryptjs for password hashing

**Frontend**
- React 18 + Vite
- React Router v6
- Axios for API calls
- CSS variables for theming (dark mode style)

---

## How to run this locally

First make sure you have Node.js and MongoDB installed and running.

**Backend:**
```bash
cd lms/backend
npm install
npm run dev
```
This runs on `http://localhost:5000`

**Frontend:**
```bash
cd lms/frontend
npm install
npm run dev
```
This runs on `http://localhost:5173`

> Note: the `.env` file is already included with default config. If you have MongoDB running locally it should just work.

---

## Login credentials

**Admin:**
- Email: `admin123@gmail.com`
- Password: `admin123`

**Student:**
- Just register normally from the Register page, all new accounts are students by default

---

## Project folder structure

```
lms/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── lessonController.js
│   │   ├── enrollmentController.js
│   │   ├── commentController.js
│   │   ├── progressController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Lesson.js
│   │   ├── Enrollment.js
│   │   ├── Comment.js
│   │   └── Progress.js
│   ├── routes/
│   ├── utils/
│   ├── uploads/
│   ├── .env
│   └── server.js
│
└── frontend/
    └── src/
        ├── api/
        ├── components/
        │   ├── common/
        │   ├── courses/
        │   ├── lessons/
        │   └── comments/
        ├── context/
        ├── hooks/
        ├── pages/
        │   ├── auth/
        │   ├── instructor/
        │   ├── student/
        │   └── shared/
        ├── styles/
        ├── utils/
        └── App.jsx
```

---

## Database relationships (1:N)

This was one of the main things in the assignment - setting up proper one-to-many relationships:

- One Instructor → Many Courses (course stores `instructor._id`)
- One Course → Many Lessons (lesson stores `course._id`)
- One Lesson → Many Comments (comment stores `lesson._id`)
- One Course → Many Enrollments (enrollment stores `course._id` + `student._id`)

---

## Features I built

- JWT login/register with role-based access (admin vs student)
- Admin can create and manage courses and lessons
- Two video options for lessons - upload a video file OR paste a YouTube URL
- When you upload a video, the duration gets auto-detected using the browser's video metadata API (pretty cool honestly)
- Students can browse all courses and view full details before enrolling
- Lessons are locked until enrolled, except ones marked as free preview
- Progress tracking - marks lessons complete and shows % progress
- Comments section on each lesson
- Separate dashboards for admin and student
- Profile page with avatar upload

---

## API endpoints (main ones)

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new student |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get logged in user |
| GET | `/api/courses` | Browse all courses |
| POST | `/api/courses` | Create course (admin) |
| GET | `/api/lessons/course/:id` | Get lessons for a course |
| POST | `/api/lessons` | Add lesson with video/file |
| POST | `/api/enrollments` | Enroll in a course |
| GET | `/api/enrollments/check/:courseId` | Check if enrolled |
| POST | `/api/progress/complete` | Mark lesson as done |
| GET | `/api/progress/course/:id` | Get progress % |

---

## AI usage

I used Claude (AI) mainly to save time on repetitive parts and to help me understand some concepts better. All the logic and decisions are mine - I just used AI like how you'd use Stack Overflow but faster.

Specific things I used AI help for:
- Writing the MongoDB aggregate queries in the dashboard controller (I understood the logic but the syntax for $group and $lookup took some back and forth)
- The YouTube URL embed conversion (regex to extract video ID from different URL formats)
- Setting up the Multer config for handling multiple file fields at once

Everything else I wrote and understood on my own. I can explain any part of this code if asked.

---

## Known issues / things I'd improve with more time

- No email verification on register
- Video player could use a custom UI instead of default browser controls
- No search inside the lesson sidebar
- Mobile layout needs some work on the lesson page

---

*Built by Mohamed Aathil M — Start Turing Academy*
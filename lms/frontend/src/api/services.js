import API from './axios';

// ── Auth ──────────────────────────────────────────────────────
export const registerUser    = (data)        => API.post('/auth/register', data);
export const loginUser       = (data)        => API.post('/auth/login', data);
export const getMe           = ()            => API.get('/auth/me');
export const updateProfile   = (data)        => API.put('/auth/profile', data);

// ── Courses ───────────────────────────────────────────────────
export const fetchCourses    = (params)      => API.get('/courses', { params });
export const fetchCourseById = (id)          => API.get(`/courses/${id}`);
export const fetchMyCourses  = ()            => API.get('/courses/instructor/my');
export const createCourse    = (data)        => API.post('/courses', data);
export const updateCourse    = (id, data)    => API.put(`/courses/${id}`, data);
export const deleteCourse    = (id)          => API.delete(`/courses/${id}`);

// ── Lessons ───────────────────────────────────────────────────
export const fetchLessonsByCourse = (cId)    => API.get(`/lessons/course/${cId}`);
export const fetchLessonById      = (id)     => API.get(`/lessons/${id}`);
export const createLesson         = (data)   => API.post('/lessons', data);
export const updateLesson         = (id, d)  => API.put(`/lessons/${id}`, d);
export const deleteLesson         = (id)     => API.delete(`/lessons/${id}`);

// ── Enrollments ───────────────────────────────────────────────
export const enrollCourse         = (data)   => API.post('/enrollments', data);
export const fetchMyEnrollments   = ()       => API.get('/enrollments/my');
export const checkEnrollment      = (cId)    => API.get(`/enrollments/check/${cId}`);
export const fetchCourseEnrollments = (cId)  => API.get(`/enrollments/course/${cId}`);

// ── Comments ──────────────────────────────────────────────────
export const fetchComments        = (lId)    => API.get(`/comments/lesson/${lId}`);
export const addComment           = (data)   => API.post('/comments', data);
export const deleteComment        = (id)     => API.delete(`/comments/${id}`);

// ── Progress ──────────────────────────────────────────────────
export const markLessonComplete   = (data)   => API.post('/progress/complete', data);
export const fetchCourseProgress  = (cId)    => API.get(`/progress/course/${cId}`);

// ── Dashboard ─────────────────────────────────────────────────
export const fetchInstructorDashboard = ()   => API.get('/dashboard/instructor');
export const fetchStudentDashboard    = ()   => API.get('/dashboard/student');

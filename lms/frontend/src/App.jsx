import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Sidebar, { SIDEBAR_W } from './components/common/Sidebar';
import TopBar from './components/common/TopBar';

// Auth pages
import LoginPage    from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Instructor pages
import InstructorDashboard    from './pages/instructor/InstructorDashboard';
import InstructorCourses      from './pages/instructor/InstructorCourses';
import InstructorCourseDetail from './pages/instructor/InstructorCourseDetail';

// Student pages
import StudentDashboard   from './pages/student/StudentDashboard';
import BrowseCourses      from './pages/student/BrowseCourses';
import MyCourses          from './pages/student/MyCourses';
import StudentCourseView  from './pages/student/StudentCourseView';

// Shared pages
import ProfilePage from './pages/shared/ProfilePage';

// Layout wrapping sidebar + topbar + content
const Layout = ({ children, title, subtitle, action }) => (
  <>
    <Sidebar />
    <div style={{ marginLeft: SIDEBAR_W, minHeight: '100vh', background: 'var(--bg)' }}>
      <TopBar title={title} subtitle={subtitle} action={action} />
      <div>{children}</div>
    </div>
  </>
);

const App = () => (
  <AuthProvider>
    <Routes>
      {/* Public */}
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Instructor routes */}
      <Route path="/instructor/dashboard" element={
        <ProtectedRoute role="instructor">
          <Layout title="Dashboard"><InstructorDashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/instructor/courses" element={
        <ProtectedRoute role="instructor">
          <Layout title="My Courses"><InstructorCourses /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/instructor/courses/:id" element={
        <ProtectedRoute role="instructor">
          <Layout><InstructorCourseDetail /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/instructor/students" element={
        <ProtectedRoute role="instructor">
          <Layout title="Students"><InstructorCourses /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/instructor/profile" element={
        <ProtectedRoute role="instructor">
          <Layout title="Profile"><ProfilePage /></Layout>
        </ProtectedRoute>
      } />

      {/* Student routes */}
      <Route path="/student/dashboard" element={
        <ProtectedRoute role="student">
          <Layout title="Dashboard"><StudentDashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/browse" element={
        <ProtectedRoute role="student">
          <Layout title="Browse Courses"><BrowseCourses /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/my-courses" element={
        <ProtectedRoute role="student">
          <Layout title="My Learning"><MyCourses /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/courses/:id" element={
        <ProtectedRoute role="student">
          <Layout><StudentCourseView /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/student/profile" element={
        <ProtectedRoute role="student">
          <Layout title="Profile"><ProfilePage /></Layout>
        </ProtectedRoute>
      } />

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </AuthProvider>
);

export default App;

import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { useAuth } from './lib/auth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Grades from './pages/Grades';
import Schedule from './pages/Schedule';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Registration from './pages/Registration';
import Finances from './pages/Finances';
import Profile from './pages/Profile';

export default function App() {
  const { student, ready } = useAuth();
  if (!ready) return null;
  if (!student) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="grades" element={<Grades />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:id" element={<CourseDetail />} />
        <Route path="register" element={<Registration />} />
        <Route path="finances" element={<Finances />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

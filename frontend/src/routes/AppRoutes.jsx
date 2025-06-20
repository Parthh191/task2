import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import BlogListPage from '../pages/BlogListPage';
import AddEditBlogPage from '../pages/AddEditBlogPage';
import UserManagementPage from '../pages/UserManagementPage';

export default function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<BlogListPage />} />
      <Route path="/blog/new" element={<AddEditBlogPage />} />
      <Route path="/blog/edit/:id" element={<AddEditBlogPage />} />
      <Route path="/users" element={<UserManagementPage />} />
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
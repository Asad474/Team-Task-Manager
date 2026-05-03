import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { useAuthStore } from './stores/authStore';
import { useUserStore } from './stores/userStore';

// Layout Components
import Layout from './components/layout/layout';

// Pages
import Dashboard from './pages/dashboard';
import Login from './pages/login';
import Profile from './pages/profile';
import ProjectDetails from './pages/projectDetails';
import Projects from './pages/projects';
import Register from './pages/register';
import Tasks from './pages/tasks';

// Loading Component
import LoadingSpinner from './components/shared/loadingSpinner';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading: isUserLoading } = useUserStore();
  const { isLoading: isAuthLoading } = useAuthStore();
  
  if (isUserLoading || isAuthLoading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading: isUserLoading } = useUserStore();
  const { isLoading: isAuthLoading } = useAuthStore();
  
  if (isUserLoading || isAuthLoading) {
    return <LoadingSpinner />;
  }
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const { fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected Routes with Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetails />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
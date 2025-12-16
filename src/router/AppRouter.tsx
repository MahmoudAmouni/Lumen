import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LandingPage } from "../pages/LandingPage";
import Login from "../pages/Login";
import JobList from "../pages/JobList";
import Dashboard from "../pages/Dashboard";
import CreateJob from "../pages/CreateJob";
import Candidates from "../pages/Candidates";
import CandidateDetail from "../pages/CandidateDetail";
import AICopilot from "../pages/AICopilot";
import InterviewNotes from "../pages/InterviewNotes";
import AdminDashboard from "../pages/AdminDashboard";
import JobDetail from "../pages/JobDetail";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes - require authentication */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Job"
          element={
            <ProtectedRoute>
              <JobList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/createJob"
          element={
            <ProtectedRoute>
              <CreateJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/:jobId"
          element={
            <ProtectedRoute>
              <JobDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidate"
          element={
            <ProtectedRoute>
              <Candidates />
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidate-detail"
          element={
            <ProtectedRoute>
              <CandidateDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-copilot"
          element={
            <ProtectedRoute>
              <AICopilot />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview-notes"
          element={
            <ProtectedRoute>
              <InterviewNotes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

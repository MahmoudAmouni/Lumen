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

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Job" element={<JobList />} />
        <Route path="/createJob" element={<CreateJob />} />
        <Route path="/jobs/:jobId" element={<JobDetail />} />
        <Route path="/candidate" element={<Candidates />} />
        <Route path="/candidate-detail" element={<CandidateDetail />} />
        <Route path="/ai-copilot" element={<AICopilot />} />
        <Route path="/interview-notes" element={<InterviewNotes />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

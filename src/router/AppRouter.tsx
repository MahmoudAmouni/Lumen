import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LandingPage } from "../pages/LandingPage";
import Login from "../pages/Login";
import JobList from "../pages/JobList";
import Dashboard from "../pages/Dashboard";
import CreateJob from "../pages/CreateJob";
import Candidates from "../pages/Candidates";

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Job" element={<JobList />} />
        <Route path="/createJob" element={<CreateJob />} />
        <Route path="/candidate" element={<Candidates />} />
      </Routes>
    </Router>
  );
};

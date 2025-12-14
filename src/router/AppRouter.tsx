import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LandingPage } from "../pages/LandingPage";
import Login from "../pages/Login";
import JobList from "../pages/JobList";
import CreateJob from "../components/CreateJob";

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Job" element={<JobList />} />
        <Route path="/createJob" element={<CreateJob />} />
      </Routes>
    </Router>
  );
};

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LandingPage } from "../pages/LandingPage";

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        
      </Routes>
    </Router>
  );
};

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LandingPage } from "../pages/LandingPage";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export const AppRouter = () => {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<div style={{ padding: '100px', textAlign: 'center' }}>Login Page (Coming Soon)</div>} />
          <Route path="/contact" element={<div style={{ padding: '100px', textAlign: 'center' }}>Contact Us Page (Coming Soon)</div>} />
          <Route path="/signup" element={<div style={{ padding: '100px', textAlign: 'center' }}>Sign Up Page (Coming Soon)</div>} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/LandingPage.module.css";
import Footer from "../components/Footer";
import ContactModal from "../components/ContactModal";
import logo from "../assets/lumen-logo.png";
import bg from "../assets/background.png";
import { ThemeToggle } from "../components/ThemeToggle";
import {
  FiFileText,
  FiColumns,
  FiMic,
  FiZap,
  FiCheckCircle,
  FiShield,
} from "react-icons/fi";

const FEATURES = [
  {
    icon: <FiFileText />,
    title: "Document-grounded answers",
    desc: "Ask anything about a candidate and get answers backed by CVs, notes, and portfolios—with citations.",
  },
  {
    icon: <FiColumns />,
    title: "Hiring pipeline that stays clean",
    desc: "Roles, stages, interviews, scorecards and offers—organized in one place with a fast kanban flow.",
  },
  {
    icon: <FiMic />,
    title: "Interview copilot",
    desc: "Capture notes, summarize interviews, and draft scorecards automatically—without losing evidence.",
  },
  {
    icon: <FiZap />,
    title: "Automation via n8n",
    desc: "Trigger workflows for scheduling, follow-ups, offer packets, and reminders—customizable to your team.",
  },
  {
    icon: <FiCheckCircle />,
    title: "Evidence to scorecard",
    desc: "Attach cited snippets directly to criteria so feedback is clear, consistent, and auditable.",
  },
  {
    icon: <FiShield />,
    title: "Privacy-first controls",
    desc: "Consent flags, role-based access, and per-candidate knowledge bases keep data safe and separated.",
  },
];

const TRUST = [
  { icon: <FiCheckCircle />, text: "Citations on every answer" },
  { icon: <FiCheckCircle />, text: "RAG per-candidate knowledge base" },
  { icon: <FiCheckCircle />, text: "n8n automation workflows" },
];

export const LandingPage = () => {
  const navigate = useNavigate();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  const handleLoginClick = () => navigate("/login");
  const handleBookDemoClick = () => setIsContactModalOpen(true);

  return (
    <div className={styles.landingContainer}>
      <header className={styles.landingHeader}>
        <div className={styles.logoSection}>
          <img src={logo} alt="Lumen Logo" className={styles.logoImg} />
          <span className={styles.logoText}>Lumen</span>
        </div>

        <div className={styles.headerActions}>
          <ThemeToggle />
          <button className={styles.headerLoginBtn} onClick={handleLoginClick}>
            Login
          </button>
        </div>
      </header>

      <section className={styles.heroSection}>
        <div className={styles.heroBadge}>
          <span className={styles.badgeDot} />
          Evidence-based ATS + Interview Copilot
        </div>

        <h1 className={styles.heroTitle}>
          Hiring Teams Deserve{" "}
          <span className={styles.highlight}>Truthful AI</span>
        </h1>

        <p className={styles.heroSubtext}>
          Lumen answers questions about candidates using only their real
          documents (CVs, portfolios, interview notes) with citations—no
          hallucinations.
        </p>

        <div className={styles.heroButtons}>
          <button className={styles.primaryBtn} onClick={handleLoginClick}>
            Start free trial
          </button>
          <button className={styles.secondaryBtn} onClick={handleBookDemoClick}>
            Book a demo
          </button>
        </div>

        <div className={styles.trustRow} aria-label="Trust indicators">
          {TRUST.map((t) => (
            <div className={styles.trustItem} key={t.text}>
              <span className={styles.trustIcon} aria-hidden="true">
                {t.icon}
              </span>
              <span>{t.text}</span>
            </div>
          ))}
        </div>

        <div className={styles.heroMedia}>
          <img
            className={styles.bgimage}
            src={bg}
            alt="Lumen product preview"
          />
        </div>
      </section>

      <section className={styles.featuresSection}>
        <div className={styles.sectionHead}>
          <h2 className={styles.featuresTitle}>
            Why Hiring Teams Choose Lumen
          </h2>
          <p className={styles.featuresSubtitle}>
            Built for speed, evidence, and consistency across the whole hiring
            loop.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {FEATURES.map((f) => (
            <div className={styles.featureCard} key={f.title}>
              <div className={styles.featureIcon} aria-hidden="true">
                {f.icon}
              </div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureText}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>
          Ready to hire with evidence, not guesswork?
        </h2>
        <p className={styles.ctaSubtext}>
          Get started in minutes. Import a role, add a candidate, and ask your
          first cited question.
        </p>
        <div className={styles.ctaActions}>
          <button className={styles.ctaBtn} onClick={handleLoginClick}>
            Get started
          </button>
          <button className={styles.ctaBtnSecondary} onClick={handleBookDemoClick}>
            Talk to sales
          </button>
        </div>
      </section>

      <Footer />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};

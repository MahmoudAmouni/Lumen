import { Link } from 'react-router-dom';
import styles from '../styles/LandingPage.module.css';

export function LandingPage() {
  return (
    <div className={styles.page}>
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Hiring Teams Deserve <span className={styles.highlight}>Truthful AI</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Lumen is an evidence-based Applicant Tracking System that answers questions about candidates using only their real documents with citations, no hallucinations.
          </p>
          <div className={styles.heroButtons}>
            <Link to="/login" className={styles.loginButton}>
              Login
            </Link>
            <Link to="/contact" className={styles.contactButton}>
              Contact Us
            </Link>
          </div>
          <div className={styles.heroImagePlaceholder}>
            {/* Placeholder for image/video */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.pageContainer}>
          <h2 className={styles.sectionTitle}>Why Hiring Teams Choose Lumen</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <h3 className={styles.featureTitle}>Document-Grounded AI</h3>
              <p className={styles.featureText}>
                Ask "Do they have React experience?" get a cited answer from their CV or interview notes.
              </p>
            </div>
            <div className={styles.featureCard}>
              <h3 className={styles.featureTitle}>Document-Grounded AI</h3>
              <p className={styles.featureText}>
                Ask "Do they have React experience?" get a cited answer from their CV or interview notes.
              </p>
            </div>
            <div className={styles.featureCard}>
              <h3 className={styles.featureTitle}>Document-Grounded AI</h3>
              <p className={styles.featureText}>
                Ask "Do they have React experience?" get a cited answer from their CV or interview notes.
              </p>
            </div>
            <div className={styles.featureCard}>
              <h3 className={styles.featureTitle}>Document-Grounded AI</h3>
              <p className={styles.featureText}>
                Ask "Do they have React experience?" get a cited answer from their CV or interview notes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mid-Page CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>Ready to Hire with Evidence, Not Guesswork?</h2>
          <Link to="/signup" className={styles.ctaButton}>
            Get Started - Free Trail
          </Link>
        </div>
      </section>
    </div>
  );
}


import styles from "../styles/LandingPage.module.css";
import { Footer } from "../components/Footer";
import logo from "../assets/lumen-logo.png";
import { ThemeToggle } from "../components/ThemeToggle";

export const LandingPage = () => {
    return (
        <div className={styles.landingContainer}>
            <header className={styles.landingHeader}>
                <div className={styles.logoSection}>
                    <img
                        src={logo}
                        alt="Lumen Logo"
                        className={styles.logoImg}
                    />
                    <span className={styles.logoText}>Lumen</span>
                </div>

                <div className={styles.headerActions}>
                    <ThemeToggle />
                    <button className={styles.headerLoginBtn}>Login</button>
                </div>
            </header>

            <section className={styles.heroSection}>
                <h1 className={styles.heroTitle}>
                    Hiring Teams Deserve{" "}
                    <span className={styles.highlight}>Truthful AI</span>
                </h1>

                <p className={styles.heroSubtext}>
                    Lumen is an evidence-based Applicant Tracking System that
                    answers questions about candidates using only their real
                    documents with citations, no hallucinations.
                </p>

                <div className={styles.heroButtons}>
                    <button className={styles.primaryBtn}>Login</button>
                    <button className={styles.secondaryBtn}>Contact Us</button>
                </div>

                <div className={styles.heroPlaceholder}></div>
            </section>

            <section className={styles.featuresSection}>
                <h2 className={styles.featuresTitle}>
                    Why Hiring Teams Choose Lumen
                </h2>

                <div className={styles.featuresGrid}>
                    {Array(4)
                        .fill(0)
                        .map((_, i) => (
                            <div className={styles.featureCard} key={i}>
                                <h3 className={styles.featureTitle}>
                                    Document-Grounded AI
                                </h3>
                                <p className={styles.featureText}>
                                    Ask “Do they have React experience?” get a
                                    cited answer from their CV or interview
                                    notes.
                                </p>
                            </div>
                        ))}
                </div>
            </section>

            <section className={styles.ctaSection}>
                <h2 className={styles.ctaTitle}>
                    Ready to Hire with Evidence, Not Guesswork?
                </h2>

                <button className={styles.ctaBtn}>
                    Get Started - Free Trial
                </button>
            </section>

            <Footer />
        </div>
    );
};

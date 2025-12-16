import styles from "./Footer.module.css";
import logo from "../assets/lumen-logo.png";
import { FaFacebook, FaInstagram, FaTiktok, FaSnapchat } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.footerContainer}>
        <div className={styles.topRow}>
          <div className={styles.brand}>
            <div className={styles.footerLogoSection}>
              <img
                src={logo}
                alt="Lumen Logo"
                className={styles.footerLogoImg}
              />
              <span className={styles.footerLogoText}>Lumen</span>
            </div>
            <p className={styles.tagline}>
              Evidence-based ATS + Interview Copilot for modern hiring teams.
            </p>
          </div>

          <nav className={styles.linksGrid} aria-label="Footer links">
            <div className={styles.linkCol}>
              <h4 className={styles.colTitle}>Product</h4>
              <a className={styles.link} href="#">
                Features
              </a>
              <a className={styles.link} href="#">
                Pricing
              </a>
              <a className={styles.link} href="#">
                Security
              </a>
              <a className={styles.link} href="#">
                Integrations (n8n)
              </a>
            </div>

            <div className={styles.linkCol}>
              <h4 className={styles.colTitle}>Company</h4>
              <a className={styles.link} href="#">
                About
              </a>
              <a className={styles.link} href="#">
                Careers
              </a>
              <a className={styles.link} href="#">
                Contact
              </a>
              <a className={styles.link} href="#">
                Press
              </a>
            </div>

            <div className={styles.linkCol}>
              <h4 className={styles.colTitle}>Resources</h4>
              <a className={styles.link} href="#">
                Docs
              </a>
              <a className={styles.link} href="#">
                API
              </a>
              <a className={styles.link} href="#">
                Blog
              </a>
              <a className={styles.link} href="#">
                Support
              </a>
            </div>

            <div className={styles.linkCol}>
              <h4 className={styles.colTitle}>Legal</h4>
              <a className={styles.link} href="#">
                Privacy
              </a>
              <a className={styles.link} href="#">
                Terms
              </a>
              <a className={styles.link} href="#">
                Cookie Policy
              </a>
              <a className={styles.link} href="#">
                DPA
              </a>
            </div>
          </nav>
        </div>

        <div className={styles.bottomRow}>
          <p className={styles.footerCopy}>
            © {new Date().getFullYear()} Lumen. All rights reserved.
          </p>

          <div className={styles.social}>
            <span className={styles.socialLabel}>Follow</span>
            <div className={styles.socialIcons}>
              <a href="#" className={styles.socialIcon} aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="#" className={styles.socialIcon} aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className={styles.socialIcon} aria-label="TikTok">
                <FaTiktok />
              </a>
              <a href="#" className={styles.socialIcon} aria-label="Snapchat">
                <FaSnapchat />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

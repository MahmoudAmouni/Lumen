import styles from "./Footer.module.css";
import logo from "../assets/lumen-logo.png";
import { FaFacebook, FaInstagram, FaTiktok, FaSnapchat } from "react-icons/fa";

export default function Footer() {
    return (
        <div className={styles.footerWrapper}>
            <footer className={styles.footerContainer}>
                <div className={styles.footerContent}>
                    <div className={styles.footerLeft}>
                        <div className={styles.footerLogoSection}>
                            <img
                                src={logo}
                                alt="Lumen Logo"
                                className={styles.footerLogoImg}
                            />
                            <span className={styles.footerLogoText}>Lumen</span>
                        </div>
                    </div>

                    <div className={styles.footerCenter}>
                        <p className={styles.footerCopy}>
                            © 2025 Lumen. Built with care for mindful households.
                        </p>
                    </div>

                    <div className={styles.footerRight}>
                        <h4 className={styles.socialTitle}>Social Links</h4>
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
            </footer>
        </div>
    );
}

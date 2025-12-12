import styles from "../styles/Footer.module.css";
import logo from "../assets/lumen-logo.png";

export const Footer = () => {
    return (
        <footer className={styles.footerContainer}>
            <div className={styles.footerLeft}>
                <div className={styles.footerLogoSection}>
                    <img src={logo} className={styles.footerLogoImg} alt="Lumen Logo" />
                    <span className={styles.footerLogoText}>Lumen</span>
                </div>

                <p className={styles.footerCopy}>
                    © 2025 Vesta. Built with care for mindful households.
                </p>
            </div>

            <div className={styles.footerRight}>
                <h4>Social Links</h4>

                <div className={styles.socialIcons}>
                    <i className="fab fa-facebook"></i>
                    <i className="fab fa-instagram"></i>
                    <i className="fab fa-tiktok"></i>
                    <i className="fab fa-snapchat"></i>
                </div>
            </div>
        </footer>
    );
};

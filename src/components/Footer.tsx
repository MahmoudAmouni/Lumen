import styles from '../styles/Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerLeft}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg width="65" height="65" viewBox="0 0 32 32" fill="none">
                <path
                  d="M16 2L26 7V15L16 20L6 15V7L16 2Z"
                  fill="#4A90E2"
                  stroke="#87CEEB"
                  strokeWidth="1"
                />
                <circle cx="16" cy="11" r="4" fill="white" />
              </svg>
            </div>
            <span className={styles.logoText}>Lumen</span>
          </div>
        </div>

        <div className={styles.footerRight}>
          <h3 className={styles.socialHeading}>Social Links</h3>
          <div className={styles.socialIcons}>
            <a href="#" aria-label="Facebook" className={styles.socialLink}>
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="12" fill="#4A90E2" />
                <path
                  d="M13.5 8H11.5C10.67 8 10 8.67 10 9.5V11H8V13H10V18H12V13H14V11H12V9.5C12 9.22 12.22 9 12.5 9H14V7H13.5Z"
                  fill="white"
                />
              </svg>
            </a>
            <a href="#" aria-label="Instagram" className={styles.socialLink}>
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="12" fill="#4A90E2" />
                <rect x="8" y="8" width="8" height="8" rx="2" stroke="white" strokeWidth="1.5" fill="none" />
                <circle cx="15" cy="9" r="1" fill="white" />
              </svg>
            </a>
            <a href="#" aria-label="TikTok" className={styles.socialLink}>
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="12" fill="#4A90E2" />
                <path
                  d="M16.5 7.5C16 7 15.5 6.5 15 6.5V9.5C14.5 9.5 14 9.5 13.5 9.5V11.5C13.5 13.5 14.5 15.5 16.5 15.5C17 15.5 17.5 15.5 18 15V13C17.5 13.5 17 13.5 16.5 13.5C15.5 13.5 14.5 12.5 14.5 11.5V8.5H16.5V7.5Z"
                  fill="white"
                />
              </svg>
            </a>
            <a href="#" aria-label="Snapchat" className={styles.socialLink}>
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="12" fill="#4A90E2" />
                <path
                  d="M12 7C10.5 7 9.5 7.5 9 8.5C8.5 9 8 9.5 7.5 10C7 10.5 6.5 11 7 11.5C7.5 12 8 12 8.5 12C9 12 9.5 12 10 11.5C10.5 11 11 11 11.5 11.5C12 12 12.5 12 13 12C13.5 12 14 12 14.5 11.5C15 11 15.5 11 16 11.5C16.5 12 17 12 17.5 12C18 12 18.5 12 19 11.5C19.5 11 19 10.5 18.5 10C18 9.5 17.5 9 17 8.5C16.5 7.5 15 7 12 7Z"
                  fill="white"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <p className={styles.copyright}>
        © 2025 Vesta. Built with care for mindful households.
      </p>
    </footer>
  );
}


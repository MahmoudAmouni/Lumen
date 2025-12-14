import React, { useState } from "react";
import styles from "../styles/Login.module.css";

type LoginPageProps = {
  onSubmit?: (payload: { email: string; password: string }) => void;
};

export default function Login({ onSubmit }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit?.({ email, password });
  }

  return (
    <div className={styles.page}>
      <div className={styles.card} role="region" aria-label="Login">
        <div className={styles.logoWrap} aria-hidden="true">
          <svg
            className={styles.logo}
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="24" cy="24" r="18" fill="var(--cta-bg)" />
            <circle
              cx="24"
              cy="24"
              r="10"
              fill="var(--color-card)"
              stroke="var(--color-btn)"
              strokeWidth="6"
            />
          </svg>
        </div>

        <h1 className={styles.title}>Welcome Back !</h1>
        <p className={styles.subtitle}>
          Let’s get you back to your smart kitchen.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className={styles.input}
              type="email"
              autoComplete="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className={styles.input}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className={styles.button} type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

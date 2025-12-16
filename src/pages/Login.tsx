/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Login.module.css";
import { useLogin } from "../hooks/useLogin";
import logo from "../assets/lumen-logo.png"
type LoginPageProps = {
  onSubmit?: (payload: { email: string; password: string }) => void;
};

type LoginFormValues = {
  email: string;
  password: string;
  remember: boolean;
};

export default function Login({ onSubmit }: LoginPageProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "", remember: true },
  });

  const loginMutation = useLogin();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const onSubmitForm = (values: LoginFormValues) => {
    setServerError(null);
    onSubmit?.({ email: values.email, password: values.password });

    loginMutation.mutate(
      { email: values.email, password: values.password },
      {
        onError: (err: any) => {
          setServerError(
            err?.message || "Login failed. Please check your credentials."
          );
        },
      }
    );
  };

  const isBusy = loginMutation.isPending || isSubmitting;

  return (
    <div className={styles.page}>
      <div className={styles.bgGlow} aria-hidden="true" />

      <div className={styles.card} role="region" aria-label="Login">
        <div className={styles.topBar}>
          <Link to="/" className={styles.backLink}>
            ← Back to home
          </Link>
        </div>

        <div className={styles.logoWrap} aria-hidden="true">
          <img src={logo} width={50} height={50}/>
        </div>

        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>
          Sign in to manage roles, candidates, and evidence-based notes.
        </p>

        <form className={styles.form} onSubmit={handleSubmit(onSubmitForm)}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className={`${styles.input} ${
                errors.email ? styles.inputError : ""
              }`}
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              disabled={isBusy}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Please enter a valid email",
                },
              })}
            />
            {errors.email && (
              <span className={styles.fieldError}>{errors.email.message}</span>
            )}
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label className={styles.label} htmlFor="password">
                Password
              </label>
              <a className={styles.forgotLink} href="#">
                Forgot?
              </a>
            </div>

            <input
              id="password"
              className={`${styles.input} ${
                errors.password ? styles.inputError : ""
              }`}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              disabled={isBusy}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
            />
            {errors.password && (
              <span className={styles.fieldError}>
                {errors.password.message}
              </span>
            )}
          </div>

          <div className={styles.row}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                disabled={isBusy}
                {...register("remember")}
              />
              <span>Remember me</span>
            </label>

            <span className={styles.securityHint}>🔒 Encrypted session</span>
          </div>

          {serverError && (
            <div className={styles.serverError} role="alert">
              {serverError}
            </div>
          )}

          <button className={styles.button} type="submit" disabled={isBusy}>
            {isBusy ? (
              <span className={styles.btnInner}>
                <span className={styles.spinner} aria-hidden="true" />
                Logging in…
              </span>
            ) : (
              "Login"
            )}
          </button>

          <p className={styles.bottomText}>
            New to Lumen?{" "}
            <a className={styles.inlineLink} href="#">
              Request access
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

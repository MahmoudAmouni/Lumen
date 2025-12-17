/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Login.module.css";
import { useRegister } from "../hooks/useRegister";
import logo from "../assets/lumen-logo.png";

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const registerMutation = useRegister();

  const password = watch("password");

  // Allow access to register page even if logged in
  // User can register a new account or will be redirected after successful registration

  const onSubmitForm = (values: RegisterFormValues) => {
    setServerError(null);

    if (values.password !== values.confirmPassword) {
      setServerError("Passwords do not match");
      return;
    }

    registerMutation.mutate(
      { name: values.name, email: values.email, password: values.password },
      {
        onError: (err: any) => {
          setServerError(
            err?.message || "Registration failed. Please try again."
          );
        },
      }
    );
  };

  const isBusy = registerMutation.isPending || isSubmitting;

  return (
    <div className={styles.page}>
      <div className={styles.bgGlow} aria-hidden="true" />

      <div className={styles.card} role="region" aria-label="Register">
        <div className={styles.topBar}>
          <Link to="/" className={styles.backLink}>
            ← Back to home
          </Link>
        </div>

        <div className={styles.logoWrap} aria-hidden="true">
          <img src={logo} alt="Lumen Logo" className={styles.logo} />
        </div>

        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.subtitle}>
          Sign up to start managing roles, candidates, and evidence-based notes.
        </p>

        <form className={styles.form} onSubmit={handleSubmit(onSubmitForm)}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              className={`${styles.input} ${
                errors.name ? styles.inputError : ""
              }`}
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              disabled={isBusy}
              {...register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "Minimum 2 characters" },
              })}
            />
            {errors.name && (
              <span className={styles.fieldError}>{errors.name.message}</span>
            )}
          </div>

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
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className={`${styles.input} ${
                errors.password ? styles.inputError : ""
              }`}
              type="password"
              autoComplete="new-password"
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

          <div className={styles.field}>
            <label className={styles.label} htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              className={`${styles.input} ${
                errors.confirmPassword ? styles.inputError : ""
              }`}
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              disabled={isBusy}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <span className={styles.fieldError}>
                {errors.confirmPassword.message}
              </span>
            )}
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
                Creating account…
              </span>
            ) : (
              "Create account"
            )}
          </button>

          <p className={styles.bottomText}>
            Already have an account?{" "}
            <Link to="/login" className={styles.inlineLink}>
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}


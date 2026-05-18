import React, { useState } from "react";
import "./Register.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  // Local UI state only (no API calls as requested)
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    userType: "user",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          email: form.email,
          fullname: {
            firstName: form.firstName,
            lastName: form.lastName,
          },
          password: form.password,
          role: form.userType,
        },
        {
          withCredentials: true,
        },
      );

      navigate("/");
    } catch (err) {
      console.error("Error during registration:", err);
    }
  }

  return (
    <div className="register-wrapper">
      <div className="register-card surface">
        <h2 className="register-title">Create your account</h2>
        <p className="text-muted" style={{ marginTop: "var(--space-1)" }}>
          Join us to get started
        </p>

        <button
          onClick={() => {
            window.location.href = "http://localhost:3000/api/auth/google";
          }}
          type="button"
          className="btn btn-google"
          aria-label="Continue with Google"
        >
          <span className="btn-google-icon" aria-hidden>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
          </span>
          Continue with Google
        </button>

        <div
          className="divider"
          role="separator"
          aria-label="or continue with email"
        >
          <span className="divider-line" />
          <span className="divider-text">or</span>
          <span className="divider-line" />
        </div>

        <form
          className="register-form stack"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="field-row">
            <div className="field-group">
              <label htmlFor="firstName">First name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                value={form.firstName}
                onChange={handleChange}
                required
                placeholder="Jane"
              />
            </div>
            <div className="field-group">
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                value={form.lastName}
                onChange={handleChange}
                required
                placeholder="Doe"
              />
            </div>
          </div>

          <fieldset className="field-group fieldset-radio">
            <legend className="legend">Account type</legend>
            <div className="radio-row">
              <label className="radio-option">
                <input
                  type="radio"
                  name="userType"
                  value="user"
                  checked={form.userType === "user"}
                  onChange={handleChange}
                />
                <span>User</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="userType"
                  value="artist"
                  checked={form.userType === "artist"}
                  onChange={handleChange}
                />
                <span>Artist</span>
              </label>
            </div>
          </fieldset>

          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              minLength={8}
            />
            <p className="hint text-muted">Minimum 8 characters.</p>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            aria-label="Create account"
          >
            Create account
          </button>
        </form>
        <p className="login-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

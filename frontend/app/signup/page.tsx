"use client";
import "../auth.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function SignupPage() {
  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const registerRes = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!registerRes.ok) {
      alert("Registration failed. Email might already be in use.");
      return;
    }

    const loginRes = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!loginRes.ok) {
      window.location.href = "/login";
      return;
    }

    window.location.href = "/account";
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="signup-header">
          <a href="/"><img src="/img/logo.png" className="signup-logo" alt="SilverBank logo" /></a>
        </div>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join SilverBank and start banking smarter.</p>

        <form onSubmit={handleSignup} className="auth-form">
          <input type="text" name="name" className="auth-input" placeholder="Full name" required />
          <input type="email" name="email" className="auth-input" placeholder="Email address" required />
          <input type="password" name="password" className="auth-input" placeholder="Password" required />
          <button type="submit" className="auth-btn">Sign Up</button>
        </form>

        <p className="auth-switch">Already have an account? <a href="/login">Login</a></p>
        <p className="auth-switch"><a href="/">← Back to homepage</a></p>
      </div>
    </div>
  );
}

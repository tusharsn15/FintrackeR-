import { useState } from "react";
import { useApp } from "../context/AppContext";

export function Login({ onBack }) {
  const { setUser, notify, navigate, currentPath } = useApp();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const finishLogin = (userData) => {
    setUser(userData);
    const validAppPaths = ["/dashboard", "/transactions", "/budgets", "/bills", "/goals", "/calendar", "/reports", "/settings"];
    const target = validAppPaths.includes(currentPath) ? currentPath : "/dashboard";
    navigate(target);
  };

  const submit = (e) => {
    e.preventDefault();
    const found = {};
    if (mode === "register" && !form.name.trim()) found.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) found.email = "Enter a valid email address.";
    if (form.password.length < 6) found.password = "Use at least 6 characters.";
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    const name = form.name.trim() || form.email.split("@")[0];
    finishLogin({ name, email: form.email });
    notify("Welcome, " + name);
  };

  const demo = () => {
    finishLogin({ name: "Demo Student", email: "demo@fintrack.app" });
    notify("Signed in with the demo account");
  };

  const handleBack = (e) => {
    if (e && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && e.button === 0) {
      e.preventDefault();
    }
    if (onBack) onBack();
    else navigate("/");
  };

  return (
    <div className="auth">
      <section className="authside">
        <a
          href="/"
          className="logo"
          onClick={handleBack}
        >
          Fin<span>Track</span>
        </a>
        <h1>Your money, finally in one calm place.</h1>
        <p>Track spending, hit budgets and reach your savings goals.</p>
        <a
          href="/"
          className="btn ghost small"
          style={{ color: "#fff", borderColor: "rgba(255,255,255,.4)" }}
          onClick={handleBack}
        >
          Back to home
        </a>
      </section>
      <section className="authform">
        <form className="f" onSubmit={submit} noValidate>
          <h2>{mode === "login" ? "Log in" : "Create your account"}</h2>
          {mode === "register" && (
            <label>Name<input name="name" value={form.name} onChange={change} autoComplete="name" />
              {errors.name && <span className="err">{errors.name}</span>}</label>
          )}
          <label>Email<input name="email" type="email" value={form.email} onChange={change} autoComplete="email" />
            {errors.email && <span className="err">{errors.email}</span>}</label>
          <label>Password
            <div className="row2" style={{ flexWrap: "nowrap" }}>
              <input name="password" type={show ? "text" : "password"} value={form.password} onChange={change} autoComplete="current-password" />
              <button type="button" className="btn ghost small" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>
            </div>
            {errors.password && <span className="err">{errors.password}</span>}
          </label>
          <button className="btn" type="submit">{mode === "login" ? "Log in" : "Sign up"}</button>
          <button className="btn ghost" type="button" onClick={demo}>Try the demo account</button>
          <button className="tab" type="button" onClick={() => setMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "New here? Create an account" : "Have an account? Log in"}
          </button>
          <p className="note">Demo only: this sign-in runs in your browser and is not real security. Do not use a password you use elsewhere.</p>
        </form>
      </section>
    </div>
  );
}

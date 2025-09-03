import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const backend = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await fetch(`${backend}/api/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Login failed");
      console.log(data); 
      localStorage.setItem("token", data.token);

      navigate("/dashboard"); // change to your post-login route
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-3">
      <div className="card p-5 shadow-sm rounded-3" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="text-center">
          <h2 className="fw-bold">Sign In</h2>
          <p className="text-muted">Sign in to continue</p>
          <hr className="my-4" />
        </div>

        {err && <div className="alert alert-danger">{err}</div>}

        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <label htmlFor="usernameInput" className="form-label">Username:</label>
            <input
              id="usernameInput"
              type="text"
              className="form-control rounded-pill"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="passwordInput" className="form-label">Password:</label>
            <input
              id="passwordInput"
              type="password"
              className="form-control rounded-pill"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-dark btn-lg rounded-pill" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        <div className="text-center mt-5">
          <p className="text-muted mb-0">Don't have an account yet?</p>
          {/* Use a link to go to /signup */}
          <Link to="/signup" className="btn btn-link text-dark text-decoration-none fw-bold">
            Sign Up
          </Link>
          {/* OR use a button: 
          <button type="button" onClick={() => navigate("/signup")} className="btn btn-link text-dark text-decoration-none fw-bold">
            Sign Up
          </button> */}
        </div>
      </div>
    </div>
  );
}

export default Login;

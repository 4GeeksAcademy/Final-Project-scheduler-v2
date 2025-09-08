import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { NavbarContext } from '../hooks/NavbarContext.jsx'


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const { userID, setUserID } = useContext(NavbarContext);

  const navigate = useNavigate();
  const raw = import.meta.env.VITE_BACKEND_URL || "";
  const backend = raw.replace(/\/$/, ""); // remove trailing slash if present

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      // 1) Request token
      const res = await fetch(`${backend}/api/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        // ⬆️ backend expects "username" (not "email")
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        const msg = data.msg || data.message || data.error || "Login failed";
        throw new Error(msg);
      }

      setUserID(data.user_id);
      const token = data.token;
      if (!token) throw new Error("No token returned from server");

      localStorage.setItem("token", token);

      // 2) Fetch current user via /api/me
      const meRes = await fetch(`${backend}/api/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!meRes.ok) throw new Error("Failed to fetch current user");
      const me = await meRes.json();

      if (!me?.id) throw new Error("No user id returned from /api/me");

      // 3) Redirect to profile page
      navigate(`/profile/${me.id}`);
    } catch (e) {
      setErr(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-3">
      <div
        className="card p-5 shadow-sm rounded-3"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div className="text-center">
          <h2 className="fw-bold">Sign In</h2>
          <p className="text-muted">Sign in to continue</p>
          <hr className="my-4" />
        </div>

        {err && (
          <div className="alert alert-danger" role="alert" aria-live="polite">
            {err}
          </div>
        )}

        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <label htmlFor="usernameInput" className="form-label">
              Username:
            </label>
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
            <label htmlFor="passwordInput" className="form-label">
              Password:
            </label>
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
            <button
              type="submit"
              className="btn btn-dark btn-lg rounded-pill"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        <div className="text-center mt-5">
          <p className="text-muted mb-0">Don't have an account yet?</p>
          <Link
            to="/signup"
            className="btn btn-link text-dark text-decoration-none fw-bold"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

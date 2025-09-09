import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { NavbarContext } from "../hooks/NavbarContext.jsx";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUserID } = useContext(NavbarContext);

  const navigate = useNavigate();
  const raw = import.meta.env.VITE_BACKEND_URL || "";
  const backend = raw.replace(/\/$/, ""); // trim trailing slash

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      // 1) Request token
      const res = await fetch(`${backend}/api/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }), // backend expects "username"
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

      setUserID?.(data.user_id);
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

      // 3) Redirect (keeping your note to avoid profile page)
      navigate("/search");
    } catch (e) {
      setErr(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight mb-2">
            Sign In
          </h1>
          <p className="text-gray-500 text-lg">Welcome back</p>
        </div>

        {/* Error */}
        {err && (
          <div className="bg-red-500 text-white p-4 rounded-xl shadow-md text-center">
            {err}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignIn} className="space-y-5">
          <div>
            <label
              htmlFor="usernameInput"
              className="block mb-2 font-semibold text-gray-700"
            >
              Username
            </label>
            <input
              id="usernameInput"
              type="text"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FC1E0] transition-colors duration-200"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label
              htmlFor="passwordInput"
              className="block mb-2 font-semibold text-gray-700"
            >
              Password
            </label>
            <input
              id="passwordInput"
              type="password"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FC1E0] transition-colors duration-200"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="w-full bg-[#7FC1E0] text-white font-semibold py-3 rounded-xl shadow-md hover:bg-[#5fa9cb] transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center">
          <span className="text-gray-500">Don’t have an account?</span>
          <Link
            to="/signup"
            className="inline-block ml-2 border border-[#7FC1E0] text-[#28779a] font-semibold py-2 px-4 rounded-full hover:bg-[#e9f5fb] transition-colors duration-200"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

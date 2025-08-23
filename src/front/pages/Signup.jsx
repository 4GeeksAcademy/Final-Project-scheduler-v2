import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Signup = () => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  // just keep the string, don’t try to trim or sanitize automatically
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  function handleSubmit(e) {
    e.preventDefault();

    if (!backendUrl) {
      setErrorMsg("Backend URL is missing in your .env file");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const apiUrl = backendUrl + "/api/signup";

    const bodyData = {
      username: username,
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      gender: gender
    };

    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData)
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then((result) => {
        if (!result.ok) {
          setErrorMsg(result.data.error || "Signup failed");
        } else {
          setSuccessMsg("Account created! Redirecting to login…");
          setUsername("");
          setFirstName("");
          setLastName("");
          setEmail("");
          setPassword("");
          setGender("");
          setTimeout(() => {
            navigate("/Login");
          }, 1500);
        }
      })
      .catch((err) => {
        setErrorMsg("Could not reach the server: " + err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        background: "#f4f6f8",
        padding: "2rem 1rem",
        marginTop: "56px",
        minHeight: "100vh",
      }}
    >
      <div
        className="card shadow-lg border-0"
        style={{
          borderRadius: "1rem",
          overflow: "hidden",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <div className="card-header bg-white text-center py-4 border-0">
          <h1 className="card-title fw-bold text-primary mb-1">Sign Up</h1>
          <p className="card-text text-muted mb-0">
            Create your account to get started
          </p>
        </div>

        <div className="card-body p-4 p-md-5 bg-white">
          {errorMsg !== "" && (
            <div className="alert alert-danger mb-3">{errorMsg}</div>
          )}
          {successMsg !== "" && (
            <div className="alert alert-success mb-3">{successMsg}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label fw-semibold">
                Username
              </label>
              <input
                id="username"
                type="text"
                className="form-control rounded-pill"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="firstName" className="form-label fw-semibold">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                className="form-control rounded-pill"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="lastName" className="form-label fw-semibold">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                className="form-control rounded-pill"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">
                Email address
              </label>
              <input
                id="email"
                type="email"
                className="form-control rounded-pill"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-semibold">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-control rounded-pill"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="gender" className="form-label fw-semibold">
                Gender
              </label>
              <select
                id="gender"
                className="form-select rounded-pill"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary btn-lg fw-semibold rounded-pill"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </div>
          </form>
        </div>

        <div className="card-footer bg-light border-0 text-center py-3">
          <span className="text-muted">Already have an account?</span>
          <Link
            to="/Login"
            className="btn btn-outline-primary btn-sm ms-2 rounded-pill"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};



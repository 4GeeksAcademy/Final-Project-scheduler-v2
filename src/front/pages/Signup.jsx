import { useState } from "react";

export const Signup = () => {
  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        background: "#f4f6f8",
        padding: "2rem 1rem",
        marginTop: "56px", 
        minHeight: "100vh"
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
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label fw-semibold">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                className="form-control rounded-pill"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="firstName" className="form-label fw-semibold">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                className="form-control rounded-pill"
                placeholder="Enter your first name"
                value={form.firstName}
                onChange={handleChange}
                autoComplete="given-name"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="lastName" className="form-label fw-semibold">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                className="form-control rounded-pill"
                placeholder="Enter your last name"
                value={form.lastName}
                onChange={handleChange}
                autoComplete="family-name"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control rounded-pill"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-semibold">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control rounded-pill"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="gender" className="form-label fw-semibold">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                className="form-select rounded-pill"
                value={form.gender}
                onChange={handleChange}
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
                style={{ transition: "0.3s ease-in-out" }}
                onMouseOver={(e) => (e.target.style.opacity = "0.9")}
                onMouseOut={(e) => (e.target.style.opacity = "1")}
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>

        <div className="card-footer bg-light border-0 text-center py-3">
          <span className="text-muted">Already have an account?</span>
          <a
            href="/login"
            className="btn btn-outline-primary btn-sm ms-2 rounded-pill"
          >
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
};



